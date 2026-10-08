# 第五课绘图库官方图片

获取日期：2026-10-08。两张 SVG 均从项目官网直接下载，未裁切、改色或改动比例。

| 本地文件              | 官方资源                                                                      | 来源页面                                                                  | 原始比例                          |
| --------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------- | --------------------------------- |
| `seaborn-logo.svg`    | [浅色背景横版 logo](https://seaborn.pydata.org/_images/logo-wide-lightbg.svg) | [Citing and logo](https://seaborn.pydata.org/citing.html)                 | 595.9575 × 170.634375，约 3.493:1 |
| `matplotlib-logo.svg` | [官网浅色背景 logo](https://matplotlib.org/stable/_static/logo_light.svg)     | [Matplotlib logo](https://matplotlib.org/stable/gallery/misc/logos2.html) | 900 × 216，约 4.167:1             |

## 展示与内容

- 浅色卡片中等比例显示，建议宽度 260–320 px，使用 `object-fit: contain`。对应高度约为 seaborn 74–92 px、Matplotlib 62–77 px。
- 图片可以分别链接 [seaborn 官网](https://seaborn.pydata.org/) 和 [Matplotlib 官网](https://matplotlib.org/)。
- seaborn 是基于 Matplotlib 的 Python 数据可视化库，提供绘制统计图的高级接口。来源：[seaborn 首页](https://seaborn.pydata.org/)。
- pyplot 是 Matplotlib 的接口模块；使用 Matplotlib logo，并将文字写成“Matplotlib · pyplot”。`import matplotlib.pyplot as plt` 后，可以用 `plt.xlabel()`、`plt.ylabel()` 添加坐标轴文字，用 `plt.show()` 显示图。来源：[官方 Pyplot tutorial](https://matplotlib.org/stable/tutorials/pyplot.html)。
- seaborn logo 最初的设计与实现归功于 Matthias Bussonnier。来源：[官方 Citing and logo](https://seaborn.pydata.org/citing.html)。

## 版权、许可与标志使用

- seaborn 项目版权：Copyright (c) 2012–2023, Michael L. Waskom，BSD 3-Clause 项目许可见同目录 `seaborn-license.txt`；[官方许可原文](https://github.com/mwaskom/seaborn/blob/master/LICENSE.md)。官网 logo 页面提供下载，没有额外列出独立的 logo 许可。本课仅在介绍 seaborn 时展示原标志，不作课程品牌或官方背书使用。
- Matplotlib 项目版权：Copyright (c) 2012–, Matplotlib Development Team; All Rights Reserved。与软件和文档有关的许可见同目录 `matplotlib-license.txt`；[官方许可页面](https://matplotlib.org/stable/project/license.html)。软件许可与商标使用是不同事项。
- [NumFOCUS 标志使用指南](https://numfocus.org/trademark-guidelines)包含 Matplotlib；其中“Publications and presentations”允许在文稿和演示的插图中使用 logo，但不能暗示项目发布或认可了内容；logo 应只等比例缩放。标记：Matplotlib is a trademark of NumFOCUS。本课为独立教学内容，与项目无隶属或背书关系。

## 文件检查

- 两张 SVG 均可解析为合法 XML；不包含脚本和外部 `href` 资源。
- 字标为矢量路径，不依赖浏览器安装特定字体。
