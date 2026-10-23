import requests
from bs4 import BeautifulSoup

url = "https://www.creaai.online/battle-towers.html"
res = requests.get(url, timeout=10)
res.raise_for_status()
res.encoding = "utf-8"

soup = BeautifulSoup(
    res.text, "html.parser")
csv_text = soup.find(
    id="intel-data").get_text()

with open("towers.csv", "w",
          encoding="utf-8") as f:
    f.write(csv_text)
print("情报已保存：towers.csv")
