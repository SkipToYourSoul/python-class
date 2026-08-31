#!/bin/zsh

set -e
unsetopt BG_NICE

cd "${0:A:h}"

if ! command -v node >/dev/null 2>&1; then
  echo "请先安装 Node.js 22.13 或更高版本。"
  read "?按回车键退出……"
  exit 1
fi

npm install --prefer-offline

(
  for _ in {1..60}; do
    if curl --silent --head --fail "http://localhost:3000/" >/dev/null; then
      open "http://localhost:3000/"
      exit 0
    fi
    sleep 0.5
  done
  echo "网站启动超时，请查看这个窗口中的错误信息。"
) &

npm run dev -- --port 3000 --strictPort
