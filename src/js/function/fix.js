
/**
 * * 修正 mobile 100vh 的問題
 */
export function appHeight() {
  const doc = document.documentElement;
  doc.style.setProperty("--app-height", `${window.innerHeight}px`);
}

// /**
//  * * 使 scrollBar 不佔據任何空間但保有滾動條樣式與滾動的功能。
//  */
export function scrollBarFix() {
  const mainContentList = document.querySelector(".main__content-list");
  mainContentList.style.paddingRight =
    mainContentList.offsetWidth - mainContentList.clientWidth
      ? mainContentList.offsetWidth - mainContentList.clientWidth + "px"
      : "";
}
