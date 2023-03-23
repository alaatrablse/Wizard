class Wizard{
    constructor(titel,description,userId,pages){
        this.titel=titel;
        this.description=description;
        this.userId=userId;
        this.pages=pages;
    }
}



class Page {
    constructor(type, index,numPage) {
        this.wizardType = type;
        this.wizardData = index;
        this.numPages = numPage;
    }
}

class WizardsStorage {

  static wizardSKEY = "Addwizards";
  //--return Array Of wizard from storage
  //--if exsist parse to array object else return empty array
    static getwizards() {
        let wizards;
        //KEY NOT EXSIST
        var id = getCookies("usercookis");
        if (localStorage.getItem(WizardsStorage.wizardSKEY) === null) {
            wizards = {"titel": null,
            "description": null,
            "userId": id,
            "hashnum":0,
            "pages":[]
            };
        }
        //Key Exsist - Need to Get Value
        else {
            //01 Get Storage value as JSON STRING
            let wizardsArrTxt = localStorage.getItem(WizardsStorage.wizardSKEY);
            //02 Convert the string to real JSON OBJECT
            let wizardsArr = JSON.parse(wizardsArrTxt);
            wizards = wizardsArr;
        }
        return wizards;
    }

    static add(wizard){

    }

    static Addpage(page) {
        //1)READ ALL wizardS AS OBJECT (getwizards()) get Array
        let wizards = WizardsStorage.getwizards();
        //02) PUSH to ARRAY 
        wizards.pages.push(page);
        //03) Save the array back to storage
        var wizardtjsonTxt = JSON.stringify(wizards);
        localStorage.setItem(WizardsStorage.wizardSKEY, wizardtjsonTxt);
    }

    ///Remove Item From Storage By ISBN Code
    static removewizard(id,numpage) {
        //1)READ ALL wizardS AS OBJECT (getwizards()) get Array
        let wizards = WizardsStorage.getwizards();

        //2) Remove Item
        var i = 0; 
        wizards.pages.forEach((itemWizard,index) => {
            if(i===id && itemWizard.numPages == numpage){
                wizards.pages.splice(index,1);
                i++;
            }
            else if(itemWizard.numPages == numpage){
                i++;
            }
        });
        //03)
        var wizardtjsonTxt = JSON.stringify(wizards);
        localStorage.setItem(WizardsStorage.wizardSKEY, wizardtjsonTxt);

    }

    static UpdateWizard(id, numpage, wizard) {
        let wizards = WizardsStorage.getwizards();
        //2) Remove Item
        var i = 0; 
        wizards.pages.forEach(itemWizard => {
            if(i===id && itemWizard.numPages == numpage){
                itemWizard.type=wizard.wizardType; 
                itemWizard.wizardData =wizard.wizardData;
                i++;
            }
            else if(itemWizard.numPages == numpage){
                i++;
            }
        });
        var wizardtjsonTxt = JSON.stringify(wizards);
        localStorage.setItem(WizardsStorage.wizardSKEY, wizardtjsonTxt);
    }

    static removeAll(){
        localStorage.removeItem(WizardsStorage.wizardSKEY);
    }

    static Add_titel_des() {
        let wizards = WizardsStorage.getwizards();
        wizards.titel= document.getElementById("title-wizard").value
        wizards.description= document.getElementById("des-wizard").value
        var wizardtjsonTxt = JSON.stringify(wizards);
        localStorage.setItem(WizardsStorage.wizardSKEY, wizardtjsonTxt);
    }

    static update(wizard) {
        var wizardtjsonTxt = JSON.stringify(wizard);
        localStorage.setItem(WizardsStorage.wizardSKEY, wizardtjsonTxt);
    }

}

var size =0 ;
class UI {
    
