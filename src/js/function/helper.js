import { DATA } from "../function/storage.js";

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
  const allPages = getAllPage();
  return allPages
    .map(({ content }) => content) // 取得 content 屬性
    .reduce((acc, cur) => acc.concat(cur), []) // 攤平
    .find(({ id }) => id === currentTodoId); // 找出 todo Object

  //! --------------- 以下原版(上面應該更簡便，不先在當前頁面找了，而是全部都找) -------
  // // 取得當前頁面物件資料
  // const currentPage = getCurrentPage();

  // // 先從當前頁面資料取得當前 todo
  // const currentTodoObj = currentPage.content.find(
  //   (todoItem) => todoItem.id === currentTodoId
  // );

  // // 如果在當前頁面資料當中已找到 todo Object ，則返回該 todo Object
  // if (currentTodoObj) return currentTodoObj;

  // // 如果找不到(undefined)，要往其他頁面資料去尋找:
  // const allPages = getAllPage();
  // return allPages
  //   .filter(({ id }) => id !== currentPage.id) // 過濾掉當前頁面物件資料
  //   .map(({ content }) => content) // 取得 content 屬性
  //   .reduce((acc, cur) => acc.concat(cur), []) // 攤平
  //   .find(({ id }) => id === currentTodoId); // 找出 todo Object
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
 * 接收一個 Array 作為參數，該 Array 包含所有目前的 「未命名列表」。
 *
 * ex: `[ "未命名列表", "未命名列表(1)", "未命名列表(4)" ]`
 *
 * 提取出所有「未命名列表」後的數字，並將數字排序後並返回一個數字陣列
 * @param {*} listArr 所有「未命名列表」陣列
 * @returns 返回一個經過大小排序的數字陣列。
 */
export function extractUnnamedNumber(listArr) {
  return (
    listArr
      // 匹配開頭為「未命名列表(X)」及頭尾名為 「未命名列表」的元素
      .filter((list) => /^未命名列表(?=\(\d+\)$)|^未命名列表$/.test(list))
      .map((list) => {
        // 取出數字部分
        if (list.match(/\d+/)) {
          return Number(list.match(/\d+/)[0]);
        } else if (list.match(/\d+/) === null && list === "未命名列表") {
          // 如果遇到「未命名列表」純文字，將其設為 0
          return 0;
        }
      })
      // 排序
      .sort((a, b) => a - b)
  );
}

/**
 * 計算目前最新的未命名列表後的編號應該為多少。
 * 此函數接收一個 `Array` 作為參數，該 Array 必須包含目前所有的未命名列表的編號。
 * ex: `[1, 3, 5]`
 * @param {*} numList
 * @returns 返回應一個數字，該數字即為「未命名列表」編號的最新順位。
 */
export function listCounter(numList) {
  let i = 0;
  while (true) {
    if (numList.indexOf(i) === -1) {
      break;
    }
    i++;
  }
  return i;
}

/**
 * * 根據現有的未命名列表，產生最新的列表名稱，例如: 未命名列表(2)。
 * @returns "未命名列表" + (一個數字)
 */
export function createNewListName() {
  // 獲取現有列表
  const allCustomListName = DATA.custom.map((i) => i.name);
  // 提取列表尾數。
  // 提取的列表尾數為空，則在陣列內給予其初始值 1 並返回
  // (因為如果初始值是 1 ，在後續的計算中，下一個順位將會是 0)
  const extractNumberList =
    extractUnnamedNumber(allCustomListName).length === 0
      ? [1]
      : extractUnnamedNumber(allCustomListName);
  // 得出最新的數字
  const newNumber = listCounter(extractNumberList);
  // 如果新的數字是 0，則後面加個空字串
  return `未命名列表${newNumber === 0 ? "" : `(${newNumber})`}`;
}

/**
 * * 取得並返回特定 css 變量名稱內的值
 * @param {*} cssVar css 變量名稱 (string)
 * @returns 返回該變量內的值
 */
export function getCssVarValue(cssVar) {
  const root = document.querySelector(":root");
  const rootComputedStyle = getComputedStyle(root);
  const varValue = rootComputedStyle.getPropertyValue(cssVar);
  return varValue;
}

// const color = '1';
// console.log(getCssVarValue(`--color-type-${color}`))
