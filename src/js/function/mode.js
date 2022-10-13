/**
 * 檢查目前使用者系統設定的主題模式是 'light' 還是 'dark'。
 * @returns 返回String 'light' 或 'dark'
 */
function getCurrentTheme() {
  let theme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  return theme;
}

/**
 * 刪除html既有的'light' 或 'dark' class，並更新現有的主題色。
 */
function updateMode() {
  document.documentElement.classList.remove("light");
  document.documentElement.classList.remove("dark");
  document.documentElement.classList.add(getCurrentTheme());
}

function modeSwitcher(e) {
  // light/dark 模式切換按鈕監聽
  const html = document.documentElement;
  if (e.target.id === "dark-mode-btn") {
    html.classList.add("dark");
    html.classList.remove("light");
  } else if (e.target.id === "light-mode-btn") {
    html.classList.remove("dark");
    html.classList.add("light");
  }
}

export { updateMode, modeSwitcher };

