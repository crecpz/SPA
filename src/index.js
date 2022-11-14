import "./scss/style.scss";
import { updateMode } from "./js/function/mode.js";
import {
  activeNavLists,
  loader,
  renderCustomList,
  switchSearchPageUI,
} from "./js/function/ui.js";
import { Router } from "./js/routes/Router.js";
import { appHeight, navCustomListTextOverflow } from "./js/function/fix.js";
import { switchNotFoundState } from "./js/function/helper.js";

// 監聽 hash 變化 & 加載完畢事件
window.addEventListener("hashchange", Router);
window.addEventListener("load", Router);

// 更新光線模式
updateMode();

// 從資料中渲染出 customList
renderCustomList();

// 監聽使用者系統光線模式是否被改變
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", updateMode);

// 將 Nav 中相對應的頁面套用 active
activeNavLists();

// 解決手機瀏覽器無法剛好只占滿整版的問題
window.addEventListener("resize", appHeight);
appHeight();

// 切換 NotFound.js 中的 isNotFound 狀態
window.addEventListener("hashchange", switchNotFoundState);

// 在載入時或 hashchange 時切換 search 的 UI
switchSearchPageUI();
window.addEventListener("hashchange", switchSearchPageUI);

// 處理 nav 中 customList 名稱過長時的字數省略
navCustomListTextOverflow();
window.addEventListener("resize", navCustomListTextOverflow);

// 在 hashchange 時改變 nav 的 active
window.addEventListener("hashchange", activeNavLists);

// loader 動畫
loader();