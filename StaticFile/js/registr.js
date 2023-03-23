

function ss(){
    var url = "/users";
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    var name = document.getElementById("your_name").value;
    var email = document.getElementById("email").value;
    var pass = document.getElementById("pass").value;
    var re_pass = document.getElementById("re_pass").value;
    if(pass != re_pass){
        document.getElementById("theDiv").innerHTML=`<h3 style="color:red" >Username/Password Invalid !!</h3`
        return false;
    }
    else{
         var temp = JSON.stringify({ "name": `${name}`,
        "email": `${email}`,
        "password": `${pass}`,
        "type": "USER"})
        xhr.send(temp);
        xhr.onreadystatechange = function () {
            if(xhr.readyState === XMLHttpRequest.DONE) {
                var status = xhr.status;
                if (status === 0 || (status >= 200 && status < 400)) {
                    // The request has been completed successfully
                    window.location.href="login.html";
                } else {
                    // Oh no! There has been an error with the request!
                    document.getElementById("theDiv").innerHTML=`<h3 style="color:red" >Username/Password Invalid !!</h3`
                    return false;
                }
            }
        };
    }

    return false;
}