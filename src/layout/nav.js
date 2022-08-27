// import { clickBodyOverlay } from './function.js';

// nav 展開與收合
const mainHamburger = document.querySelector('#main-hamburger'),
  navHamburger = document.querySelector('#nav-hamburger');

// 當 #main-hamburger 按下
// mainHamburger.addEventListener('click', navSwitcher)

// 當 #nav-hamburger 按下
// navHamburger.addEventListener('click', navSwitcher)


// 點擊 bodyOverley 時調用指定函數
// clickBodyOverlay(navSwitcher);


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


