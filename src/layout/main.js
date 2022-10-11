import { Router } from "../routes/Router.js";
import {
  DATA,
  getCurrentPage,
  getCurrentPageId,
  getCurrentTodo,
  getPage,
  moveTopToAll,
  setStorage,
  setTodo,
  unhide,
} from "../utils/function.js";
import { activeNavLists, renderCustomList } from "./nav.js";

// 用來表示目前的各種操作狀態
export let nameIsEditing = false; // 正在編輯清單名稱: false
export let todoIsEditing = false; //  正在編輯單項 todo : false
export let listIsRemoving = false; // 正在刪除單項 todo: false

// export function changeState(nameIsEditing){

// }

/**
 * 點擊 listOptionBtn 會調用此函數。
 * 此函數用於展開 listOption。
 */
export function openListOption(e) {
  // 控制 listOption 展開與收合
  if (e.target.classList.contains("btn--list-option")) {
    const listOptions = document.querySelector(".list-options");
    listOptions.classList.toggle("list-options--open");
  }
}

/**
 * 此函數功能為當 `listOption` 是開啟的狀態下偵測使用者點擊了什麼，
 * 只要 `listOptions` 是開啟的狀態下且點擊的不是 `listOptionBtn`，
 * 就將 `listOptionBtn` 調用一次 `click()`。(所以 `listOptionBtn` 會被關閉)
 * @param {*} e `event`
 */
export function clickToCloseListOption(e) {
  const listOptionBtn = document.querySelector(".btn--list-option");
  const listOptions = document.querySelector(".list-options");
  const listOptionsIsOpened =
    listOptions.classList.contains("list-options--open");
  const clickingListOptionBtn = e.target.classList.contains("btn--list-option");

  if (listOptionsIsOpened && !clickingListOptionBtn) {
    listOptionBtn.click();
  }
}

// 監聽 submit 按鈕
const todoSubmit = document.querySelector("#todo-submit");
todoSubmit.addEventListener("click", setTodo);

/**
 * 編輯自訂清單的名稱
 */
export function editName() {
  // 將目前 nameEditing 改成 true，表示編輯清單名稱中
  nameIsEditing = true;
  const editTarget = document.querySelector(".main__name");
  editTarget.removeAttribute("readonly");
  editTarget.select();
}

/**
 * 儲存已經改動的清單名稱
 * @param {*} e
 */
export function saveEditedName() {
  // 取得 input
  const editTarget = document.querySelector(".main__name");

  // 如果輸入的內容為空，則替此內容新增內容
  if (editTarget.value.trim() === "") {
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

    // 給予目前的清單新名稱
    editTarget.value = `未命名清單${newNumber === 0 ? "" : `(${newNumber})`}`;
  }

  // 更新 DATA 中的資料
  const currentPage = getCurrentPage();
  currentPage.name = editTarget.value;

  // 更新該頁中的 todo obj 內的 srcName
  currentPage.content.forEach(
    (todoObj) => (todoObj.srcName = editTarget.value)
  );

  // 存入 localStorage
  setStorage(DATA);

  // 重新渲染新的名稱上去 nav
  renderCustomList();

  // input 設定回 readonly 屬性
  editTarget.setAttribute("readonly", "readonly");

  // nameEditing 設回 false
  nameIsEditing = false;
}

/**
 * * 開啟 modal-overlay
 * 開啟位於 modal 後面的暗色遮蓋層
 */
export function openModalOverlay() {
  const modalOverlay = document.querySelector(".modal-overlay");
  modalOverlay.classList.add("overlay--active");
}

/**
 * * 關閉 modal-overlay
 * 關閉位於 modal 後面的暗色遮蓋層
 */
export function closeModalOverlay() {
  const modalOverlay = document.querySelector(".modal-overlay");
  modalOverlay.classList.remove("overlay--active");
  todoIsEditing = false;
}

/**
 * * 開啟 confirm modal
 * 將 confirmModal 的 class 加上 modal--active 使其彈出
 */
export function openConfirmModal() {
  const confirmModal = document.querySelector("#confirm-modal");
  confirmModal.classList.add("modal--active");
}

/**
 * * 製作出 confirmModal 所需要的結構
 * @param {*} confirmContent 要確認的內容，最後會顯示在「 」中
 */
export function createConfirmModalContent(confirmContent) {
  // 取得 confirm DOM
  const confirmModal = document.querySelector("#confirm-modal");

  // 放入結構，並插入相對應的內容
  confirmModal.innerHTML = `
    <p class="modal__text">
        <span class="text-lg text-strong">刪除確認</span>
        <span id="confirm-content" class="confirm-content text-base">
          ${confirmContent}
        </span>
        <span class="text-base text-normal">刪除之後將無法復原</span>
    </p>
    <div class="modal__btn-group">
        <button id="confirm-cancel" class="btn btn--primary btn--modal">取消</button>
        <button id="confirm-yes" class="btn btn--primary btn--modal btn--danger">確定刪除</button>
    </div>
  `;
}

