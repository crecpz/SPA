
/**
 * * 修正 mobile 100vh 的問題
 */
export function appHeight() {
  const doc = document.documentElement;
  doc.style.setProperty("--app-height", `${window.innerHeight}px`);
}

// * 使 scrollBar 不佔據任何空間但保有滾動條樣式與滾動的功能。
export function scrollBarFix() {
  const mainContentList = document.querySelector(".main__content-list");
  mainContentList.style.paddingRight =
    mainContentList.offsetWidth - mainContentList.clientWidth
      ? mainContentList.offsetWidth - mainContentList.clientWidth + "px"
      : "";
}

/**
 * * 取得所有 customList 的 DOM > 設定 customList 的最大寬度 > 一旦超出就將文字省略
 */
export function navCustomListTextOverflow(){
  const customLists = document.querySelectorAll(".custom-list__name");
  customLists.forEach((customList) => {
    if (!(window.innerWidth >= 576)) {
      customList.style.width = window.innerWidth - 125 + "px";
    } else {
      // 並非沒有設定寬度，而是 >= 576 的寬度已被設定在 _nav.scss 中的 .custom-list__name
      customList.style.width = "";
    }
  });
}