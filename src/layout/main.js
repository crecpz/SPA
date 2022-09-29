import {
  addTodo,
  DATA,
  getCurrentCustomPage,
  setStorage,
} from "../utils/function.js";
import { activeNavLists, renderCustomList } from "./nav.js";

/**
 * 點擊 listOptionBtn 會調用此函數。
 * 此函數用於展開 listOption。
 */
export function openListOption(e) {
  // 控制 listOption 展開與收合
  if (e.target.classList.contains("btn--list-option")) {
    const listOptions = document.querySelector(".list-options");
    listOptions.classList.toggle("list-options--open");
  }
}

/**
 * 此函數功能為當 `listOption` 是開啟的狀態下偵測使用者點擊了什麼，
 * 只要 `listOptions` 是開啟的狀態下且點擊的不是 `listOptionBtn`，
 * 就將 `listOptionBtn` 調用一次 `click()`。(所以 `listOptionBtn` 會被關閉)
 * @param {*} e `event`
 */
export function clickToCloseListOption(e) {
  const listOptionBtn = document.querySelector(".btn--list-option");
  const listOptions = document.querySelector(".list-options");
  const listOptionsIsOpened =
    listOptions.classList.contains("list-options--open");
  const clickingListOptionBtn = e.target.classList.contains("btn--list-option");

  if (listOptionsIsOpened && !clickingListOptionBtn) {
    listOptionBtn.click();
  }
}

// 監聽 submit 按鈕
const todoSubmit = document.querySelector("#todo-submit");
todoSubmit.addEventListener("click", addTodo);

/**
 * 關鍵 modal 動作
 * 1.偵測使用者是否有點擊"刪除清單"的 showConfirmModal()
 * 2.偵測使用者是否有點擊"取消"的 closeConfirmModal()
 * 3.偵測使用者是否有點擊"刪除"的 removeList()
 */

/**
 * 偵測使用者是否有點擊 "刪除清單"
 */
export function openConfirmModal(e) {
  if (e.target.classList.contains("list-option__link--remove")) {
    const modalOverlay = document.querySelector(".modal-overlay");
    modalOverlay.classList.add("overlay--active");
  }
}

/**
 * 關閉清單
 */
export function closeModal(e) {
  if (e.target.classList.contains("btn--modal")) {
    const modalOverlay = document.querySelector(".modal-overlay");
    modalOverlay.classList.remove("overlay--active");
  }
}

/**
 * 刪除清單
 */
export function removeList(e) {
  if (e.target.id === "confirm-yes") {
    // 取得當前清單頁面的資料
    const currentPage = getCurrentCustomPage();

    // 存放接下來頁面的去向 (此處存放的是一段網址，)
    let pageWillGoTo;

    // 獲取當前頁面的前一個頁面，如果只有一個頁面，則前一個頁面指定為 '/top'
    if (!DATA.custom[DATA.custom.indexOf(currentPage) - 1]) {
      pageWillGoTo = "/top";

      window.location.hash = pageWillGoTo;
      activeNavLists();
    } else {
      // 找到當前頁面的前一頁的 id
      pageWillGoTo = DATA.custom[DATA.custom.indexOf(currentPage) - 1].id;
      window.location.hash = `/customlist/${pageWillGoTo}`;
    }

    // 刪除在 DATA 中該頁的資料
    DATA.custom = DATA.custom.filter((page) => page.id !== currentPage.id);

    // 重新渲染 nav 自訂清單的 UI
    renderCustomList();

    // 存到 localStorage
    setStorage(DATA);
  }
}


/**
 * 搜尋出自於該頁面本身的 todo
 */
function searchOriginTodo(todoId) {
  const isInAll = DATA.default[0].content.find(({ id, srcId }) => srcId === 'all' && id === todoId);
  if (isInAll) return isInAll;
  else {
    const allPageObj = [];
    for (let pageType in DATA) {
      allPageObj.push(...DATA[pageType]);
    }
    return allPageObj.filter(({ id }) => id !== 'all')
      .map(({ content }) => content)
      .reduce((acc, cur) => acc.concat(cur), [])
      .find(({ id }) => id === todoId);
  }
}


/**
 * checkbox 功能
 * @param {*} e event
 */
export function checkbox(e) {
  // checkbox
  if (e.target.classList.contains("todo__checkbox")) {
    // 取得 checkbox 事件觸發 todo 的 id
    const currentTodoId = e.target.closest(".todo__item").id;

    // 翻轉 checked 值
    searchOriginTodo(currentTodoId).checked = !searchOriginTodo(currentTodoId).checked;

    // 儲存變更
    setStorage(DATA);
  }
}

/**
 * 以往更新 checkbox 的值的方式是先透過 e.target.id 來找出:
 *  1.該 todo 的 id
 *  2.該事件觸發時的網址後段(id)，利用 id 找出相對於此網址的 DATA 資料，從資料中再根據
 *    todo id 找出該筆 todo
 * 接著反轉 checkbox 的值，並且更新至 localStorage。
 *
 * 但位於 All.js 的情況並非如此， All.js 的資料已經是從 DATA 中拉下來之後經過變造的次等資料。
 * 那些資料僅是為了呈現到 dropdown 所寫出來的資料。除了全部頁面親生的 todo 能儲存改變之外，
 * 其他的 todo 都沒辦法存入資料，因為變更的次等資料。
 *
 * 對於 all 頁面的 checkbox，應該要另想方設法，
 */


/**
 * 控制 dropdown 展開與收合
 */
export function dropdownSwitch(e) {
  const dropdownCover = e.target.nextElementSibling;
  const todos = dropdownCover.children[0];
  const dropdownArrow = e.target.children[0];
  dropdownCover.style.height = `${todos.clientHeight}px`

  if (dropdownCover.clientHeight) {
    dropdownCover.style.height = `${0}px`;
    dropdownArrow.classList.add('dropdown__arrow--closing');
  } else {
    dropdownCover.style.height = `${todos.clientHeight}px`;
    dropdownArrow.classList.remove('dropdown__arrow--closing');
  }
}

/**
 * 使 scrollBar 不佔據任何空間但保有滾動條樣式與滾動的功能。
 */
export function scrollBarFix() {
  const mainContentList = document.querySelector(".main__content-list");
  mainContentList.style.paddingRight =
    mainContentList.offsetWidth - mainContentList.clientWidth
      ? mainContentList.offsetWidth - mainContentList.clientWidth + "px"
      : "";
}
