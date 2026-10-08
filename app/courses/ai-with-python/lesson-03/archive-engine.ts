import { practiceSource } from './practice-content';

export const fields = ['恶魔', '地点', '弱点'];
export const expectedGrid: string[][] = practiceSource.intel.map(
  ({ name, location, weakness }) => [name, location, weakness],
);
export const archiveFiles = [
  {
    id: 'watch',
    title: '城堡值守记录',
    path: './watch_log.txt',
    text: '东门：晨间换岗。\n西门：检查城墙。\n北门：夜间巡逻。',
    feedback: '读取成功，但这是值守安排，还没有恶魔的地点与弱点。',
    useful: false,
  },
  {
    id: 'tracks',
    title: '前线行踪记录',
    path: './tracks.txt',
    text: practiceSource.intel
      .map(({ name, location }) => `${location}发现了${name}。`)
      .join('\n'),
    feedback: '找到了记录中的出没地点，但这份档案还缺少它们的弱点。',
    useful: false,
  },
  {
    id: 'scout',
    title: '侦察员手记',
    path: './scout_notes.txt',
    text: practiceSource.intel
      .map(
        ({ name, location, weakness }) =>
          `${location}发现了${name}，它${weakness}。`,
      )
      .join('\n'),
    feedback: '这份手记记录了恶魔、当时的地点和已知弱点，可以用它准备防线！',
    useful: true,
  },
  {
    id: 'supplies',
    title: '防御物资清单',
    path: './supplies.txt',
    text: '探照灯：3 台。\n火把：12 支。\n供热装置：2 套。',
    feedback: '物资充足，但清单没有记录恶魔的出没地点和已知弱点。',
    useful: false,
  },
];

export const readSlots = [
  {
    id: 'mode',
    label: '打开模式',
    options: ['"r"', '"w"'],
    answer: '"r"',
    feedback: '要读取已有档案，请使用读取模式 "r"。"w" 会覆盖原文件。',
  },
  {
    id: 'read',
    label: '读取文件内容',
    options: ['read', 'write'],
    answer: 'read',
    feedback: '使用 f.read() 读取文件内容，write() 用来写入内容。',
  },
];

export const codeSlots = [
  {
    id: 'mode',
    label: '打开模式',
    options: ['"r"', '"w"'],
    answer: '"w"',
    feedback: '要新建或覆盖防御档案，请使用写入模式 "w"。',
  },
  {
    id: 'writer',
    label: 'CSV 写入工具',
    options: ['DictReader', 'DictWriter', 'reader'],
    answer: 'DictWriter',
    feedback: 'records 中每条记录都是字典，需要 csv.DictWriter 写入。',
  },
  {
    id: 'fieldnames',
    label: '表头对应关系',
    options: ['records', 'path', 'fields'],
    answer: 'fields',
    feedback: 'fieldnames 接收列名列表 fields，确定每一列的名称和顺序。',
  },
  {
    id: 'header',
    label: '写入表头',
    options: ['writerows', 'writeheader', 'read'],
    answer: 'writeheader',
    feedback: '先调用 writeheader()，把恶魔、地点、弱点写成第一行。',
  },
  {
    id: 'rows',
    label: '写入全部记录',
    options: ['writerow', 'read', 'writerows'],
    answer: 'writerows',
    feedback: 'records 包含多条记录，使用 writerows(records) 一次写入。',
  },
];

export type ArchiveState = {
  phase: 'ready' | 'playing' | 'timeout' | 'won';
  step: 0 | 1 | 2;
  remainingMs: number;
  paused: boolean;
  practice: boolean;
  selectedFile: string | null;
  openedFile: string | null;
  readFiles: string[];
  readChoices: string[];
  activeReadSlot: number;
  readChecked: boolean;
  raidRemainingMs: number;
  raidCount: [number, number, number];
  raidSerial: number;
  raidSeeds: number[];
  raidInMs: number;
  raidDemon: number;
  pendingAdvance: 'use-file' | 'check-format' | 'save' | null;
  grid: string[][];
  gridHistory: string[][][];
  selectedToken: string | null;
  gridChecked: boolean;
  formatReady: boolean;
  separator: string;
  lineBreak: string;
  choices: string[];
  activeSlot: number;
  codeChecked: boolean;
  savedCsv: string | null;
  feedback: string;
  tone: 'neutral' | 'error' | 'success';
};

