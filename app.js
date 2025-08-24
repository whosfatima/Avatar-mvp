// ===== عناصر UI
const btnStart = document.getElementById("start");
const btnEnd = document.getElementById("end");
const btnCTA = document.getElementById("cta");
const elLatency = document.getElementById("latency");
const elTurns = document.getElementById("turns");
const elDur = document.getElementById("duration");
const elCSAT = document.getElementById("csat");
const csatBox = document.querySelector(".csat");

// ===== وضعیت KPI
let turns = 0;
let tStart = null;
let latestLatency = null;
const sessionStart = Date.now();
let sessionTimerId = null;

// (اختیاری) گرفتن توکن از پروکسی امن، اگر سرویس نیاز داشت
async function getSignedToken() {
    return null; // برای حالت بدون کلید
}

async function initAvatar() {
    // اگر نیاز به init خاصی برای ویجت هست، اینجا صدا بزن.
    // مثلاً: mount کردن SDK، یا subscribe کردن به eventها.
    // مثال ایونت‌های واقعی (وقتی SDK داشته باشی):
    // avatar.on('user_input', kpi_userUtteranceStart)
    // avatar.on('response_start', kpi_avatarResponseStart)
}

// ===== KPI: Latency / Turns
function kpi_userUtteranceStart() {
    tStart = performance.now();
}

function kpi_avatarResponseStart() {
    if (tStart != null) {
        latestLatency = Math.round(performance.now() - tStart);
        elLatency.textContent = latestLatency;
        console.log("[KPI] latency_ms:", latestLatency);
        tStart = null;
    }
    turns += 1;
    elTurns.textContent = String(turns);
    console.log("[KPI] turns:", turns);
}

// ===== KPI: Session Duration
function startSessionTimer() {
    if (sessionTimerId) return;
    sessionTimerId = setInterval(() => {
        const sec = Math.round((Date.now() - sessionStart) / 1000);
        elDur.textContent = sec;
    }, 1000);
}

function endSession() {
    clearInterval(sessionTimerId);
    const duration_s = Math.round((Date.now() - sessionStart) / 1000);
    console.log("[KPI] session_end", {
        turns,
        latestLatency,
        duration_s,
    });
}

// ===== KPI: CTA Click
function kpi_ctaClick(label = "learn_more") {
    console.log("[KPI] cta_click:", label, Date.now());
    // TODO: بعداً می‌تونی اینو به یک endpoint سبک بفرستی
}

// ===== KPI: CSAT
function kpi_csat(value) {
    // 'up' | 'down'
    elCSAT.textContent = value === "up" ? "👍" : "👎";
    console.log("[KPI] csat:", value, {
        turns,
        latestLatency,
    });
    // TODO: بعداً ارسال به endpoint
}

// ===== رویدادها
btnStart.addEventListener("click", async() => {
    btnStart.disabled = true;
    btnEnd.disabled = false;
    startSessionTimer();
    await initAvatar();

    // --- شبیه‌سازی MVP تا وقتی ایونت واقعی وصل کنیم ---
    kpi_userUtteranceStart();
    setTimeout(kpi_avatarResponseStart, 900); // simulate 900ms latency
    setTimeout(() => (csatBox.hidden = false), 6000);
});

btnEnd.addEventListener("click", () => {
    btnEnd.disabled = true;
    csatBox.hidden = false;
    endSession();
});

btnCTA.addEventListener("click", () => kpi_ctaClick("learn_more"));

// CSAT
csatBox.addEventListener("click", (e) => {
    if (!e.target.dataset.csat) return;
    kpi_csat(e.target.dataset.csat); // 'up' | 'down'
    alert(`ثبت شد: ${e.target.dataset.csat === "up" ? "👍" : "👎"}`);
});

// پایان جلسه وقتی کاربر صفحه رو می‌بنده/رفرش می‌کند
window.addEventListener("beforeunload", endSession);