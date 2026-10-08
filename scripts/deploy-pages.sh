#!/usr/bin/env bash
#
# 一键发布课程网站到 Coze Pages（国内可直连）。
#
# 流程：
#   1. 检查 coze-dev 与登录态
#   2. vinext 构建并预渲染全部路由为静态 HTML
#   3. 用 scripts/build-static-export.py 把静态资源 + 预渲染 HTML 组装到 static-export/
#   4. 发布到已绑定的 Coze Pages 应用，并轮询到部署完成，打印线上地址
#
# 依赖：Node.js 22.13+、python3、已安装并登录 coze-dev（@coze-arch/cli@0.1.7）。
# 部署绑定保存在 static-export/.coze（build-static-export.py 会在重建时保留）。

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

APP_NAME="AI Python 课程"
EXPORT_DIR="static-export"

# ---- 定位 coze-dev：优先 PATH，其次用户目录安装位置（系统全局目录可能无写权限）----
if command -v coze-dev >/dev/null 2>&1; then
  COZE="coze-dev"
elif [ -x "$HOME/.coze-cli-npm/bin/coze-dev" ]; then
  export PATH="$HOME/.coze-cli-npm/bin:$PATH"
  COZE="$HOME/.coze-cli-npm/bin/coze-dev"
else
  echo "❌ 未找到 coze-dev。请先安装 @coze-arch/cli@0.1.7："
  echo "   npm install -g @coze-arch/cli@0.1.7"
  echo "   若系统全局目录无权限，可装到用户目录："
  echo "   npm install -g --prefix \"$HOME/.coze-cli-npm\" @coze-arch/cli@0.1.7"
  exit 1
fi

command -v node >/dev/null 2>&1 || { echo "❌ 未找到 node，请先安装 Node.js 22.13+"; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "❌ 未找到 python3"; exit 1; }

# 从可能混入 Warning 文本的输出中提取第一个 JSON 对象
read_json_field() {
  # $1=字段名；stdin=混合文本
  python3 -c "import sys,json;s=sys.stdin.read();i=s.find('{');d=json.loads(s[i:]);v=d.get('$1');print('' if v is None else v)"
}

echo "==> [1/4] 检查登录态"
if ! "$COZE" deploy --format json auth status 2>/dev/null | python3 -c "import sys,json;d=json.load(sys.stdin);sys.exit(0 if d.get('logged_in') else 1)"; then
  echo "❌ coze-dev 未登录，请先运行：$COZE deploy auth login"
  exit 1
fi
echo "    已登录"

echo "==> [2/4] 构建并预渲染（vinext build --prerender-all）"
npx vinext build --prerender-all

echo "==> [3/4] 组装静态站到 ${EXPORT_DIR}/"
python3 scripts/build-static-export.py

if [ ! -f "${EXPORT_DIR}/.coze" ]; then
  echo "❌ ${EXPORT_DIR}/.coze 不存在：该静态目录尚未绑定 Coze Pages 应用。"
  echo "   首次发布需要先创建应用绑定，请联系项目维护者或参考部署记忆中的手动流程。"
  exit 1
fi

echo "==> [4/4] 发布到 Coze Pages"
cd "$EXPORT_DIR"
DEPLOY_RAW="$("$COZE" deploy --format json --source-root . --application-type pages --name "$APP_NAME" --yes)"
APP_ID="$(printf '%s' "$DEPLOY_RAW" | read_json_field app_id)"
DEPLOY_ID="$(printf '%s' "$DEPLOY_RAW" | read_json_field deploy_history_id)"

if [ -z "$APP_ID" ] || [ -z "$DEPLOY_ID" ]; then
  echo "❌ 未能解析部署任务 ID，原始输出："
  printf '%s\n' "$DEPLOY_RAW"
  exit 1
fi
echo "    app_id=${APP_ID}  deploy_id=${DEPLOY_ID}"

echo "==> 等待部署完成…"
FINAL=""
for i in $(seq 1 90); do
  R="$("$COZE" deploy --format json status --app-id "$APP_ID" --deploy-id "$DEPLOY_ID" 2>/dev/null || true)"
  ST="$(printf '%s' "$R" | python3 -c "import sys,json;
try: print(json.load(sys.stdin).get('status',''))
except Exception: print('')" 2>/dev/null || echo "")"
  case "$ST" in
    Succeeded) FINAL="$R"; echo "    部署成功 ✅"; break ;;
    Failed|Canceled)
      echo "❌ 部署状态为 ${ST}，诊断信息："
      printf '%s\n' "$R"
      exit 1
      ;;
    *) printf "    …%s（第 %s 次查询）\n" "${ST:-未知}" "$i"; sleep 5 ;;
  esac
done

if [ -z "$FINAL" ]; then
  echo "❌ 等待超时。可稍后用以下命令恢复查询："
  echo "   $COZE deploy --format json status --app-id $APP_ID --deploy-id $DEPLOY_ID"
  exit 1
fi

echo "==> 线上地址："
printf '%s' "$FINAL" | python3 -c "import sys,json;d=json.load(sys.stdin);[print('   ',x) for x in (d.get('domains') or [])]"
echo "🎉 发布完成"
