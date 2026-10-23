/* ============================================================
   伯顿个人主页 v2 — 揉纸转场 + 尺子拖动条
   揉成纸团（3D 翻滚 + SVG 位移扭曲 + 随机褶皱）→ 展开新纸
   ============================================================ */
(function () {
  'use strict';

  const CHAPTERS = [
    { kicker: 'THE WINNER · 获奖经历', tip: ['08.02 · GOLD', '获奖经历'] },
    {
      kicker: 'THE TEACHER · 教学经历',
      tip: ['2027 校招 · OFFICIAL', '教学经历'],
    },
    { kicker: 'THE COURSE · 课程内容', tip: ['2026 · 12 LESSONS', '课程内容'] },
  ];

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DURATION = REDUCED
    ? { crumple: 40, unfold: 40 }
    : { crumple: 430, unfold: 520 };

  const papers = Array.from(document.querySelectorAll('.poster'));
  const track = document.getElementById('track');
  const ruler = document.getElementById('ruler');
  const handle = document.getElementById('handle');
  const tip = document.getElementById('tip');
  const snaps = Array.from(document.querySelectorAll('.snap'));
  const labels = Array.from(document.querySelectorAll('.scrub-label'));
  const kickerText = document.getElementById('kickerText');
  const counterNow = document.getElementById('counterNow');
  const stack = document.getElementById('stack');
  const disp = document.getElementById('crumpleDisp');

  /* ---------- 尺子刻度 ---------- */
  (function buildTicks() {
    const N = 60;
    for (let i = 0; i <= N; i++) {
      const t = document.createElement('span');
      const isChapter = i % (N / 2) === 0;
      t.className =
        'tick' + (isChapter ? ' tick--chapter' : i % 5 === 0 ? ' tick--m' : '');
      t.style.left = (i / N) * 100 + '%';
      ruler.appendChild(t);
    }
  })();

  /* ---------- 揉纸状态 ---------- */
  // progress: 0 平整 → 1 完全揉成纸团
  const anims = papers.map(() => ({
    p: 0,
    from: 0,
    target: 0,
    start: 0,
    dur: 0,
    wob: 0,
    wobY: 0,
    onDone: null,
  }));
  let current = 0;
  let busy = false;
  let activePoster = papers[0];

  const easeInOut = (t) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const rand = (a, b) => a + Math.random() * (b - a);

  /* ---------- 褶皱折痕 ---------- */
  function buildFolds(poster) {
    if (poster.querySelector('.folds')) return;
    const box = document.createElement('div');
    box.className = 'folds';
    for (let i = 0; i < 12; i++) {
      const line = document.createElement('i');
      line.className = 'fold-line';
      line.style.left = rand(2, 88) + '%';
      line.style.top = rand(2, 94) + '%';
      line.style.width = rand(18, 62) + '%';
      line.style.transform = 'rotate(' + rand(-70, 70) + 'deg)';
      box.appendChild(line);
      if (i % 2 === 0) {
        const glow = document.createElement('i');
        glow.className = 'fold-glow';
        glow.style.left = rand(2, 88) + '%';
        glow.style.top = rand(2, 94) + '%';
        glow.style.width = rand(14, 46) + '%';
        glow.style.transform = 'rotate(' + rand(-70, 70) + 'deg)';
        box.appendChild(glow);
      }
    }
    poster.appendChild(box);
  }

  /* ---------- 应用形变 ---------- */
  function apply(i) {
    const a = anims[i];
    const poster = papers[i];
    const p = a.p;
    const rotY = -66 * p + a.wob;
    const rotX = 26 * p;
    const rotZ = 7 * p * (a.wob >= 0 ? 1 : -1);
    const sc = 1 - 0.66 * p;
    const ty = 30 * p + a.wobY;
    poster.style.transform =
      'rotateY(' +
      rotY.toFixed(2) +
      'deg) ' +
      'rotateX(' +
      rotX.toFixed(2) +
      'deg) ' +
      'rotateZ(' +
      rotZ.toFixed(2) +
      'deg) ' +
      'scale(' +
      sc.toFixed(3) +
      ') ' +
      'translateY(' +
      ty.toFixed(1) +
      'px)';
    poster.style.borderRadius = p < 0.02 ? '12px' : 12 + p * 46 + '%';
    const folds = poster.querySelector('.folds');
    if (folds) folds.style.opacity = Math.min(1, p * 1.6).toFixed(2);
    if (poster === activePoster) {
      if (p < 0.02) poster.style.filter = '';
      else poster.style.filter = 'url(#crumpleF)';
      disp.setAttribute('scale', (34 * p).toFixed(1));
    }
  }

  /* ---------- 动画驱动 ---------- */
  function raf(now) {
    let running = false;
    for (let i = 0; i < anims.length; i++) {
      const a = anims[i];
      if (a.dur <= 0) continue;
      const t = Math.min(1, (now - a.start) / a.dur);
      const e = a.target > a.from ? easeInOut(t) : easeOut(t);
      a.p = a.from + (a.target - a.from) * e;
      a.wob = Math.sin(now / 85) * 9 * a.p; // 翻滚
      a.wobY = Math.sin(now / 117) * 6 * a.p;
      apply(i);
      if (t >= 1) {
        a.dur = 0;
        a.wob = 0;
        a.wobY = 0;
        apply(i);
        const cb = a.onDone;
        a.onDone = null;
        if (cb) cb();
      } else {
        running = true;
      }
    }
    if (running) requestAnimationFrame(raf);
  }

  function animateTo(i, target, dur, onDone) {
    const a = anims[i];
    a.from = a.p;
    a.target = target;
    a.dur = dur;
    a.start = performance.now();
    a.onDone = onDone || null;
    requestAnimationFrame(raf);
  }

  function setP(i, p) {
    const a = anims[i];
    a.dur = 0;
    a.p = p;
    a.wob = 0;
    a.wobY = 0;
    apply(i);
  }

  /* ---------- UI 状态 ---------- */
  function setHandle(ratio) {
    const pct = ratio * 100 + '%';
    handle.style.left = pct;
    tip.style.left = pct;
  }

  function setTip(i) {
    tip.querySelector('b').textContent = CHAPTERS[i].tip[0];
    tip.querySelector('span').textContent = CHAPTERS[i].tip[1];
  }

  function updateUI(i) {
    snaps.forEach((s) =>
      s.classList.toggle('is-active', Number(s.dataset.go) === i),
    );
    labels.forEach((l) =>
      l.classList.toggle('is-active', Number(l.dataset.go) === i),
    );
    kickerText.textContent = CHAPTERS[i].kicker;
    counterNow.textContent = String(i + 1).padStart(2, '0');
    track.setAttribute('aria-valuenow', String(i + 1));
    setHandle(i / 2);
    setTip(i);
  }

  /* ---------- 章节切换：揉团 → 换纸 → 展开 ---------- */
  function transition(next) {
    busy = true;
    updateUI(next);
    const cur = current;
    buildFolds(papers[cur]);
    buildFolds(papers[next]);
    animateTo(cur, 1, DURATION.crumple, () => {
      // 换纸：旧纸藏起，新纸以纸团态入场
      papers[cur].classList.remove('is-current');
      papers[cur].setAttribute('aria-hidden', 'true');
      setP(cur, 0);
      current = next;
      activePoster = papers[next];
      anims[next].p = 1;
      apply(next);
      const el = papers[next];
      el.classList.add('is-current');
      el.setAttribute('aria-hidden', 'false');
      // 展开
      requestAnimationFrame(() => {
        animateTo(next, 0, DURATION.unfold, () => {
          busy = false;
          if (pending !== null && pending !== current) {
            const p2 = pending;
            pending = null;
            transition(p2);
          } else {
            pending = null;
          }
        });
      });
    });
  }

  let pending = null;

  function goTo(i) {
    const n = Math.max(0, Math.min(CHAPTERS.length - 1, i));
    if (busy) {
      if (n !== current) pending = n;
      return;
    }
    if (n === current) return;
    transition(n);
  }

  /* ---------- 拖拽（跟手揉纸） ---------- */
  let dragging = false;

  function ratioAt(clientX) {
    const r = track.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - r.left) / r.width));
  }

  function onDown(e) {
    if (busy) return;
    dragging = true;
    track.classList.add('is-dragging');
    if (e.pointerId !== undefined && track.setPointerCapture) {
      try {
        track.setPointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
    }
    buildFolds(papers[current]);
  }

  function onMove(e) {
    if (!dragging) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const ratio = ratioAt(x);
    setHandle(ratio);
    setTip(Math.round(ratio * 2));
    // 距离最近章节的偏离度 → 揉纸程度
    const a = anims[current];
    a.dur = 0;
    a.p = Math.min(0.5, Math.abs(ratio * 2 - current) * 0.62);
    a.wob = (ratio * 2 - current) * 10;
    a.wobY = 0;
    apply(current);
    a.wob = 0;
  }

  function onUp(e) {
    if (!dragging) return;
    dragging = false;
    track.classList.remove('is-dragging');
    const x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const target = Math.round(ratioAt(x) * 2);
    if (target !== current) {
      goTo(target);
    } else {
      // 没越界：舒展回当前章
      animateTo(current, 0, DURATION.unfold * 0.7, () => {});
      setHandle(current / 2);
      setTip(current);
    }
  }

  track.addEventListener('mousedown', onDown);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
  track.addEventListener('touchstart', onDown, { passive: true });
  window.addEventListener('touchmove', onMove, { passive: true });
  window.addEventListener('touchend', onUp);

  /* ---------- 标签 / 吸附点 / 键盘 / 海报点击 ---------- */
  labels.forEach((l) =>
    l.addEventListener('click', () => goTo(Number(l.dataset.go))),
  );
  snaps.forEach((s) =>
    s.addEventListener('click', () => goTo(Number(s.dataset.go))),
  );

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo(current + 1);
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo(current - 1);
    }
  });

  papers.forEach((p) => {
    p.addEventListener('click', (e) => {
      if (e.target.closest('a,button')) return;
      if (busy) return;
      const r = p.getBoundingClientRect();
      if (e.clientX - r.left > r.width / 2) goTo(current + 1);
      else goTo(current - 1);
    });
  });

  /* ---------- 海报触屏滑动 ---------- */
  let touchStartX = null;
  stack.addEventListener(
    'touchstart',
    (e) => {
      touchStartX = e.touches[0].clientX;
    },
    { passive: true },
  );
  stack.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 56) goTo(current + (dx < 0 ? 1 : -1));
    touchStartX = null;
  });

  /* ---------- 初始化（支持 ?ch= 深链） ---------- */
  const initial = Math.max(
    0,
    Math.min(
      2,
      parseInt(new URLSearchParams(location.search).get('ch') || '0', 10) || 0,
    ),
  );
  current = initial;
  activePoster = papers[initial];
  papers.forEach((p, i) => {
    p.classList.toggle('is-current', i === initial);
    p.setAttribute('aria-hidden', String(i !== initial));
  });
  updateUI(initial);
})();
