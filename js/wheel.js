// =============================================
// LuckyDraw2026
// Professional Wheel Engine
// =============================================

const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");

const spinSound = new Audio("assets/sounds/spin.mp3");
const winSound = new Audio("assets/sounds/win.mp3");

spinSound.preload = "auto";
spinSound.load(); 
spinSound.loop = true;
spinSound.volume = 0.5;

winSound.preload = "auto";
winSound.load();
winSound.volume = 0.8;

const centerLogo = new Image();

centerLogo.onload = function () {
    drawScene();
};

centerLogo.src = "assets/logo.png";

canvas.width = 780;
canvas.height = 780;

const CENTER_X =390;
const CENTER_Y = 390;
const RADIUS = 320;

const SEGMENTS = [
    { level:"一獎", title:"密封杯", color:"#e53935" },

    { level:"四獎", title:"爸氣節專屬徽章", color:"#3949ab" },

    { level:"二獎", title:"無酒精飲品", color:"#FFA000" },

    { level:"四獎", title:"爸氣節專屬徽章", color:"#90caf9" },

    { level:"三獎", title:"爸氣爆米花", color:"#43a047" },

    { level:"四獎", title:"爸氣節專屬徽章", color:"#42a5f5" },

    { level:"二獎", title:"無酒精飲品", color:"#FFC107" },

    { level:"四獎", title:"爸氣節專屬徽章", color:"#5c6bc0" },

    { level:"三獎", title:"爸氣爆米花", color:"#4caf50" },

    { level:"四獎", title:"爸氣節專屬徽章", color:"#64b5f6" },

    { level:"三獎", title:"爸氣爆米花", color:"#66bb6a" },

    { level:"四獎", title:"爸氣節專屬徽章", color:"#1e88e5" }
];

const SEGMENT_ANGLE = 360 / SEGMENTS.length;

// ===============================
// 精準停靠設定
// ===============================

const SPIN_TURNS = 6;      // 至少先轉 6 圈 

let spinFrame = 0;
let spinFrames = 0;

let startRotation = 0;
let endRotation = 0;

let rotation = 0;

let spinning = false;

let currentPrize = null;
function drawScene(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.save();

    ctx.translate(CENTER_X,CENTER_Y);

    if(spinning){

    ctx.shadowBlur =
        12 + Math.sin(Date.now()/120)*8;

    ctx.shadowColor="#FFD700";


    }else{

    ctx.shadowBlur = 18;

    ctx.shadowColor = "rgba(0,0,0,.35)";

    }

    ctx.shadowOffsetY = 10; 

    ctx.rotate(rotation*Math.PI/180);

    drawSegments();

    drawCenter();

    ctx.restore();

    drawPointer();

    updateAnimation();

    requestAnimationFrame(drawScene);

}

function drawSegments(){

    for(let i=0;i<SEGMENTS.length;i++){

        const start=(i*SEGMENT_ANGLE-90)*Math.PI/180;
        const end=((i+1)*SEGMENT_ANGLE-90)*Math.PI/180;

        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.arc(0,0,RADIUS,start,end);
        ctx.closePath();

        ctx.fillStyle=SEGMENTS[i].color;
        ctx.fill();

        ctx.strokeStyle="#ffffff";
        ctx.lineWidth=3;
        ctx.stroke();

        drawLabel(i);
    }
 //========================
    // 金色外框（新增）
    //========================

    // 白色細框
    ctx.beginPath();
    ctx.arc(0,0,RADIUS-2,0,Math.PI*2);
    ctx.lineWidth=3;
    ctx.strokeStyle="#FFFFFF";
    ctx.stroke();

    // 金色外框
    ctx.beginPath();
    ctx.arc(0,0,RADIUS+2,0,Math.PI*2);
    ctx.lineWidth=5;
    ctx.strokeStyle="#FFD700";
    ctx.stroke();

}
function drawLabel(i){

  // 每格中心角度（以正上方為起點）
    const angle = (i * SEGMENT_ANGLE + SEGMENT_ANGLE / 2 - 90) * Math.PI / 180;

    // 文字中心位置（離圓心約 72% 半徑）
    const textRadius = RADIUS * 0.73;

    const x = Math.cos(angle) * textRadius;
    const y = Math.sin(angle) * textRadius;

    ctx.save();

    // 移到文字位置
    ctx.translate(x, y);

    // 讓文字跟著扇形方向
    ctx.rotate(angle + Math.PI / 2);

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(0,0,0,0.45)";

// 第一行
    ctx.font = "bold 24px Microsoft JhengHei";
    ctx.strokeText(SEGMENTS[i].level, 0, -14);
    ctx.fillText(SEGMENTS[i].level, 0, -14);

// 第二行
    ctx.font = "14px Microsoft JhengHei";
    ctx.strokeText(SEGMENTS[i].title, 0, 14);
    ctx.fillText(SEGMENTS[i].title, 0, 14);

    ctx.restore();

}

