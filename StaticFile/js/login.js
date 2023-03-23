
if(getCookie("usertype") == "USER")
    window.location.href = "pageuser.html";
else if(getCookie("usertype") == "WIZARD CREATOR")
    window.location.href = "pageusercreator.html";


function login(){
    var email = document.getElementById("your_email").value;
    var pass = document.getElementById("your_pass").value;
    var theUrl="users/"+email+"/"+pass;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', theUrl, true);
    xhr.onload = function(){
        if(this.status == 200){
            var data = JSON.parse(this.responseText);
            console.log(data);
            createCookie(`usersemail`,`${data.email}`,15);
            createCookie(`usercookis`, `${data.id}`,15);
            createCookie(`username`, `${data.name}`,15);
            createCookie(`usertype`, `${data.type}`,15);
            if(data.type == "WIZARD CREATOR")
                window.location.href = "pageusercreator.html";
            else if(data.type == "USER"){
                console.log(getCookie('h'));
                if(getCookie('h') !== ""){
                    console.log("second.html?h="+getCookie('h'));
                    window.location.href = "second.html?h="+getCookie('h');
                }
                window.location.href = "pageuser.html";
            }
            else if(data.type == "ADMIN")
                window.location.href = "pageadmin.html";
        }
        else{
            // window.alert("email or password not corect")
            var mis_error = document.getElementById("theDiv")
            mis_error.innerHTML='<h3 style="color:red" >Username/Password Invalid !!</h3>';
        }
    }
    xhr.send();
}

function createCookie(name,value,minutes) {
    if (minutes) {
        var date = new Date();
        date.setTime(date.getTime()+(minutes*60*1000));
        var expires = "; expires="+date.toGMTString();
    } else {
        var expires = "";
    }
    document.cookie = name+"="+value+expires+"; path=/";
}


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