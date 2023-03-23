function getall(){
    var theUrl="/api/wizards";
    var xhr = new XMLHttpRequest();
    xhr.open('GET', theUrl, true);
    xhr.onload = function(){
        if(this.status == 200){
            var data = JSON.parse(this.responseText);
            var ss;
            let listTableBody = document.querySelector("#wizards");
            listTableBody.innerHTML="";
            let row = document.createElement("tr");
            var i = 1;
            for(var e in data){
                ss=`<tr class="row100 body">
                <td class="cell100 column1">${i}</td>`
                if(data[e]==="")
                    ss+=`<td class="cell100 column2">no title</td>`
                else
                    ss+=`<td class="cell100 column2">${data[e].titel}</td>`
                ss+=`<td class="cell100 column3">${data[e].hashnum}</td>
                <td class="cell100 column4"><a onclick="copylink(${data[e].hashnum})" href="#"> <img src="images/link.png"></a></td>
                </tr>`
                i++;
                row.innerHTML = ss;
                listTableBody.appendChild(row);
                row = document.createElement("tr");
            }
        }
        else{
            window.alert("email or password not corect")
           
        }
    }
    xhr.send();
}

getall();


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
function exit() {
    deleteAllCookies();
    window.location.href = "home.html";
}

function copylink(hash) {
    var ctx = window.location.origin;
    navigator.clipboard.writeText(ctx + "/second.html?h=" + hash);
}