class Wizard {
    constructor(type, index, numPage, idWizard) {
        this.type = type;
        this.index = index;
        this.numPage = numPage;
        this.idWizard = idWizard;
    }
}

class AnswerofWizard {
    constructor(Answer1, UserName, UserEmail, WizardDatumId) {
        this.Answer1 = Answer1;
        this.UserName = UserName;
        this.UserEmail = UserEmail;
        this.WizardDatumId = WizardDatumId;
    }
}

class WizardsStorage2 {

    static wizardSKEY = "wizards";

    static getwizards() {
        let wizards;
        //KEY NOT EXSIST
        if (localStorage.getItem(WizardsStorage2.wizardSKEY) === null) {
            wizards = [];
        }
        //Key Exsist - Need to Get Value
        else {
            //01 Get Storage value as JSON STRING
            let wizardsArrTxt = localStorage.getItem(WizardsStorage2.wizardSKEY);
            //02 Convert the string to real JSON OBJECT
            let wizardsArr = JSON.parse(wizardsArrTxt);
            wizards = wizardsArr;
        }

        return wizards;
    }


    static Addwizard(wizard) {
        let wizards = WizardsStorage2.getwizards();
        wizards.push(wizard);
        var wizardtjsonTxt = JSON.stringify(wizards);
        localStorage.setItem(WizardsStorage2.wizardSKEY, wizardtjsonTxt);
    }

    static removeAll() {

        localStorage.removeItem(WizardsStorage2.wizardSKEY);
    }
}

class AnswersStorage {

    static answerSKEY = "answer";
    static getanswers() {
        let answers;

        if (localStorage.getItem(AnswersStorage.answerSKEY) === null) {
            answers = [];
        }
        else {
            let answersArrTxt = localStorage.getItem(AnswersStorage.answerSKEY);
            let answersArr = JSON.parse(answersArrTxt);
            answers = answersArr;
        }

        return answers;
    }

    static getanswersById( id) {
        let answers = AnswersStorage.getanswers();
        if (answers.length == 0)
            return "";
        for (var i = 0; i < answers.length; i++) {
            if (answers[i].WizardDatumId == id) {
                return answers[i].Answer1;
            }
        }
        return "";
    }

    static Addanswer(answer) {

        let answers = AnswersStorage.getanswers();

        for (var i = 0; i < answers.length; i++) {
            if (answers[i].WizardDatumId == answer.WizardDatumId) {
                answers[i].Answer1 = answer.Answer1;
                var answerjsonTxt = JSON.stringify(answers);
                localStorage.setItem(AnswersStorage.answerSKEY, answerjsonTxt);
                return
            }
        }
        answers.push(answer);
        var answerjsonTxt = JSON.stringify(answers);
        localStorage.setItem(AnswersStorage.answerSKEY, answerjsonTxt);
    }

    static UpdateAnswer(id, numpage, wizard) {

    }

    static removeAll() {

        localStorage.removeItem(WizardsStorage2.wizardSKEY);
    }

}



let id = 1;
let maxPageID = 0;
class UI {

    static addWizardToList(wizard) {

    }