/**
 * * 關閉 confirm modal
 * 將 confirmModal 的 class 移除 modal--active 使其關閉
 */
export function closeConfirmModal() {
  const confirmModal = document.querySelector("#confirm-modal");
  confirmModal.classList.remove("modal--active");
}

/**
 * * 「 使用者按下 todoItem ---> editModal 跳出 」 的過程
 * 1.透過 e.target 取得 id，獲取 todo Object
 * 2.開啟 modal-overlay
 * 3.調用 openEditModal 讓 editModal 打開
 */
export function todoEditing(e) {
  // 開始編輯
  todoIsEditing = true;

  // 取得所點擊到的 todo 的資料
  const currentTodoId = e.target.id;
  const currentTodo = getCurrentTodo(currentTodoId);

  // 開啟 modal-overlay
  openModalOverlay();

  // 開啟 eidt-modal，並傳入所點擊到的 todo 的資料
  openEditModal(currentTodo);
}

/**
 * * 開啟 eidtModal，並放入所需結構
 * ! 僅開啟 eidtModal 與放入結構，使用者後續的行為並不是此函數負責。
 * 1.接收一個 todo Object 作為參數
 * 2.將 editModal 的 class　加上 modal--active，使其彈出。
 * 3.放入 editModal 結構，並將 todo Object 中相對應的內容插入結構當中
 */
export function openEditModal({ id, checked, content, top }) {
  // 顯示 modal
  const editModal = document.querySelector("#edit-modal");
  editModal.classList.add("modal--active");

  // 放入 editModal 結構
  editModal.innerHTML = `
    <form class="modal__form" data-id="${id}">
      <textarea class="modal__textarea">${content}</textarea>
      <div class="modal__check-options">
        <label class="modal__check-option checkbox">
            <input type="checkbox" class="checkbox__input"
            ${checked ? "checked" : ""}>
            <div class="checkbox__appearance"></div>
            已完成
        </label>
        <button class="modal__check-option modal__top">
          <i class="top ${top ? "fa-solid" : "fa-regular"} fa-star"></i>
          置頂
        </button>
        </div>
        <div class="modal__btn-group">
          <button id="edit-delete" class="btn btn--remove">
            <i class="fa-regular fa-trash-can"></i>   
          </button>
          <button id="edit-close" class="btn btn--primary btn--modal">完成</button>
        </div>
      </form>
    `;
}

//@ 備用
// /**
//  * * 開啟 eidtModal，並放入所需結構
//  * ! 僅開啟 eidtModal 與放入結構，使用者後續的行為並不是此函數負責。
//  * 1.接收一個 todo Object 作為參數
//  * 2.將 editModal 的 class　加上 modal--active，使其彈出。
//  * 3.放入 editModal 結構，並將 todo Object 中相對應的內容插入結構當中
//  */
// export function openEditModal({ id, checked, content, top }) {
//   // 顯示 modal
//   const editModal = document.querySelector("#edit-modal");
//   editModal.classList.add("modal--active");

//   // 放入 editModal 結構
//   editModal.innerHTML = `
//     <form class="modal__form" data-id="${id}">
//       <textarea class="modal__textarea">${content}</textarea>
//       <div class="modal__check-options">
//         <label class="modal__label checkbox">
//             <input type="checkbox" class="checkbox__input"
//             ${checked ? "checked" : ""}>
//             <div class="checkbox__appearance"></div>
//             已完成
//         </label>
//         <label class="modal__label modal__top">
//           <i class="top ${top ? "fa-solid" : "fa-regular"} fa-star"></i>
//           置頂
//         </label>
//         </div>
//         <div class="modal__btn-group">
//           <button id="edit-delete" class="btn btn--remove">
//             <i class="fa-regular fa-trash-can"></i>   
//           </button>
//           <button id="edit-close" class="btn btn--primary btn--modal">完成</button>
//         </div>
//       </form>
//     `;
// }

/**
 * * 關閉 edit modal
 * 將 editModal 的 class 移除 modal--active 使其關閉
 */
export function closeEditModal() {
  const editModal = document.querySelector("#edit-modal");
  editModal.classList.remove("modal--active");
}

/**
 * * 儲存已編輯的 todo，並將頁面更新。
 */
export function saveEditedTodo(e) {
  // 透過傳入的參數 e 取得 textarea 的 value
  const editedValue = e.target.value;
  // 透過傳入的參數 e 取得該項 todo 資料
  const todoId = e.target.closest(".modal__form").dataset.id;
  const currentTodo = getCurrentTodo(todoId);
  // 改變 todo 資料的 content 屬性內容
  currentTodo.content = editedValue;
  // re-render
  Router();
  // 存至 localStorage
  setStorage(DATA);
}

