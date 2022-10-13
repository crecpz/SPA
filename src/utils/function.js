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
          color: "1",
          content: [],
        },
        {
          id: "top",
          name: "置頂",
          color: "1", // @ 這其實用不到，除非 dropdown 會放 top 的內容，那就需要顏色
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
  // 取得到 srcId 之後就可以知道此 todo 的資料是來自於哪一個頁面資料
  const todoObj = getCurrentTodo(currentTodoId);
  const { srcId } = todoObj;
  // 取得所有頁面
  const allPages = getAllPage();
  // 在所有頁面中尋找與 srcId 符合的頁面，找到之後取得 content 屬性
  const currentTodoArray = allPages.find(({ id }) => id === srcId).content;
  return currentTodoArray;
}

/**
 * * 接收一個頁面的 Id，返回該頁面的物件
 * @param {*} pageId 頁面 id 字串
 * @returns 返回給定的 id 相對應的頁面物件
 */
export function getPage(pageId) {
  const allPages = getAllPage();
  return allPages.find(({ id }) => id === pageId);
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
 * * 建立新的 todo 資料，並加進當前頁面中
 */
export function setTodo() {
  const todoInput = document.querySelector("#todo-input");
  if (todoInput.value.trim() !== "") {
    // 存放使用者輸入的文字內容
    const todoValue = todoInput.value.trim();

    // 取得目前頁面的所在位置(取得頁面ID)
    const currentPageId = getCurrentPageId();

    // 建構 todo Obecjt
    const todo = {
      id: createUniqueId(),
      checked: false,
      content: todoValue,
      top: currentPageId === "top", // 凡是在 top 內的都是 true
      srcId: getCurrentPageId(),
      srcName: getCurrentPage().name,
    };

    // 取得所有的頁面資料，並找出與目前頁面 id 相匹配的資料，
    // 在 content 內加入新 todo
    const allPage = getAllPage();
    allPage.find((i) => i.id === currentPageId).content.unshift(todo);

    setStorage(DATA);
    todoInput.value = "";
  }
  Router();
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
 * * 接收一個在「置頂」被取消的 todo 物件，將該物件從「top」移動至「all」
 * 1.判斷被取消置頂的 todo 是否來自於 Top.js 本身
 * 2.若來自於 Top.js 本身，將該 todo 資料移動到 DATA.default 的 all 物件中
 * 3.移動過去之前，將 srcId、srcName 更改成屬於 all
 * 4.移動過去之後，該項 todo 將不再屬於 top，而是屬於 all 物件
 * @param {*} moveTodoObj 被取消置頂的 todo Object
 */
export function moveTopToAll(moveTodoObj) {
  // 取得 DATA 中的 top 物件後，過濾掉與 moveTodoObj
  const top = getPage("top");
  top.content = top.content.filter((todoObj) => todoObj !== moveTodoObj);
  // 將 srcId、srcName 做更改
  moveTodoObj.srcName = "全部";
  moveTodoObj.srcId = "all";
  // 取得 DATA.default 中的 all 物件，並將 moveTodoObj 放入 all 物件中的 content Array 中
  const all = getPage("all");
  all.content.unshift(moveTodoObj);
  // 取消置頂後及時更新頁面
  Router();
  // 儲存變更至 localStorage
  setStorage(DATA);
}

//@ 以下的函數會放到 changeTopByTodoItem 、changeTopByEditModal 兩個函數中，放置位置: 在取得到他們各自的 ID 、獲取到 todoObj 之後
export function pinTodo(todoId, todoObj) {
  // 取得該 todo 的原始 Array:
  const { srcId } = todoObj;
  const allPages = getAllPage();
  // 在所有頁面中尋找與 srcId 符合的頁面，找到之後，取得 content 屬性
  const currentTodoOriginPage =  allPages.find(({ id }) => id === srcId);
  const currentTodoArray = currentTodoOriginPage.content;
  // todo - 更該順序: 將點擊到的 todo 放到第一個，其餘的順序不更改
  // todo - 利用 todoId，將 currentTodoArray 做 filter， 過濾掉該項 todo
  // todo - 創建一個新的 []，使用 spread operator 放入置頂的元素跟剩下的元素
  console.log('old: ', currentTodoArray)
  const filteredArray = currentTodoArray.filter(({id}) => id !== todoId);
  const topTodo = currentTodoArray.find(({id}) => id === todoId);
  const newArr = [topTodo, ...filteredArray];

  console.log('newArr: ', newArr)

  currentTodoOriginPage.content = newArr;

  Router();
}
