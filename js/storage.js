// =====================================
// LuckyDraw2026 Storage
// 正式版 V1
// =====================================

const STORAGE_KEY = "LuckyDraw2026";

function initStorage(){

    if(localStorage.getItem(STORAGE_KEY)) return;

    const data = {

        unlockPassword:"0808",

        adminPassword:"20260808",

        totalDraw:0,

        prizes:[

            {
                id:1,
                level:"一獎",
                name:"密封杯",
                total:20,
                remain:20
            },

            {
                id:2,
                level:"二獎",
                name:"無酒精飲品",
                total:30,
                remain:30
            },

            {
                id:3,
                level:"三獎",
                name:"爸氣爆米花",
                total:30,
                remain:30
            },

            {
                id:4,
                level:"四獎",
                name:"爸氣節專屬徽章",
                total:100,
                remain:100
            }

        ],

        history:[]

    };

    saveData(data);

}

function getData(){

    return JSON.parse(

        localStorage.getItem(STORAGE_KEY)

    );

}

function saveData(data){

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(data)

    );

}

function resetData(){

    localStorage.removeItem(STORAGE_KEY);

    initStorage();

}

function drawPrize(){

    const data=getData();

    let pool=[];

    data.prizes.forEach((p,index)=>{

        for(let i=0;i<p.remain;i++){

            pool.push(index);

        }

    });

    if(pool.length===0){

        return null;

    }

    const pick=

        pool[Math.floor(Math.random()*pool.length)];

    data.prizes[pick].remain--;

    data.totalDraw++;

    const result={

        id:Date.now(),

        number:data.totalDraw,

        level:data.prizes[pick].level,

        prize:data.prizes[pick].name,

        time:new Date().toLocaleString()

    };

    data.history.push(result);

    saveData(data);

    return result;

}

initStorage();