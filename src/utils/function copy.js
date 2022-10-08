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

/**
 * * 設定 localStorage 的資料
 * @param {*} data 欲存至 localStorage 的物件
 */
export function setStorage(data) {
  localStorage.setItem("todoLocalData", JSON.stringify(data));
}

/**
 * * 將所有頁面資料集合成一個 Array 並返回。
 * @returns 包含所有頁面 Object 的 array
 */
export function getAllPage() {
  const allPage = [];
  for (let pageType in DATA) {
    allPage.push(...DATA[pageType]);
  }
  return allPage;
}

/**
 * * 取得網址列中的 hash，並利用 RegExp 過濾出網址列最後面的值，返回一個字符串(返回值是本頁 id)。
 * * 註: 取得的結果若是 `''` 則代表取得的 id 是 home。
 * @returns id 字符串
 */
export function getCurrentPageId() {
  const hash = window.location.hash;
  const currentPageId =
    hash.match(/[a-z0-9]*$/)[0] === "" ? "home" : hash.match(/[a-z0-9]*$/)[0];
  return currentPageId;
}

/**
 * * 取得當前所在頁面的 Object
 * @returns 頁面 Object
 */
export function getCurrentPage() {
  const allPages = getAllPage();
  const result = allPages.find((i) => i.id === getCurrentPageId());
  if (result) return result;
}

/**
 * * 透過 id 字串，搜尋當前觸發的 todo 在 DATA 中的物件資料。
 * @param {*}  currentTodoId 提供 id 字串作為參數
 * @returns 返回 todo 物件
 */
export function getCurrentTodo(currentTodoId) {
  // 取得當前頁面物件資料
  const currentPage = getCurrentPage();

  // 先從當前頁面資料取得當前 todo
  const currentTodoObj = currentPage.content.find(
    (todoItem) => todoItem.id === currentTodoId
  );

  // 如果在當前頁面資料當中已找到 todo Object ，則返回該 todo Object
  if (currentTodoObj) return currentTodoObj;

  // 如果找不到(undefined)，要往其他頁面資料去尋找:
  const allPages = getAllPage();
  return allPages
    .filter(({ id }) => id !== currentPage.id) // 過濾掉當前頁面物件資料
    .map(({ content }) => content) // 取得 content 屬性
    .reduce((acc, cur) => acc.concat(cur), []) // 攤平
    .find(({ id }) => id === currentTodoId); // 找出 todo Object
}


/**
 * * 取得某個 todo 在 DATA 中所屬的 Array 並返回
 * @param {*} currentTodoId 接收一個 id 字符串作為參數
 * @returns 返回該 todo 在 DATA 中所屬的 Array
 */
export function getCurrentTodoOriginArray(currentTodoId) {
  // 取得 todo 物件中的 srcId
  const todoObj = getCurrentTodo(currentTodoId);
  const { srcId } = todoObj;
  // 取得所有頁面
  const allPages = getAllPage();
  const currentTodoArray = allPages.find(({ id }) => id === srcId).content;
  return currentTodoArray;
}

/**
 * * 接收一個頁面的 Id，返回該頁面的物件
 * @param {*} pageId 頁面 id 字串
 * @returns 返回給定的 id 相對應的頁面物件
 */
export function getPage(pageId){
  const allPages = getAllPage();
  return allPages.find(({id}) => id === pageId);
}


/**
 * * 取得所有的 todo Object，返回一個 Array。
 * @returns 返回一個匯集所有 todo Object 的 Array
 */
export function getAllTodos() {
  const allPage = getAllPage();
  return allPage
    .map((pageObj) => pageObj.content)
    .reduce((acc, pageContent) => acc.concat(pageContent), []);
}

/**
 * * 產生一個隨機 id
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
 * * 接收一個數字參數 number，檢查 number是否大於 0 且小於 10，
 * * 若符合條件，返回一個前面補 0 的 String；
 * * 若不符合條件返回一個由 number 轉化成的 String。
 * @param {*} number
 * @returns `String`
 */
export function fillZero(number) {
  return number < 10 && number > 0 ? "0" + number : String(number);
}

/**
 * ! 此函數的描述待補
 */
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
      DATA.default.find((i) => i.id === currentPageId).content.push(todo);
    } else {
      DATA.custom.find((i) => i.id === currentPageId).content.push(todo);
    }

    setStorage(DATA);
    todoInput.value = "";
  }
  Router();
}

/**
 * ! 此函數的描述待補
 */
export function addTodo(todo) {
  setTodo();
}

/**
 * * 隱藏 DOM 上的某個元素
 *
 * 將該元素新增 `.hide` class。
 * (visibility: hidden; opacity: 0;)
 * @param {*} selector css 選擇器
 */
export function hide(selector) {
  const target = document.querySelector(selector);
  target.classList.add("hide");
}

/**
 * * 取消隱藏 DOM 上的某個元素
 * 移除 指定 DOM 元素上的 .hide class
 * @param {*} selector css 選擇器
 */
export function unhide(selector) {
  const target = document.querySelector(selector);
  target.classList.remove("hide");
}

/**
 * * 處理在 Top.js 中被取消置頂的項目
 * 1.判斷被取消置頂的 todo 是否來自於 Top.js
 * 2.若來自於 Top.js，將該 todo 資料移動到 DATA.default 的 all 物件中
 * 3.移動過去之前，將 srcId、srcName 做更改
 * 4.移動過去之後，該項 todo 將屬於 all 物件
 * @param {*} todoId 
 */
export function topMoveToAll(todoId){
  // todo: 取得 todo 物件
  // todo: 將 srcId、srcName 做更改
  // todo: 取得 DATA.default 中的 all 物件
  // todo: 放入 all 物件中的 content Array 中
}