/**
 * * 「 使用者按下刪除清單 ---> confirmModal 跳出 」 的確認過程
 * (跳出 confirmModal 後，使用者後續刪除的行為會寫在 removeList() 內)
 */
export function removeListConfirm() {
  // 改變狀態
  listIsRemoving = true;

  // 開啟 modal-overlay
  openModalOverlay();

  // 開啟 confirm modal
  openConfirmModal();

  // 取得當前頁面名稱，傳入 createConfirmModal() 內
  const currentPageName = getCurrentPage().name;
  createConfirmModalContent(currentPageName);
}

/**
 * * 刪除清單在 DATA 中的資料
 */
export function removeList(e) {
  // 取得當前清單頁面的資料
  const currentPage = getCurrentPage();

  // 存放接下來頁面的去向 (此處存放的是一段網址)
  let pageWillGoTo;

  // 獲取當前頁面的前一個頁面，如果只有一個頁面，則前一個頁面指定為 '/top'
  if (!DATA.custom[DATA.custom.indexOf(currentPage) - 1]) {
    // 將頁面導向到 '/top'
    pageWillGoTo = "/top";
    window.location.hash = pageWillGoTo;
    activeNavLists();
  } else {
    // 如果當前頁面不只有一個頁面，
    // 找到當前頁面的前一頁的 id，並將頁面導向過去
    pageWillGoTo = DATA.custom[DATA.custom.indexOf(currentPage) - 1].id;
    window.location.hash = `/customlist/${pageWillGoTo}`;
  }

  // 刪除在 DATA 中該頁的資料
  DATA.custom = DATA.custom.filter((page) => page.id !== currentPage.id);

  // 重新渲染 nav 自訂清單的 UI
  renderCustomList();

  // 存到 localStorage
  setStorage(DATA);

  // listRemoving state 恢復成 false
  listIsRemoving = false;
}

/**
 // ? 萬一內容很長怎麼辦?
 * * 「 使用者按下刪除 todo ---> confirmModal 跳出 」 的確認過程
 * @param {*} todoId 欲刪除的 todoId
 */
export function removeTodoConfirm(todoId) {
  // 取得當前 todo 的物件資料
  const removeTodoObj = getCurrentTodo(todoId);
  // 取得當前 todo 的 content (文字內容)
  const { content } = removeTodoObj;
  // 開啟 confirm modal
  openConfirmModal();
  // 在 content 中放入 confirm 結構讓使用者確認現在要刪除的項目名稱
  createConfirmModalContent(content);
}

/**
 * * 刪除 todo 在 DATA 中的資料
 */
export function removeTodo(removeTodoId) {
  // @註: 以下註解中的 todo 皆代表要刪除的 todo

  // 取得 todo 物件中的 srcId 屬性 (srcId 屬性表示:「該 todo 是來自於哪一個頁面(id)」)
  const todoObj = getCurrentTodo(removeTodoId);
  const { srcId } = todoObj;

  // 取得該 todo 在 DATA 中的頁面資料
  const pageObjOfRemoveTarget = getPage(srcId);
  // 承上，在頁面資料的 content 屬性做過濾，將該項 todo 剔除掉
  pageObjOfRemoveTarget.content = pageObjOfRemoveTarget.content.filter(
    ({ id }) => id !== removeTodoId
  );

  // 重新 render
  Router();

  // 存至 localStorage
  setStorage(DATA);

  // 關閉編輯視窗與 modalOverlay
  closeEditModal();
  closeModalOverlay();

  // 將原本被隱藏的 editModal 再度切換成顯示狀態(以確保下一次彈出時是可見的)
  unhide("#edit-modal");
}

/**
 *
 * * 反轉 checkbox 值，最後儲存結果至 localStorage
 *
 * 注意: checkbox 可能來自於兩個地方:
 * 1.位於 todoItem 中
 * 2.位於 editModal 中
 *
 * 會根據觸發時哪邊能獲取得到 id ，來決定 currentTodoId 的值
 * @param {*} e event
 */
