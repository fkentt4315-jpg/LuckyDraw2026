initStorage();

const data=getData();

login.onclick=function(){

if(adminPwd.value!=data.adminPassword){

loginError.innerHTML="密碼錯誤";

return;

}

panel.style.display="block";

login.style.display="none";

adminPwd.style.display="none";

loginError.style.display="none";

loadStats();
function loadStats(){

    const d=getData();

    let html="";

    html+=`
    <div class="statCard">
        <div class="statTitle">🎯 總抽獎</div>
        <div class="statNumber">${d.totalDraw}</div>
    </div>
    `;

    d.prizes.forEach(p=>{

        const used=p.total-p.remain;

        html+=`
        <div class="statCard">

            <div class="statTitle">
                ${p.level}
            </div>

            <div class="statNumber">
                已抽 ${used}
            </div>

            <div class="statRemain">
                剩餘 ${p.remain}/${p.total}
            </div>

        </div>
        `;

    });

    stats.innerHTML=html;

}

loadPrize();

}

function loadPrize(){

table.innerHTML="";

const d=getData();

d.prizes.forEach((p,index)=>{

table.innerHTML+=`

<tr>

<td>

${p.level}<br>${p.name}

</td>

<td>

${p.remain}

</td>

<td>

<input

id="r${index}"

type="number"

value="${p.remain}">

</td>

</tr>

`;

});

}

save.onclick=function(){

const d=getData();

d.prizes.forEach((p,index)=>{

p.remain=

parseInt(

document.getElementById(

"r"+index

).value

);

});

saveData(d);

loadStats();

loadPrize();

alert("儲存完成");

}

excel.onclick=function(){

    const d=getData();

    let csv="序號,時間,獎項,獎品\n";

    d.history.forEach((h,i)=>{

        const p = d.prizes.find(x=>x.name===h.prize);

        const remain = p ? p.remain : "";

        csv +=
            (i+1)+","+
            h.time+","+
            h.level+","+
            h.prize+","+
            remain+"\n";

    });

    const blob=new Blob(

        ["\uFEFF"+csv],

        {

            type:"text/csv;charset=utf-8;"

        }

    );

    const a=document.createElement("a");

    a.href=URL.createObjectURL(blob);

    a.download="LuckyDrawHistory.csv";

    a.click();

}