export type ArchiveAction =
  | {
      type:
        | 'start'
        | 'pause'
        | 'read'
        | 'use-file'
        | 'undo'
        | 'check-grid'
        | 'check-format'
        | 'save'
        | 'continue-practice'
        | 'restart';
      random?: number;
    }
  | { type: 'tick'; elapsedMs: number; random?: number }
  | { type: 'select-file'; id: string }
  | {
      type: 'token' | 'separator' | 'line-break' | 'choice' | 'read-choice';
      value: string;
    }
  | { type: 'place'; row: number; col: number }
  | { type: 'slot' | 'read-slot'; index: number };

export function createArchiveState(): ArchiveState {
  return {
    phase: 'ready',
    step: 0,
    remainingMs: 5 * 60 * 1000,
    paused: false,
    practice: false,
    selectedFile: null,
    openedFile: null,
    readFiles: [],
    readChoices: readSlots.map(() => ''),
    activeReadSlot: 0,
    readChecked: false,
    raidRemainingMs: 0,
    raidCount: [0, 0, 0],
    raidSerial: 0,
    raidSeeds: [],
    raidInMs: 15000,
    raidDemon: 0,
    pendingAdvance: null,
    grid: expectedGrid.map((row) => row.map(() => '')),
    gridHistory: [],
    selectedToken: null,
    gridChecked: false,
    formatReady: false,
    separator: '',
    lineBreak: '',
    choices: codeSlots.map(() => ''),
    activeSlot: 0,
    codeChecked: false,
    savedCsv: null,
    feedback: '通信中断！打开档案，找到三只恶魔记录中的地点和已知弱点。',
    tone: 'neutral',
  };
}

export function isGridCorrect(grid: string[][]): boolean {
  return (
    grid.length === expectedGrid.length &&
    new Set(grid.map((row) => row[0])).size === expectedGrid.length &&
    grid.every(
      (row) =>
        row.length === fields.length &&
        expectedGrid.some((expected) =>
          row.every((cell, c) => cell === expected[c]),
        ),
    )
  );
}

export function isCellCorrect(
  grid: string[][],
  row: number,
  col: number,
): boolean {
  const cells = grid[row];
  if (!cells || col < 0 || col >= fields.length || !cells[col]) return false;
  const record = expectedGrid.find((expected) => expected[0] === cells[0]);
  if (col === 0) {
    return (
      !!record &&
      grid.filter((candidate) => candidate[0] === cells[0]).length === 1
    );
  }
  // Until the name is identified, only reject values outside this column.
  return record
    ? cells[col] === record[col]
    : expectedGrid.some((expected) => expected[col] === cells[col]);
}

