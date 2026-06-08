# -*- coding: utf-8 -*-
"""
《放鳥同盟》FlakeOut Web App - 本地 HTTP 伺服器與 API Proxy
此腳本採用 Python 內建的 http.server 與 urllib 模組，不需使用 pip 安裝第三方套件。
執行此程式會自動在瀏覽器中開啟：http://localhost:8000
"""

import http.server
import socketserver
import urllib.request
import urllib.error
import json
import os
import webbrowser
import sys

# 強制將輸出編碼設為 UTF-8，防止 Windows 環境下印出 Emoji 或特殊字元時崩潰
try:
    if sys.stdout.encoding != 'utf-8':
        sys.stdout.reconfigure(encoding='utf-8')
    if sys.stderr.encoding != 'utf-8':
        sys.stderr.reconfigure(encoding='utf-8')
except AttributeError:
    # 舊版 Python 不支援 reconfigure 時的備用處理
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

PORT = 8000
# 取得目前腳本所在的目錄
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class FlakeOutHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # 設定伺服器工作的靜態檔案目錄
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        """處理網頁靜態檔案讀取"""
        if self.path == '/':
            self.path = '/index.html'
        
        # 移除 query parameters 避免找不到檔案
        clean_path = self.path.split('?')[0]
        
        # 處理 Windows 環境下的 URL 編碼（特別是中文檔名）
        import urllib.parse
        clean_path = urllib.parse.unquote(clean_path)
        
        filepath = os.path.join(DIRECTORY, clean_path.lstrip('/'))
        
        if os.path.exists(filepath) and os.path.isfile(filepath):
            # 設定正確的 Content-Type 以防瀏覽器解析錯誤
            mime_type = "text/plain; charset=utf-8"
            if filepath.endswith('.html'):
                mime_type = "text/html; charset=utf-8"
            elif filepath.endswith('.css'):
                mime_type = "text/css; charset=utf-8"
            elif filepath.endswith('.js'):
                mime_type = "application/javascript; charset=utf-8"
            elif filepath.endswith('.png'):
                mime_type = "image/png"
            elif filepath.endswith('.jpg') or filepath.endswith('.jpeg'):
                mime_type = "image/jpeg"
                
            try:
                with open(filepath, 'rb') as f:
                    content = f.read()
                self.send_response(200)
                self.send_header("Content-Type", mime_type)
                self.send_header("Content-Length", str(len(content)))
                self.end_headers()
                self.wfile.write(content)
            except Exception as e:
                self.send_error(500, f"伺服器內部錯誤: {e}")
        else:
            self.send_error(404, "找不到指定的檔案")

    def do_POST(self):
        """處理 AI 藉口生成的 Proxy 請求"""
        if self.path == '/api/generate':
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                
                req_data = json.loads(post_data.decode('utf-8'))
                target = req_data.get('target', '朋友')
                weather = req_data.get('weather', '下大雨')
                time_of_day = req_data.get('time', '下午')
                api_key = req_data.get('apiKey', '')
                
                if not api_key:
                    self.send_response(400)
                    self.send_header("Content-Type", "text/plain; charset=utf-8")
                    self.end_headers()
                    self.wfile.write("錯誤：未填寫 Anthropic API Key".encode('utf-8'))
                    return
                
                # 發送請求至 Anthropic Claude API (使用內建 urllib 避免 CORS 限制)
                excuse = self.call_anthropic_api(target, weather, time_of_day, api_key)
                
                # 回傳 JSON 結果給前端
                response_data = json.dumps({"excuse": excuse}).encode('utf-8')
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(response_data)))
                self.end_headers()
                self.wfile.write(response_data)
                
            except urllib.error.HTTPError as e:
                err_content = e.read().decode('utf-8')
                print(f"Anthropic API 錯誤回傳: {err_content}", file=sys.stderr)
                self.send_response(500)
                self.send_header("Content-Type", "text/plain; charset=utf-8")
                self.end_headers()
                
                # 嘗試提取 API 回傳的錯誤訊息
                try:
                    err_json = json.loads(err_content)
                    err_msg = err_json.get('error', {}).get('message', err_content)
                except Exception:
                    err_msg = err_content
                    
                self.wfile.write(f"Claude API 錯誤：{err_msg}".encode('utf-8'))
                
            except Exception as e:
                print(f"本地伺服器錯誤: {e}", file=sys.stderr)
                self.send_response(500)
                self.send_header("Content-Type", "text/plain; charset=utf-8")
                self.end_headers()
                self.wfile.write(f"伺服器內部錯誤：{e}".encode('utf-8'))
        else:
            self.send_error(404, "找不到指定的路徑")

    def call_anthropic_api(self, target, weather, time_of_day, api_key):
        """透過 HTTPS 請求直接與 Anthropic API 通訊"""
        prompt = f"""你是「放鳥同盟App」的AI藉口大師。請根據以下條件生成一個放鳥藉口：
- 放鳥對象：{target}
- 天氣：{weather}
- 時間：{time_of_day}

要求：
1. 藉口必須超扯、荒謬、但又帶點哲理或莫名合理性，讓對方哭笑不得。
2. 要結合天氣 and 時間製造「客觀因素不可抗力」的感覺。
3. 語氣要帶點無辜、抱歉但又理所當然，使用台灣繁體中文口吻與用語。
4. 字數約 100~150 字。
5. 直接輸出藉口內容，不要加任何引號、標題或說明，用第一人稱「我」。

只輸出藉口本文，不要任何前言後語。"""

        url = "https://api.anthropic.com/v1/messages"
        headers = {
            "Content-Type": "application/json",
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01"
        }
        
        data = {
            "model": "claude-3-5-sonnet-20241022",
            "max_tokens": 1024,
            "messages": [
                {"role": "user", "content": prompt}
            ]
        }
        
        req = urllib.request.Request(
            url, 
            data=json.dumps(data).encode('utf-8'), 
            headers=headers, 
            method='POST'
        )
        
        # 設定超時為 30 秒
        with urllib.request.urlopen(req, timeout=30) as response:
            res_body = json.loads(response.read().decode('utf-8'))
            return res_body['content'][0]['text'].strip()

def run_server():
    # 允許快速重用 Socket 連接埠
    socketserver.TCPServer.allow_reuse_address = True
    try:
        with socketserver.TCPServer(("", PORT), FlakeOutHTTPRequestHandler) as httpd:
            print("=" * 70)
            print("        [放鳥同盟] FlakeOut Web App 本地伺服器已啟動")
            print(f"        -> 請至此網址體驗：http://localhost:{PORT}")
            print("        提示：網頁將會自動開啟。在網頁輸入 API Key，即可安全呼叫 AI 模式。")
            print("        如果要關閉伺服器，請在終端機按下 Ctrl+C 結束。")
            print("=" * 70)
            
            # 自動使用預設瀏覽器開啟網址
            try:
                webbrowser.open(f"http://localhost:{PORT}")
            except Exception as e:
                print(f"無法自動開啟瀏覽器，請手動輸入網址，錯誤原因：{e}")
                
            httpd.serve_forever()
    except Exception as e:
        print(f"伺服器啟動失敗，請檢查 {PORT} 連接埠是否已被佔用。錯誤原因：{e}")

if __name__ == '__main__':
    run_server()