/** A tessellated, double-sided paper surface with depth-tested folds. */
export type PaperRenderer = {
  draw: (
    chapter: number,
    fold: number,
    direction: number,
    width: number,
    height: number,
    paperHeight: number,
  ) => void;
  dispose: () => void;
};

const vertex = `
attribute vec2 aPoint;
uniform float uFold;
uniform float uDirection;
uniform vec2 uViewport;
uniform float uSize;
uniform float uAspect;
uniform float uDetail;
varying vec2 vUV;
varying vec3 vNormal;
varying float vCrease;
varying float vValley;
float crease(vec2 q) {
  return .25 * abs(dot(q,vec2(.82,.57))+.11)
    - .30 * abs(dot(q,vec2(-.38,.92))-.15)
    + .21 * abs(dot(q,vec2(.94,-.33))+.30);
}
float foldHeight(vec2 cell) {
  return fract(sin(dot(cell,vec2(127.1,311.7)))*43758.5453);
}
vec3 bundleCorner(vec2 cell) {
  vec2 unit = cell/vec2(7.0,9.0)*2.0-1.0;
  float panels = foldHeight(cell);
  float radius = .205 + (panels-.5)*.17;
  float longitude = unit.x*2.85 + sin(unit.y*5.0)*.16;
  float latitude = unit.y*1.62 + sin(unit.x*6.0)*.11;
  return radius * vec3(
    sin(longitude)*cos(latitude)*1.20,
    sin(latitude),
    cos(longitude)*cos(latitude)
  );
}
// Interpolate entire triangular panels, rather than a smooth sphere. Unequal
// vertices create the flat facets, sharp ridges and dents of a crushed sheet.
vec3 crushedBundle(vec2 uv) {
  vec2 point = uv*vec2(7.0,9.0);
  vec2 cell = floor(point);
  vec2 f = fract(point);
  vec3 a = bundleCorner(cell);
  vec3 b = bundleCorner(cell+vec2(1.0,0.0));
  vec3 c = bundleCorner(cell+vec2(0.0,1.0));
  vec3 d = bundleCorner(cell+vec2(1.0));
  return f.x+f.y < 1.0
    ? a+(b-a)*f.x+(c-a)*f.y
    : d+(c-d)*(1.0-f.x)+(b-d)*(1.0-f.y);
}
vec3 surface(vec2 uv) {
  float p = uFold;
  vec2 q = (uv - .5) * vec2(2.0 * uAspect, 2.0);
  vec2 unit = q / vec2(uAspect,1.0);
  float edge = max(abs(unit.x),abs(unit.y));
  float corner = abs(unit.x*unit.y);
  float gather = smoothstep(.16,.98,p);
  float cornerLead = corner * sin(p*3.14159) * .10;
  // A few unequal crease planes make broad paper panels, rather than ripples.
  float mainFold = (crease(q)-crease(vec2(0.0))) * smoothstep(.025,.72,p);
  float fineFold = sin(q.x*6.4+q.y*3.1) * sin(q.y*8.3-q.x*2.7)
    * .015 * uDetail * smoothstep(.12,.8,p);
  float curl = pow(edge,3.0) * sin(q.x*1.7+q.y*2.3+.6)
    * .24 * sin(p*3.14159);
  // Edge flex outlasts the central compression and gently settles near flat.
  float settle = sin(p*27.0) * .018 * pow(edge,3.0)
    * smoothstep(0.0,.035,p) * (1.0-smoothstep(.10,.22,p));
  vec3 pos = vec3(
    q.x * (1.0-.73*gather-cornerLead),
    q.y * (1.0-.75*gather-cornerLead),
    mainFold + fineFold + curl + settle
  );
  pos.x += sin(q.y*4.1+.7) * .035 * gather;
  pos.y += sin(q.x*3.7-q.y*2.2) * .04 * gather;
  // The final squeeze wraps the sheet around a compact, uneven core. This
  // closes the wing-shaped silhouette without changing the early corner curl.
  float squeeze = smoothstep(.48,1.0,p);
  pos = mix(pos,crushedBundle(uv),squeeze);
  // Keep the printed face dominant when fully gathered; the back peeks out
  // during the turn, rather than bleaching the whole bundle at the midpoint.
  float a = (p*.85 + sin(p*3.14159)*.72) * uDirection;
  pos.xz = mat2(cos(a),-sin(a),sin(a),cos(a)) * pos.xz;
  a = sin(p*3.14159) * .24;
  pos.yz = mat2(cos(a),-sin(a),sin(a),cos(a)) * pos.yz;
  a = sin(p * 3.14159) * .10 * uDirection;
  pos.xy = mat2(cos(a),-sin(a),sin(a),cos(a)) * pos.xy;
  pos.x += sin(p * 3.14159) * .045 * uDirection;
  return pos;
}
void main() {
  vec3 pos = surface(aPoint);
  vec3 dx = surface(aPoint + vec2(.001,0.0))-pos;
  vec3 dy = surface(aPoint + vec2(0.0,.001))-pos;
  vNormal = normalize(cross(dx,dy));
  vUV = vec2(aPoint.x, 1.0-aPoint.y);
  vCrease = uFold;
  vec2 q = (aPoint-.5)*vec2(2.0*uAspect,2.0);
  vValley = exp(-abs(dot(q,vec2(.82,.57))+.11)*28.0)
    + .6*exp(-abs(dot(q,vec2(.94,-.33))+.30)*24.0);
  float perspective = 1.0 - pos.z * .22;
  float breathing = 1.0 - .12*sin(uFold*3.14159);
  gl_Position = vec4(pos.x * breathing * uSize * uViewport.y/uViewport.x,
    pos.y * breathing * uSize, -pos.z * .25, perspective);
}`;
const fragment = `
precision mediump float;
uniform sampler2D uTexture;
varying vec2 vUV;
varying vec3 vNormal;
varying float vCrease;
varying float vValley;
void main() {
  vec3 normal = normalize(gl_FrontFacing ? vNormal : -vNormal);
  float tight = smoothstep(.55,.95,vCrease);
  float light = mix(.70,.44,tight) + mix(.32,.58,tight)
    * max(0.0, dot(normal, normalize(vec3(-.5,.8,1.4))));
  vec4 color = texture2D(uTexture, vUV);
  float fiber = sin(vUV.x*1870.0+sin(vUV.y*1490.0))
    * sin(vUV.y*2160.0+vUV.x*310.0) * .004;
  vec3 paper = vec3(.955,.939,.900)+fiber;
  vec3 back = paper - (1.0-color.rgb)*.045;
  if (!gl_FrontFacing) {
    // Early curled edges reveal the paper back. In the tight overlapping
    // bundle the current print dominates, so its chapter color stays intact.
    float printOverlap = .12 + .84*smoothstep(.15,.85,vCrease);
    color.rgb = mix(back,color.rgb,printOverlap);
  }
  float edge = min(min(vUV.x,1.0-vUV.x),min(vUV.y,1.0-vUV.y));
  float rim = (1.0-smoothstep(.0005,.003,edge))*smoothstep(.03,.3,vCrease);
  color.rgb = mix(color.rgb,paper*.88,rim*.7);
  light *= 1.0 - min(vValley,1.5)*.09*smoothstep(.05,.5,vCrease);
  color.rgb *= mix(1.0,light,smoothstep(0.0,.12,vCrease));
  gl_FragColor = color;
}`;

