import { DATA, setStorage } from "./storage.js";

// *從 DATA 中找尋光線模式，如果沒有找到，則預設為使用者裝置上的設定
let currentMode = DATA.mode || getPrefersColorScheme();

/**
 * * 檢查目前使用者系統設定的主題模式是 'light' 還是 'dark'。
 * @returns 返回String 'light' 或 'dark'
 */
export function getPrefersColorScheme() {
  let theme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  return theme;
}

/**
 * * 刪除html既有的'light' 或 'dark' class，並更新現有的主題色。
 */
export function updateMode() {
  document.documentElement.classList.remove("light");
  document.documentElement.classList.remove("dark");
  document.documentElement.classList.add(currentMode);
}

/**
 * * 在使用者按下光線模式切換鈕時，切換光線模式
 */
export function modeSwitcher() {
  // 旋轉光線模式鈕
  const modeBtn = document.getElementById("mode-btn");
  modeBtn.classList.toggle("mode-btn--change");
  // 將目前最新的顏色存入 currentMode 變量中
  currentMode = currentMode === "light" ? "dark" : "light";
  // 刪除html既有的'light' 或 'dark' class，並更新現有的主題色。
  updateMode();
  // 將使用者設定的顏存至 DATA 中(下次開啟的時候，就不再是依據使用者裝置的光線模式了)
  DATA.mode = currentMode;
  setStorage(DATA);
}