    ///-- Add Item of wizard to Table
    static addWizardToList(wizard) {
        let listTableBody = document.querySelector("#wizard-list");
        //Create new Tr
        let row = document.createElement("tr");
        const listIndex =[]
        for(var i=0;i<wizard.wizardData.length;i++){
            listIndex.push(wizard.wizardData[i].wizardIndex)
        }
        var size = listTableBody.getElementsByTagName('tr').length;
        var ss = `<td >${wizard.wizardType}</td> <td>${listIndex.toString()}</td> <td >${wizard.numPages}</td><td ><a id="p-${wizard.numPage}b-${wizard.idWizard}" onclick="deleteRow(this,${size},${wizard.numPages});" href="#"> <img src="images/x-button.png"></a></td>
       <td> <a id="p-${wizard.numPage}b-${wizard.idWizard}" onclick="UpdateRow(this,${size},'${wizard.numPages}','${wizard.wizardType}');" href="#"> <img src="images/refresh-button.png" alt="updat"></a></td>`
        
        if(size === 0){
            ss+=`<td ><a onclick="downfun(${size},${wizard.numPages})"><img src="images/down-arrow.png" alt="updat"></a></td>`
        }
        else{
            ss+=`<td ><a onclick="upfun(${size},${wizard.numPages})"><img src="images/up-arrow.png" alt="updat"></a></td><td></td>`
            if(size > 1){
                var size2 = listTableBody.getElementsByTagName('tr')[size-1].getElementsByTagName('td').length;
                listTableBody.getElementsByTagName('tr')[size-1].getElementsByTagName('td')[size2-2].innerHTML=
                `<a onclick="upfun(${size-1},${wizard.numPages})"><img src="images/up-arrow.png" alt="updat"></a>`
                listTableBody.getElementsByTagName('tr')[size-1].getElementsByTagName('td')[size2-1].innerHTML=
                 `<a  onclick="downfun(${size-1},${wizard.numPages})"><img src="images/down-arrow.png" alt="updat">`
            }
        }
        row.innerHTML = ss;
        listTableBody.appendChild(row);
    }

    //Read Data FRom Storage And Display Wizards in list
    static displayWizardsByStorage() {
        let WizardsArr = WizardsStorage.getwizards().pages;
        WizardsArr.forEach(itemWizard => {
            UI.addWizardToList(itemWizard);
        });
        
    }

    static displayWizardsByStorageByPage(numpage){
        let WizardsArr = WizardsStorage.getwizards().pages;
        UI.ClearList();
        WizardsArr.forEach(itemWizard => {
            if(itemWizard.numPages == numpage){
                UI.addWizardToList(itemWizard);
            }
        });
    }


    static ClearList() {
        let listTableBody = document.querySelector("#wizard-list");
        listTableBody.innerHTML = "";
    }

    static UpdateRowWizardsByStorage(id, numpage) {
        var select = document.getElementById("typeWizardChoice");
        var choose = select.options[select.selectedIndex].value;
        var inputElements = document.getElementById('indexs').getElementsByTagName('input')
        var temp =[]
        for(var i=0;i<inputElements.length;i++){
            temp.push({"wizardIndex":inputElements[i].value,"pageId":0})
        }
        var nweElement = new Page(choose,temp,numpage);
        WizardsStorage.UpdateWizard(id,numpage,nweElement);
        select.selectedIndex = 0;
        document.getElementById('indexs').innerHTML = "<input type='text' placeholder='Index' id='input' name='text' class='inputxx'>";
    }
}
///////////////////check cookies//////////////////////
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

if (getCookies("usertype") != "WIZARD CREATOR") {
    window.location.href = "home.html";
}
else if (getCookies("usercookis") !== WizardsStorage.getwizards().userId) {
    Delete_Wizard();
    titel();
}
///////////////deleteRow/////////////////////

function deleteRow(element, id, numpage) {
    WizardsStorage.removewizard(id,numpage);
    UI.ClearList();
    UI.displayWizardsByStorageByPage(document.getElementById("myList").selectedIndex)
    titel();
}


//////////////////UpdateRow///////////////////

function UpdateRow(element, id, numpage, type) {
    UI.ClearList();
    var select = document.getElementById("typeWizardChoice");
    var choose = select.options;
    for(var i=0; i<choose.length;i++){
        if(choose[i].innerText == type){
            select.selectedIndex=i;
        }
    }
    
    var indexss = document.getElementById("indexs");
    indexss.innerHTML="";
    
    var varss = dd(numpage);
    for(var i=0;i<varss[id].wizardData.length;i++){
        if(i>0)
            indexss.innerHTML+="<input type='text' placeholder='Index' id='input-"+i+"' name='text' style='margin-top:10px' class='inputxx'>";
        else
            indexss.innerHTML+="<input type='text' placeholder='Index' id='input-"+i+"' name='text' class='inputxx'>";
        // div.innerHTML += '<input type="text" placeholder="Index '+size+' of radioButt" id="input" name="text" style="margin-top:10px" class="inputxx">'
    }
    for(var i=0;i<varss[id].wizardData.length;i++){
        document.getElementById("input-"+i).value = varss[id].wizardData[i].wizardIndex;
    }
    document.getElementById('div-but').innerHTML=`<button id='updateElement' type='button' class='but-add' style='margin: 0; margin-top: -6px;'>update element</button>
    <button id="addinput" type="button" class="but-add" style="margin-left: 5px; margin-top: -6px;" onclick="AddInput2(${id},${numpage})">Add input</button>`;
    document.getElementById('updateElement').addEventListener('click', function(){
        UI.UpdateRowWizardsByStorage(id,numpage);
        document.getElementById('div-but').innerHTML="<button id='addElement' type='button' class='but-add' onclick='AddElement()'>add element</button>";
        UI.displayWizardsByStorageByPage(document.getElementById("myList").selectedIndex);
    });
    titel();
}