async function rasterize(svg: SVGSVGElement): Promise<HTMLImageElement> {
  const copy = svg.cloneNode(true) as SVGSVGElement;
  copy.setAttribute('width', '920');
  copy.setAttribute('height', String(svg.viewBox.baseVal.height));
  await Promise.all(
    Array.from(copy.querySelectorAll('image')).map(async (image) => {
      const response = await fetch(image.getAttribute('href')!);
      if (!response.ok) throw new Error('Poster image unavailable');
      const blob = await response.blob();
      const data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () =>
          resolve(typeof reader.result === 'string' ? reader.result : '');
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      image.setAttribute('href', data);
    }),
  );
  const url = URL.createObjectURL(
    new Blob([new XMLSerializer().serializeToString(copy)], {
      type: 'image/svg+xml;charset=utf-8',
    }),
  );
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    return image;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function createPaperRenderer(
  canvas: HTMLCanvasElement,
  posters: SVGSVGElement[],
  signal?: AbortSignal,
): Promise<PaperRenderer | null> {
  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: true,
    premultipliedAlpha: false,
  });
  if (!gl) return null;
  const images = await Promise.all(posters.map(rasterize));
  if (gl.isContextLost() || signal?.aborted) return null;
  function shader(type: number, source: string) {
    const s = gl!.createShader(type)!;
    gl!.shaderSource(s, source);
    gl!.compileShader(s);
    if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS))
      throw new Error(gl!.getShaderInfoLog(s) || 'Shader failed');
    return s;
  }
  const vs = shader(gl.VERTEX_SHADER, vertex),
    fs = shader(gl.FRAGMENT_SHADER, fragment);
  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    throw new Error('Paper shader link failed');
  gl.useProgram(program);
  const vertices: number[] = [],
    indices: number[] = [];
  const mobile = posters[0].viewBox.baseVal.height !== 1300;
  const nx = mobile ? 48 : 72,
    ny = mobile ? 68 : 104;
  for (let y = 0; y <= ny; y++)
    for (let x = 0; x <= nx; x++) vertices.push(x / nx, y / ny);
  for (let y = 0; y < ny; y++)
    for (let x = 0; x < nx; x++) {
      const a = y * (nx + 1) + x,
        b = a + nx + 1;
      indices.push(a, a + 1, b, a + 1, b + 1, b);
    }
  const positions = gl.createBuffer(),
    elements = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positions);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  const location = gl.getAttribLocation(program, 'aPoint');
  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elements);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW,
  );
  gl.enable(gl.DEPTH_TEST);
  const textures = images.map((image) => {
    const texture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    return texture;
  });
  const foldLocation = gl.getUniformLocation(program, 'uFold');
  const directionLocation = gl.getUniformLocation(program, 'uDirection');
  const viewportLocation = gl.getUniformLocation(program, 'uViewport');
  const sizeLocation = gl.getUniformLocation(program, 'uSize');
  const aspectLocation = gl.getUniformLocation(program, 'uAspect');
  const detailLocation = gl.getUniformLocation(program, 'uDetail');
  const aspect =
    posters[0].viewBox.baseVal.width / posters[0].viewBox.baseVal.height;
  return {
    draw(chapter, fold, direction, width, height, paperHeight) {
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
      const w = Math.round(width * dpr),
        h = Math.round(height * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform1f(foldLocation, fold);
      gl.uniform1f(directionLocation, direction);
      gl.uniform2f(viewportLocation, width, height);
      gl.uniform1f(sizeLocation, paperHeight / height);
      gl.uniform1f(aspectLocation, aspect);
      gl.uniform1f(detailLocation, mobile ? 0.45 : 1);
      gl.bindTexture(gl.TEXTURE_2D, textures[chapter]);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    },
    dispose() {
      textures.forEach((t) => gl.deleteTexture(t));
      gl.deleteBuffer(positions);
      gl.deleteBuffer(elements);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteProgram(program);
    },
  };
}
