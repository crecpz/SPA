import { Router } from "../routes/Router.js";
import {
  DATA,
  getCurrentPage,
  getCurrentPageId,
  getCurrentTodo,
  getPage,
  moveTopToAll,
  pinTodo,
  setStorage,
  setTodo,
  unhide,
} from "../utils/function.js";
import { activeNavLists, renderCustomList } from "./nav.js";

// 用來表示目前的各種操作狀態
export let nameIsEditing = false; // 正在編輯清單名稱
export let todoIsEditing = false; //  正在編輯單項 todo
export let listIsRemoving = false; // 正在刪除單項 todo

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

// 監聽 todo submit 按鈕
document.querySelector("#todo-submit").addEventListener("click", setTodo);

/**
 * * 彈出 editNameModal 視窗(for 清單名稱設定)
 */
export function nameSetting() {
  // 變更 nameEditing 狀態
  nameIsEditing = true;

  // 從當前頁面資料中取得: 1.當前清單名稱  2.當前頁面的 color-block 顏色號碼
  const {name:currentPageName , color} = getCurrentPage();

  // 開啟 modal-overlay & editNameModal
  openModalOverlay();
  openEditNameModal(currentPageName, color); // @ 現在是在清單名稱設定，所以傳入的是當前清單名稱
}

/**
 * * 儲存使用者在編輯現有清單名稱後的內容
 * @param {*} e event
 */
export function saveNameSetting(e) {
  // 取得使用者編輯清單名稱後的最終結果
  const { name: listName, color: listColorBlock } = getEditNameResult(e);
  // 取得當前頁面
  const currentPage = DATA.custom.find(({ id }) => id === getCurrentPageId());
  currentPage.name = listName;
  currentPage.color = listColorBlock;
  // 將改變存進 localStorage
  setStorage(DATA);
  // 重新渲染
  Router();
  // 也一併重新渲染 nav
  renderCustomList();
  // 恢復 nameIsEditing 狀態
  nameIsEditing = false;
}

// /**
//  * 儲存已經改動的清單名稱
//  * @param {*} e
//  */
// export function saveEditedName() {
//   // 取得 input
//   const editTarget = document.querySelector(".main__name");

//   // 如果輸入的內容為空，則替此內容新增內容
//   if (editTarget.value.trim() === "") {
//     // 獲取現有清單
//     const allCustomListName = DATA.custom.map((i) => i.name);
//     // 提取清單尾數。
//     // 提取的清單尾數為空，則在陣列內給予其初始值 1 並返回
//     // (因為如果初始值是 1 ，在後續的計算中，下一個順位將會是 0)
//     const extractNumberList =
//       extractUnnamedNumber(allCustomListName).length === 0
//         ? [1]
//         : extractUnnamedNumber(allCustomListName);

//     // 得出最新的數字
//     const newNumber = listCounter(extractNumberList);

//     // 給予目前的清單新名稱
//     editTarget.value = `未命名清單${newNumber === 0 ? "" : `(${newNumber})`}`;
//   }

//   // 更新 DATA 中的資料
//   const currentPage = getCurrentPage();
//   currentPage.name = editTarget.value;

//   // 更新該頁中的 todo obj 內的 srcName
//   currentPage.content.forEach(
//     (todoObj) => (todoObj.srcName = editTarget.value)
//   );

//   // 存入 localStorage
//   setStorage(DATA);

//   // 重新渲染新的名稱上去 nav
//   renderCustomList();

//   // input 設定回 readonly 屬性
//   editTarget.setAttribute("readonly", "readonly");

//   // nameEditing 設回 false
//   nameIsEditing = false;
// }

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
 * * 關閉 confirm modal
 * 將 confirmModal 的 class 移除 modal--active 使其關閉
 */
