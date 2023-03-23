function getCookies(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
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

function getWizards() {

    if (getCookies("usercookis") == "") {
        window.location.href = "home.html";
    }
    var theUrl = "users/" + getCookies("usercookis");
    var xhr = new XMLHttpRequest();
    xhr.open('GET', theUrl, true);
    xhr.onload = function () {
        if (this.status == 200) {
            var data = JSON.parse(this.responseText);
            var ss;
            let listTableBody = document.querySelector("#wizards");
            listTableBody.innerHTML = "";
            let row = document.createElement("tr");
            var i = 1;
            for (var e in data) {
                ss = `<tr class="row100 body">
                <td class="cell100 column1">${i}</td>`
                if (data[e][1] === "")
                    ss += `<td class="cell100 column2">no title</td>`
                else
                    ss += `<td class="cell100 column2">${data[e][1]}</td>`
                ss += `<td class="cell100 column3">${data[e][0]}</td>
                <td class="cell100 column4"><a onclick="edit(${data[e][0]})" href="#"> <img src="images/edit.png"></a></td>
                <td class="cell100 column5"><a onclick="deleteRwo(${data[e][0]})" href="#"> <img src="images/bin.png"></a></td>
                <td class="cell100 column6"><a onclick="copylink(${data[e][0]})" href="#"> <img src="images/link.png"></a></td>
                </tr>`
                i++;
                row.innerHTML = ss;
                listTableBody.appendChild(row);
                row = document.createElement("tr");
            }
        }
        else {
            window.alert("email or password not corect")

        }
    }
    xhr.send();
}




function getWizardsofAdmin() {

    if (getCookies("usercookis") == "") {
        window.location.href = "home.html";
    }
    var theUrl = "/wizards";
    var xhr = new XMLHttpRequest();
    xhr.open('GET', theUrl, true);
    xhr.onload = function () {
        if (this.status == 200) {
            var data = JSON.parse(this.responseText);
            var ss;
            let listTableBody = document.querySelector("#wizards");
            listTableBody.innerHTML = "";
            let row = document.createElement("tr");
            var i = 1;
            for (var e in data) {
                ss = `<tr class="row100 body">
                <td class="cell100 column1">${i}</td>`;
                if (data[e] === "")
                    ss += `<td class="cell100 column2">no title</td>`;
                else
                    ss += `<td class="cell100 column2">${data[e].titel}</td>`;
                ss += `<td class="cell100 column3">${data[e].hashnum}</td>
                <td class="cell100 column4"><a onclick="results(${data[e].hashnum})" href="#"> <img src="images/edit.png"></a></td>
                <td class="cell100 column5"><a onclick="deleteRwo(${data[e].hashnum})" href="#"> <img src="images/bin.png"></a></td>
                <td class="cell100 column6"><a onclick="copylink(${data[e].hashnum})" href="#"> <img src="images/link.png"></a></td>
                </tr>`;
                i++;
                row.innerHTML = ss;
                listTableBody.appendChild(row);
                row = document.createElement("tr");
            }
        }
        else {
            window.alert("email or password not corect");
        }
    }
    xhr.send();
}



if (getCookies("usertype") == "ADMIN")
    getWizardsofAdmin();
else {
    getWizards();
}


///////////* Copy the text inside the text field *//////////		

function copylink(hash) {
    chickcookies()
    var ctx = window.location.origin;
    navigator.clipboard.writeText(ctx + "/second.html?h=" + hash);
}


function fun1(hashnum) {
    document.getElementById("edit").innerHTML = "results";
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/wizards/' + hashnum, true);
    xhr.onload = function () {
        if (this.status == 200) {
            var wizard = JSON.parse(this.responseText);
            var id = wizard.userId;

            url = "/wizards/" + hashnum + "/" + id;
            let xhr1 = new XMLHttpRequest();
            xhr1.open("DELETE", url, true);
            xhr1.onload = function () {
                var users = JSON.parse(xhr1.responseText);
                if (xhr1.readyState == 4 && xhr1.status == "200") {
                    let listTableBody = document.querySelector("#wizards");
                    listTableBody.innerHTML = "";

                } else {
                    console.error(users);
                }
            }
            xhr1.send();

        }
    }
    xhr.send();
}

function fun2(hashnum) {

    url = "/wizards/" + hashnum + "/" + getCookies("usercookis");
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", url, true);
    xhr.onload = function () {
        var users = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            let listTableBody = document.querySelector("#wizards");
            listTableBody.innerHTML = "";
            getWizards();
        } else {
            console.error(users);
        }
    }
    xhr.send();
}

function deleteRwo(hashnum) {
    chickcookies()
    var url = "";
    if (getCookies("usertype") == "ADMIN") {
        fun1(hashnum);
    }
    else {
        fun2(hashnum);
    }
    getWizards();
}


function results(hashnum) {
    chickcookies();

}

function edit(hashnum) {
    chickcookies();

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/wizards/' + hashnum, true);
    xhr.onload = function () {
        if (this.status == 200) {
            var wizard = JSON.parse(this.responseText);
            

            console.log(wizard);
            wizard.userId = wizard.userId.toString();
            var wizardtjsonTxt = JSON.stringify(wizard);
            
            localStorage.setItem("Addwizards", wizardtjsonTxt);
            //localStorage.setItem("Addwizardss", wizardtjsonTxt);
            window.location.href = "AddWizaed.html";

        }
        else {
            window.location.href = "404error.html";
        }
    }
    xhr.send();

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
function exit() {
    chickcookies()
    deleteAllCookies();
    window.location.href = "home.html";
    titel();
}


function chickcookies() {
    if (getCookies("usercookis") == "")
        window.location.href = "home.html";
}