import { scrollBarFix } from "../function/fix.js";
import { getAllTodos, getSearchResult, hide, removeTodoInSearchResult, searchResult, unhide } from "../function/helper.js";
import { closeConfirmModal, closeEditModal, closeModalOverlay, listIsRemoving, removeTodoConfirm, todoEditing, todoIsEditing } from "../function/modal.js";
import { changeCheckbox, changeTopByEditModal, changeTopByTodoItem, DATA, removeTodo, saveEditedTodo } from "../function/storage.js";
import { createEmptyMsg, emptyMsg, switchSearchPage } from "../function/ui.js";
import { Router } from "../routes/Router.js";

export const Search = {
  state: {
    isSearching: true,
  },

  mount: () => {
    scrollBarFix(".main__search-result");
    // const mainSearchResult = document.querySelector(".main__search-result");
    // mainSearchResult.style.paddingRight =
    //   mainSearchResult.offsetWidth - mainSearchResult.clientWidth
    //     ? mainSearchResult.offsetWidth - mainSearchResult.clientWidth + "px"
    //     : "";
  },

  render: () => {
    // * 準備 emptyMsg
    const emptyMsgContent = createEmptyMsg(
      emptyMsg.search.msgText,
      emptyMsg.search.svgTag,
      "#888"
    );

    // * 準備要顯示出來的搜尋結果
    // 檢查 searchInput 是否為空
    const searchInputIsEmpty = document.getElementById('search-input').value.trim() === "";
    // 檢查是否"找不到搜尋結果"
    const noSearchResult = searchResult.length === 0;

    // 此 result 變數最後會放到下方 return 中，渲染至頁面
    let result = '';

    // 如果目前 searchInput 是否為空，則顯示 emptyMsg
    if (searchInputIsEmpty) {
      result = emptyMsgContent;
    } else { // 如果 searchInput 有輸入內容
      // 如果有輸入內容，但搜尋不到結果，顯示搜尋不到的文字提示
      if (noSearchResult) {
        result =
          `<ul id="todo" class="todo">
            <p class="text-center" > 找不到您所輸入的內容</p>
          </ul >`;
      } else { // 如果搜尋到結果，則顯示結果
        result =
          `<ul id="todo" class="todo">
            ${searchResult.map(({ id, checked, content, top , srcName}) => {
              return `
                      <li id="${id}" class="todo__item todo__item--search ${checked ? "todo__item--isChecked" : ""}">
                        <label class="todo__checkbox checkbox">
                          <input type="checkbox" class="checkbox__input" ${checked ? "checked" : ""}>
                          <div class="checkbox__appearance"></div>
                        </label>
                        <p class="todo__content">${content}</p>
                        <i class="top ${top ? "fa-solid" : "fa-regular"} fa-star"></i>
                        <p class="todo__info"><i class="fa-solid fa-circle-info"></i><span class="text-strong">來自:</span> ${srcName}</p>
                      </li>
                  `;
            }).join("")
          }
          </ul >`;
      }
    }

    return `
      <!-- 主內容區 - list -->
      <div class="main__search-result">
        <div class="container">
          ${result}
        </div>
      </div>
    `;
  },

  listener: {
    click: (e) => {
      // * 偵測使用者是否在 Search 頁面按下 "#back-btn"
      if (e.target.id === "back-btn") {
        // 切換搜尋頁面 UI
        switchSearchPage();
        // 返回上一頁
        history.back();
      }

      // * 偵測使用者在輸入框中是否按下 x ，若按下則清除文字
      if (e.target.id === "clear-text-btn") {
        e.target.previousElementSibling.value = '';
        Router()
      }


      // * confirmModal 設定
      // 在 confirm modal 為顯示的狀態時，無論使用者按下哪一個按鈕，都會關閉 confirm-modal
      // 至於是否要接著一起關閉 modal-overlay，取決於目前是否為 listIsRemoving 狀態，
      // 如果現在是 listIsRemoving 狀態，使用者在按下任何一個按鈕之後都意味著對話框將結束，
      // 如果現在不是 listIsRemoving 狀態，使用者在按下任何一個按鈕之後可能還會有後續的對話框，
      // 這時就不必關閉 modalOverlay
      if (e.target.id === "confirm-cancel" || e.target.id === "confirm-yes") {
        e.preventDefault();

        // 關閉 confirm modal
        closeConfirmModal();

        // 如果目前處於 listIsRemoving 狀態，一併關閉 modal-overlay
        if (listIsRemoving) {
          // 關閉 modal-overlay
          closeModalOverlay();
        }
      }

      // * 重要星號
      // 如果目前點擊的目標是 <i> tag，且向上層尋找可以找到 .todo__item
      if (e.target.tagName === "I" && e.target.closest(".todo__item")) {
        changeTopByTodoItem(e);
      } else if (
        // 如果上述方法獲取不到內容，則代表使用者現在點擊的是位於 editModal 的星星
        e.target.classList.contains("modal__top")
      ) {
        changeTopByEditModal(e);
      }


      // * 開啟編輯 todoItem 視窗
      if (e.target.classList.contains("todo__item")) {
        todoEditing(e);
      }


      // * 關閉編輯 todoItem 視窗
      if (e.target.id === "edit-close") {
        e.preventDefault();
        // 關閉 edit-modal
        closeEditModal();
        // 關閉 modal-overlay
        closeModalOverlay();
      }

      // * 刪除單項 todo
      // 確認階段 - 跳出確認框
      if (e.target.id === "edit-delete") {
        e.preventDefault();
        // 隱藏 editModal (視覺上隱藏 editModal，並非真的關閉)
        hide("#edit-modal");
        // 取得 todo id ，並將其傳進 removeTodoConfirm 中做確認
        const removeTodoId = e.target.closest(".modal__form").dataset.id;
        removeTodoConfirm(removeTodoId);
      }

      // 使用者反悔 - 若使用者在 todoEditing 模式下按下了取消按鈕，代表使用者決定不刪除此項 todo
      if (todoIsEditing && e.target.id === "confirm-cancel") {
        // 關閉 confirmModal
        closeConfirmModal();
        // 再度回到 editModal(將已經被隱藏的 editModal 再度展開)
        unhide("#edit-modal");
      }

      // 使用者確定要刪除 - 若使用者在 todoEditing 模式下按下了 confirm-yes 按鈕，代表使用者確定要刪除此項 todo
      if (todoIsEditing && e.target.id === "confirm-yes") {
        // 取得欲刪除的 todo 的 id (透過位於 .modal__form 中的 data-id 屬性取得 id)
        const removeTodoId =
          e.target.closest("#confirm-modal").nextElementSibling.children[0].dataset
            .id;
        removeTodo(removeTodoId);
        // ! 重新更新結果並顯示出來(此 function 只在此頁使用)
        removeTodoInSearchResult(removeTodoId)
      }
    },

    change: (e) => {
      //* 變更 checkbox 狀態
      changeCheckbox(e);

      // * 偵測在 todoEditing 為 true 的狀態下 change 事件是否由 .modal__textarea 觸發
      if (todoIsEditing && e.target.classList.contains("modal__textarea")) {
        saveEditedTodo(e);
      }
    },

    input: (e) => {
      if (e.target.id === "search-input") {
        // 取得搜尋結果
        getSearchResult(e);
        // 每次的 input 都觸發渲染
        Router();
      }
    },

    keydown: (e) => {
      // 防止 input 在使用者按下 enter 時自動刷新
      if (e.keyCode === 13) {
        e.preventDefault();
      }
    },
  }
};
