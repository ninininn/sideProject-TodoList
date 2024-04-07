//!DOMs
let userInput = document.getElementById("userInput");
let addBtn = document.getElementById("addBtn");
let dataBase = JSON.parse(localStorage.getItem("item")) || [];
let checkBase = JSON.parse(localStorage.getItem("check")) || [];
let listBlock = document.querySelector("#list-block");

//!events
userInput.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    addData();
  }
});
addBtn.addEventListener("click", addData);
listBlock.addEventListener("click", deleteData);
listBlock.addEventListener("click", editData);
listBlock.addEventListener("change", updateCheckBase);
//@重新渲染頁面
updatePage(dataBase);
updatePageCheck(checkBase);

//!點擊新增按鈕時，將input.value加入localStorage
function addData(e) {
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
  //*建立要使用的localStorage物件
  var todoList = {
    content: userInput.value,
  };
  var checkState = {
    checked: false, //預設為false
  };
  //*加入dataBase&checkBase中
  dataBase.push(todoList);
  checkBase.push(checkState);

  //*渲染頁面
  updatePage(dataBase);
  updatePageCheck(checkBase);

  //*將資料存回localStorage中
  localStorage.setItem("item", JSON.stringify(dataBase));
  localStorage.setItem("check", JSON.stringify(checkBase));

  userInput.value = ""; //清空輸入框
}

//!取出dataBase的值，並渲染到頁面上
function createItem(text, num) {
  //*建立清單items
  //-<li>
  let item = document.createElement("li");
  item.classList.add("item");
  item.setAttribute("data-num", num);
  //-<div>
  let textGroup = document.createElement("div");
  textGroup.classList.add("text-group");
  let btnGroup = document.createElement("div");
  btnGroup.classList.add("btn-group");
  //-<button>s
  let editBtn = document.createElement("button");
  editBtn.classList.add("editBtn");
  editBtn.setAttribute("data-num", num);

  let deleteBtn = document.createElement("button");
  deleteBtn.classList.add("deleteBtn");
  deleteBtn.setAttribute("data-num", num);
  //-<input type=checkbox>
  let checkBox = document.createElement("input");
  checkBox.setAttribute("type", "checkbox");
  checkBox.setAttribute("name", "checkbox");
  checkBox.setAttribute("data-num", num);
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
  if (listBlock.children.length > 0) clearAll();
  for (let i = 0; i < dataBase.length; i++) {
    createItem(dataBase[i].content);
  }
}

//!將localStorage的checkbox狀態渲染到網頁
function updatePageCheck(checkBase) {
  let checkbox = document.querySelectorAll("[type=checkbox]");
  for (let i = 0; i < checkBase.length; i++) {
    checkbox[i].checked = checkBase[i].checked;
  }
  checkStyle();
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
  //*在網頁上更新資訊
  updatePage(dataBase);
  updatePageCheck(checkBase);
}

//!clearAllHistory
var clearBtn = document.getElementById("clearBtn");
clearBtn.addEventListener("click", () => {
  localStorage.clear();
  dataBase = [];
  checkBase = [];
  editBase = [];
  clearAll();
});
function clearAll() {
  listBlock.innerHTML = ``;
}

//!設定所有checkbox勾選樣式
function checkStyle() {
  let checkbox = document.querySelectorAll("[type=checkbox]");
  let text = document.querySelectorAll(".content");
  for (let i = 0; i < checkbox.length; i++) {
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
}

//!更新localStorage的checkBase內資料
function updateCheckBase(e) {
  if (e.target.nodeName !== "INPUT") {
    return;
  } //判斷是否點擊到checkbox
  let num = e.target.dataset.num; //點擊元素的data-num
  checkBase[num].checked = e.target.checked;
  localStorage.setItem("check", JSON.stringify(checkBase)); //存回localStorage
  checkStyle();
  // itemDone();
}

//!勾選完成時放置在最後面
function itemDone() {
  let itemList = document.querySelectorAll(".item");
  for (let i = 0; i < itemList.length; i++) {
    if (itemList[i].querySelector("[type=checkbox]").checked) {
      listBlock.appendChild(itemList[i]);
    }
  }
}

//!編輯功能
function editData(e) {
  if (e.target.nodeName !== "BUTTON" || e.target.className !== "editBtn") {
    return;
  } //判斷是否點擊到編輯按鈕
  var num = e.target.dataset.num; //取得待辦事項編號
  userInput.value = dataBase[num].content;
  dataBase[parseInt(num)].content = userInput.value;
  dataBase.splice(num, 1); //刪除點選的資料一筆
  checkBase.splice(num, 1); //刪除點選的資料一筆
  localStorage.setItem("item", JSON.stringify(dataBase)); //存入localStorage作更新
  localStorage.setItem("check", JSON.stringify(checkBase)); //存入localStorage作更新
  //*在網頁上更新資訊
  updatePage(dataBase);
  updatePageCheck(checkBase);
}
