import random
import os

try:
    import anthropic
    HAS_ANTHROPIC = True
except ImportError:
    HAS_ANTHROPIC = False


# ── 備用藉口庫（無 API 時使用）──────────────────────────────────────

FALLBACK_EXCUSES = {
    "老闆": [
        "我的電腦剛自動更新，進度條卡在 99%，我必須用念力守護它完成，不然公司機密檔案會蒸發。",
        "我突然接到量子力學領域的緊急諮詢電話，為了公司的未來，我必須留在家裡專心通話。",
        "我家巷口被共享單車集體罷工給堵死了，里長說現在進出需要通行證，我正在排隊申請。",
    ],
    "朋友": [
        "我剛踩到一隻螞蟻，內心充滿愧疚，決定在家為牠點燈祈福三小時，真的走不開。",
        "我家的貓剛剛用『你敢出門試試看』的眼神看著我，為了生命安全，我決定妥協。",
        "外送員留下一句『這是一碗有故事的麵』，我必須花一整晚品嚐並感悟人生。",
    ],
    "曖昧對象 / 另一半": [
        "算命師說我今天如果出門，會因為太帥/太美引發 street fight，為了你的安全，我含淚留在家。",
        "我今天衣服顏色跟宇宙磁場不合，一出門就會引力失衡，請原諒我的物理限制。",
        "我在路上撿到一隻迷路的毛毛蟲，牠指名要我送牠去附近公園，這是一場關乎生態平衡的救援。",
    ],
}

WEATHER_EFFECTS = {
    "下大雨": "外面正下著大雨，我的心也跟著在下雨，體感溫度直接降到絕對零度，實在動彈不得。",
    "大太陽": "現在太陽大到紫外線能直接穿透靈魂，我體內的吸血鬼基因正在隱隱作痛，無法在紫外線下前進。",
    "陰天":   "這種陰沉的天氣讓我的右腳膝蓋發出「不宜遠行」的警告音效，我必須尊重身體的直覺。",
}

TIME_EFFECTS = {
    "早上": "這個時間點太陽磁場太強，我的大腦還沒完全下載完今天的開機檔案。",
    "下午": "這個尷尬的時間，我的靈魂正處於微波加熱的狀態，如果被打斷會變得很難吃（？）。",
    "晚上": "月亮的光線角度剛好折射到我的懶惰神經，導致我整個人暫時性癱瘓。",
}

ENERGY_RANGE = {
    "老闆":           (150, 200),
    "朋友":           (50,  90),
    "曖昧對象 / 另一半": (100, 140),
}


# ── AI 藉口生成 ────────────────────────────────────────────────────

def generate_excuse_ai(target: str, weather: str, time_of_day: str) -> str:
    """呼叫 Claude API 生成藉口（需安裝 anthropic 套件並設定 ANTHROPIC_API_KEY）"""
    client = anthropic.Anthropic()  # 自動讀取環境變數 ANTHROPIC_API_KEY

    prompt = f"""你是「放鳥同盟App」的AI藉口大師。請根據以下條件生成一個放鳥藉口：
- 放鳥對象：{target}
- 天氣：{weather}
- 時間：{time_of_day}

要求：
1. 藉口必須超扯、荒謬、但又帶點哲理或莫名合理性，讓對方哭笑不得
2. 要結合天氣和時間製造「客觀因素不可抗力」的感覺
3. 語氣要帶點無辜、抱歉但又理所當然
4. 字數約 100~150 字
5. 直接輸出藉口內容，不要加任何標題或說明，用第一人稱

只輸出藉口本文，不要任何前言後語。"""

    message = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}],
    )
    return message.content[0].text


def generate_excuse_fallback(target: str, weather: str, time_of_day: str) -> str:
    """備用邏輯：從藉口庫隨機組合"""
    key = target if target in FALLBACK_EXCUSES else random.choice(list(FALLBACK_EXCUSES.keys()))
    base   = random.choice(FALLBACK_EXCUSES[key])
    w_text = WEATHER_EFFECTS.get(weather, "現在的天氣磁場怪怪的，不宜出門。")
    t_text = TIME_EFFECTS.get(time_of_day, "這個時間點真的不適合人類進行社交活動。")
    return f"{t_text}其實{base}{w_text}"


# ── 社交能量計算器 ─────────────────────────────────────────────────

def calculate_energy(target: str) -> int:
    lo, hi = ENERGY_RANGE.get(target, (60, 100))
    return random.randint(lo, hi)


# ── 互動式主程式 ───────────────────────────────────────────────────

def print_banner():
    print("=" * 50)
    print("        歡迎來到《放鳥同盟》FlakeOut App")
    print("      —— 大家做社交，我偏反社交 ——")
    print("=" * 50)
    if HAS_ANTHROPIC and os.environ.get("ANTHROPIC_API_KEY"):
        print("✅  AI 模式：已連線 Claude API")
    else:
        print("⚠️   備用模式：未偵測到 API Key，使用內建藉口庫")
        if not HAS_ANTHROPIC:
            print("    （安裝方式：pip install anthropic）")
    print()


def prompt_choice(question: str, options: list[str]) -> str:
    print(question)
    for i, opt in enumerate(options, 1):
        print(f"  {i}. {opt}")
    while True:
        raw = input("請輸入選項編號：").strip()
        if raw.isdigit() and 1 <= int(raw) <= len(options):
            return options[int(raw) - 1]
        print("  ❌ 請輸入有效的編號")


def main():
    print_banner()

    targets  = ["老闆", "朋友", "曖昧對象 / 另一半"]
    weathers = ["下大雨", "大太陽", "陰天"]
    times    = ["早上", "下午", "晚上"]

    target      = prompt_choice("1. 今天要放鳥誰？", targets)
    weather     = prompt_choice("\n2. 目前外面的天氣如何？", weathers)
    time_of_day = prompt_choice("\n3. 聚會的時間點？", times)

    print("\n正在啟動 AI 藉口生成引擎 ...")
    print("-" * 50)

    use_ai = HAS_ANTHROPIC and bool(os.environ.get("ANTHROPIC_API_KEY"))
    if use_ai:
        try:
            excuse = generate_excuse_ai(target, weather, time_of_day)
        except Exception as e:
            print(f"⚠️  API 呼叫失敗（{e}），改用備用模式")
            excuse = generate_excuse_fallback(target, weather, time_of_day)
    else:
        excuse = generate_excuse_fallback(target, weather, time_of_day)

    print(f"\n【完美藉口產生成功】\n")
    print(f"「{excuse}」")

    energy = calculate_energy(target)
    print("\n" + "-" * 50)
    print(f"🎉  放鳥成功！")
    print(f"🔋  今日省下的社交能量值：+{energy} 點！")
    print(f"💡  提示：把這些能量拿去追劇或躺平吧。")
    print("-" * 50)

    again = input("\n要再生成一個藉口嗎？(y/n): ").strip().lower()
    if again == "y":
        print()
        main()


if __name__ == "__main__":
    main()