function csvCell(value: string): string {
  return /[",\r\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

export function toCsv(grid: string[][]): string {
  return (
    [fields, ...grid].map((row) => row.map(csvCell).join(',')).join('\n') + '\n'
  );
}

export function fullArchiveCode(state: ArchiveState): string {
  const choices = codeSlots.map(
    (slot, index) => state.choices[index] || slot.answer,
  );
  const rows = state.grid.map((row) =>
    Object.fromEntries(fields.map((field, index) => [field, row[index]])),
  );
  const records = rows
    .map(
      (row) =>
        `    {${Object.entries(row)
          .map(
            ([key, value]) =>
              `${JSON.stringify(key)}: ${JSON.stringify(value)}`,
          )
          .join(', ')}},`,
    )
    .join('\n');
  return `import csv\n\nfields = ${JSON.stringify(fields)}\nrecords = [\n${records}\n]\n\npath = "./defense.csv"\nwith open(path, ${choices[0]}, newline="", encoding="utf-8") as f:\n    writer = csv.${choices[1]}(f, fieldnames=${choices[2]})\n    writer.${choices[3]}()\n    writer.${choices[4]}(records)\n\nwith open(path, "r", encoding="utf-8") as f:\n    print(f.read(), end="")`;
}

function feedback(
  state: ArchiveState,
  text: string,
  tone: ArchiveState['tone'] = 'neutral',
): ArchiveState {
  return { ...state, feedback: text, tone };
}

function randomUnit(value = 0.5): number {
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0.5;
}

function raidDelay(random?: number): number {
  return 10000 + Math.round(randomUnit(random) * 10000);
}

function beginRaid(
  state: ArchiveState,
  random?: number,
  pendingAdvance: ArchiveState['pendingAdvance'] = null,
): ArchiveState {
  const raidCount: ArchiveState['raidCount'] = [...state.raidCount];
  raidCount[state.step] += 1;
  return {
    ...state,
    raidCount,
    raidRemainingMs: 3600,
    raidSerial: state.raidSerial + 1,
    raidSeeds: [
      ...state.raidSeeds,
      Math.floor(randomUnit(random) * 0xffffffff),
    ],
    raidDemon: Math.min(2, Math.floor(randomUnit(random) * 3)),
    raidInMs: raidDelay(random),
    pendingAdvance,
  };
}

export function archiveReducer(
  state: ArchiveState,
  action: ArchiveAction,
): ArchiveState {
  if (action.type === 'restart') return createArchiveState();
  if (action.type === 'start')
    return state.phase === 'ready'
      ? { ...state, phase: 'playing', raidInMs: raidDelay(action.random) }
      : state;
  if (action.type === 'continue-practice') {
    return state.phase === 'timeout'
      ? feedback(
          { ...state, phase: 'playing', practice: true, paused: false },
          '继续整理已找到的情报。这次计为练习完成。',
        )
      : state;
  }
  if (state.phase !== 'playing') return state;
  if (action.type === 'pause') return { ...state, paused: !state.paused };
  if (state.paused) return state;
  if (action.type === 'tick') {
    if (!Number.isFinite(action.elapsedMs) || action.elapsedMs <= 0)
      return state;
    const remainingMs = state.practice
      ? state.remainingMs
      : Math.max(0, state.remainingMs - action.elapsedMs);
    if (!state.practice && remainingMs === 0)
      return feedback(
        { ...state, remainingMs, phase: 'timeout' },
        '恶魔抵达城门！当前成果已保留，可以继续练习或重新挑战。',
        'error',
      );
    const next = {
      ...state,
      remainingMs,
      raidInMs: Math.max(0, state.raidInMs - action.elapsedMs),
    };
    if (state.raidRemainingMs > 0) {
      next.raidRemainingMs = Math.max(
        0,
        state.raidRemainingMs - action.elapsedMs,
      );
      if (next.raidRemainingMs === 0 && state.pendingAdvance) {
        return archiveReducer(
          { ...next, pendingAdvance: null },
          { type: state.pendingAdvance, random: action.random },
        );
      }
      return next;
    }
    return next.raidInMs === 0 ? beginRaid(next, action.random) : next;
  }
  if (state.raidRemainingMs > 0) return state;
  if (state.step === 0) {
    if (action.type === 'read-slot')
      return Number.isInteger(action.index) &&
        action.index >= 0 &&
        action.index < readSlots.length
        ? { ...state, activeReadSlot: action.index }
        : state;
    if (action.type === 'read-choice') {
      if (!readSlots[state.activeReadSlot].options.includes(action.value))
        return state;
      const readChoices = [...state.readChoices];
      readChoices[state.activeReadSlot] = action.value;
      return feedback(
        {
          ...state,
          readChoices,
          readChecked: false,
          activeReadSlot: Math.min(
            state.activeReadSlot + 1,
            readSlots.length - 1,
          ),
        },
        '代码已填入。补全两处后，点击“打开档案”读取内容。',
      );
    }
    if (action.type === 'select-file') {
      return archiveFiles.some((file) => file.id === action.id)
        ? feedback(
            { ...state, selectedFile: action.id },
            '文件名已替换。补全读取代码，再点击“打开档案”。',
          )
        : state;
    }
    if (action.type === 'read') {
      const file = archiveFiles.find((item) => item.id === state.selectedFile);
      if (!file) return feedback(state, '先在档案柜中选一份档案。', 'error');
      const incorrect = readSlots.findIndex(
        (slot, index) => slot.answer !== state.readChoices[index],
      );
      if (incorrect >= 0)
        return feedback(
          { ...state, readChecked: true, activeReadSlot: incorrect },
          state.readChoices[incorrect]
            ? readSlots[incorrect].feedback
            : '还有读取代码没有填写。先补全当前高亮的位置。',
          'error',
        );
      return feedback(
        {
          ...state,
          openedFile: file.id,
          readChecked: true,
          readFiles: [...new Set([...state.readFiles, file.id])],
        },
        '读取成功。观察内容：是否同时记录了恶魔、当时的地点和已知弱点？',
      );
    }
    if (action.type === 'use-file') {
      const incorrect = readSlots.findIndex(
        (slot, index) => slot.answer !== state.readChoices[index],
      );
      if (incorrect >= 0)
        return feedback(
          { ...state, readChecked: true, activeReadSlot: incorrect },
          '先补全正确的读取代码，再使用这份档案。',
          'error',
        );
      const file = archiveFiles.find((item) => item.id === state.openedFile);
      if (!file)
        return feedback(state, '先点击“打开档案”，读出内容后再判断。', 'error');
      if (file.id !== state.selectedFile)
        return feedback(
          state,
          '文件名已改变，请先打开当前选中的档案。',
          'error',
        );
      if (file.useful && state.raidCount[0] === 0)
        return beginRaid(state, action.random, 'use-file');
      return feedback(
        file.useful
          ? { ...state, step: 1, raidInMs: raidDelay(action.random) }
          : state,
        file.feedback,
        file.useful ? 'success' : 'error',
      );
    }
    return state;
  }
  if (state.step === 1) {
    if (action.type === 'token')
      return expectedGrid.flat().includes(action.value)
        ? { ...state, selectedToken: action.value }
        : state;
    if (action.type === 'place') {
      if (
        !state.selectedToken ||
        !Number.isInteger(action.row) ||
        !Number.isInteger(action.col) ||
        action.row < 0 ||
        action.row >= expectedGrid.length ||
        action.col < 0 ||
        action.col >= fields.length
      )
        return state;
      const grid = state.grid.map((row) => [...row]);
      grid[action.row][action.col] = state.selectedToken;
      return feedback(
        {
          ...state,
          grid,
          gridHistory: [...state.gridHistory, state.grid],
          selectedToken: null,
          gridChecked: false,
        },
        '情报已放入表格。还可以选择信息并点击格子来修改。',
      );
    }
    if (action.type === 'undo') {
      const grid = state.gridHistory.at(-1);
      if (!grid) return state;
      return feedback(
        {
          ...state,
          grid,
          gridHistory: state.gridHistory.slice(0, -1),
          selectedToken: null,
          gridChecked: false,
        },
        '已撤销上一次放入的情报，可以重新整理。',
      );
    }
    if (action.type === 'check-grid') {
      const checked = { ...state, gridChecked: true };
      return isGridCorrect(state.grid)
        ? feedback(
            checked,
            '三条情报核对正确！接下来选择 CSV 的分隔和换行方式。',
            'success',
          )
        : feedback(
            checked,
            '还有信息缺失或位置不对。对照手记，让每行属于同一只恶魔，每列属于同一种信息。',
            'error',
          );
    }
    if (action.type === 'separator')
      return { ...state, separator: action.value };
    if (action.type === 'line-break')
      return { ...state, lineBreak: action.value };
    if (action.type === 'check-format') {
      if (!isGridCorrect(state.grid) || !state.gridChecked)
        return feedback(state, '先核对完整表格，再选择 CSV 格式。', 'error');
      if (state.separator !== ',')
        return feedback(state, '这份 CSV 使用英文逗号分隔字段。', 'error');
      if (state.lineBreak !== '\n')
        return feedback(
          state,
          '表头和每条记录各占一行，需要在每条记录结束后换行。',
          'error',
        );
      if (state.raidCount[1] === 0)
        return beginRaid(state, action.random, 'check-format');
      return feedback(
        {
          ...state,
          formatReady: true,
          step: 2,
          raidInMs: raidDelay(action.random),
        },
        'CSV 格式已整理好，但还没有保存。补全代码，生成防御档案！',
        'success',
      );
    }
    return state;
  }
  if (action.type === 'slot')
    return Number.isInteger(action.index) &&
      action.index >= 0 &&
      action.index < codeSlots.length
      ? { ...state, activeSlot: action.index }
      : state;
  if (action.type === 'choice') {
    if (!codeSlots[state.activeSlot].options.includes(action.value))
      return state;
    const choices = [...state.choices];
    choices[state.activeSlot] = action.value;
    return feedback(
      {
        ...state,
        choices,
        codeChecked: false,
        activeSlot: Math.min(state.activeSlot + 1, codeSlots.length - 1),
      },
      '代码块已填入。可以点击任何空位重新选择。',
    );
  }
  if (action.type === 'save') {
    const incorrect = codeSlots.findIndex(
      (slot, index) => slot.answer !== state.choices[index],
    );
    if (incorrect >= 0)
      return feedback(
        { ...state, codeChecked: true, activeSlot: incorrect },
        state.choices[incorrect]
          ? codeSlots[incorrect].feedback
          : '还有代码空位没有填写。请先补全当前高亮的位置。',
        'error',
      );
    if (!state.formatReady || !isGridCorrect(state.grid))
      return feedback(state, '情报表还没有完成，请重新整理档案。', 'error');
    if (state.raidCount[2] === 0)
      return beginRaid({ ...state, codeChecked: true }, action.random, 'save');
    return feedback(
      {
        ...state,
        phase: 'won',
        codeChecked: true,
        savedCsv: toCsv(state.grid),
      },
      state.practice
        ? '练习完成！防御档案已保存，三条情报都能重新读回。'
        : '防御档案保存成功！三条情报已读回核对，城门守卫可以据此布防。',
      'success',
    );
  }
  return state;
}
