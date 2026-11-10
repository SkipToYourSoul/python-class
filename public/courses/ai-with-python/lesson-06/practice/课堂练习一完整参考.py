import requests  # 请求网页
from bs4 import BeautifulSoup  # 解析

url = "https://www.creaai.online/battle-towers.html"
res = requests.get(url, timeout=10)  # 获取
res.raise_for_status()
res.encoding = "utf-8"

soup = BeautifulSoup(
    res.text, "html.parser")
csv_text = soup.find(  # 按属性找元素
    id="intel-data").get_text()  # 取文本

with open("towers.csv", "w",  # 打开文件
          encoding="utf-8") as f:
    f.write(csv_text)  # 写入情报
print("情报已保存：towers.csv")