    static displayWizardsByStorageByPage(numpage) {
        let WizardsArr = WizardsStorage2.getwizards();
        var id = 0;

        const quiz_box = document.querySelector(".quiz_box");
        let que_tag = '<section>';
        var numtemp;
        for (var x = 0; x < WizardsArr.length; x++){
            var itemWizard = WizardsArr[x];
            if (itemWizard.numPage == numpage) {
                numtemp = itemWizard.numPage;
                switch (itemWizard.type) {
                    case "LABEL":
                        que_tag += '<div class="que_text" id="' + itemWizard.idWizard + '"><span>' + itemWizard.index + '</span></div>'
                        break;
                    case "TextBox":
                        que_tag += '<div class="que_text"><input id="' + itemWizard.idWizard + '" placeholder="' + itemWizard.index + '" value="' + AnswersStorage.getanswersById(itemWizard.idWizard) + '"></div>';
                        break;

                    case "CheckBox":
                        que_tag += '<label class="container">' + itemWizard.index;
                        if (AnswersStorage.getanswersById(itemWizard.idWizard) == "true")
                            que_tag += '<input type="checkbox" checked id="' + itemWizard.idWizard + '">';
                        else
                            que_tag += '<input type="checkbox" id="' + itemWizard.idWizard + '">';
                        que_tag += '<span class="checkmark"></span></label>';
                        break;

                    case "IMAGE":
                        que_tag += '<div class="que_text"><img src="' + itemWizard.index + '" alt=""></div>'
                        break;
                    case "MultiLine Free Text":
                        que_tag += '<div style="padding-top: 20px;"><textarea id="' + itemWizard.idWizard + '" rows="5" cols="50" id="multiLineInput">' + AnswersStorage.getanswersById(itemWizard.idWizard)+'</textarea></div>'
                        break;
                    case "RadioButtons List":
                        que_tag += '<div style="margin-top:25px">'
                        if (x + 1 < WizardsArr.length) {
                            while (WizardsArr[x + 1].type == "RadioButtons List") {
                                que_tag += ' <label class="container" id="container' + id + '">' + itemWizard.index;
                                if (AnswersStorage.getanswersById(itemWizard.idWizard) == "true")
                                    que_tag += '<input id="' + itemWizard.idWizard + '" type="radio" name="radio' + id +'" checked>';
                                else
                                    que_tag += '<input id="' + itemWizard.idWizard + '" type="radio" name="radio' + id +'">';
                                que_tag += '<span class="checkmark"></span></label>';
                                x++;
                                itemWizard = WizardsArr[x];
                                que_tag += '</div>';
                            }
                        }
                        id++;
                        
                        break;

                    case "CheckBox List":
                        que_tag += '<div class="que_text" style="margin-top:25px">'
                        que_tag += '<label class="container" id="' + itemWizard.idWizard + '">' + itemWizard.index;
                        if (AnswersStorage.getanswersById(itemWizard.idWizard) == "true")
                            que_tag += '<input id="' + itemWizard.idWizard + '" type="checkbox" checked>';
                        else
                            que_tag += '<input id="' + itemWizard.idWizard + '" type="checkbox">';
                        que_tag += '<span class="checkmark"></span></label>';
                        que_tag += '</div>';
                        break;
                    case "ListBox List":

                        que_tag += '<select id="multiselect'+ id+'" style="margin-top:20px">'
                        var i = 0;
                        if (x + 1 < WizardsArr.length) {
                            while (WizardsArr[x + 1].type == "ListBox List") {
                                if (AnswersStorage.getanswersById(itemWizard.idWizard) == "true")
                                    que_tag += '<option id="' + itemWizard.idWizard + '" value="' + itemWizard.index + '" selected=true>' + itemWizard.index + '</div>';
                                else
                                    que_tag += '<option id="' + itemWizard.idWizard + '" value="' + itemWizard.index + '">' + itemWizard.index + '</div>';
                                x++;
                                itemWizard = WizardsArr[x];
                            }
                        }
                        que_tag += '</select>';
                        id++;
                        break;
                    //////v
                    case "Images Selection List": 
                        
                        break;
                    ///////^
                    case "SecuredInput":
                        que_tag += '<div class="que_text"><input id="' + itemWizard.idWizard + '" type="password"  placeholder="' + itemWizard.index + '" value="' + AnswersStorage.getanswersById(itemWizard.idWizard) + '"></div>';
                        break;
                }
            }
        }

        que_tag += '<section><div>';
        if (numtemp != 1)
            que_tag += '<button class="btn" style="background: White; border: none !important;" onclick="leftFunc()"><img src="images/left.png" alt="next button"></button>';
        if (numtemp == maxPageID)
            que_tag += '<button class="btn" style="background: White;float: right; border: none !important;" onclick="finsh()"><img src="images/check-mark.png" alt="next></button">';
        else
            que_tag += '<button class="btn" style="background: White;float: right; border: none !important;" onclick="rightFunc()"><img src="images/right.png" alt="next></button">';
        que_tag += '</div></section>';

        quiz_box.innerHTML = que_tag
    }

    static ClearList() {
        let wizard = document.querySelector(".quiz_box");
        wizard.innerHTML = "";
    }

}

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


const start_btn = document.querySelector(".start_btn button");
const info_box = document.querySelector(".info_box");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const result_box = document.querySelector(".result_box");

// if startQuiz button clicked
start_btn.onclick = () => {
    info_box.classList.add("activeInfo");
    //show info box
}
loadUsers();
// if exitQuiz button clicked
exit_btn.onclick = () => {
    info_box.classList.remove("activeInfo"); //hide info box
}
continue_btn.onclick = () => {

    info_box.classList.remove("activeInfo"); //hide info box
    quiz_box.classList.add("activeQuiz"); //show quiz box
    UI.displayWizardsByStorageByPage("1");
}

function loadUsers() {
    WizardsStorage2.removeAll();
    var urlParams = query_string();

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/wizards/' + urlParams.h, true);
    xhr.onload = function () {
        if (this.status == 200) {
            var wizard = JSON.parse(this.responseText);
            
            document.getElementById("tetel_wizard").innerHTML = `<span>${wizard.titel}</span>`;
            document.getElementById("description").innerHTML = `<div class='info'>${wizard.description}</div>`;
            var data = wizard.pages;
            var lst = []
            for (var i = 0; i < wizard.pages.length; i++) {
                var num = wizard.pages[i].numPages
                if (lst.includes(num) == false) {
                    lst.push(num)
                }
            }
            maxPageID = Math.max(...lst);

            WizardsStorage2.removeAll();
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i]["wizardData"].length; j++) {
                    let wizard = new Wizard(data[i].wizardType, data[i]["wizardData"][j].wizardIndex, data[i].numPages, data[i]["wizardData"][j].id)
                    WizardsStorage2.Addwizard(wizard);
                }
            }
        }
        else {
            window.location.href = "404error.html";
        }
    }
    xhr.send();
}