function drawCenter(){

    ctx.beginPath();

    ctx.arc(0,0,82,0,Math.PI*2);

    ctx.fillStyle="#ffffff";

    ctx.fill();

    ctx.lineWidth=8;

    ctx.strokeStyle="#FFD700";

    ctx.stroke();

    if(centerLogo.complete){

    ctx.drawImage(centerLogo,-55,-55,110,110);

    ctx.fillStyle="#fff";

    ctx.font="bold 18px Microsoft JhengHei";

    ctx.textAlign="center";

    //ctx.fillText("點我抽獎",0,55);

    }

}

// =====================================
// 計算停靠角度
// =====================================

function prepareSpin(prize){

    // 找出所有符合的格子
    const candidates = SEGMENTS
        .map((s,index)=>({...s,index}))
        .filter(s=>
            s.level === prize.level &&
            s.title === prize.prize
    );

    // 隨機選其中一格
    const target =
        candidates[Math.floor(Math.random()*candidates.length)];

    // 該格中心角度
    const targetAngle =
        target.index * SEGMENT_ANGLE + SEGMENT_ANGLE/2;

    startRotation = rotation;

    endRotation =
        rotation
        + SPIN_TURNS * 360
        + (360 - targetAngle);

    spinFrame = 0;
    spinFrames = 240;
}

function drawPointer(){

    ctx.save();

    ctx.translate(CENTER_X,78);

    ctx.beginPath();

    ctx.moveTo(0,0);

    ctx.lineTo(-25,-60);

    ctx.lineTo(25,-60);

    ctx.closePath();

    ctx.fillStyle="#ff0000";

    ctx.fill();

    ctx.beginPath();

    ctx.arc(0,-60,10,0,Math.PI*2);

    ctx.fillStyle="#FFD700";

    ctx.fill();

    ctx.lineWidth=3;

    ctx.strokeStyle="#FFFFFF";

    ctx.stroke();

    ctx.restore();

}
function updateAnimation(){


    if(!spinning) return;

    spinFrame++;

    // 動畫進度 0~1
    const t = Math.min(spinFrame / spinFrames, 1);

    // ===== EaseOutBack =====
    // 有一點回彈效果
    const c1 = 1.35;
    const c3 = c1 + 1;

    const ease =
        1 +
        c3 * Math.pow(t - 1, 3) +
        c1 * Math.pow(t - 1, 2);

    rotation =
        startRotation +
        (endRotation - startRotation) * ease;

    if(t >= 1){

        spinning = false;

        rotation = endRotation % 360;

        spinSound.pause();

        spinSound.currentTime = 0;

        localStorage.setItem(
    "drawResult",
    JSON.stringify(currentPrize)
);

    showResult();

    }

}
const startBtn = document.getElementById("start");

startBtn.addEventListener("click", function () {

    if (spinning) return;

    console.log("按鈕被按了");

    currentPrize = drawPrize();

    console.log(currentPrize);

    if (!currentPrize) {

        alert("所有獎品已抽完");

        return;

    }

    prepareSpin(currentPrize);

    spinSound.currentTime = 0;

    spinSound.play().catch(()=>{});

    spinning = true;

});

// ==========================
// 顯示中獎畫面
// ==========================

function showResult(){

    startBtn.disabled = true;

    const img={

        "密封杯":"assets/prizes/cup.png",

        "無酒精飲品":"assets/prizes/drink.png",

        "爸氣爆米花":"assets/prizes/popcorn.png",

        "爸氣節專屬徽章":"assets/prizes/badge.png"

    };

    document.getElementById("giftImage").src =
        img[currentPrize.prize];

    document.getElementById("level").innerHTML =
        currentPrize.level;

    document.getElementById("gift").innerHTML =
        currentPrize.prize;

    document.body.classList.add("result-open");
        // ⭐先讓畫面更新
    document.getElementById("resultCard").classList.add("show");

    // 100ms 後再播放音效
setTimeout(() => {
    winSound.currentTime = 0;
    winSound.play().catch(console.error);
}, 100);

}

document.getElementById("backBtn").onclick=function(){

startBtn.disabled = false;

    document.getElementById("resultCard")
        .classList.remove("show");

    document.body.classList.remove("result-open");

    sessionStorage.removeItem("LuckyDrawUnlock");

    location.href="index.html";

};