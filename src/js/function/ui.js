
import { getCurrentPage, getCurrentPageId } from "./helper.js";
import { listAdding, listIsAdding } from "./modal.js";
import { modeSwitcher } from "./mode.js";
import { DATA, setTodo } from "./storage.js";


// nav 中存放 custom 的容器
const customList = document.querySelector(".custom-list");
/**
 * 渲染 customList 至 nav 中
 */
export function renderCustomList() {
  const currentPageId = getCurrentPageId();
  let lists = DATA.custom
    .map(({ id, name, color }) => {
      return `
      <li id="${id}" 
          class="custom-list__item nav__list-item 
                ${id === currentPageId ? "nav__list-item--active" : null}"
      >
          <a class="nav__list-link nav__list-link--custom-list" 
              href="#/customlist/${id}">
              <div class="custom-list__color color-block color-block-${color}"></div>
              ${name}
          </a>
      </li>
    `;
    })
    .join("");
  customList.innerHTML = lists;
}

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

/**
 * 控制 dropdown 展開與收合
 */
export function dropdownSwitch(e) {
  const dropdownCover = e.target.nextElementSibling;
  const todos = dropdownCover.children[0];
  const dropdownArrow = e.target.querySelector(".dropdown__arrow");

  dropdownCover.style.height = `${todos.clientHeight}px`;

  if (dropdownCover.clientHeight) {
    dropdownCover.style.height = `${0}px`;
    dropdownArrow.classList.add("dropdown__arrow--closing");
  } else {
    dropdownCover.style.height = `${todos.clientHeight}px`;
    dropdownArrow.classList.remove("dropdown__arrow--closing");
  }
}

// 監聽 todo submit 按鈕
document.querySelector("#todo-submit").addEventListener("click", setTodo);

// 監聽新增自訂列表按鈕
const addBtn = document.querySelector("#add-list-btn");
addBtn.addEventListener("click", listAdding);

const navContent = document.querySelector(".nav__content");

// 監聽整個頁面的 click 事件
document.querySelector(".wrapper").addEventListener("click", (e) => {
  // 光線模式切換
  modeSwitcher(e);

  // 點擊漢堡鈕來開啟 nav
  if (e.target.id === "main-hamburger" || e.target.id === "nav-hamburger") {
    navSwitcher();
  }

  // 如果點按 body-overlay 時 nav 是開啟的狀態，則調用 navSwitcher() 來關閉 nav
  if (
    e.target.classList.contains("body-overlay") &&
    document.querySelector("#wrapper").classList.contains("nav-open")
  ) {
    // 切換 nav 展開與收合
    navSwitcher();
  }
});

/**
 * 清除在 nav內選單的 active
 */
export function removeNavActive() {
  navContent
    .querySelectorAll(".nav__list-item")
    .forEach((i) => i.classList.remove("nav__list-item--active"));
}

/**
 * 先取得目前所在頁面的 id，
 * 接著再使用此 id 來尋找在 nav 中與此 id 匹配的項目，
 * 最後將其加上 active 的 class。
 */
export function activeNavLists() {
  const id = getCurrentPageId();
  const activeTarget = navContent.querySelector(`#${id}`);
  activeTarget.classList.add("nav__list-item--active");
}

/**
 * nav 側邊欄展開時所需套用的行為
 */
export function navSwitcher() {
  const wrapper = document.querySelector("#wrapper"),
    nav = document.querySelector("#nav"),
    main = document.querySelector("#main"),
    mainHeader = document.querySelector("#main__header");
  // 加上 nav-open class
  [wrapper, nav, main, mainHeader].forEach((elem) => {
    elem.classList.toggle("nav-open");
  });
}

// nav 中所有的選單點擊切換行為
document.querySelectorAll(".nav__list").forEach((navList) => {
  navList.addEventListener("click", (e) => {
    if (e.target.classList.contains("nav__list-link")) {
      // 清除在選單上的 active
      removeNavActive();

      // 更新 active
      e.target.closest("li").classList.add("nav__list-item--active");

      // 如果目前螢幕的寬度 < 576px 點擊任一列表就把列表收合
      const smallerThan576 = window.matchMedia("(max-width: 576px)");

      // If media query matches
      if (smallerThan576.matches) {
        navSwitcher();
      }
    }
  });
});
