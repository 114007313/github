/* ==========================================================================
   《放鳥同盟》FlakeOut Web App - 前端核心邏輯
   ========================================================================== */

// ── 音效系統 (Web Audio API) ───────────────────────────────────────────
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

/**
 * 播放清脆可愛的「啵」聲（點擊音效）
 */
function playClickSound() {
    try {
        initAudio();
        if (!audioCtx) return;
        
        // 確保 AudioContext 已啟動（瀏覽器安全性限制）
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'sine';
        const now = audioCtx.currentTime;
        
        // 快速頻率掃描 (350Hz -> 850Hz) 產生「啵」聲
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(850, now + 0.08);
        
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        
        osc.start(now);
        osc.stop(now + 0.08);
    } catch (e) {
        console.warn("音效播放失敗:", e);
    }
}

/**
 * 播放懷舊 8-bit 升級琶音（成功音效）
 */
function playSuccessSound() {
    try {
        initAudio();
        if (!audioCtx) return;
        
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const now = audioCtx.currentTime;
        
        const playTone = (freq, startTime, duration) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.type = 'triangle'; // 三角波有可愛的 Chiptune 感覺
            osc.frequency.setValueAtTime(freq, startTime);
            
            gain.gain.setValueAtTime(0.12, startTime);
            gain.gain.exponentialRampToValueAtTime(0.005, startTime + duration);
            
            osc.start(startTime);
            osc.stop(startTime + duration);
        };
        
        // C5 -> E5 -> G5 -> C6 快速升級音效
        playTone(523.25, now, 0.08);          // C5
        playTone(659.25, now + 0.06, 0.08);    // E5
        playTone(783.99, now + 0.12, 0.08);    // G5
        playTone(1046.50, now + 0.18, 0.15);   // C6
    } catch (e) {
        console.warn("成功音效播放失敗:", e);
    }
}


// ── 在地備用資料庫 ──────────────────────────────────────────────────
const FALLBACK_EXCUSES = {
    "老闆": [
        "我一開眼發現大腦正在進行系統自動更新，進度條卡在 99%。在下載完成前，我只要移動身體就會重啟開機，真的沒辦法去上班。",
        "突然接到量子力學研究會的緊急諮詢，這攸關平行宇宙的穩定！為了公司的未來與人類的安危，我今天必須留在家裡進行心靈通訊。",
        "我家巷口被共享單車集體罷工給堵死了，里長說現在進出需要通行證，我排隊排了兩個小時，現在還卡在第二關面試，沒辦法出門。"
    ],
    "親戚": [
        "剛才在客廳遭遇時空亂流，我被困在一個「阿嬤覺得你很冷」的特殊維度裡，全身被套了五件羽絨衣和三條毛毯，動彈不得，真的過不去了。",
        "我出門前算了一下，發現我今天的磁場跟親戚聚會的風水極度不合，強行前去會導致家族集體智商衰退，為了大家的健康我決定自我隔離。",
        "我阿嬤家的貓剛剛突然開口跟我討論尼采的虛無主義。為了幫牠做心理輔導以防牠看破紅塵，我今天必須留在家裡陪牠喝茶。"
    ],
    "朋友": [
        "剛才在路上踩到一隻螞蟻，我內心充滿了無法言喻的愧疚，決定原地為牠超度並點燈祈福三小時，希望你能體諒我這顆善良脆弱的心。",
        "我家的貓剛才用一種『你今天敢出門試試看』的冷酷眼神看著我。為了生命財產安全，我決定對這股惡勢力妥協，乖乖在家侍奉牠。",
        "外送員送餐來時留下一句『這是一碗有故事的麵』，我吃了一口眼眶泛淚，決定花一整晚的時間來品嚐並感悟其中蘊含的人生哲理。"
    ],
    "曖昧對象 / 另一半": [
        "算命師說我今天如果出門，會因為長得太過迷人而引發大型街頭暴動。為了你的人身安全與世界和平，我決定含淚把自己反鎖在家。",
        "我今天穿的衣服顏色跟宇宙的引力磁場完全不合，一走出大門就會像斷線氣球一樣飄到外太空，請原諒我受到物理定律的無情限制。",
        "我在路邊遇到一隻迷路的毛毛蟲，牠眼淚汪汪地指名要我護送牠去附近公園。這是一場攸關生態平衡的重大救援，我不能棄牠於不顧。"
    ],
    "老師": [
        "老師對不起，我準備交的報告昨晚被我家的狗當成潔牙骨給啃得稀碎。我花了半天嘗試拼回去，結果拼出了一張藏寶圖，我現在正要去尋寶。",
        "我今天早上起床時，發現我房間的重力突然失效了，我整個人飄在天花板上，正嘗試用吸管反作用力把自己噴回地面，真的去不了學校。",
        "我在出門的路上，突然被一位神秘的老人攔住，說我是萬中選一的武術奇才，非要傳授我如來神掌不可。為了維護世界和平，我只能請假了。"
    ],
    "小組報告": [
        "我發現我的磁場跟其他組員會產生劇烈的化學反應，導致我一靠近就會開始瘋狂打噴嚏。為了報告順利，我決定採用心靈感應遠端參與。",
        "準備出門時，我被困在一個名為『床鋪』的強大黑洞中，它的引力已經超越了光速，我用盡全身力氣也只能動一動手指，真的出不去。",
        "我正在跟外星人進行一場關於『人類為什麼要分組報告』的學術外交談判，這攸關地球會不會被毀滅！我今天必須全力以赴，大家加油！"
    ]
};

