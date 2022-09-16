import { modeSwitcher } from "../utils/mode.js";
import { createUniqueId, getStorage, setStorage } from "../utils/function.js";
import { DATA } from "../utils/function.js";


/**
 * 渲染 customList 至頁面中
 */
export function renderCustomList(){
  let lists = DATA.custom.map((list) => {
    return `<li id="${list.id}" class="custom-list__item nav__list-item">
              <a class="nav__list-link nav__list-link--custom-list" href="#/customlist/${list.id}">
                  <div class="custom-list__color"></div>
                  ${list.name}
              </a>
            </li>`;
  });
  customList.innerHTML = lists.join('');
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
document.querySelectorAll(".nav__list").forEach((i) => {
  i.addEventListener("click", (e) => {
    if (e.target.classList.contains("nav__list-link")) {
      // 清除在選單上的 active
      document
        .querySelectorAll(".nav__list-item")
        .forEach((i) => i.classList.remove("nav__list-item--active"));
      // 更新 active
      e.target.closest("li").classList.add("nav__list-item--active");
    }
  });
});

/**
 * 提取「未命名清單」後面的數字
 */
function extractUnnamedNumber(){
  const unnameLists = DATA.custom.filter(list => /^未命名清單\(\d*\)$/.test(list))
  // const unnameLists = DATA.custom.map(list => list.name)
  // console.log(unnameLists)

}

extractUnnamedNumber();

// console.log(/^未命名清單\(\d*\)$/.test('未命名清單(2)'))
const fakeList = ['未命名清單(1)','未命名清單(23)','工作', '出遊(1)','未命名清單(9)','未命名清單(45)','未命名清單(4)','未命名清單(A)'];
/* 將 list 中名為 「未命名清單(x)」 的元素找出來， 
  提取出每一項元素中的數字部分，最後轉換成 Number，進行排序。
  所以 unnamedNumber 內的值現在是一個經過排序的數字陣列。  
*/
const unnamedNumber = fakeList
  .filter(list => /^未命名清單\(\d*\)$/.test(list))
  .map(list => Number(list.match(/\d+/)[0]))
  .sort((a, b) => a - b);


// console.log(unnamedNumber)



/**
 * 計算目前最新的未命名清單後的編號應該為多少。
 * 此函數接收一個 `Array` 作為參數，該 Array 必須包含目前所有的未命名清單的編號。
 * @param {*} arr 
 * @returns 返回應該新增在「未命名清單」後的內容，且是 `String`。
 */
function listCounter(arr) {
  // 過濾掉 arr 內空無一物的狀況
  if(arr.length === 0) {
    return '';
  }

  // 其實就是求一個 Array 中的最小數而已 嗎? 沒那麼簡單，還牽涉到缺口
  // 要逐一找出哪一個數字是缺口， forLoop 應該是一個好選擇
  let min = 0;
  return arr.find(i => i > min)
}

// 如果是空 Array ?
// console.log(listCounter([]))

// 如果是只有 1 個元素 ?
console.log(listCounter([0,1,3]))

// 如果有3個元素，需要在最後一個元素新增新的數字?




// 頁面完全載入後，根據 currentPageInfo.pageId 為何來決定哪個 item 要被 active。
// *註: 使用 `load` 是因為使用 DOMContentLoaded 會讀取不到後續才渲染的 customList
window.addEventListener("load", navListItemActive);

function navListItemActive(){
  const navListItems = document.querySelectorAll(".nav__list-item");
  
  // 比對目前現有 navListItem 是否有任何一個元素的 id 跟 currentPageInfo.pageId 相同，
  // 並將其存進 activedItem 變量中
  let activedItem = Array.from(navListItems)
                      .find(item => {
                        return item.id === DATA.currentPageInfo.pageId
                      });

  // 刪除所有現有 active，並將 activedItem 加上 active
  navListItems.forEach((i) => i.classList.remove("nav__list-item--active"));
  activedItem.classList.add("nav__list-item--active");
}




// --------------------------[ 新增自訂列表 ]--------------------------

const addBtn = document.querySelector("#add-list-btn");
const customList = document.querySelector(".custom-list");


addBtn.addEventListener("click", addCustomList);

/**
 * 此函數代表整個 customList 從新建並儲存到渲染的動作。
 * 會先使用 `setCustomList()` 將新的自訂清單加入到 DATA，
 * 接著使用 `renderCustomList()` 渲染 customList 至頁面中。
 * @param {*} e 
 */
function addCustomList() {
  setCustomList();
  renderCustomList();
}

/**
 * 將新的自訂清單加入到 DATA
 */
function setCustomList(){
  DATA.custom.push({
      id: createUniqueId(),
      name: "未命名清單",
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
  setStorage(DATA)
}

// function 




// --------------------------[ 監聽當前點擊頁面 ]--------------------------

const navContent = document.querySelector(".nav__content");


// 設定在 DATA 中的 currentPageInfo.pageId
navContent.addEventListener('click', setCurrentPageId);

// 設定在 DATA 中的 currentPageInfo.path
window.addEventListener('hashchange', setCurrentPath);

/**
 * 設定在 DATA 中的 currentPageInfo.pageId
 * @param {*} e 
 */
export function setCurrentPageId(e){
  if(e.target.classList.contains('nav__list-link')){
    const currentPageId = e.target.closest('li').id;
    DATA.currentPageInfo.pageId = currentPageId;
  }
}

/**
 * 設定在 DATA 中的 currentPageInfo.path
 * @param {*} e 
 */
export function setCurrentPath(){
  const currentPath = location.hash.slice(1).toLowerCase();  
  DATA.currentPageInfo.path = currentPath;
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