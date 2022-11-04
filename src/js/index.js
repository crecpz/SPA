import { updateMode } from "./function/mode.js";
import {
  activeNavLists,
  hideTodoForm,
  loader,
  renderCustomList,
  switchSearchPageUI,
} from "./function/ui.js";
import { Router } from "./routes/Router.js";
import { appHeight, navCustomListTextOverflow } from "./function/fix.js";
import { switchNotFoundState } from "./function/helper.js";

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

// 在載入時或 hashchange 時切換 search 的 UI
window.addEventListener("DOMContentLoaded", switchSearchPageUI);
window.addEventListener("hashchange", switchSearchPageUI);

// 處理 nav 中 customList 名稱過長時的字數省略
window.addEventListener("resize", navCustomListTextOverflow);
window.addEventListener("DOMContentLoaded", navCustomListTextOverflow);

// 在 hashchange 時改變 nav 的 active
window.addEventListener("hashchange", activeNavLists);

// loader 動畫
window.addEventListener("DOMContentLoaded", loader);