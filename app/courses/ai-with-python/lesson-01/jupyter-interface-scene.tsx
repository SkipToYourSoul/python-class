/* oxlint-disable next/no-img-element -- Keep the supplied, annotated interface screenshot intact. */
'use client';

import { useRef } from 'react';
import { useScreenshotConnections } from './use-screenshot-connections';
import { asset, Stage } from './lesson-ui';
import s from './jupyter-interface-scene.module.css';

const regions = [
  {
    id: 1,
    name: '菜单栏',
    copy: '管理文件、运行等操作',
    x: 13,
    y: 6.6,
    side: 'top',
  },
  {
    id: 2,
    name: '文件区',
    copy: '新建、查找和打开笔记本',
    x: 1.7,
    y: 71.7,
    side: 'bottom',
  },
  {
    id: 3,
    name: '工具栏',
    copy: '保存、运行、切换单元格类型',
    x: 48,
    y: 15.7,
    side: 'top',
  },
  {
    id: 4,
    name: '单元格',
    copy: '写代码或说明，输出在下方',
    x: 53.2,
    y: 43.5,
    side: 'bottom',
  },
] as const;

function Callout({ region }: { region: (typeof regions)[number] }) {
  return (
    <section
      className={s.callout}
      data-callout={region.id}
      aria-label={`${region.id} ${region.name}`}
    >
      <b className={s.number} aria-hidden="true">
        {region.id}
      </b>
      <h3>{region.name}</h3>
      <p>{region.copy}</p>
    </section>
  );
}

export function JupyterInterfaceScene() {
  const diagramRef = useRef<HTMLDivElement>(null);
  const connections = useScreenshotConnections(diagramRef, regions);

  return (
    <Stage
      label="JUPYTERLAB · 认识界面"
      title="找到四个常用区域"
      className={s.scene}
    >
      <div className={s.diagram} ref={diagramRef}>
        <div className={s.calloutRow}>
          <Callout region={regions[0]} />
          <Callout region={regions[2]} />
        </div>

        <div className={s.pictureSpace}>
          <div className={s.picture} data-interface-picture data-tour-picture>
            <img
              src={asset('image89.png')}
              width={3344}
              height={1280}
              alt="JupyterLab 完整界面。四个红框依次标出菜单栏、文件区、工具栏和单元格，序号与图外说明框对应。"
            />
            {regions.map((region) => (
              <span
                key={region.id}
                className={`${s.number} ${s.marker}`}
                style={{
                  left: `${region.x}%`,
                  top:
                    region.side === 'top'
                      ? `calc(${region.y}% - 16px)`
                      : `${region.y}%`,
                }}
                data-marker={region.id}
                aria-hidden="true"
              >
                {region.id}
              </span>
            ))}
          </div>
        </div>

        <div className={s.calloutRow}>
          <Callout region={regions[1]} />
          <Callout region={regions[3]} />
        </div>

        <svg className={s.connections} aria-hidden="true">
          {connections.map((path, index) => (
            <path key={regions[index].id} d={path} />
          ))}
        </svg>
      </div>
    </Stage>
  );
}
