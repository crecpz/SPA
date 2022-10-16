import { Home } from "../pages/Home.js";
import { NotFound } from "../pages/NotFound.js";

/**
 * * 修正 mobile 100vh 的問題
 */
export function appHeight() {
  const doc = document.documentElement;
  doc.style.setProperty("--app-height", `${window.innerHeight}px`);
}

/**
 * * 使 scrollBar 不佔據任何空間但保有滾動條樣式與滾動的功能。
 */
export function scrollBarFix() {
  const mainContentList = document.querySelector(".main__content-list");
  mainContentList.style.paddingRight =
    mainContentList.offsetWidth - mainContentList.clientWidth
      ? mainContentList.offsetWidth - mainContentList.clientWidth + "px"
      : "";
}


/**
 * * 當目前頁面是總覽且當前 view 是 grid-view 時，不需要顯示 .todo-form。
 * 預設是先將 .todo-form 加上 .hidden class (display: none)，可以顯示時才將 .hidden class remove
 */
export function hideTodoForm(){
  if (location.hash === "#/" && Home.state.view === "grid-view" || NotFound.state.isNotFount) {
    document.querySelector('.todo-form').classList.add('hidden');
  } else {
    document.querySelector('.todo-form').classList.remove('hidden');
  }
}
