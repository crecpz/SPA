import {
  addTodo,
  DATA,
  getCurrentCustomPage,
  getCurrentPageId,
  getCurrentTodo,
  setStorage,
} from "../utils/function.js";
import { activeNavLists as activeNavLists, renderCustomList } from "./nav.js";

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

// 加上星號


/**
 * checkbox 功能
 * @param {*} e event
 */
export function checkbox(e) {
  // checkbox
  if (e.target.classList.contains("todo__checkbox")) {
    // 取得當前 todo
    const currentTodo = getCurrentTodo(e);
    // 反轉 checked 值
    currentTodo.checked = !currentTodo.checked;
    // 存進 localStorage
    setStorage(DATA);
  }
}