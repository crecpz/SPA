/**
 * 點擊 bodyOverley 時調用指定函數來達成特定行為
 * @param {*} callback 
 */
export function clickBodyOverlay(callback) {
  const overlay = document.querySelector('.body-overlay');
  overlay.addEventListener('click', callback);
}