///////////////////////////////////
function AddInput2(id, numpage) {
    var varss = dd(numpage);
    var select = document.getElementById("typeWizardChoice");
    var div = document.getElementById("indexs");
    var size =div.getElementsByTagName('input').length+1;
    var choose = select.options[select.selectedIndex].value;
    if(choose === "RadioButtons List"){
        div.innerHTML += '<input type="text" placeholder="Index '+size+' of radioButt" id="input'+i+'" name="text" style="margin-top:10px" class="inputxx">';
    }
    else if(choose === "CheckBox List"){
        div.innerHTML += '<input type="text" placeholder="Index '+size+' of checkBox" id="input'+i+'" name="text" style="margin-top:10px" class="inputxx">';
    }
    else if(choose === "ListBox List"){
        div.innerHTML += '<input type="text" placeholder="Index 2 of ListBox" id="input'+i+'" name="text" style="margin-top:10px" class="inputxx">';
    }
    else if(choose === "Images Selection List"){
        div.innerHTML += '<input type="text" placeholder="URL 2 of Images" id="input'+i+'" name="text" style="margin-top:10px" class="inputxx">';
    }
    for(var i=0;i<varss[id].wizardData.length;i++){
        document.getElementById("input-"+i).value = varss[id].wizardData[i].wizardIndex;
    }
    titel();
}


/////////////////DropDownList functions//////////////////////

function favTutorial() {
    var mylist = document.getElementById("myList");
    UI.displayWizardsByStorageByPage(mylist.selectedIndex); 
    titel();
}



function Drowpdown(){
    let WizardsArr = WizardsStorage.getwizards();
    var mylist = document.getElementById("myList");
    mylist.innerHTML = "<option> ---Choose page--- </option>";
    var lst = []
    for(var i=0; i<WizardsArr.pages.length; i++){
        var num = WizardsArr.pages[i].numPages
        if (lst.includes(num) == false){
            lst.push(num)
        } 
    }
    var max = Math.max(...lst);
    for (var j=0; j<max; j++){
        var opt = document.createElement('option');
        opt.innerHTML = j+1;
        opt.value = j+1;
        mylist.appendChild(opt); 
    }
    titel();
    
}
/////////////////////////////////////////////
function SelectType(){
    var select = document.getElementById("typeWizardChoice");
    var div = document.getElementById("indexs");
    var div2 = document.getElementById("div-but");
    var choose = select.options[select.selectedIndex].value
    div2.innerHTML ='<button id="addElement" type="button" class="but-add" style="margin: 0; margin-top: -6px;" onclick="AddElement()">Add element</button>';
    if(choose === "LABEL" || choose === "TextBox" || choose === "CheckBox"){
        div.innerHTML = '<input type="text" placeholder="Index" id="input" name="text" class="inputxx">';
    }
    else if(choose === "IMAGE"){
        div.innerHTML = '<input type="text" placeholder="URL" id="input" name="text" class="inputxx">';
    }
    else if(choose === "MultiLine Free Text"){
        div.innerHTML = '';
    }
    else if(choose === "RadioButtons List"){
        div.innerHTML = '<input type="text" placeholder="Index 1 of radioButt" id="input" name="text" class="inputxx">';
        div.innerHTML += '<input type="text" placeholder="Index 2 of radioButt" id="input" name="text" style="margin-top:10px" class="inputxx">';
        div2.innerHTML +='<button id="addinput" type="button" class="but-add" style="margin-left: 5px; margin-top: -6px;" onclick="AddInput()">Add input</button>';
    }
    else if(choose === "CheckBox List"){
        div.innerHTML = '<input type="text" placeholder="Index 1 of checkBox" id="input" name="text" class="inputxx">';
        div.innerHTML += '<input type="text" placeholder="Index 2 of checkBox" id="input" name="text" style="margin-top:10px" class="inputxx">';
        div2.innerHTML +='<button id="addinput" type="button" class="but-add" style="margin-left: 5px; margin-top: -6px;" onclick="AddInput()">Add input</button>';
    }
    else if(choose === "ListBox List"){
        div.innerHTML = '<input type="text" placeholder="Index 1 of ListBox" id="input" name="text" class="inputxx">';
        div.innerHTML += '<input type="text" placeholder="Index 2 of ListBox" id="input" name="text" style="margin-top:10px" class="inputxx">';
        div2.innerHTML +='<button id="addinput" type="button" class="but-add" style="margin-left: 5px; margin-top: -6px;" onclick="AddInput()">Add input</button>';
    }
    else if(choose === "Images Selection List"){
        div.innerHTML = '<input type="text" placeholder="URL 1 of Images" id="input" name="text" class="inputxx">';
        div.innerHTML += '<input type="text" placeholder="URL 2 of Images" id="input" name="text" style="margin-top:10px" class="inputxx">';
        div2.innerHTML +='<button id="addinput" type="button" class="but-add" style="margin-left: 5px; margin-top: -6px;" onclick="AddInput()">Add input</button>';
    }
    else if(choose === "SecuredInput"){
        div.innerHTML = '';
    }
    titel();
}

