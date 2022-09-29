// import { scrollBarFix } from "../layout/main.js";
import { Router } from "../routes/Router.js";

// 初次載入時取得 localStorage 中的資料並存進變量中
export const DATA = getStorage();

// mobile 100vh 的問題
export const appHeight = () => {
  const doc = document.documentElement;
  doc.style.setProperty("--app-height", `${window.innerHeight}px`);
};

// 取得 localStorage 的資料
export function getStorage() {
  // 如果取得的 localStorage 資料為空，則返回一個基本的初始資料
  return (
    JSON.parse(localStorage.getItem("todoLocalData")) || {
      default: [
        {
          id: "all",
          name: "全部",
          color: "",
          content: [],
        },
        {
          id: "top",
          name: "置頂",
          color: "",
          content: [
            //   {
            //     checked: false,
            //     content: "this is todo A.",
            //     top: true, // 凡是在 top 內的都是 true
            //   },
          ],
        },
      ],

      custom: [
        // {
        //   id: "",
        //   name: "未命名清單",
        //   color: "",
        //   content: [
        // {
        //   checked: false,
        //   content: "this is todo A.",
        //   top: false,
        // },
        // ],
        // },
      ],
    }
  );
}

// 設定 localStorage 的資料
export function setStorage(data) {
  localStorage.setItem("todoLocalData", JSON.stringify(data));
}


/**
 * 取得網址列中的 hash，並利用 RegExp 過濾出網址列最後面的值，返回一個字符串(返回值是本頁 id)。
 * 註: 取得的結果若是 `''` 則代表取得的 id 是 home。
 * @returns id 字符串
 */
export function getCurrentPageId() {
  const hash = window.location.hash;
  const currentPageId =
    hash.match(/[a-z0-9]*$/)[0] === "" ? "home" : hash.match(/[a-z0-9]*$/)[0];
  return currentPageId;
}

/**
 * 取得當前所在頁面的 Object
 * @returns 頁面 Object
 */
function getCurrentPage() {
  for (let pageType in DATA) {
    const result = DATA[pageType].find(i => i.id === getCurrentPageId())
    if(result) return result;
  }
}

// console.log(getCurrentPage())

/**
 * 取得當前所在 custom 頁面的資料。
 * 注意: 此函數是指定在 DATA.custom 內尋找"內部元素的"的 ID。
 * @returns 目前所在的 custom 頁面的資料(`Object`)
 */
export function getCurrentCustomPage() {
  return DATA.custom.find((i) => i.id === getCurrentPageId());
}




/**
 * 取得當前事件觸發的 todo 物件
 * @param {*} e 事件
 * @returns todo 物件
 */
export function getCurrentTodo(e) {
  // 取得事件觸發 todo 的 id
  const currentTodoId = e.target.closest(".todo__item").id;
  // 取得當前頁面物件資料
  const currentPage = getCurrentPage();
  // 從當前頁面資料取得當前 todo
  const currentTodo = currentPage.content.find(
    (todoItem) => todoItem.id === currentTodoId
  );
  return currentTodo;
}

/**
 * 產生一個隨機 id
 * @returns 一個獨一無二的亂數 id
 */
export function createUniqueId() {
  return (
    Date.now().toString(36) +
    Math.floor(
      Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)
    ).toString(36)
  );
}


/**
 * 接收一個數字參數number，檢查number是否大於0且小於10，
 * 若符合條件，返回一個前面補0的String；
 * 若不符合條件返回一個由number轉化成的String。
 * @param {*} number 
 * @returns `String`
 */
export function fillZero(number) {
  return number < 10 && number > 0
    ? '0' + number
    : String(number);
}



export function setTodo() {
  const todoInput = document.querySelector("#todo-input");

  if (todoInput.value.trim() !== "") {
    const todoValue = todoInput.value.trim();
    // 取得目前頁面的所在位置(取得頁面ID)
    const currentPageId = getCurrentPageId();


    const todo = {
      id: createUniqueId(),
      checked: false,
      content: todoValue,
      top: currentPageId === "top", // 凡是在 top 內的都是 true
      srcId: getCurrentPageId(),
      srcName: getCurrentPage().name,
    };

    // ↓ 這個寫法要改善，要更活一點
    if (
      currentPageId === "home" ||
      currentPageId === "all" ||
      currentPageId === "top"
    ) {
      DATA.default.find(i => i.id === currentPageId).content.push(todo);
    } else {
      DATA.custom.find((i) => i.id === currentPageId).content.push(todo);
    }

    setStorage(DATA);
    todoInput.value = "";
  }
  Router();
}

export function addTodo(todo) {
  setTodo();
}


/**
 * 編輯自訂清單的名稱
 */
export function editName(){
  const pageName = document.querySelector('.main__name');
  pageName.removeAttribute('readonly');
  pageName.select();
}

export function saveEditedName(e){
  // 取得 input value
  const inputValue = e.target.value;
  const currentPage = getCurrentPage();
  currentPage.name = inputValue;

  setStorage(DATA);
}



// function selectText(containerid) {
//   if (document.selection) {
//       let range = document.body.createTextRange();
//       range.moveToElementText(document.getElementById(containerid));
//       range.select();
//   } else if (window.getSelection) {
//       let range = document.createRange();
//       range.selectNode(document.getElementById(containerid));
//       window.getSelection().addRange(range);
//   }
// }
