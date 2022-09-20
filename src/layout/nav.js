import { modeSwitcher } from "../utils/mode.js";
import { createUniqueId, getStorage, setStorage } from "../utils/function.js";
import { DATA } from "../utils/function.js";

const navContent = document.querySelector(".nav__content");

/**
 * 渲染 customList 至頁面中
 */
export function renderCustomList() {

  const currentPageId = getCurrentPageId();

  let lists = DATA.custom.map(list => {
    return `<li id="${list.id}" 
                class="custom-list__item nav__list-item 
                        ${list.id === currentPageId 
                            ? "nav__list-item--active" 
                            : null
                        }"
                >
              <a class="nav__list-link nav__list-link--custom-list" 
                  href="#/customlist/${list.id}">
                  <div class="custom-list__color"></div>
                  ${list.name}
              </a>
            </li>`;
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
document.querySelectorAll(".nav__list").forEach((i) => {
  i.addEventListener("click", (e) => {
    if (e.target.classList.contains("nav__list-link")) {
      // 清除在選單上的 active
      removeNavActive();
      // 更新 active
      e.target.closest("li").classList.add("nav__list-item--active");
    }
  });
});

/**
 * 接收一個 Array 作為參數，該 Array 包含所有目前的 「未命名清單」。
 * 提取出所有「未命名清單」後的數字，並將數字排序後並返回一個數字陣列
 * @param {*} listArr 所有「未命名清單」陣列
 * @returns 返回一個經過大小排序的數字陣列。
 */
function extractUnnamedNumber(listArr) {
  return (
    listArr
      // 匹配開頭為「未命名清單(X)」及頭尾名為 「未命名清單」的元素
      .filter((list) => /^未命名清單(?=\(\d+\)$)|^未命名清單$/.test(list))
      .map((list) => {
        // 取出數字部分 (如果遇到「未命名清單」純文字，將其設為 0)
        if (list.match(/\d+/)) {
          return Number(list.match(/\d+/)[0]);
        } else if (list.match(/\d+/) === null && list === "未命名清單") {
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
 * @param {*} numList
 * @returns 返回應一個數字，該數字為「未命名清單」編號的最新順位。
 */
function listCounter(numList) {
  // 過濾掉 arr 內空無一物的狀況
  if (numList.length === 0) {
    return; // 這個 undefined 後續必續用它來判斷文字後是否要加數字
  }

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
 * 此函數代表整個 customList 從新建並儲存到渲染的動作。
 * @param {*} e
 */
function addCustomList() {
  setCustomList();

  // 將頁面導向(directed)到當前最新新增的頁
  window.location.hash = `/customlist/${DATA.custom[DATA.custom.length - 1].id}`;

  // 清除在選單上的 active
  removeNavActive();

  renderCustomList();
}


/**
 * 這麼做雖然可以讓頁面在刷新時能夠根據目前網址來為對應的頁面加上 active，
 * 但是在頁面被刪除時，如果沒有做好預備措施會產生問題。
 * 
 * 問題就出在頁面刪除之後，如果沒有更改網址列的話，
 * 接著如果原地刷新，此函數將會根據網址列內的值獲取 id。
 * 但是這個 id 所在的頁面已經不存在了，將會找不到這個頁面。
 * 
 * 目前還未新增頁面刪除功能，之所以會發現這個問題是因為我刪除 localStorage
 * 接著刷新，頁面就找不到了。 報錯原因是函數內的 navContent.querySelector(`#${currentPageId}`).classList.add('nav__list-item--active')
 * 這段是獲取到 null ， 而我在 null 嘗試加上 classList.add 所致。
 * 
* 之後新增刪除功能之後，必須想好刪除頁面之後的方案，最好是改變網址列到某一個順位。
 */

/**
 * 取得網址列中的 hash，並利用 RegExp 過濾出網址列最後面的值，該值即為該頁面的 id。
 * @returns id 字符串
 */
function getCurrentPageId(){
  const hash = window.location.hash;
  const currentPageId = hash.match(/[a-z0-9]*$/)[0] === '' 
  ? 'home' 
  : hash.match(/[a-z0-9]*$/)[0];
  return currentPageId;
}

/**
 * 將新的自訂清單加入到 DATA
 */
function setCustomList() {
  // 獲取現有清單 
  // (目前讓未命名清單出現 undefined 的原因，沒記錯的話是因為我的清單
  // 是根據上一位的尾數，而我在沒有任何清單的情況下，就沒辦法基於上一個
  // 清單來判斷我目前的清單，所以會出現 undefined)
  const allCustomListName = DATA.custom.map((i) => i.name);
  const extractNumberList = extractUnnamedNumber(allCustomListName).length === 0
    ? [1]
    : extractUnnamedNumber(allCustomListName);
  const newNumber = listCounter(extractNumberList);

  DATA.custom.push({
    id: createUniqueId(),
    name: `未命名清單(${newNumber})`,
    color: "",
    content: [
      // ↓ 示意格式
      // {
      //   checked: false,
      //   content: "this is todo A.",
      //   pin: false,
      // },
    ],
  });

  // 存至 localStorage
  setStorage(DATA);
}

/**
 * 先取得目前所在頁面的 id，
 * 接著再使用此 id 來尋找在 nav 中與此 id 匹配的項目，
 * 最後將其加上 active 的 class。
 * 
 * 主要用途是在網頁載入的時候在目前所在的頁面加上 active。
 * 防止使用者原地 F5 之後 active 消失的問題。
 */
 export function activeWhenLoad(){
  const id = getCurrentPageId();
  const activeTarget = navContent.querySelector(`#${id}`);
  activeTarget.classList.add('nav__list-item--active');
}




const wrapper = document.querySelector(".wrapper");
wrapper.addEventListener("click", (e) => {
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
