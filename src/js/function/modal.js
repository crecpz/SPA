import { Router } from "../routes/Router.js";
import { createNewListName, createUniqueId, getCurrentPage, getCurrentPageId, getCurrentTodo } from "./helper.js";
import { DATA, setStorage } from "./storage.js";
import { activeNavLists, navSwitcher, removeNavActive, renderCustomList } from "./ui.js";


// 用來表示目前的各種操作狀態
export let nameIsEditing = false; // 正在編輯列表名稱
export let todoIsEditing = false; //  正在編輯單項 todo
export let listIsRemoving = false; // 正在刪除單項 todo
export let listIsAdding = false; // 正在新增自訂列表

/**
 * * 彙整使用者在 editNameModal 輸入的內容，套用到新的列表名稱設定上
 * 1.此函數調用時機為: 當使用者在 「 listIsAdding 狀態下」 按下 editNameModal 內的 "完成按鈕" 時
 * 2.先取得使用者編輯列表名稱後的最終結果
 * 3.新增一個新的列表物件至 DATA 中，並將 2.的結果套用進該 Object 中，存至 localStorage
 * 4.調整 nav active 指向
 * 5.恢復 listIsAdding 為 false
 */
export function createNewList(e) {
  // 取得使用者編輯列表名稱後的最終結果
  const { name: listName, color: listColorBlock } = getEditNameResult(e);

  // 在 DATA 中新增新的 nav 資料
  DATA.custom.push({
    id: createUniqueId(),
    // 如果新的數字是 0，則後面加個空字串
    name: listName,
    color: listColorBlock,
    content: [],
  });

  // 存至 localStorage
  setStorage(DATA);

  // 將頁面導向到當前最新新增的頁
  // (此步驟在跳轉的過程中會觸發到 Router()，所以不需要再進行渲染)
  window.location.hash = `/customlist/${DATA.custom[DATA.custom.length - 1].id
    }`;

  // 清除在選單上的 active
  removeNavActive();

  // 渲染 customList 至 nav 中
  renderCustomList();

  // 新增列表模式設為 false
  listIsAdding = false;
}

/**
 * * 彈出 editNameModal 視窗(for 新增自訂列表)
 * 調用時機為使用者按下「新增自訂列表」後
 */
export function listAdding() {
  // 新增列表模式設為 true
  listIsAdding = true;

  // 如果目前螢幕的寬度 < 1024px，讓 「新增自訂列表」 按紐被點擊時收起 nav
  // 防止 nav 遮蓋到頁面名稱而不知道要命名
  const smallerThan1024 = window.matchMedia("(max-width: 1024px)");
  if (smallerThan1024.matches) {
    navSwitcher();
  }

  //  獲取最新的列表名稱
  const newListName = createNewListName();

  // @ 開啟 modal-overlay & editNameModal
  openModalOverlay();
  openEditNameModal(newListName); // @ 現在 editNamemodal 內 input 的 placeholder & value 就會是最新的未命名列表順位
}

/**
 * * 彈出 editNameModal 視窗(for 列表名稱設定)
 */
export function nameSetting() {
  // 變更 nameEditing 狀態
  nameIsEditing = true;

  // 從當前頁面資料中取得: 1.當前列表名稱  2.當前頁面的 color-block 顏色號碼
  const { name: currentPageName, color } = getCurrentPage();

  // 開啟 modal-overlay & editNameModal
  openModalOverlay();
  openEditNameModal(currentPageName, color); // @ 現在是在列表名稱設定，所以傳入的是當前列表名稱
}

/**
 * * 儲存使用者在編輯現有列表名稱後的內容
 * @param {*} e event
 */
export function saveNameSetting(e) {
  // 取得使用者編輯列表名稱後的最終結果
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
 * 3.調用 openEditModal() 讓 editModal 打開，
 *    並將 todo Object 傳入 openEditModal() 作為參數
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
          重要
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
 * * 「 使用者按下刪除列表 ---> confirmModal 跳出 」 的確認過程
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
 * * 開啟編輯列表名稱 editNameModal
 * 1.此函數調用的時機為當使用者按下「新增自訂列表」或「列表名稱設定」時所觸發
 * 2.給予 editNameModal 裡面 input 的 placeholder &  value 一個 defaultName (預設名稱)
 * 3.反白 value 文字(為了更容易編輯)
 * 4.
 *
 * @param {*} defaultName 預設名稱
 * - defaultName 將套用到 editNameModal 中 input 的 value 與 placeholder 中
 * - 若此函數是在新增新列表時(listAdding = true)被調用，則 defaultName 將會傳入的是下一個順位的列表名稱；
 * - 若此函數是在列表名稱設定時(listEditing = true)被調用，則 defaultName 將會傳入的是當前列表名稱。
 * @param {*} color
 * - color 作為顯示在 editNameModal 中的顏色選擇器上套用 active 的指標
 * - 若此函數是在新增新列表時(listAdding = true)被調用，由於頁面 Object 才剛被建立出來，所以 Object 內
 *   的 color 屬性不會有任何的值，所以調用 openEditNameModal() 時，我只傳入第一個參數(defaultName)，而
 *   不會傳入第二個參數(color)，使 color 變成 undefined。接著使用含樹的預設值 color = 1 ，代表 :
 *   只要沒有傳入參數，自動將顏色設為 1。
 * - 若此函數是在列表名稱設定時(listEditing = true)被調用，則 color 傳入的是當前列表 color。
 */
export function openEditNameModal(defaultName, color = "1") {
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
  const activeColorBlock = editNameModal.querySelector(
    `[data-color="${color}"]`
  );
  activeColorBlock.classList.add("modal__color-block--active");
}

/**
 * * 關閉編輯列表名稱的 modal
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
 * * 取得使用者編輯列表名稱後的最終結果
 */
export function getEditNameResult(e) {
  // todo - 獲取 editNameModal DOM 元素
  const editNameModal = e.target.closest("#edit-name-modal");

  // todo - 獲取列表名稱 input 的內容
  const editName = editNameModal.querySelector("#list-name");
  let newName = "";
  // 如果使用者留下空白，那就使用預設值。
  // 基本預設值會是跟 placeholder 相同(因為預設值已經放在 placeholder)
  if (editName.value.trim() === "") {
    newName = editName.placeholder;
  } else {
    // 如果使用者有輸入內容，則該內容將成為新的列表名稱
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
 * * 刪除列表在 DATA 中的資料
 */
export function removeList(e) {
  // 取得當前列表頁面的資料
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

  // 重新渲染 nav 自訂列表的 UI
  renderCustomList();

  // 存到 localStorage
  setStorage(DATA);

  // listRemoving state 恢復成 false
  listIsRemoving = false;
}