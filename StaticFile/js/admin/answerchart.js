$(document).ready(function(){
	$('.dropdown-toggle').dropdown();
});

if(getCookies("usertype") !=="ADMIN"){
    deleteAllCookies()
    localStorage.clear();
    window.location.href = "home.html"
}

function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

function getCookies(cname) {
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

window.addEventListener('DOMContentLoaded', (event) => {
    var urlParams = query_string();
    document.getElementById("usernum").innerText = getCookies("username");
    document.getElementById("usernum2").innerText = getCookies("username");
    document.getElementById("useremail").innerText = getCookies("usersemail");
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/wizards/' + urlParams.h, true);
    xhr.onload = function () {
        if (this.status == 200) {
            var wizard = JSON.parse(this.responseText);
            localStorage.setItem('temp2', JSON.stringify(wizard))

            document.getElementById("nameWizard").innerText=wizard.titel;
            var data = JSON.parse(localStorage.getItem('temp'));
            var user = null;
            var index ;
            for(var i=0;i<data.length;i++){
                if(data[i].id === wizard.userId){
                    user = data[i]
                    index = i
                }
            }
            document.getElementById("nameUser").innerText=user.name;
            document.getElementById("hashnum").innerText=urlParams.h;

            let size = 0; 
            const element = document.getElementById("listdrop");
            for(let i=0; i < wizard.pages.length; i++){
                if(wizard.pages[i].wizardType === "LABEL"){
                    size +=1;
                    if( i+1< wizard.pages.length){
                        element.innerHTML+=`<a class="dropdown-item" href="#" onclick="selectCollection('${wizard.pages[i].id}')">collection ${size}</a> `
                    }
                }
            }
        }
        else {

        }
    }
    xhr.send();
    
    
});




function selectCollection(id){
    document.querySelector('.dropdown-toggle').click();
    document.querySelector("#users-list").innerHTML = "";
    const v = JSON.parse(localStorage.getItem('temp2'))
    var page = null;
    var nextpage = null;
    var index ;
    for(var i=0;i<v.pages.length;i++){
        if(v.pages[i].id === id){
            page = v.pages[i]
            nextpage = v.pages[i+1]
            index = i
        }
    }
    const element = page;
    document.getElementById("label").innerHTML = `<br><br><h4 class="card-title card-title-dash">${page.wizardData[0].wizardIndex}</h4><br>`
    if(nextpage.wizardData.length === 1){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/answer/' + nextpage.wizardData[0].id, true);
        xhr.onload = function () {
            if (this.status == 200) {
                var data = JSON.parse(this.responseText);
                let listTableBody = document.querySelector("#users-list");
               
                for(e of data){ 
                    let row = document.createElement("tr");
                    var ss = `
                    <tr name="asdg" >
                        <td class="col-3"> <h6> ${e.Answer1}</h6></td>
                        <td class="col-4"><h6>${e.UserEmail} </h6></td>
                    </tr>`;
                    row.innerHTML = ss;
                    listTableBody.appendChild(row);
                }

            }
        }
        xhr.send();
    }
    else{
        const answers = [];
        const promises = nextpage.wizardData.map((dataw) => {
            return new Promise((resolve, reject) => {
              const xhr = new XMLHttpRequest();
              xhr.open('GET', '/answer/' + dataw.id, true);
              xhr.onload = function () {
                if (this.status == 200) {
                  const data = JSON.parse(this.responseText);
                  for (d of data) {
                    if (d.Answer1 == "true") {
                      answers.push({ answer: dataw.wizardIndex, user: d.UserEmail });
                    }
                  }
                  resolve();
                } else {
                  reject(this.statusText);
                }
              };
              xhr.send();
            });
          });
        let listTableBody = document.querySelector("#users-list");
        

        
        Promise.all(promises).then(() => {
            
            const classifiedData = {};
            answers.forEach((item) => {
                const { answer, user } = item;
                
                if (classifiedData.hasOwnProperty(user)) {
                    classifiedData[user].push(answer);
                } else {
                    classifiedData[user] = [answer];
                }
            });
            Object.keys(classifiedData).forEach((s) => {
                let row = document.createElement("tr");
                var ss = `
                <tr name="asdg" >
                    <td class="col-3"> <h6> ${classifiedData[s].join(', ')}</h6></td>
                    <td class="col-4"><h6>${s} </h6></td>
                </tr>`;

                row.innerHTML = ss;
        
                listTableBody.appendChild(row);
            });



          }).catch((err) => {
            console.error(err);
          });
        
       
    }
   

}





function query_string() {
    var urlParams;
    (window.onpopstate = function () {
        var match,
            pl = /\+/g,  // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
            query = window.location.search.substring(1);

        urlParams = {};
        while (match = search.exec(query))
            urlParams[decode(match[1])] = decode(match[2]);
    })();
    return urlParams;
}

function exit(){
    deleteAllCookies();
    localStorage.clear();
    window.location.href="home.html";
}