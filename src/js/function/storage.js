import { Router } from "../routes/Router.js";
import {
  createUniqueId,
  getAllPage,
  getCurrentPage,
  getCurrentPageId,
  getCurrentTodo,
  getPage,
  unhide,
} from "./helper.js";
import {
  closeEditModal,
  closeModalOverlay,
} from "./modal.js";

// 初次載入時取得 localStorage 中的資料並存進變量中
export const DATA = getStorage();

// 取得 localStorage 的資料
export function getStorage() {
  // 如果取得的 localStorage 資料為空，則返回一個基本的初始資料
  return (
    JSON.parse(localStorage.getItem("todoLocalData")) || {
      default: [
        {
          id: "defaultlist",
          name: "預設列表",
          color: "default",
          content: [],
        },
        {
          id: "top",
          name: "重要",
          color: "default",
          content: [],
        },
      ],

      custom: [
        // {
        //   id: "",
        //   name: "未命名列表",
        //   color: "",
        //   content: [
        // {
        //   checked: false,
        //   content: "this is todo A.",
        //   top: false,
        // },
        // ],
        // },
      ],
    }
  );
}

/**
 * * 設定 localStorage 的資料
 * @param {*} data 欲存至 localStorage 的物件
 */
export function setStorage(data) {
  localStorage.setItem("todoLocalData", JSON.stringify(data));
}

/**
 * * 建立新的 todo 資料，並加進當前頁面中
 */
export function setTodo(e) {
  e.preventDefault();
  const todoInput = document.querySelector("#todo-input");
  if (todoInput.value.trim() !== "") {
    // 存放使用者輸入的文字內容
    const todoValue = todoInput.value.trim();

    // 取得當前所在頁面的頁面 id
    const currentPageId = getCurrentPageId();
    // 設定 todo 的 srcId, srcName 屬性:
    // srcId: 當前 todo 被創建時所屬的來源 id。
    //  除非當前頁面位於 "home"，src 屬性將被指定為 defaultlist；
    //  否則一般情況下，todo 創建時所屬的來源 id 就是 currentPageId。
    const todoCreatedSourceId =
      getCurrentPageId() === "home" ? "defaultlist" : currentPageId;
    // srcName: 當前 todo 被創建時所屬的頁面名稱
    const todoCreatedSourceName = getPage(todoCreatedSourceId).name;

    // 建構 todo Obecjt
    const todo = {
      id: createUniqueId(),
      checked: false,
      content: todoValue,
      top: todoCreatedSourceId === "top", // 凡是在 top 內的都是 true
      srcId: todoCreatedSourceId,
      srcName: todoCreatedSourceName,
    };

    // 取得所有的頁面資料，並找出與目前頁面 id 相匹配的資料，
    // 在 content 內加入新 todo
    const allPage = getAllPage();
    allPage.find((i) => i.id === todoCreatedSourceId).content.unshift(todo);

    setStorage(DATA);
    todoInput.value = "";
  }
  Router();
}

/**
 * * 接收一個在「重要」頁面被取消星號的 todo 物件，並將該物件資料從「top」移動至「defaultlsit」
 * @param {*} moveTodoObj 被取消重要的 todo Object
 */
export function moveTopToDefaultlist(moveTodoObj) {
  // 檢查於「重要」頁面中產生的 todo 當中，是否有被取消的 todo 將其移至 「defaultlist」 資料中
  const currentPageId = getCurrentPageId();
  // currentPageId === "top" && // 如果目前位於「重要」頁面

  if (
    !moveTodoObj.top && // 當前 todo 的 top 屬性為 false (星星被摘除)
    moveTodoObj.srcId === "top" // 且該項 todo 最初是在「重要」頁面被創建出來的話
  ) {
    // 上述條件若符合，代表該項 todo 現在不該繼續存留在「重要」頁面中
    // 取得 DATA 中的 top 物件後，剔除掉 moveTodoObj
    const top = getPage("top");
    top.content = top.content.filter((todoObj) => todoObj !== moveTodoObj);

    // 取得 moveTodoObj 移動目的地物件，解構賦值出屬性
    const { id, name, content } = getPage("defaultlist");
    // 將 moveTodoObj 的 srcId、srcName 更改成目的地物件的屬性
    moveTodoObj.srcName = name;
    moveTodoObj.srcId = id;
    // 在目的地屬性的 content 陣列中，加入 moveTodoObj
    content.unshift(moveTodoObj);

    // 儲存變更至 localStorage
    setStorage(DATA);
  }
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
 * * 刪除單項 todo 在 DATA 中的資料
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

  // 關閉編輯 todoItem 視窗與 modalOverlay
  closeEditModal();
  closeModalOverlay();

  // 將原本被隱藏的 editModal 再度切換成顯示狀態(以確保下一次彈出時是可見的)
  unhide("#edit-modal");
}

