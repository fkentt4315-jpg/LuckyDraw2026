// ======================================
// LuckyDraw2026
// Login Controller
// ======================================

initStorage();

const loginBtn=document.getElementById("loginBtn");
const password=document.getElementById("password");
const message=document.getElementById("message");

loginBtn.addEventListener("click",login);

password.addEventListener("keydown",function(e){

    if(e.key==="Enter"){

        login();

    }

});

function login(){

    const data=getData();

    if(password.value.trim()==""){

        message.innerHTML="請輸入密碼";

        return;

    }

    if(password.value!=data.unlockPassword){

        message.innerHTML="密碼錯誤";

        password.value="";

        password.focus();

        return;

    }

    sessionStorage.setItem(

        "LuckyDrawUnlock",

        "YES"

    );

    window.location.href="draw.html";

}