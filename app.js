const btnStart = document.getElementById("start");
const btnEnd = document.getElementById("end");
const elLatency = document.getElementById("latency");
const elTurns = document.getElementById("turns");
const csatBox = document.querySelector(".csat");

let turns = 0;
let tStart = null;

// TODO: اگر D-ID به توکن نیاز داشت، از پروکسی امن بگیر:
async function getSignedToken() {
    // return fetch('https://your-proxy.example.com/sign').then(r => r.json());
    return null; // برای حالت بدون کلید
}

async function initAvatar() {
    // اگر نیاز به init خاصی برای ویجت هست، اینجا صدا بزن.
    // مثلا mount کردن SDK یا تنظیمات iframe.
}

function onUserUtterance() {
    // کاربر حرف زد/پیام داد → شروع اندازه‌گیری
    tStart = performance.now();
}

function onAvatarResponseStart() {
    // اولین بایت/فریم پاسخ رسید
    if (tStart != null) {
        const latency = Math.round(performance.now() - tStart);
        elLatency.textContent = latency;
        tStart = null;
    }
    turns += 1;
    elTurns.textContent = String(turns);
}

btnStart.addEventListener("click", async() => {
    btnStart.disabled = true;
    btnEnd.disabled = false;
    await initAvatar();

    // مثال: شروع گفتگو با یک greeting از سمت آواتار
    // در SDK واقعی اینجا eventها رو سابسکرایب کن:
    // avatar.on('user_input', onUserUtterance);
    // avatar.on('response_start', onAvatarResponseStart);

    // برای MVP: شبیه‌سازی تست دستی
    onUserUtterance();
    setTimeout(onAvatarResponseStart, 900); // شبیه‌سازی latency 900ms

    // بعد از چند ترنز نمایشی، بخش CSAT رو نمایش بده
    setTimeout(() => (csatBox.hidden = false), 6000);
});

btnEnd.addEventListener("click", () => {
    btnEnd.disabled = true;
    csatBox.hidden = false;
});

// CSAT
csatBox.addEventListener("click", (e) => {
    if (!e.target.dataset.csat) return;
    const val = e.target.dataset.csat; // 'up' | 'down'
    // TODO: بفرست سر لاگ/پروکسی → { csat: val, turns, latency: latest }
    alert(`ثبت شد: ${val === "up" ? "👍" : "👎"}`);
});