/**
 * * 反轉 checkbox 值，最後儲存結果至 localStorage
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
    // 此變量會用來存放當前 todo id
    let currentTodoId;
    // 此變量用來存取目前事件觸發是否來自於 editModal
    let triggerFromEditModal;

    // 如果 e.target 向上尋找可以找到 .todo__item
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

    // if (!triggerFromEditModal) {
    // 翻轉顏色淡化狀態(注意: 只是改外觀。另外，已經在下一次要 render 的 HTML 中
    // 根據 checked 的狀態來決定是否放入 .todo__item--isChecked 的判斷式了)
    const currentTodoItemDOM = document.getElementById(currentTodoId);
    currentTodoItemDOM.classList.toggle("todo__item--isChecked");

    // if(!currentTodoItemDOM && triggerFromEditModal){
    //   console.log(true)
    // }

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
 * * 改變重要星號(top)的狀態，最後儲存結果至 localStorage
 */
export function changeTop(todoObj) {
  todoObj.top = !todoObj.top;
  // 存進 localStorage
  setStorage(DATA);
}

/**
 * * 反轉重要星號的狀態(處理來自 todoItem 所觸發的事件)
 */
export function changeTopByTodoItem(e) {
  // 從 .todo__item 取得 id
  const currentTodoId = e.target.closest(".todo__item").id;

  // 取得當前 todo 資料
  const currentTodo = getCurrentTodo(currentTodoId);

  // 反轉在資料中的 checkbox 值，並儲存
  changeTop(currentTodo);

  // 改變星號的樣式
  e.target.classList.toggle("fa-solid");
  e.target.classList.toggle("fa-regular");

  // 如果此頁位於 top，則 todo 在被按下星號後，立即渲染，讓該項從此頁消失
  if (getCurrentPageId() === "top") {
    Router();
  }

  // 移動到 defaultlist
  moveTopToDefaultlist(currentTodo);
}

/**
 * * 反轉重要星號的狀態(處理來自 editModal 所觸發的事件)
 */
export function changeTopByEditModal(e) {
  e.preventDefault();
  // 從他們的上層找 dataset.id (我將 todo 的 id 使用 dataset 的方式放在 modal__form)
  const currentTodoId = e.target.closest(".modal__form").dataset.id;
  // 取得當前 todo 資料
  const currentTodo = getCurrentTodo(currentTodoId);
  // 反轉在資料中的 checkbox 值，並儲存
  changeTop(currentTodo);

  //  editModal 內的星星 icon (<i> tag)
  const editModalStarIcon = e.target.children[0];

  // 反轉 editModal 內的星星 icon
  // 因為 eidtModal 內的星星不是使用 checkbox 來做，所以不會在點擊之後就改變樣式，所以這邊要設定被按下去之後星星的樣式切換。
  editModalStarIcon.classList.toggle("fa-solid");
  editModalStarIcon.classList.toggle("fa-regular");

  // 如果此頁位於 Top:
  if (getCurrentPageId() === "top") {
    // 立即觸發渲染，此時 top === false 的 todo 將從會此頁消失
    Router();

    // 如果 editModalStarIcon 的 classList 含有 "fa-regular"，代表現在該項 todo 的 top 被取消掉了。
    // 防止編輯一個已經消失的 todo:
    //  1.禁用 editModal 內 checkbox 的勾選功能
    //  2.禁用 editModal 內 textarea 的輸入功能
    const checkboxInEditModal = e.target.previousElementSibling;
    const textareaInEditModal = e.target.parentElement.previousElementSibling;
    if (editModalStarIcon.classList.contains("fa-regular")) {
      textareaInEditModal.setAttribute("disabled", "true");
      checkboxInEditModal.classList.add("modal__check-option--disabled");
    } else {
      textareaInEditModal.removeAttribute("disabled");
      checkboxInEditModal.classList.remove("modal__check-option--disabled");
    }
  } else {
    // 如果此頁不是位於 top，則在按下星號後不渲染。
    // 在不渲染的情況下，直接透過 click editModal 內的星星來改變 todoItem 內的星星樣式
    // ? 不渲染的原因是:如果在 dropdown 會在渲染過後初始化，除非 dropdown 的開合有被儲存，那渲染就沒問題
    const starInTodoItem = document.querySelector(`#${currentTodoId} .top`);
    starInTodoItem.classList.toggle("fa-solid");
    starInTodoItem.classList.toggle("fa-regular");
  }

  // 移動到 defaultlist
  moveTopToDefaultlist(currentTodo);
}

