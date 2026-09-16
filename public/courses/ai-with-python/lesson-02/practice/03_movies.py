"""03: request Douban once, then print the first title of each movie."""
import requests

from bs4 import BeautifulSoup

url = "https://movie.douban.com/top250"
headers = {"User-Agent": "ClassroomStudy/1.0"}
res = requests.get(url, headers=headers, timeout=10)
res.raise_for_status()
res.encoding = "utf-8"
html = res.text

soup = BeautifulSoup(html, "html.parser")
for item in soup.find_all("div", class_="item"):
    title = item.find(class_="title")
    if title is not None:
        print(title.get_text(strip=True))
