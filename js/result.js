const winSound = new Audio("assets/sounds/win.mp3");

winSound.volume = 0.8;

const result = JSON.parse(
    localStorage.getItem("drawResult")
);

const img = {

    "密封杯":
        "assets/prizes/cup.png",

    "無酒精飲品":
        "assets/prizes/drink.png",

    "爸氣爆米花":
        "assets/prizes/popcorn.png",

    "爸氣節專屬徽章":
        "assets/prizes/badge.png"

};

giftImage.src = img[result.prize];

// 延遲一點播放中獎音
setTimeout(()=>{

    winSound.currentTime = 0;

    winSound.play().catch(()=>{});

},500);

level.innerHTML = result.level;

gift.innerHTML = result.prize;

// 回首頁按鈕
document.getElementById("backBtn").onclick = function () {

    sessionStorage.removeItem("LuckyDrawUnlock");

    location.href = "index.html";

};

// 震動
if (navigator.vibrate) {

    navigator.vibrate([200,100,200]);

}