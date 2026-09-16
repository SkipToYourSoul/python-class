export const movieUrl = 'https://movie.douban.com/top250';
export const movieRequestCells = [
  'import requests\n\nfrom bs4 import BeautifulSoup',
  `url = "${movieUrl}"\nheaders = {"User-Agent": "ClassroomStudy/1.0"}\nres = requests.get(url, headers=headers, timeout=10)`,
  'print(res.status_code)\nres.raise_for_status()\nres.encoding = "utf-8"\nhtml = res.text\nprint(html)',
];
export const movieParseCells = [
  'soup = BeautifulSoup(html, "html.parser")\nitems = soup.find_all("div", class_="item")\nprint("电影条目：", len(items))',
  'for item in items:\n    title = item.find(class_="title")\n    score = item.find(class_="rating_num")\n    if title is not None and score is not None:\n        print(title.get_text(strip=True),\n              score.get_text(strip=True))\n    else:\n        print("字段不完整，请查看这条 HTML")',
];
export const movieHtml = `<div class="item">
 <div class="info">
  <div class="hd"><a>
   <span class="title">
     肖申克的救赎
   </span>
  </a></div>
  <div class="bd"><div>
   <span class="rating_num">9.7</span>
  </div></div>
 </div>
</div>`;
export const movieRows = [
  ['肖申克的救赎', '9.7'],
  ['霸王别姬', '9.6'],
  ['泰坦尼克号', '9.5'],
];
export const movieSampleCode =
  'from pathlib import Path\nhtml = Path("samples/movies.html").read_text(encoding="utf-8")\nprint("数据来源：豆瓣页面保存节选")';
