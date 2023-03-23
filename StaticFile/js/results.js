

function getall() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/wizards/' + urlParams.h, true);
    xhr.onload = function () {
        if (this.status == 200) {
            var wizard = JSON.parse(this.responseText);

           
        }
        else {
            window.location.href = "404error.html";
        }
    }
    xhr.send();
}

getall();