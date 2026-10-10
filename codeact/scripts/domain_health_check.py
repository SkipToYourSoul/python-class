#!/usr/bin/env python3
"""
域名健康复测脚本 — 检测指定域名是否从 404 故障中恢复。

用法:
  python domain_health_check.py [result_mode] [url1] [url2] ...

参数:
  result_mode: "auto" | "display_only" | "no_reply" (默认 "auto")
    - auto: 全部 200 → display_only；任一非 200 → no_reply
  url1..N: 待检测的 HTTPS URL（默认 https://creaai.online/ https://www.creaai.online/）

判定:
  - 全部 HTTP 200 → 恢复，以 display_only 通知用户
  - 任一非 200（含超时/TLS 错误） → 未恢复，以 no_reply 静默退出

每次运行追加日志到 ./codeact/output/domain-check.log
"""

import sys
import os
import asyncio
import subprocess
import json
import re
from datetime import datetime, timezone, timedelta

# ─── CodeAct SDK ───
from codeact_sdk import CodeActSDK

# ─── 常量 ───
DEFAULT_URLS = ["https://creaai.online/", "https://www.creaai.online/"]
REQUEST_TIMEOUT_SEC = 12
MAX_RETRIES = 2
LOG_PATH = "./codeact/output/domain-check.log"


async def check_single_url(url: str) -> dict:
    """
    对单个 URL 执行 HTTP 检测，使用 curl 子进程以避免 aiohttp/requests
    对非标准 HTTP 响应的解析问题。最多重试 MAX_RETRIES 次。

    返回 {"url": str, "status_code": int|None, "error": str|None, "ok": bool}
    """
    last_error = None
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            # 使用 curl 获取 HTTP 状态码，-k 忽略证书问题
            # -o /dev/null 丢弃 body，-w 只输出状态码
            # --max-time 限制总超时
            result = subprocess.run(
                [
                    "curl", "-sS", "-k", "-o", "/dev/null",
                    "-w", "%{http_code}",
                    "--max-time", str(REQUEST_TIMEOUT_SEC),
                    "-L",  # follow redirects
                    url
                ],
                capture_output=True,
                text=True,
                timeout=REQUEST_TIMEOUT_SEC + 5,
            )

            status_str = result.stdout.strip()
            # curl 返回的 http_code 可能是 000（连接失败）或三位数字
            if status_str and status_str.isdigit():
                status_code = int(status_str)
                if status_code == 200:
                    return {"url": url, "status_code": status_code, "error": None, "ok": True}
                else:
                    last_error = f"HTTP {status_code}"
                    if attempt < MAX_RETRIES:
                        await asyncio.sleep(1)
                        continue
                    return {"url": url, "status_code": status_code, "error": last_error, "ok": False}
            else:
                # curl 返回空或非数字，说明连接级别失败
                stderr_snippet = result.stderr.strip()[:200] if result.stderr else "no stderr"
                last_error = f"Connection failed: {stderr_snippet}"
                if attempt < MAX_RETRIES:
                    await asyncio.sleep(1)
                    continue
                return {"url": url, "status_code": None, "error": last_error, "ok": False}

        except subprocess.TimeoutExpired:
            last_error = f"Timeout ({REQUEST_TIMEOUT_SEC}s)"
            if attempt < MAX_RETRIES:
                await asyncio.sleep(1)
                continue
            return {"url": url, "status_code": None, "error": last_error, "ok": False}
        except Exception as e:
            last_error = f"{type(e).__name__}: {e}"
            return {"url": url, "status_code": None, "error": last_error, "ok": False}

    return {"url": url, "status_code": None, "error": last_error or "Unknown", "ok": False}


async def main():
    # ─── 解析参数 ───
    result_mode_arg = sys.argv[1] if len(sys.argv) > 1 else "auto"
    urls = sys.argv[2:] if len(sys.argv) > 2 else DEFAULT_URLS

    print(f"[domain-check] result_mode_arg={result_mode_arg}")
    print(f"[domain-check] urls={urls}")

    # ─── 并发检测所有域名 ───
    tasks = [check_single_url(url) for url in urls]
    results = await asyncio.gather(*tasks)

    # ─── 汇总 ───
    all_ok = all(r["ok"] for r in results)
    now_str = datetime.now(timezone(timedelta(hours=8))).strftime("%Y-%m-%d %H:%M:%S CST")

    # ─── 写日志 ───
    os.makedirs(os.path.dirname(LOG_PATH), exist_ok=True)
    log_lines = [f"[{now_str}]"]
    for r in results:
        status_str = str(r["status_code"]) if r["status_code"] is not None else r["error"]
        log_lines.append(f"  {r['url']} → {status_str}")
    log_lines.append(f"  verdict: {'RECOVERED' if all_ok else 'STILL_DOWN'}")
    log_lines.append("")
    log_text = "\n".join(log_lines)

    with open(LOG_PATH, "a", encoding="utf-8") as f:
        f.write(log_text)
    print(log_text)

    # ─── 决定 result_mode ───
    if result_mode_arg == "auto":
        effective_mode = "display_only" if all_ok else "no_reply"
    else:
        effective_mode = result_mode_arg

    # ─── 构造 message ───
    if all_ok:
        url_list = "\n".join(f"  ✅ {r['url']}" for r in results)
        message = (
            f"[主人](at://owner) 域名已恢复生效！\n\n"
            f"以下域名均返回 HTTP 200：\n{url_list}\n\n"
            f"自定义域名已可正常访问。"
        )
    else:
        status_summary = " | ".join(
            f"{r['url']} → {r['status_code'] if r['status_code'] else r['error']}"
            for r in results
        )
        message = f"域名未恢复: {status_summary}"

    # ─── 提交结果 ───
    sdk = CodeActSDK()
    await sdk.submit_result(
        result_mode=effective_mode,
        status="success",
        message=message,
        data={
            "all_ok": all_ok,
            "details": results,
            "checked_at": now_str,
        },
    )

    print(f"[domain-check] Done. effective_mode={effective_mode}, all_ok={all_ok}")


if __name__ == "__main__":
    asyncio.run(main())
