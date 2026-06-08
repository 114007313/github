# 《放鳥同盟》FlakeOut Web App 執行計畫與說明

歡迎來到《放鳥同盟》FlakeOut Web App！本專案已成功從原有的 Python 互動式程式（[plan.py](file:///c:/Users/拉牙/OneDrive/Desktop/text/plan.py)）改造成一個視覺精美、具備暗黑霓虹科技感（Glassmorphism）的網頁版單頁應用程式（Single Page Application）。

---

## 📂 專案檔案結構

- 🌐 **[index.html](file:///c:/Users/拉牙/OneDrive/Desktop/text/index.html)**：網頁主結構，包含卡片式選擇器、API Key 設定區、藉口展示卡片與社交能量計量條。
- 🎨 **[style.css](file:///c:/Users/拉牙/OneDrive/Desktop/text/style.css)**：毛玻璃質感、霓虹發光特效、背景微光粒子與能量條充電動畫樣式。
- ⚡ **[app.js](file:///c:/Users/拉牙/OneDrive/Desktop/text/app.js)**：互動核心邏輯。支援本機隨機藉口資料庫與 Anthropic Claude API 連接。

---

## 🚀 如何執行與體驗

1. **直接開啟**：您可以在檔案總管中，直接雙擊 **[index.html](file:///c:/Users/拉牙/OneDrive/Desktop/text/index.html)** 檔案，使用任意現代瀏覽器（Chrome, Edge, Safari, Firefox 等）開啟即可運作。
2. **使用 Live Server**：如果您使用 VS Code，可以右鍵點擊 `index.html` 並選擇 「Open with Live Server」以獲得最佳的即時載入體驗。

---

## 💡 功能特色

### 1. 兩種藉口生成模式
- **在地備用模式（無 API Key）**：
  當未輸入 API Key 時，系統會自動使用內建的隨機藉口庫。結合您選擇的「放鳥對象」、「天氣」與「時間」，隨機組合出哭笑不得的荒謬藉口（例如：*「這個時間點月亮的光線角度剛好折射到我的懶惰神經，導致我整個人暫時性癱瘓。其實我剛踩到一隻螞蟻，內心充滿愧疚，決定在家為牠點燈祈福三小時，真的走不開。外面正下著大雨，我的心也跟著在下雨...」*）。
- **AI 智能模式（有 API Key）**：
  在網頁上方輸入您的 `Anthropic API Key`，系統將直接在瀏覽器端發送請求至 Anthropic Claude API，根據您的情境生成 100% 客製化、既荒誕又莫名具有哲理的完美放鳥理由。

### 2. 社交能量充電器 (🔋 Energy Saver)
每次成功生成藉口並放鳥後，系統會根據對象老闆、親戚、朋友、曖昧對象、老師、小組報告的不同，為您計算出今日「省下的社交能量值」（例如放鳥老闆可獲得 150~200 點！放鳥朋友可獲得 50~90 點）
- 社交能量條會伴隨螢光粒子特效進行充電動畫，提醒您把省下的能量拿去追劇或躺平。

### 3. 一鍵複製 (Copy to Clipboard)
- 生成藉口後，點擊「一鍵複製」即可將藉口存入剪貼簿，直接傳送給對方，省去手動選取的麻煩。


我想要一個可愛的網站，背景是深色的，不要毛玻璃質感，然後不要有霓虹發光特效，我要一個可愛的介面，選項按下去要有音效，要有一個一個出現的動畫效果，生成結果之前要有一個轉場效果，讓使用者感覺更有儀式感，生成結果要有音效，顯示"AI正在胡思亂想中...