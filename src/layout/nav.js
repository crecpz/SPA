import { modeSwitcher } from "../utils/mode.js";
import { createUniqueId, getStorage, setStorage } from "../utils/function.js";

// ---------------[ 全局監聽(不管在哪一個頁面都會使用到這些 nav 的監聽) ]---------------
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

/**
 * nav 展開時所需套用的行為
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

const navLists = document.querySelectorAll(".nav__list");
// nav 中所有的選單點擊切換行為
navLists.forEach((i) => {
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

// --------------------------[ 新增自訂列表 ]--------------------------

const addBtn = document.querySelector("#add-list-btn");
const customList = document.querySelector(".custom-list");


addBtn.addEventListener("click", addCustomList);

function addCustomList(e) {
  setCustomList();
  renderCustomList();
}

/**
 * 將新的自訂清單加入到 localStorage
 */
function setCustomList(){
  const data = getStorage();

  data.custom.push(
    {
      id: createUniqueId(),
      name: "未命名清單",
      color: "",
      content: [
        // {
        //   checked: false,
        //   content: "this is todo A.",
        //   pin: false,
        // },
      ],
    }
  );

  setStorage(data);
}

/**
 * 從 localStorage 取得已儲存的 customList，並渲染至頁面中
 */
export function renderCustomList(){
  const data = getStorage();
  let lists = data.custom.map((list) => {
    return `<li id="${list.id}" class="custom-list__item nav__list-item">
              <a class="nav__list-link nav__list-link--custom-list" href="#/customlist">
                  <div class="custom-list__color"></div>
                  ${list.name}
              </a>
            </li>`;
  });

  customList.innerHTML = lists.join('');
}


// --------------------------[ 監聽當前點擊頁面 ]--------------------------

const navContent = document.querySelector(".nav__content");




navContent.addEventListener('click', setCurrentPageInfo);
window.addEventListener('hashchange', setCurrentPath);

export const currentPageInfo = {
    // pageId: "",
    // path: "",
};


export function setCurrentPath(){
  const listPath = location.hash.slice(1).toLowerCase();
  currentPageInfo.path = listPath;
  console.log(currentPageInfo)
}

export function setCurrentPageInfo(e){
  if(e.target.classList.contains('nav__list-link')){
    const listId = e.target.closest('li').id;
    currentPageInfo.pageId = listId;
    console.log(currentPageInfo)
  }
}

// window.addEventListener('beforeunload', ()=> {
//   alert(1)
// })


export function getCurrentPageInfo(){
  const data = getStorage();
  return data.currentPageInfo;
}



// defaultList.addEventListener("click", getCurrentPageId);

// function getCurrentPageId(e) {
//   return (currentPageId = e.target.closest("li").id);
// }

// 此 currentPageId 將會傳送給各個 page 中，讓它用這個 id 去渲染相對應的內容
// export let currentPageId;