/**
 * * 修正 mobile 100vh 的問題
 */
export function appHeight() {
  const doc = document.documentElement;
  doc.style.setProperty("--app-height", `${window.innerHeight}px`);
}

/**
 * * 使 scrollBar 不佔據任何空間但保有滾動條樣式與滾動的功能。
 * @param {*} DOMElement 接收一個 css 選擇器作為參數，且該元素必須是要有滾動條
 */
export function scrollBarFix(DOMElement) {
  const scrollBarElement = document.querySelector(DOMElement);
  scrollBarElement.style.paddingRight =
    scrollBarElement.offsetWidth - scrollBarElement.clientWidth
      ? scrollBarElement.offsetWidth - scrollBarElement.clientWidth + "px"
      : "";
}

/**
 * * 取得所有 customList 的 DOM > 設定 customList 的最大寬度 > 一旦超出就將文字省略
 */
export function navCustomListTextOverflow() {
  const customLists = document.querySelectorAll(".custom-list__name");
  customLists.forEach((customList) => {
    if (!(window.innerWidth >= 576)) {
      customList.style.width = window.innerWidth - 125 + "px";
    } else {
      customList.style.width = "";
      // 視窗 >= 576 時，customList 不再使用 inline-style 設定寬度，而是設定在 _nav.scss 中的 .custom-list__name
    }
  });
}