export function changeCheckbox(e) {
  // 如果 change 事件所觸發的 e.target 包含 .checkbox__input class
  if (e.target.classList.contains("checkbox__input")) {
    // 此變量存放當前 todo id
    let currentTodoId;
    // 此變量用來存取目前事件處發是否來自於 editModal
    let triggerFromEditModal = false;

    // 如果 e.target 向上尋找可以找到 .todo__item (代表目前所點擊)
    if (e.target.closest(".todo__item")) {
      // currentTodoId 將是往上層尋找 .todo__item 的 id
      currentTodoId = e.target.closest(".todo__item").id;
    } else {
      // 否則 currentTodoId 將是來自於 editModal checkbox 的 dataset
      currentTodoId = e.target.closest(".modal__form").dataset.id;
      // 事件處發來自 editModal
      triggerFromEditModal = true;
    }

    // 翻轉 checkbox 值
    getCurrentTodo(currentTodoId).checked =
      !getCurrentTodo(currentTodoId).checked;

    // 若事件觸發來自 editModal
    if (triggerFromEditModal) {
      // 一併更改在 DOM 中顯示的 todoItem checkbox 狀態 (注意: 只是改外觀，沒有存入 localStorage)
      const currentTodoCheckbox = document.querySelector(`#${currentTodoId}`)
        .children[0].children[0];
      currentTodoCheckbox.checked = !currentTodoCheckbox.checked;
    }
  }
  // 儲存變更
  setStorage(DATA);
}

/**
 * * 改變置頂星號(top)的狀態，最後儲存結果至 localStorage
 * @param {*} e event
 * ! 參數原本是 e，現在我改成 Id
 */
export function changeTop(todoObj) {
  todoObj.top = !todoObj.top;
  // 存進 localStorage
  setStorage(DATA);
}

/**
 * * 反轉置頂星號的狀態(處理來自 todoItem 所觸發的事件)
 * @param {*} e
 */
export function changeTopByTodoItem(e) {
  // 從 .todo__item 取得 id
  const currentTodoId = e.target.closest(".todo__item").id;
  // 取得當前 todo 資料
  const currentTodo = getCurrentTodo(currentTodoId);
  // 反轉在資料中的 checkbox 值，並儲存
  changeTop(currentTodo);

  
  // // 改變星號的樣式
  // e.target.classList.toggle("fa-solid");
  // e.target.classList.toggle("fa-regular");

  // 渲染
  Router();

  // 檢查於置頂頁面中產生的 todo 當中，已經不再被置頂的 todo
  // 將其移至 「all」 資料中
  const currentPageId = getCurrentPageId();
  if (
    currentPageId === "top" && // 如果目前位於置頂頁面
    !currentTodo.top && // 且當前 todo 不再是置頂狀態(星星被摘除)
    currentTodo.srcId === "top" // 且該項 todo 是在置頂頁面被創建出來的話
  ) {
    // 上述條件若符合，代表該項 todo 不該出現在「置頂」，必須將其移至資料中的 「all」 內
    moveTopToAll(currentTodo);
  }
}

/**
 * * 反轉置頂星號的狀態(處理來自 editModal 所觸發的事件)
 * @param {*} e
 */
export function changeTopByEditModal(e) {
  // 從他們的上層找 dataset.id (我將 todo 的 id 使用 dataset 的方式放在 modal__form)
  const currentTodoId = e.target.closest(".modal__form").dataset.id;
  // 取得當前 todo 資料
  const currentTodo = getCurrentTodo(currentTodoId);
  // 反轉在資料中的 checkbox 值，並儲存
  changeTop(currentTodo);
  // 渲染出最新的改變(此渲染會影響的元素是顯示在 todoItem 上面的星星)
  Router();

  // 因為 eidtModal 內的星星不是使用 checkbox 來做，所以不會在點擊之後
  // 就改變樣式，所以這邊要設定被按下去之後星星的樣式切換。
  // 下面判斷的是使用者按的是
  if (e.target.tagName === "I") {
    e.target.classList.toggle("fa-solid");
    e.target.classList.toggle("fa-regular");
  } else {
    e.target.children[0].classList.toggle("fa-solid");
    e.target.children[0].classList.toggle("fa-regular");
  }
}

/**
 * 控制 dropdown 展開與收合
 */
export function dropdownSwitch(e) {
  const dropdownCover = e.target.nextElementSibling;
  const todos = dropdownCover.children[0];
  const dropdownArrow = e.target.children[0];
  dropdownCover.style.height = `${todos.clientHeight}px`;

  if (dropdownCover.clientHeight) {
    dropdownCover.style.height = `${0}px`;
    dropdownArrow.classList.add("dropdown__arrow--closing");
  } else {
    dropdownCover.style.height = `${todos.clientHeight}px`;
    dropdownArrow.classList.remove("dropdown__arrow--closing");
  }
}

/**
 * 使 scrollBar 不佔據任何空間但保有滾動條樣式與滾動的功能。
 */
export function scrollBarFix() {
  const mainContentList = document.querySelector(".main__content-list");
  mainContentList.style.paddingRight =
    mainContentList.offsetWidth - mainContentList.clientWidth
      ? mainContentList.offsetWidth - mainContentList.clientWidth + "px"
      : "";
}