////////////////////ALL DOM ELEMENTS READY/////////////////
function titel(){
    let WizardsArr = WizardsStorage.getwizards();
    var titel = document.getElementById("title-wizard");
    var description = document.getElementById("des-wizard");
    
    WizardsArr.titel = titel.value;
    WizardsArr.description = description.value;
    
    WizardsStorage.update(WizardsArr);
}

window.addEventListener('DOMContentLoaded', (event) => {
    let WizardsArr = WizardsStorage.getwizards();
    if (WizardsArr.hashnum!=0){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/wizards/' + WizardsArr.hashnum, true);
        xhr.onload = function () {
            if (this.status == 200) {
                var wizard = JSON.parse(this.responseText);
                
                wizard.userId = wizard.userId.toString();
                var wizardtjsonTxt = JSON.stringify(wizard);
                
                Drowpdown();
                titel();
            }
            else {
                WizardsStorage.removeAll();
            }
        }
        xhr.send();
    }
    else{
        Drowpdown();
        titel();
    }
    
});

///////////////////////////Add Page Button//////////////////////////////

var but = document.getElementById('addPage').addEventListener('click', AddPageToStorg);


function AddPageToStorg(){
    var mylist = document.getElementById("myList");
    var i = mylist.childNodes[mylist.childNodes.length-1].index+1
    var opt = document.createElement('option');
    opt.innerHTML = i;
    opt.value = i;
    mylist.appendChild(opt);
    mylist.selectedIndex = i;
    UI.displayWizardsByStorageByPage(i);
    titel();
}

///////////////////////////Add elment Button//////////////////////////////

 function AddElement(){
    var page = document.getElementById("myList");
    var numpage = page.options[page.selectedIndex].value
    var select = document.getElementById("typeWizardChoice");
    var choose = select.options[select.selectedIndex].value
    var inputElements = document.getElementById('indexs').getElementsByTagName('input')
    let wizards = WizardsStorage.getwizards().pages;
    var size = 0
    wizards.forEach((elementwizard, index) => {
        if (elementwizard.numPage == numpage){
            size++
        }
    });

    if( numpage != "---Choose page---"){
        var temp =[]
        if(inputElements.length == 0){
            temp.push({"wizardIndex":null,"pageId":0})
        }
        for(var i=0;i<inputElements.length;i++){
            if(inputElements[i].value == ""){
                window.alert("One of inputs is empty");
                return;
            }
            temp.push({"wizardIndex":inputElements[i].value,"pageId":0})
        }
        var nweElement = new Page(choose,temp,numpage,size);
        WizardsStorage.Addpage(nweElement);
        UI.ClearList();
        UI.displayWizardsByStorageByPage(numpage);
        size = size+1;
        document.getElementById('indexs').innerHTML = '<input type="text" placeholder="Index" id="input" name="text" class="inputxx">';
        select.selectedIndex=0;
    }
    else{
        window.alert("Choose page");
        document.getElementById('indexs').innerHTML = '<input type="text" placeholder="Index" id="input" name="text" class="inputxx">';
        select.selectedIndex=0;
    }
    titel();
}

