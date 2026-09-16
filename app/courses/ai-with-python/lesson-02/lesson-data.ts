export const chapters = [
  { id: 'start', title: '敌情侦察任务', number: '00' },
  { id: 'request', title: '取回前线敌情', number: '01' },
  { id: 'parse', title: '从网页中找到情报', number: '02' },
  { id: 'transfer', title: '为勇士挑选电影', number: '03' },
  { id: 'finish', title: '城堡情报官', number: '04' },
] as const;
export type Chapter = (typeof chapters)[number]['id'];
export const scenes: { id: string; chapter: Chapter; title: string }[] = [
  { id: 'l2-cover', chapter: 'start', title: '敌情动态早知道' },
  { id: 'l2-mission', chapter: 'start', title: '守住城门，还不够！' },
  { id: 'l2-request-cover', chapter: 'request', title: '取回前线敌情' },
  { id: 'l2-scout-observe', chapter: 'request', title: '先亲自查一条敌情' },
  {
    id: 'l2-scout-scale',
    chapter: 'request',
    title: '消息越来越多，怎么办？',
  },
  { id: 'l2-browser', chapter: 'request', title: '前线情报，原来就在网页上' },
  { id: 'l2-rules', chapter: 'request', title: '这位小帮手，叫网页爬虫' },
  { id: 'l2-http', chapter: 'request', title: '一次请求的旅程' },
  { id: 'l2-url', chapter: 'request', title: '程序要去哪里？' },
  { id: 'l2-request-code', chapter: 'request', title: '用 Python 取回网页' },
  { id: 'l2-response', chapter: 'request', title: 'res 里装着什么？' },
  { id: 'l2-practice-01', chapter: 'request', title: '在 HTML 中找到三个恶魔' },
  { id: 'l2-parse-cover', chapter: 'parse', title: '从网页中找到情报' },
  { id: 'l2-document', chapter: 'parse', title: '网页也有自己的结构' },
  { id: 'l2-dom', chapter: 'parse', title: '沿着树枝，走进一条记录' },
  { id: 'l2-html', chapter: 'parse', title: '地点信息藏在哪一行？' },
  { id: 'l2-inspect', chapter: 'parse', title: '解析情报，只记住这三步' },
  { id: 'l2-soup', chapter: 'parse', title: '请来一位“档案整理员”' },
  { id: 'l2-find', chapter: 'parse', title: '找一条，还是找全部？' },
  { id: 'l2-fields', chapter: 'parse', title: '按三步公式，取出一项情报' },
  { id: 'l2-loop', chapter: 'parse', title: '让三张记录卡，依次经过' },
  { id: 'l2-practice-02', chapter: 'parse', title: '为三个恶魔整理完整情报' },
  {
    id: 'l2-hotspot-code',
    chapter: 'parse',
    title: '核对简报：每条敌情都要配对',
  },
  { id: 'l2-transfer-cover', chapter: 'transfer', title: '为勇士挑选电影' },
  { id: 'l2-movies', chapter: 'transfer', title: '敌情交给程序，今晚看什么？' },
  { id: 'l2-headers', chapter: 'transfer', title: '去新网站，带上程序的名片' },
  { id: 'l2-failure', chapter: 'transfer', title: '收到回信，先确认拿对了' },
  {
    id: 'l2-movie-code',
    chapter: 'transfer',
    title: '同一个公式，找到电影资料',
  },
  {
    id: 'l2-practice-03',
    chapter: 'transfer',
    title: '跟写代码：打印电影标题',
  },
  {
    id: 'l2-challenge-entry',
    chapter: 'finish',
    title: '城堡情报官，准备出战！',
  },
  { id: 'l2-challenge', chapter: 'finish', title: '城堡情报官' },
  { id: 'l2-summary', chapter: 'finish', title: '从敌情到电影，一套方法带走' },
];
export const kingdomPath = '/kingdom.html';
export const assetBase = '/courses/ai-with-python/lesson-02';
export const oldAssets = '/courses/ai-with-python/lesson-01/assets';
export const announcements = [
  { title: '北方哨站发现恶魔踪迹', hot: '860', href: '#north' },
  { title: '森林勇士送来补给', hot: '620', href: '#forest' },
  { title: '东桥修复，商队可以通行', hot: '410', href: '#bridge' },
];
export const kingdomHtml = `<div class="event">
  <h2 class="title">北方哨站发现恶魔踪迹</h2>
  <span class="hot">860</span>
  <a href="#north">查看详情</a>
</div>`;

export const scoutPath = '/scout.html';
export const scoutOrigin = 'https://pythonwithme.coze.site';
export const scoutUrl = `${scoutOrigin}${scoutPath}`;
export const scoutUpdatedPath = '/scout-updated.html';
export const scoutRecord = {
  name: '炎角兽',
  location: '北方峡谷',
  attribute: '火焰',
  weakness: '怕强光',
};