export function closeConfirmModal() {
  const confirmModal = document.querySelector("#confirm-modal");
  confirmModal.classList.remove("modal--active");
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

/**
 * * 關閉 edit modal
 * 將 editModal 的 class 移除 modal--active 使其關閉
 */
export function closeEditModal() {
  const editModal = document.querySelector("#edit-modal");
  editModal.classList.remove("modal--active");
}

/**
 * * 儲存已編輯的 todo 內容，並將頁面更新。
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
 * * 開啟編輯清單名稱 editNameModal
 * 1.此函數調用的時機為當使用者按下「新增自訂清單」或「清單名稱設定」時所觸發
 * 2.給予 editNameModal 裡面 input 的 placeholder &  value 一個 defaultName (預設名稱)
 * 3.反白 value 文字(為了更容易編輯)
 * 4.
 * 
 * @param {*} defaultName 預設名稱
 * - defaultName 將套用到 editNameModal 中 input 的 value 與 placeholder 中
 * - 若此函數是在新增新清單時(listAdding = true)被調用，則 defaultName 將會傳入的是下一個順位的清單名稱；
 * - 若此函數是在清單名稱設定時(listEditing = true)被調用，則 defaultName 將會傳入的是當前清單名稱。
 * @param {*} color
 * - color 作為顯示在 editNameModal 中的顏色選擇器上套用 active 的指標
 * - 若此函數是在新增新清單時(listAdding = true)被調用，由於頁面 Object 才剛被建立出來，所以 Object 內
 *   的 color 屬性不會有任何的值，所以調用 openEditNameModal() 時，我只傳入第一個參數(defaultName)，而
 *   不會傳入第二個參數(color)，使 color 變成 undefined。接著使用含樹的預設值 color = 1 ，代表 : 
 *   只要沒有傳入參數，自動將顏色設為 1。
 * - 若此函數是在清單名稱設定時(listEditing = true)被調用，則 color 傳入的是當前清單 color。
 */
export function openEditNameModal(defaultName, color = '1') {
  //  取得 editNameModal DOM
  const editNameModal = document.querySelector("#edit-name-modal");
  editNameModal.classList.add("modal--active");
  // 設定 input 內的 placeholder &  value 屬性
  const input = editNameModal.querySelector("#list-name");
  input.placeholder = defaultName;
  input.value = defaultName;
  // 反白文字內容
  setTimeout(() => input.select(), 300);
  // 取得與傳入的 color 參數匹配的 DOM elelment，將其套用 active
  clearColorSelectorActive();
  const activeColorBlock = editNameModal.querySelector(`[data-color="${color}"]`);
  activeColorBlock.classList.add('modal__color-block--active');
}

/**
 * * 關閉編輯清單名稱的 modal
 */
export function closeEditNameModal() {
  const editNameModal = document.querySelector("#edit-name-modal");
  editNameModal.classList.remove("modal--active");
}

/**
 * * 清除在 editNameModal 中的顏色選擇器 active 的狀態
 * @param {*} e
 */
export function clearColorSelectorActive() {
  const colorBlocks = document.querySelectorAll(".modal__color-block");
  colorBlocks.forEach((colorBlocks) =>
    colorBlocks.classList.remove("modal__color-block--active")
  );
}

/**
 * * 取得使用者編輯清單名稱後的最終結果
 */
export function getEditNameResult(e) {
  // todo - 獲取 editNameModal DOM 元素
  const editNameModal = e.target.closest("#edit-name-modal");

  // todo - 獲取清單名稱 input 的內容
  const editName = editNameModal.querySelector("#list-name");
  let newName = "";
  // 如果使用者留下空白，那就使用預設值。
  // 基本預設值會是跟 placeholder 相同(因為預設值已經放在 placeholder)
  if (editName.value.trim() === "") {
    newName = editName.placeholder;
  } else {
    // 如果使用者有輸入內容，則該內容將成為新的清單名稱
    newName = editName.value;
  }
  // 獲取顏色
  const color = editNameModal.querySelector(".modal__color-block--active")
    .dataset.color;

  // 返回物件 {name:"", color:""}
  return {
    name: newName,
    color: color,
  };
}

/**
 *
 * 1.此函數是在使用者於 editNameModal 按下 「完成」 之後所觸發
 * 2.觸發後會先獲取使用者編輯清單名稱後的最終結果(包括選色)
 * 3.將此設定套用到目標清單
 * @param {*} editNameResult
 */
export function setListName(e) {
  // 取得使用者編輯清單名稱後的最終結果
  const { name: listName, color: listColorBlock } = getEditNameResult(e);

  // console.log(listName, listColorBlock);
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
  // 判斷目前 top 是否是由 false ---> true (只有非置頂 ---> 置頂)
  // ! pinTodo 的必要性? (1)
  if (!currentTodo.top) {
    pinTodo(currentTodoId, currentTodo);
  }
  // 反轉在資料中的 checkbox 值，並儲存
  changeTop(currentTodo);
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
 * * 反轉置頂星號的狀態
 * 此函式僅處理來自 editModal 所觸發的事件，不會處理
 * @param {*} e
 */
export function changeTopByEditModal(e) {
  // 從他們的上層找 dataset.id (我將 todo 的 id 使用 dataset 的方式放在 modal__form)
  const currentTodoId = e.target.closest(".modal__form").dataset.id;
  // 取得當前 todo 資料
  const currentTodo = getCurrentTodo(currentTodoId);

  // ! pinTodo 的必要性? (2)
  if (!currentTodo.top) {
    pinTodo(currentTodoId, currentTodo);
  }
  // 反轉在資料中的 checkbox 值，並儲存
  changeTop(currentTodo);
  // 渲染出最新的改變(此渲染會影響的元素僅是顯示在 todoItem 上面的星星，位於 editModal 上的星星不會有任何變化)
  Router();
  // 因為 eidtModal 內的星星不是使用 checkbox 來做，所以不會在點擊之後就改變樣式，所以這邊要設定被按下去之後星星的樣式切換。
  e.target.children[0].classList.toggle("fa-solid");
  e.target.children[0].classList.toggle("fa-regular");
}

/**
 * 控制 dropdown 展開與收合
 */
export function dropdownSwitch(e) {
  console.log(e.target)
  const dropdownCover = e.target.nextElementSibling;
  const todos = dropdownCover.children[0];
  const dropdownArrow = e.target.querySelector('.dropdown__arrow');

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
