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


// const navLists = document.querySelectorAll('.nav__list');
// navLists.forEach(i => {
//   i.addEventListener('click', (e) => {
//     if(e.target.classList.contains('nav__list-item')) {
//       document.querySelectorAll('.nav__list-item')
//         .forEach(i => i.classList.remove('nav__list-item--active'));
//       e.target.classList.add('nav__list-item--active');
//     }
//   })
// })

const navLists = document.querySelectorAll('.nav__list');

navLists.forEach(i => {
  i.addEventListener('click', (e) => {
    console.log(e.target);
    // if(e.target.classList.contains('nav__list-item')) {
      
    // }
  })
})