/**
 * * 清除已完成的 todo，根據所在頁面不同，會調用不同的函數
 */
export function removeCompleted() {
  const currentPageId = getCurrentPageId();

  switch (currentPageId) {
    case "home":
      removeCompleted(homeCallback);
      break;

    case "top":
      removeCompleted(topCallback);
      break;

    case "defaultlist":
      removeCompletedFromCurrentPage();
      console.log("defaultlist");
      break;

    default:
      removeCompletedFromCurrentPage();
      break;
  }

  setStorage(DATA);
  Router();

  /**
   * * 清除已完成 - 遍歷 DATA 內所有的物件，過濾掉已完成的 todo(根據所在的頁面不同，有不同的過濾方式)
   * 1. 此函數適用於當前頁面是 Home (list-view) 或是 Top 時
   * 2. 接收一個 callback function 作為參數，該 callback function 用來決定過濾的條件
   * 3. 透過上方的 switch() 決定傳入的 callback 為何
   * 4. 如果當前頁面位於 Home，則會將 homeCallback 傳入；如果當前頁面位於 Top 則會將 topCallback 傳入。
   * @param {*} callback 接收 `homeCallback` 或 `topCallback` 作為參數
   */
  function removeCompleted(callback) {
    for (let pageType in DATA) {
      if (Array.isArray(DATA[pageType])) {
        DATA[pageType].forEach((pageObj, index) => {
          DATA[pageType][index].content = pageObj.content.filter(callback);
        });
      }
    }
  }

  /**
   * * 清除已完成 - 刪除自身頁面資料中 checked === true 的 todo
   * 此頁面適用於 defaultlist & customlist，因為他們的 todo 都各自存放在各自的資料中
   */
  function removeCompletedFromCurrentPage() {
    const currentPage = getCurrentPage();
    currentPage.content = currentPage.content.filter(
      ({ checked }) => checked === false
    );
  }

  /**
   * * 在 Home 頁面清除已完成時傳入 removeCompleted() 的參數
   * @param {*} todoObj
   * @returns 返回所有 todoObj.checked === true 的 todo
   */
  function homeCallback(todoObj) {
    return todoObj.checked === false;
  }

  /**
   * * 在 Top 頁面清除已完成時傳入 removeCompleted() 的參數
   * @param {*} todoObj
   * @returns 由於 removeCompleted() 檢查 DATA 內所有的物件，
   * 為了防止刪除到其他頁面的資料，返回值(能繼續留在清單內的 todo)必須要注意該 todo 是來自於哪裡:
   * 1. 只要在 Top 頁面以外的 todo 都必須被留下來(todoObj.top === false)
   * 2. 至於在 Top 頁面以內的 todo ，必須要是還沒被勾選為已完成(todoObj.top === true && checked === false)
   *    才可繼續被留在清單
   */
  function topCallback(todoObj) {
    return (
      todoObj.top === false ||
      (todoObj.top === true && todoObj.checked === false)
    );
  }
}

/**
 * @ 困難點在於: 總覽跟重要，必須深入每一個 obj 刪除他的內容
 *
 * - 在「總覽 list-view」按下刪除已完成  ★★★★★
 *    - 找出每一個 DATA 中的 page Object 中 checked === true 的物件
 *
 * - 在「預設列表」按下刪除已完成  ★☆☆☆☆
 *    很單純，只要找到該頁面的物件之後，從 content 屬性中剔除掉所有 checked === true 的項目
 *
 * - 在「重要」按下刪除已完成 ★★★★☆
 *    - 找出每一個 DATA 中的 page Object 中找出 top === true && checked === true 的元素，刪除它
 *
 * - 在「自訂列表」按下刪除已完成 ★☆☆☆☆
 *    很單純，只要找到該頁面的物件之後，從 content 屬性中剔除掉所有 checked === true 的項目
 *
 */
