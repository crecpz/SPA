// #input-area 新增監聽
document.querySelector('#input-area')
  .addEventListener('click',function(e){
    const addItemBtn = this.querySelector('#add-item-btn ');
    const input = document.querySelector('.input-area__input');
    const submitBtn = document.querySelector('.input-area__submit-btn');

    addItemBtn.classList.add('input-area__add-btn--active');
    input.focus();
  


    if(e.target === submitBtn) return false;
    input.addEventListener('blur', function(e){
      addItemBtn.classList.remove('input-area__add-btn--active');
    },{once: true})

  })


// 1. 使用 id 與 class 同名，id 給 js 用，class 給 css 有什麼問題? 為什麼不直接用 class 就好?
// 2. id 在 querySelector 時會比較快嗎?


/**
 * 點擊 listOptionBtn 會調用此函數。
 * 此函數用於展開 listOption。  
 */
function openListOption(){
  const listOption =document.querySelector('.list-option');
  listOption.classList.toggle('list-option--open');
  // document.addEventListener('click', clickToCloseListOption);

}

/**
 * 此函數功能為當 `listOption` 是開啟的狀態下偵測使用者點擊了什麼，
 * 只要 `listOption` 是開啟的狀態下且點擊的不是 `listOptionBtn`，
 * 就將 `listOptionBtn` 調用一次 `click()`。(所以 `listOptionBtn` 會被關閉)
 * @param {*} e `event`
 */
function clickToCloseListOption(e){
  const listOptionBtn = document.querySelector('.btn--list-option');
  const listOption =document.querySelector('.list-option');
  const listOptionIsOpened = listOption.classList.contains('list-option--open');
  const clickingListOptionBtn = e.target.classList.contains('btn--list-option')
  
  if(listOptionIsOpened && !clickingListOptionBtn){
    listOptionBtn.click();
  }
}

export {openListOption, clickToCloseListOption};