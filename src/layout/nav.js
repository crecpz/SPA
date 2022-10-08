import { modeSwitcher } from "../utils/mode.js";
import { createUniqueId, setStorage } from "../utils/function.js";
import { DATA, getCurrentPageId } from "../utils/function.js";
import { editName } from "./main.js";

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
 * 渲染 customList 至 nav 中
 */
export function renderCustomList() {
  const currentPageId = getCurrentPageId();
  let lists = DATA.custom.map((list) => {
    return `
      <li id="${list.id}" 
          class="custom-list__item nav__list-item 
                ${list.id === currentPageId ? "nav__list-item--active" : null}"
          >
          <a class="nav__list-link nav__list-link--custom-list" 
              href="#/customlist/${list.id}">
              <div class="custom-list__color"></div>
              ${list.name}
          </a>
      </li>
    `;
  });
  customList.innerHTML = lists.join("");
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

/**
 * 清除在 nav內選單的 active
 */
function removeNavActive() {
  navContent
    .querySelectorAll(".nav__list-item")
    .forEach((i) => i.classList.remove("nav__list-item--active"));
}

// nav 中所有的選單點擊切換行為
document.querySelectorAll(".nav__list").forEach((navList) => {
  navList.addEventListener("click", (e) => {
    if (e.target.classList.contains("nav__list-link")) {
      // 清除在選單上的 active
      removeNavActive();

      // 更新 active
      e.target.closest("li").classList.add("nav__list-item--active");

      // 如果目前螢幕的寬度 < 576px 點擊任一清單就把清單收合
      const smallerThan576 = window.matchMedia("(max-width: 576px)");

      // If media query matches
      if (smallerThan576.matches) {
        navSwitcher();
      }
    }
  });
});

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
 * 接收一個 Array 作為參數，該 Array 包含所有目前的 「未命名清單」。
 *
 * ex: `[ "未命名清單", "未命名清單(1)", "未命名清單(4)" ]`
 *
 * 提取出所有「未命名清單」後的數字，並將數字排序後並返回一個數字陣列
 * @param {*} listArr 所有「未命名清單」陣列
 * @returns 返回一個經過大小排序的數字陣列。
 */
export function extractUnnamedNumber(listArr) {
  return (
    listArr
      // 匹配開頭為「未命名清單(X)」及頭尾名為 「未命名清單」的元素
      .filter((list) => /^未命名清單(?=\(\d+\)$)|^未命名清單$/.test(list))
      .map((list) => {
        // 取出數字部分
        if (list.match(/\d+/)) {
          return Number(list.match(/\d+/)[0]);
        } else if (list.match(/\d+/) === null && list === "未命名清單") {
          // 如果遇到「未命名清單」純文字，將其設為 0
          return 0;
        }
      })
      // 排序
      .sort((a, b) => a - b)
  );
}

/**
 * 計算目前最新的未命名清單後的編號應該為多少。
 * 此函數接收一個 `Array` 作為參數，該 Array 必須包含目前所有的未命名清單的編號。
 * ex: `[1, 3, 5]`
 * @param {*} numList
 * @returns 返回應一個數字，該數字即為「未命名清單」編號的最新順位。
 */
export function listCounter(numList) {
  let i = 0;
  while (true) {
    if (numList.indexOf(i) === -1) {
      break;
    }
    i++;
  }
  return i;
}

// --------------------------[ 新增自訂列表 ]--------------------------

const addBtn = document.querySelector("#add-list-btn");
const customList = document.querySelector(".custom-list");

addBtn.addEventListener("click", addCustomList);

/**
 * * 此函數包含整個 customList 從新建、儲存 storage 、渲染的動作。
 * @param {*} e
 */
function addCustomList() {
  // 將新的自訂清單加入到 DATA
  setCustomList();

  // 如果目前螢幕的寬度 < 1024px，讓 「新增自訂清單」 按紐被點擊時收起 nav
  // 防止 nav 遮蓋到頁面名稱而不知道要命名
  const smallerThan1024 = window.matchMedia("(max-width: 1024px)");
  if (smallerThan1024.matches) {
    navSwitcher();
  }

  // 將頁面導向到當前最新新增的頁
  window.location.hash = `/customlist/${
    DATA.custom[DATA.custom.length - 1].id
  }`;

  // 清除在選單上的 active
  removeNavActive();

  // 渲染 customList 至 nav 中
  renderCustomList();

  setTimeout(() => {
    editName();
  }, 300);
}


/**
 * 將新的自訂清單加入到 DATA
 */
function setCustomList() {
  // 獲取現有清單
  const allCustomListName = DATA.custom.map((i) => i.name);
  // 提取清單尾數。
  // 提取的清單尾數為空，則在陣列內給予其初始值 1 並返回
  // (因為如果初始值是 1 ，在後續的計算中，下一個順位將會是 0)
  const extractNumberList =
    extractUnnamedNumber(allCustomListName).length === 0
      ? [1]
      : extractUnnamedNumber(allCustomListName);
  // 得出最新的數字
  const newNumber = listCounter(extractNumberList);

  // 在 DATA 中新增新的 nav 資料
  DATA.custom.push({
    id: createUniqueId(),
    // 如果新的數字是 0，則後面加個空字串
    name: `未命名清單${newNumber === 0 ? "" : `(${newNumber})`}`,
    color: "",
    content: [],
  });

  // 存至 localStorage
  setStorage(DATA);
}
