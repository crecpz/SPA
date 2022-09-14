/**
 * 點擊 listOptionBtn 會調用此函數。
 * 此函數用於展開 listOption。  
 */
function openListOption(){
  const listOption = document.querySelector('.list-option');
  listOption.classList.toggle('list-option--open');
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