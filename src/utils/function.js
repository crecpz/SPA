// import { scrollBarFix } from "../layout/main.js";
import {
  extractUnnamedNumber,
  listCounter,
  renderCustomList,
} from "../layout/nav.js";
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
 * 將所有頁面集合成一個 Array 並返回。
 * @returns
 */
export function getAllPage() {
  const allPage = [];
  for (let pageType in DATA) {
    allPage.push(...DATA[pageType]);
  }
  return allPage;
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
export function getCurrentPage() {
  const allPages = getAllPage();
  const result = allPages.find((i) => i.id === getCurrentPageId());
  if (result) return result;
}

/**
 * 取得當前所在 custom 頁面的資料。
 * 注意: 此函數是指定在 DATA.custom 內尋找"內部元素的"的 ID。
 * @returns 目前所在的 custom 頁面的資料(`Object`)
 */
// export function getCurrentCustomPage() {
//   return DATA.custom.find((i) => i.id === getCurrentPageId());
// }

/**
 * 透過 id 名稱，搜尋當前觸發的 todo 在 DATA 中的資料。
 * @param {*} e 事件
 * @returns 返回 todo 物件
 */
export function getCurrentTodo(e) {
  // 取得事件觸發 todo 的 id
  const currentTodoId = e.target.closest(".todo__item").id;

  // 取得當前頁面物件資料
  const currentPage = getCurrentPage();

  // 先從當前頁面資料取得當前 todo
  const currentTodoObj = currentPage.content.find(
    (todoItem) => todoItem.id === currentTodoId
  );

  // 如果在當前頁面資料當中已找到 todo Object ，則返回。
  if (currentTodoObj) return currentTodoObj;

  // 如果找不到(undefined)，要往其他頁面去尋找:
  const allPages = getAllPage();
  return allPages
    .filter(({ id }) => id !== currentPage.id) // 過濾掉當前頁面物件資料
    .map(({ content }) => content) // 取得 content 屬性
    .reduce((acc, cur) => acc.concat(cur), []) // 攤平
    .find(({ id }) => id === currentTodoId); // 找出 todo Object
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
  return number < 10 && number > 0 ? "0" + number : String(number);
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
      DATA.default.find((i) => i.id === currentPageId).content.push(todo);
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
export function editName() {
  const editTarget = document.querySelector(".main__name");
  editTarget.removeAttribute("readonly");
  editTarget.select();
}

/**
 * 儲存已經改動的清單名稱
 * @param {*} e
 */
export function saveEditedName(e) {
  // 取得 input
  const editTarget = e.target;

  // 如果輸入的內容為空，則替此內容新增內容
  if (editTarget.value.trim() === "") {
    // 獲取現有清單
    const allCustomListName = DATA.custom.map((i) => i.name);
    // 提取清單尾數。
    // 提取的清單尾數為空，則在陣列內給予其初始值 1 並返回
    // (因為如果初始值是 1 ，在後續的計算中，下一個順位將會是 0)
    const extractNumberList =
      extractUnnamedNumber(allCustomListName).length === 0
        ? [1]
        : extractUnnamedNumber(allCustomListName);

    // 得出最新的數字
    const newNumber = listCounter(extractNumberList);

    // 給予目前的清單新名稱
    editTarget.value = `未命名清單${newNumber === 0 ? "" : `(${newNumber})`}`;
  }

  // 更新 DATA 中的資料
  const inputValue = e.target.value;
  const currentPage = getCurrentPage();
  currentPage.name = inputValue;

  // 更新該頁中的 todo obj 內的 srcName
  currentPage.content.forEach((todoObj) => (todoObj.srcName = inputValue));

  // 存入 localStorage
  setStorage(DATA);

  // 重新渲染新的名稱上去 nav
  renderCustomList();

  // input 設定回 readonly 屬性
  editTarget.setAttribute("readonly", "readonly");
}

console.log(
  DATA

)

export function updateTop(e){
  // 取得點擊的 todo 物件

  // 翻轉該 todo 物件的 "top" 屬性


  // 「 所有的 todo 在被取消掉都要前往到 all 嗎? No, 只有 srcId === top 的才要 」，所以: 
  // 直接指定要檢查的位置: 檢查 DATA.default --> top 資料 --> content --> 每一項todo
  // 如果有任何一項
}
