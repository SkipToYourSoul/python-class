#!/usr/bin/env python3
"""组装 vinext 预渲染产物为可静态托管目录。

输入：
  dist/client/                     静态资源 + public 文件
  dist/server/prerendered-routes/  预渲染 HTML 与 .rsc
输出：
  static-export/
"""
import os
import shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CLIENT = os.path.join(ROOT, "dist", "client")
PRERENDER = os.path.join(ROOT, "dist", "server", "prerendered-routes")
OUT = os.path.join(ROOT, "static-export")

# 保留部署绑定（coze-dev CLI 复用同一应用）
COZE_BIND = os.path.join(OUT, ".coze")
saved_coze = None
if os.path.isfile(COZE_BIND):
    saved_coze = os.path.join(ROOT, ".coze.deploy.json")
    shutil.copy2(COZE_BIND, saved_coze)

if os.path.exists(OUT):
    shutil.rmtree(OUT)
os.makedirs(OUT)

# 重建后恢复部署绑定
if saved_coze and os.path.isfile(saved_coze):
    shutil.copy2(saved_coze, COZE_BIND)
    print("已恢复部署绑定 .coze")

# 1) 拷贝全部静态资源（保持根绝对路径 /_next、/courses/.../assets 等）
shutil.copytree(CLIENT, OUT, dirs_exist_ok=True)

# 2) 放置预渲染路由
def write_html_as_dir(rel_html):
    """courses/ai-with-python.html -> courses/ai-with-python/index.html"""
    rel_html = rel_html[:-5]  # 去掉 .html
    if rel_html == "index":
        dest = os.path.join(OUT, "index.html")
    else:
        dest = os.path.join(OUT, rel_html, "index.html")
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    shutil.copy2(os.path.join(PRERENDER, rel_html + ".html"), dest)
    return dest

def write_rsc(rel_rsc):
    """courses/ai-with-python.rsc -> courses/ai-with-python.rsc（保留文件名）"""
    dest = os.path.join(OUT, rel_rsc)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    shutil.copy2(os.path.join(PRERENDER, rel_rsc), dest)
    return dest

html_count = rsc_count = 0
for dirpath, _dirs, files in os.walk(PRERENDER):
    for fn in files:
        full = os.path.join(dirpath, fn)
        rel = os.path.relpath(full, PRERENDER)
        if fn.endswith(".html"):
            if fn == "404.html":
                shutil.copy2(full, os.path.join(OUT, "404.html"))
            else:
                write_html_as_dir(rel)
            html_count += 1
        elif fn.endswith(".rsc"):
            write_rsc(rel)
            rsc_count += 1

print(f"HTML 路由: {html_count}，RSC 文件: {rsc_count}")
print("输出目录:", OUT)