//////////////////////delete Wizard//////////////////////////
function Delete_Wizard() {
    WizardsStorage.removeAll();
    UI.ClearList();
    var mylist = document.getElementById("myList");
    mylist.innerHTML = "<option> ---Choose page--- </option>";
    document.getElementById("title-wizard").value = "";
    document.getElementById("des-wizard").value = "";
    titel();
}
///////////////////////move wizard//////////////////////////////
function switchWizard (i,j,numpage) {
    var wizard = WizardsStorage.getwizards();
    
    const lis = []
    for(var x=0;x<wizard.pages.length;x++){
        if(wizard.pages[x].numPages == numpage){
            lis.push(x);
        }
    }
    var temp = wizard.pages[lis[i]];
    wizard.pages[lis[i]]=wizard.pages[lis[j]];
    wizard.pages[lis[j]] =temp;
    var wizardtjsonTxt = JSON.stringify(wizard);
    localStorage.setItem(WizardsStorage.wizardSKEY, wizardtjsonTxt);
    favTutorial()
    titel();
}

function downfun(index,numpage){
    switchWizard(index,index+1,numpage)
}

function upfun(index,numpage){
    if(index>0)
        switchWizard(index,index-1,numpage)
}

//////////////////////Save Wizard//////////////////////////
function Save_Wizard(){;

    if (getCookies("usercookis") == "") {
        deleteAllCookies();
        Delete_Wizard();
        window.location.href="home.html";
    }
    else if (getCookies("usercookis") !== WizardsStorage.getwizards().userId) {
        deleteAllCookies();
        Delete_Wizard();
        window.location.href="home.html";
    }
    else{
        var url = "/wizards";
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url);

        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log("Saved");
        }};
        
        WizardsStorage.Add_titel_des();
        let data = WizardsStorage.getwizards();
        var temp = JSON.stringify(data)
        if(data.pages.length == 0){
            window.alert("One page must be added to the Wizard")
        }
        else if(data.titel == "" || data.description == ""){
            let text = "the title or description is empty, are you want save the Wizard";
            if (confirm(text) == true) {
                xhr.send(temp);
                Delete_Wizard()
            }
        }
        else{
            xhr.send(temp);
            Delete_Wizard()
        }
    }
}
////////////////////////////titel and Description//////////////////////
function data(){
    let WizardsArr = WizardsStorage.getwizards();
    var titel = document.getElementById("title-wizard");
    var des = document.getElementById("des-wizard");
    if(titel.value == ""){
        if(WizardsArr.titel != null){
            titel.value = WizardsArr.titel;
        }
    }
    if(des.value == ""){
        if(WizardsArr.titel != null){
            des.value = WizardsArr.description;
        }
    }
}

data();

////////////////////////////////////////////
function AddInput(){
    var select = document.getElementById("typeWizardChoice");
    var div = document.getElementById("indexs");
    var size =div.getElementsByTagName('input').length+1;
    var choose = select.options[select.selectedIndex].value;
    if(choose === "RadioButtons List"){
        div.innerHTML += '<input type="text" placeholder="Index '+size+' of radioButt" id="input" name="text" style="margin-top:10px" class="inputxx">';
    }
    else if(choose === "CheckBox List"){
        div.innerHTML += '<input type="text" placeholder="Index '+size+' of checkBox" id="input" name="text" style="margin-top:10px" class="inputxx">';
    }
    else if(choose === "ListBox List"){
        div.innerHTML += '<input type="text" placeholder="Index 2 of ListBox" id="input" name="text" style="margin-top:10px" class="inputxx">';
    }
    else if(choose === "Images Selection List"){
        div.innerHTML += '<input type="text" placeholder="URL 2 of Images" id="input" name="text" style="margin-top:10px" class="inputxx">';
    }
    titel();
}
////////////////////////////////////////////

function dd(numpage){
    let WizardsArr = WizardsStorage.getwizards();
    var varss =[]
    WizardsArr.pages.forEach(itemWizard => {
        if(itemWizard.numPages == numpage){
            varss.push(itemWizard);
        }
    });
    titel();
    return varss
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
    titel();
}

function chickcookies(){
    if(getCookies("usercookis")=="")
        window.location.href="home.html";
    else if(getCookies("usercookis") !== WizardsStorage.getwizards().userId){
        window.location.href="home.html";
    }
}