function saveData() {
    var inputs = document.getElementById('quiz_box').getElementsByTagName("section")[0].getElementsByTagName("*");
    var name = getCookies("username");
    var email = getCookies("usersemail")

    for (var i = 0; i < inputs.length; i++) {
        let answer;
        if (inputs[i].tagName == 'INPUT') {
            switch (inputs[i].type) {
                case "password":
                    answer = new AnswerofWizard(inputs[i].value, name, email, inputs[i].id);
                    break;
                case "radio":
                    answer = new AnswerofWizard("" + inputs[i].checked + "",  name, email, inputs[i].id);
                    break;
                case "checkbox":
                    answer = new AnswerofWizard("" + inputs[i].checked + "", name, email, inputs[i].id);
                    break;
                default:
                    answer = new AnswerofWizard(inputs[i].value, name, email, inputs[i].id);
                    break;
            }
            AnswersStorage.Addanswer(answer);
        }
        else if (inputs[i].tagName == 'TEXTAREA') {
            answer = new AnswerofWizard(inputs[i].value, name, email, inputs[i].id);
            AnswersStorage.Addanswer(answer);
        }
        else if (inputs[i].tagName == 'OPTION') {
            answer = new AnswerofWizard(inputs[i].selected +"", name, email, inputs[i].id);
            AnswersStorage.Addanswer(answer);
        }
    }

}

function rightFunc() {
    //chickcookies();
    if (id < maxPageID) {
        if (checkedpage()) {
            saveData();
            id += 1;
            UI.ClearList();
            UI.displayWizardsByStorageByPage(id);
        }
        else {
            window.alert("You did not answer all wizard");
        }
    }

}
function leftFunc() {
    //chickcookies();
    if (id > 1) {
        if (checkedpage()) {
            saveData();
            id -= 1;
            UI.ClearList();
            UI.displayWizardsByStorageByPage(id);
        }
        else {
            window.alert("You did not answer all wizard");
        }
    }
}

function finsh() {
    
    //chickcookies();
    if (checkedpage()) {
        saveData();
        sendAnswers();
        exitWizard();
    }
    else {
        window.alert("You did not answer all wizard");
    }
}


function sendAnswers() {

    var url = "/Answer";
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    let data = AnswersStorage.getanswers();
    var temp = JSON.stringify(data);

    xhr.send(temp);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log("Saved");
        }
    };
    deleteAllCookies();
}


function exitWizard() {
    AnswersStorage.removeAll();
    WizardsStorage2.removeAll();
    window.location.href = "pageuser.html";
}

function checkedpage() {
    var inputs = document.getElementById('quiz_box').getElementsByTagName("section")[0].getElementsByTagName("*");
    var fug = false;
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].tagName == 'INPUT') {
            if (inputs[i].type == "password") {
                if (inputs[i].value == "")
                    return fulse
            }
            if (inputs[i].type == "radio") {
                fug = false;
                while (inputs[i].type == "radio") {
                    if (inputs[i].checked == true)
                        fug = true;
                    i += 3;
                }
                i -= 3;
                if (fug == false)
                    return false;
            }
            if (inputs[i].type == "checkbox") {
                if (inputs[i].checked == true)
                    fug = true;
                i += 4;
                while (inputs[i].type == "checkbox") {
                    if (inputs[i].checked == true)
                        fug = true;
                    i += 4;
                }
                i -= 4;
                if (fug == false)
                    return false;
            }
            else {
                if (inputs[i].value == "")
                    return false;
            }
        }
        else if (inputs[i].tagName == 'TEXTAREA') {
            if (inputs[i].value == "")
                return false;
        }
        else if (inputs[i].tagName == 'OPTION') {
            flug = false;

            if (inputs[i].selected == true) {
                flug = true;
            }
            while (inputs[i + 1].tagName == 'OPTION') {
                if (inputs[i + 1].selected == true) 
                    flug = true;
                i++;
            }
            if (flug == false) {
                return false;
            }
        }
    }
    return true;
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


function chickcookies() {
    if (getCookies("usertype") != "USER"){
        var urlParams = query_string();
        createCookie(`h`,`${urlParams.h}`,15)
        window.location.href = "login.html";
    }
        
}

chickcookies()