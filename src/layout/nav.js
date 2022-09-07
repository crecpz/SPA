import { modeSwitcher } from '../utils/mode.js';
import { openListOption, clickToCloseListOption } from '../layout/main.js';


// ---------------[ 全局監聽(不管在哪一個頁面都會使用到這些 nav 的監聽) ]---------------
const wrapper = document.querySelector('.wrapper');
wrapper.addEventListener('click', e => {
// console.log(1)

  // 光線模式切換
  modeSwitcher(e);

  // 點擊漢堡鈕來開啟 nav
  if (e.target.id === 'main-hamburger'
    || e.target.id === 'nav-hamburger') {
    navSwitcher();
  }

  // 如果點按 body-overlay 時 nav 是開啟的狀態，則調用 navSwitcher() 來關閉 nav
  if (e.target.classList.contains('body-overlay')
    && document.querySelector('#wrapper').classList.contains('nav-open')) {
    // 切換 nav 展開與收合
    navSwitcher();
  }
})


/**
* nav 展開時所需套用的行為
*/
export function navSwitcher() {
  const wrapper = document.querySelector('#wrapper'),
    nav = document.querySelector('#nav'),
    main = document.querySelector('#main'),
    mainHeader = document.querySelector('#main__header');
  // 加上 nav-open class
  [wrapper, nav, main, mainHeader].forEach(elem => {
    elem.classList.toggle('nav-open');
  })
}


const navLists = document.querySelectorAll('.nav__list');
// nav 中所有的選單點擊切換行為
navLists.forEach(i => {
  i.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav__list-link')) {
      // 清除在選單上的 active
      document.querySelectorAll('.nav__list-item')
        .forEach(i => i.classList.remove('nav__list-item--active'));
      // 更新 active
      e.target.closest('li').classList.add('nav__list-item--active');
    }
  })
})


// --------------------------[ 新增自訂列表 ]--------------------------

const addBtn = document.querySelector('#add-list-btn');
const customList = document.querySelector('.custom-list');

let customLi = '';

addBtn.addEventListener('click', e => {
  let customListName = '未命名清單';
  const listId = new Date().getTime()
  customLi += 
  `<li id="${listId}" class="custom-list__item nav__list-item">
      <a class="nav__list-link nav__list-link--custom-list" href="#/customlist">
          <div class="custom-list__color"></div>
          ${customListName}
      </a>
  </li>`;

  customList.innerHTML = customLi;
})