const WEATHER_EFFECTS = {
    "下大雨": "外面正下著大雨，我的心也跟著在下雨，體感溫度直接降到絕對零度，實在動彈不得。",
    "大太陽": "現在太陽大到紫外線能直接穿透靈魂，我體內的吸血鬼基因正在隱隱作痛，無法在紫外線下前進。",
    "陰天": "這種陰沉的天氣讓我的右腳膝蓋發出「不宜遠行」的警告音效，我必須尊重身體的直覺。"
};

const TIME_EFFECTS = {
    "早上": "這個時間點太陽磁場太強，我的大腦還沒完全下載完今天的開機檔案。",
    "下午": "這個尷尬的時間，我的靈魂正處於微波加熱的狀態，如果被打斷會變得很難吃（？）。",
    "晚上": "月亮的光線角度剛好折射到我的懶惰神經，導致我整個人暫時性癱瘓。"
};

const ENERGY_RANGE = {
    "老闆": [150, 200],
    "親戚": [80, 120],
    "朋友": [50, 90],
    "曖昧對象 / 另一半": [100, 140],
    "老師": [120, 160],
    "小組報告": [130, 180]
};

// ── 轉場隨機字幕庫 ─────────────────────────────────────────────────
const THINKING_SUBTITLES = [
    "正在召喚藉口星人幫你想藉口...",
    "正在攔截外星人的通訊訊號...",
    "正在查閱《躺平大辭典》...",
    "正在調配最合理的荒謬藥水...",
    "正在幫藉口大師補充電能...",
    "正在把您的愧疚感打包丟掉...",
    "正在為您編寫完美的缺席劇本...",
    "正在向上天祈求一場局部大雨..."
];


