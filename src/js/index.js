import { updateMode } from "./function/mode.js";
import { activeNavLists, renderCustomList } from "./function/ui.js";
import { Router } from "./routes/Router.js";
import { appHeight } from "./function/fix.js";
import { NotFound } from "./pages/NotFound.js";
import { Home } from "./pages/Home.js";
import {
  getCurrentPageId,
  pageIsNotExist,
  switchNotFoundState,
} from "./function/helper.js";

// 監聽 hash 變化 & 加載完畢事件
window.addEventListener("hashchange", Router);
window.addEventListener("load", Router);

// 監聽 DOM 載入完畢，並更新光線模式
window.addEventListener("DOMContentLoaded", updateMode);

// 監聽使用者系統光線模式是否被改變
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", updateMode);

// 初次載入從資料中渲染出 customList
window.addEventListener("DOMContentLoaded", renderCustomList);

// 初次載入時將 Nav 中相對應的頁面套用 active
window.addEventListener("load", activeNavLists);

// 解決手機瀏覽器無法剛好只占滿整版的問題
window.addEventListener("resize", appHeight);
window.addEventListener("DOMContentLoaded", appHeight);

// 切換 NotFound.js 中的 isNotFound 狀態
window.addEventListener("hashchange", switchNotFoundState);

// 於 home 的 grid-view 狀態隱藏 todoForm
window.addEventListener("DOMContentLoaded", hideTodoForm);
window.addEventListener("hashchange", hideTodoForm);
/**
 * * 當目前頁面是總覽且當前 view 是 grid-view 時，不需要顯示 .todo-form。
 * 預設是先將 .todo-form 加上 .hidden class (display: none)，可以顯示時才將 .hidden class remove
 */
export function hideTodoForm() {
  if (
    (location.hash === "#/" && Home.state.view === "grid-view") ||
    pageIsNotExist() ||
    location.hash === "#/search"
  ) {
    document.querySelector(".todo-form").classList.add("hidden");
  } else {
    document.querySelector(".todo-form").classList.remove("hidden");
  }
}
