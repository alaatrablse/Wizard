var nameu = getCookie("username");
if(nameu == ""){
  window.location.href="login.html";
}
var lab = document.getElementById("lab_welcome")
lab.textContent  = "welcome "+nameu ; 



function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}


function goto1(){
  if(localStorage.getItem("Addwizards") === null){
    window.location.href="AddWizaed.html";
  }
  else{
    let wizardsArrTxt = localStorage.getItem("Addwizards");
    
    let wizardsArr = JSON.parse(wizardsArrTxt);

    if(wizardsArr.hashnum != 0){
      localStorage.removeItem("Addwizards");
    }
    window.location.href="AddWizaed.html";
  }
    
}

function goto2(){
  window.location.href="ShowWizard.html";
}

function goto3(){
  window.location.href="AddWizaed.html";
}
function goto4(){
  window.location.href="Answer.html";
}


/////////////////////////exit///////////////////////////
function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}
function exit(){
    deleteAllCookies();
    window.location.href="home.html";
}

function gotowizard(){
  var hashnum = document.getElementById("your_hashnum").value;
  if(hashnum!="")
    window.location.href=`second.html?h=${hashnum}`;
  else{
    window.alert("Error!! Enter Hash number");
  }
}