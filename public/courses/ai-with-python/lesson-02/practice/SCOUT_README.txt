课堂练习 01：取回前线敌情

条件：Python 3.10+，安装 requests。
终端安装：python -m pip install requests
Jupyter 安装：%pip install requests
解压后打开“前线侦察练习.ipynb”，先完成“第一次请求”；第二版留到课件下一页。
common.py、samples 和脚本须保留在同一文件夹。

运行第一版：python 01_scout_request.py
预期：状态码 200，正文包含炎角兽、北方峡谷、火焰、怕强光。
第二版：python 01_scout_request.py --updated
预期：状态码 200，炎角兽位置改为东部石桥，新增岩背魔。
两个命令均临时启动本机服务、发出一次实际 GET，然后关闭服务。
网页为预先编写的虚构教学记录，不是现场侦察或自动监测。

部署后可使用：python 01_scout_request.py --url "老师提供的完整网址"
把引号中的说明替换为实际地址；在线第二版也用它自己的网址。
不会自动刷新已有 res；要查看新版本，需要重新请求。
遇到错误先检查地址和连接，不会把本地样本伪装成现场响应。

如需本机浏览，运行：python -m http.server 8000 --directory samples
打开 http://localhost:8000/scout.html（仅本机）。
两份网页分别是独立 HTML，所有内容与样式都在各自文件中。
获取后先核对恶魔名与地点；提取字段和制定防御方案将在后续展开。