// ── 應用程式狀態與邏輯 ──────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    // 取得 DOM 元素
    const apiKeyInput = document.getElementById("api-key-input");
    const toggleApiBtn = document.getElementById("toggle-api-visibility");
    const apiStatusText = document.getElementById("api-status-text");
    const flakeForm = document.getElementById("flake-form");
    const btnGenerate = document.getElementById("btn-generate");
    const resultArea = document.getElementById("result-area");
    const excuseText = document.getElementById("excuse-text");
    const btnCopy = document.getElementById("btn-copy");
    const energyPts = document.getElementById("energy-pts");
    const energyProgress = document.getElementById("energy-progress");
    const thinkingOverlay = document.getElementById("thinking-overlay");
    const thinkingTitle = document.getElementById("thinking-title");
    const thinkingSubtitle = document.getElementById("thinking-subtitle");

    let isTyping = false; // 是否正在進行打字機效果

    // 1. 初始化讀取 API Key
    const savedApiKey = localStorage.getItem("flakeout_api_key");
    if (savedApiKey) {
        apiKeyInput.value = savedApiKey;
        updateApiStatus(savedApiKey);
    }

    // API Key 變更事件
    apiKeyInput.addEventListener("input", (e) => {
        const val = e.target.value.trim();
        localStorage.setItem("flakeout_api_key", val);
        updateApiStatus(val);
    });

    // 顯示/隱藏 API Key
    toggleApiBtn.addEventListener("click", () => {
        playClickSound();
        if (apiKeyInput.type === "password") {
            apiKeyInput.type = "text";
            toggleApiBtn.textContent = "🙈";
        } else {
            apiKeyInput.type = "password";
            toggleApiBtn.textContent = "👁️";
        }
    });

    // 更新 API 狀態顯示
    function updateApiStatus(key) {
        if (key) {
            apiStatusText.innerHTML = `<span class="status-dot success"></span> 已連線 AI 模式 (金鑰已設定)`;
        } else {
            apiStatusText.innerHTML = `<span class="status-dot warning"></span> 備用本地模式`;
        }
    }

    // 為所有單選按鈕選項綁定點擊音效
    const selectors = document.querySelectorAll(".card-option, .segment-option");
    selectors.forEach(selector => {
        selector.addEventListener("click", () => {
            playClickSound();
        });
    });

    // 2. 核心：點擊生成藉口
    btnGenerate.addEventListener("click", async () => {
        if (isTyping) return; // 正在打字中，不重複執行
        
        playClickSound();

        // 讀取目前的表單條件
        const targetEl = document.querySelector('input[name="target"]:checked');
        const weatherEl = document.querySelector('input[name="weather"]:checked');
        const timeEl = document.querySelector('input[name="time"]:checked');

        if (!targetEl || !weatherEl || !timeEl) {
            alert("請完整選擇放鳥對象、天氣與時間！");
            return;
        }

        const target = targetEl.value;
        const weather = weatherEl.value;
        const time = timeEl.value;
        const apiKey = apiKeyInput.value.trim();

        // 隱藏上一次的結果，開始播放儀式感轉場
        resultArea.classList.add("hidden");
        btnGenerate.disabled = true;

        // 顯示「AI正在胡思亂想中...」遮罩
        thinkingTitle.textContent = "AI正在胡思亂想中...";
        thinkingSubtitle.textContent = getRandomThinkingSubtitle();
        thinkingOverlay.classList.remove("hidden");

        // 在轉場中每 600ms 切換一次可愛的 subtitle 字幕
        const subtitleInterval = setInterval(() => {
            thinkingSubtitle.textContent = getRandomThinkingSubtitle();
        }, 600);

        // 儀式感轉場至少持續 1.5 秒
        const startTime = Date.now();
        let generatedExcuse = "";
        let modeUsed = "fallback";

        try {
            // 判斷是否使用 AI 模式
            const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
            
            if (apiKey) {
                if (isLocalhost) {
                    // 呼叫本機伺服器的 API Proxy
                    const response = await fetch("/api/generate", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ target, weather, time, apiKey })
                    });
                    
                    if (!response.ok) {
                        const errText = await response.text();
                        throw new Error(errText || "後端 API Proxy 回傳錯誤");
                    }
                    
                    const data = await response.json();
                    generatedExcuse = data.excuse;
                    modeUsed = "ai";
                } else {
                    // 若是直接點 html 檔案開啟，因為 CORS 限制無法連線後端 API Proxy
                    console.warn("檢測到 file:// 協議直接開啟，因瀏覽器 CORS 限制，自動退回本地模式");
                    thinkingTitle.textContent = "⚠️ CORS 安全限制 ⚠️";
                    thinkingSubtitle.textContent = "直接雙擊 HTML 無法呼叫 AI。請在終端機執行 python plan.py 啟動本地伺服器！現在切換為在地模式...";
                    // 延長轉場時間讓使用者看清提示
                    await delay(2200);
                    generatedExcuse = generateLocalExcuse(target, weather, time);
                }
            } else {
                generatedExcuse = generateLocalExcuse(target, weather, time);
            }
        } catch (error) {
            console.error("生成藉口失敗:", error);
            thinkingTitle.textContent = "⚠️ AI 思考斷線了 ⚠️";
            thinkingSubtitle.textContent = "API 請求失敗。正在幫您切換為在地備用模式...";
            await delay(1500);
            generatedExcuse = generateLocalExcuse(target, weather, time);
        }

        // 停止字幕切換
        clearInterval(subtitleInterval);

        // 確保轉場動畫至少有 1500ms 的展示時間
        const elapsedTime = Date.now() - startTime;
        const remainingDelay = Math.max(0, 1500 - elapsedTime);
        await delay(remainingDelay);

        // 關閉轉場遮罩
        thinkingOverlay.classList.add("hidden");
        btnGenerate.disabled = false;

        // 播放生成成功音效
        playSuccessSound();

        // 顯示結果區域
        resultArea.classList.remove("hidden");

        // 啟動打字機效果呈現藉口
        runTypingEffect(generatedExcuse, () => {
            // 打字完成後的 Callback：計算並為社交能量充電
            const energy = calculateEnergy(target);
            energyPts.textContent = `+${energy} 點`;
            
            // 計算充電百分比，最高 200 點
            const percent = Math.min(100, Math.max(0, (energy / 200) * 100));
            energyProgress.style.width = `${percent}%`;
        });
    });

    // 3. 複製功能
    btnCopy.addEventListener("click", () => {
        if (isTyping) return;
        playClickSound();
        const text = excuseText.textContent;
        navigator.clipboard.writeText(text).then(() => {
            const originText = btnCopy.innerHTML;
            btnCopy.innerHTML = "✅ 已複製！";
            btnCopy.disabled = true;
            setTimeout(() => {
                btnCopy.innerHTML = originText;
                btnCopy.disabled = false;
            }, 1500);
        }).catch(err => {
            console.error("無法複製文字:", err);
            alert("複製失敗，請手動複製！");
        });
    });


    // ── 輔助函式 ─────────────────────────────────────────────────────

    function getRandomThinkingSubtitle() {
        return THINKING_SUBTITLES[Math.floor(Math.random() * THINKING_SUBTITLES.length)];
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 生成在地備用藉口
     */
    function generateLocalExcuse(target, weather, time) {
        const excuses = FALLBACK_EXCUSES[target] || FALLBACK_EXCUSES["朋友"];
        const base = excuses[Math.floor(Math.random() * excuses.length)];
        const weatherText = WEATHER_EFFECTS[weather] || "";
        const timeText = TIME_EFFECTS[time] || "";
        return `${timeText}其實${base}${weatherText}`;
    }

    /**
     * 計算今日省下的社交能量值
     */
    function calculateEnergy(target) {
        const range = ENERGY_RANGE[target] || [50, 100];
        return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
    }

    /**
     * 打字機效果
     */
    function runTypingEffect(text, onComplete) {
        isTyping = true;
        btnCopy.disabled = true;
        excuseText.textContent = "";
        
        let index = 0;
        const timer = setInterval(() => {
            if (index < text.length) {
                excuseText.textContent += text.charAt(index);
                index++;
            } else {
                clearInterval(timer);
                isTyping = false;
                btnCopy.disabled = false;
                if (onComplete) onComplete();
            }
        }, 40); // 每 40ms 印出一個字
    }
});
