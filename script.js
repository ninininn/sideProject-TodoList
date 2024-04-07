//!DOMs
let userInput = document.getElementById("userInput");
let addBtn = document.getElementById("addBtn");
let dataBase = JSON.parse(localStorage.getItem("item")) || [];
let checkBase = JSON.parse(localStorage.getItem("check")) || [];
let listBlock = document.querySelector("#list-block");
// let deleteBtn = document.querySelectorAll(".deleteBtn");
// let editBtn = document.querySelectorAll(".editBtn");

//!events
addBtn.addEventListener("click", addData);
listBlock.addEventListener("click", deleteData);
updatePage(dataBase);
updateCheckboxStatus(checkBase);
setNum();

//!點擊新增按鈕時，將input.value加入localStorage
function addData(e) {
  e.preventDefault();
  //todo 判斷是否已經存在清單內
  for (let i = 0; i < dataBase.length; i++) {
    if (userInput.value === dataBase[i].content) {
      alert("already in!");
      userInput.value = "";
      return;
    }
  }
  //todo 判斷是否為空白
  if (userInput.value.trim() === "") {
    alert("請輸入文字！");
    return;
  }

  var todoList = {
    content: userInput.value,
  };
  var checkState = {
    checked: false,
  };
  dataBase.push(todoList);
  checkBase.push(checkState);
  createItem(dataBase[dataBase.length - 1].content); //@只取dataBase最後一個元素新增
  setNum(); //設定data-num
  checkboxStatus(); //設定checkbox勾選樣式
  localStorage.setItem("item", JSON.stringify(dataBase));
  localStorage.setItem("check", JSON.stringify(checkBase));
  userInput.value = ""; //清空輸入框
}

//!取出dataBase的值，並渲染到頁面上
//*建立清單items
function createItem(text) {
  //-<li>
  let item = document.createElement("li");
  item.classList.add("item");
  //   item.setAttribute("data-num", `${num}`);
  //-<div>
  let textGroup = document.createElement("div");
  textGroup.classList.add("text-group");
  let btnGroup = document.createElement("div");
  btnGroup.classList.add("btn-group");
  //-<button>s
  let editBtn = document.createElement("button");
  editBtn.classList.add("editBtn");
  //   editBtn.setAttribute("data-num", `${num}`);

  let deleteBtn = document.createElement("button");
  deleteBtn.classList.add("deleteBtn");
  //   deleteBtn.setAttribute("data-num", `${num}`);
  //-<input type=checkbox>
  let checkBox = document.createElement("input");
  checkBox.setAttribute("type", "checkbox");
  checkBox.setAttribute("name", "checkbox");
  //-<p>
  let content = document.createElement("p");
  content.classList.add("content");
  content.textContent = text;

  textGroup.appendChild(checkBox);
  textGroup.appendChild(content);

  btnGroup.appendChild(editBtn);
  btnGroup.appendChild(deleteBtn);

  item.appendChild(textGroup);
  item.appendChild(btnGroup);

  let listBlock = document.getElementById("list-block");
  listBlock.appendChild(item);
}
//*把dataBase內資料重新渲染至網頁
function updatePage(dataBase) {
  for (let i = 0; i < dataBase.length; i++) {
    createItem(dataBase[i].content);
  }
  checkboxStatus(); //設定checkbox勾選樣式
}
//!設定data-num
function setNum() {
  let item = document.querySelectorAll(".item");
  let deleteBtn = document.querySelectorAll(".deleteBtn");
  let editBtn = document.querySelectorAll(".editBtn");
  let checkboxList = document.querySelectorAll("input[type=checkbox]");
  for (let i = 0; i < item.length; i++) {
    item[i].setAttribute("data-num", `${i}`);
    deleteBtn[i].setAttribute("data-num", `${i}`);
    editBtn[i].setAttribute("data-num", `${i}`);
    checkboxList[i].setAttribute("data-num", `${i}`);
  }
}

//!刪除項目
function deleteData(e) {
  // e.preventDefault();//註解掉，讓checkbox恢復勾選功能
  if (e.target.nodeName !== "BUTTON" || e.target.className !== "deleteBtn") {
    return;
  } //判斷是否點擊到刪除按鈕
  var num = e.target.dataset.num; //取得待辦事項編號
  dataBase.splice(num, 1); //刪除點選的資料一筆
  checkBase.splice(num, 1); //刪除點選的資料一筆
  localStorage.setItem("item", JSON.stringify(dataBase)); //存入localStorage作更新
  localStorage.setItem("check", JSON.stringify(checkBase)); //存入localStorage作更新
  listBlock.innerHTML = ``; //先清除顯示區塊
  updatePage(dataBase); //在網頁上更新資訊，重新顯示dataBase
  updateCheckboxStatus(checkBase);
}

//!clearAll
var clearBtn = document.getElementById("clearBtn");
clearBtn.addEventListener("click", () => {
  localStorage.clear();
  dataBase = [];
  checkBase = [];
  updateCheckboxStatus(checkBase);
  listBlock.innerHTML = ``;
  updatePage(dataBase);
});

//!勾選狀態更改
function checkboxStatus() {
  let checkbox = listBlock.querySelectorAll("input[type=checkbox]");

  listBlock.addEventListener("change", (e) => {
    e.stopPropagation();
    for (let i = 0; i < checkbox.length; i++) {
      let text = document.querySelectorAll(".content");
      if (checkbox[i].checked) {
        //當勾選時
        text[i].style.textDecoration = " line-through";
        text[i].style.color = "#9F9F9F";
      } else {
        //取消勾選時
        text[i].style.textDecoration = "none";
        text[i].style.color = "var(--black)";
      }
    }
  });
}

//!在localStorage同步checkbox狀態
listBlock.addEventListener("change", (e) => {
  // console.log(e.target)
  e.stopPropagation();
  if (e.target.nodeName !== "INPUT") {
    return;
  } //判斷是否點擊到checkbox
  let num = e.target.dataset.num;
  checkBase[num].checked = e.target.checked;
  localStorage.setItem("check", JSON.stringify(checkBase));
});

// //!將localStorage的checkbox狀態渲染到網頁上
function updateCheckboxStatus(checkBase) {
  let checkbox = document.querySelectorAll("[type=checkbox]");
  for (let i = 0; i < checkBase.length; i++) {
    checkbox[i].checked = checkBase[i].checked;
    let text = document.querySelectorAll(".content");
    if (checkbox[i].checked) {
      text[i].style.textDecoration = " line-through";
      text[i].style.color = "#9F9F9F";
    } else {
      text[i].style.textDecoration = "none";
      text[i].style.color = "var(--black)";
    }
  }
}
