#!/bin/zsh

# 双击发布课程网站到 Coze Pages（国内可直连）。
# 完整逻辑见 scripts/deploy-pages.sh。

set -e
unsetopt BG_NICE 2>/dev/null || true

cd "${0:A:h}"

if ! command -v node >/dev/null 2>&1; then
  echo "请先安装 Node.js 22.13 或更高版本。"
  read "?按回车键退出……"
  exit 1
fi

if bash scripts/deploy-pages.sh; then
  deploy_status=0
else
  deploy_status=$?
fi

echo
if [ $deploy_status -eq 0 ]; then
  echo "发布流程结束。可直接访问 https://aiwithpython.page.coze.site"
else
  echo "发布过程中出现错误，请查看上方信息。"
fi
read "?按回车键退出……"
exit $deploy_status
