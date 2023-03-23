
function query_string(){
    var urlParams;
    (window.onpopstate = function () {
        var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);
  
        urlParams = {};
        while (match = search.exec(query))
        urlParams[decode(match[1])] = decode(match[2]);
    })();
    return urlParams;
}


function ShowWizard(){
    var urlParams = query_string();

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/wizards/'+urlParams.h, true);
    xhr.onload = function(){
        if(this.status == 200){
            var wizard = JSON.parse(this.responseText);
            
            var data = wizard.pages;
            var lst = []
            for(var i=0; i<wizard.pages.length; i++){
                var num = wizard.pages[i].numPages
                if (lst.includes(num) == false){
                    lst.push(num)
                } 
            }
            var maxPageID=Math.max(...lst);

            for(var i=0 ; i< data.length ;i++){
                if(data[i].wizardType!="LABLE"){

                }
            }
        }
        else{
            window.location.href="404error.html";
        }
    }
    xhr.send();
}