# 第五课：勇闯图表世界

## 恶魔军团图鉴 → 企鹅家族研究

魔王已经现身。侦察队新增了 90 个恶魔个体的观测，勇士需要一份有证据的图鉴。
前三个课堂练习研究恶魔，结课挑战把方法用到真实企鹅数据。

## 开始前

1. 安装 Python 3.10 或更高版本，在终端运行 `python -m pip install -r requirements.txt`。
2. 解压整个练习包，在这个文件夹运行 `python -m jupyterlab`，打开 `第五课练习.ipynb`。
3. CSV、笔记本与完整参考文件放在同一个文件夹；先跟写并运行准备代码，再依次完成练习。笔记本开头的中文字体单元格已预置，只需运行。
4. 在空白代码单元亲手输入，按 Shift + Enter 运行。完整参考放在末尾，用来核对。

英文坐标名后的括号是单位。种类名称使用中文；若中文显示为方框，安装 Noto Sans CJK SC
或将预置环境代码中的字体名称改为系统已有中文字体，再从准备代码开始重新运行。
没有图时检查是否运行 `plt.show()`；提示变量不存在时先运行准备代码。

## 读懂数据

- `demons.csv`：90 行，每行一个不同个体；三族各 30 个。`id` 是档案编号，`kind` 是种类；
  `height` 是自然直立时身高（cm），`speed` 是相同平地测量条件下的速度（m/s），`mass` 是体重（kg）。
  这是教学模拟的新增个体观测，不是第四课的进攻事件，也不是把威胁值改名。
- `patrol.csv`：同一个体 **D001** 在同一天 8、10、12、14、16、18 时的速度观测，
  仍在相同测量场地和方法下测量。`hour` 是时刻，`speed` 单位 m/s；不是六只不同恶魔。
- `patrol-by-kind.csv`：承接 D001 的原六次记录，新增藤甲魔族 D002、冰翼魔族 D009
  在同一天、同一时刻的教学模拟观测，共 18 行。`id` 是个体编号，`kind` 是种类。
  第 28 页以颜色区分种类，每条折线仍追踪同一个体；三个个体的记录不能代表整族。
- `penguins.csv`：342 条真实企鹅记录，`id` 对应原始数据的行号；`kind` 是已知种类；
  `billLength` 喙长（mm）、`billDepth` 喙深（mm）、`flipper` 鳍肢长度（mm）、`mass` 体重（g）。
  企鹅体重使用 g，恶魔体重使用 kg，不要直接混用。

种类内有差异，种类间会重叠；两项特征有关联，不代表其中一项造成另一项。

## 企鹅来源与处理

数据由 Kristen Gorman 博士及 Palmer Station Antarctica LTER 收集，由
[palmerpenguins 官方项目](https://allisonhorst.github.io/palmerpenguins/)整理发布，许可为 **CC0**。
原文件下载自 [官方 GitHub CSV](https://github.com/allisonhorst/palmerpenguins/blob/main/inst/extdata/penguins.csv)，
下载日期 2026-10-05；原始文件保留为 `penguins-original.csv`，许可全文在 `PENGUINS-LICENSE.md`。
来源文件 SHA-256：`f204db2c753b0937caac3cb35258562c14f073e4bbc76be24b4c51ce22767a93`。

原始 344 行，仅剔除四个数值字段任一缺失的 2 行（原始数据行号 [4, 272]，不含表头），保留 342 行。
没有因性别缺失而删除行，没有填补、制造或改变测量数值。种类名称翻译为中文，字段简化，编号由原始行号生成。
保留阿德利企鹅 151 条、帽带企鹅 68 条、巴布亚企鹅 123 条。所有课堂企鹅图与下载使用同一处理结果。

引用：Horst AM, Hill AP, Gorman KB (2020). palmerpenguins: Palmer Archipelago (Antarctica) penguin data.
[DOI: 10.5281/zenodo.3960218](https://doi.org/10.5281/zenodo.3960218)。
原研究：Gorman KB, Williams TD, Fraser WR (2014),
[Ecological Sexual Dimorphism and Environmental Variability within a Community of Antarctic Penguins](https://doi.org/10.1371/journal.pone.0090081)。

## 核对与文件

三个课堂练习依次是：

1. 用直方图看清 90 只恶魔的速度分布。
2. 围绕三个问题跟写三种图：90 个恶魔的身高与速度联系、D001 的一天变化、三族的平均速度比较。
3. 回到恶魔群体档案，按种类着色，完成有依据的恶魔图鉴。
   完成后进入企鹅家族结课挑战；课后练习仍按课件中的任务完成。

笔记本提供三个课堂练习、一项结课挑战、空白跟写格和末尾参考。`完整参考.py` 可在练习文件夹通过
`python 完整参考.py` 运行，依次出现十张图，每次关闭图窗后继续；JupyterLab 会将图放在单元格下方。
`课堂练习二完整参考.py` 读取 `demons.csv` 与 `patrol.csv`，依次绘制身高与速度散点图、D001 巡逻折线图、三族平均速度条形图。网页练习二分为跟写和核对两页；第一页同时展示共用准备与三段绘图代码，第二页展示三个输出与收获。笔记本同样提供共用准备和三个绘图单元：先运行字体设置，再跟写准备代码一次，之后依次跟写三段绘图代码。
每张图均为真实 CSV 的绘图结果；图的默认配色与网页教学演示可能不同。
`data-summary.json` 提供数量与区间统计。`reference-plots/` 是验证程序执行同一份代码保存的十张图。
恶魔数据使用固定随机种子 20261005 生成；D004 是身高 205 cm、速度 11.7 m/s 的高个体快速度例子。
数据包含人为设置的教学例外，不能用模拟恶魔数据推断真实生物规律。
直方图使用 seaborn 默认自动分组；网页根据同一数据和 NumPy 的默认 auto 方法生成区间与数量。
区间通常左含右不含，最后一区间包含右端点。网页坐标刻度为便于阅读作了四舍五入，数量按原始边界统计。
可重复运行各绘图单元。若之前留下未关闭的图，先运行 `plt.close("all")` 再重画。
