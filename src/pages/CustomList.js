import { DATA, hide, unhide } from "../utils/function.js";

import {
  clickToCloseListOption,
  removeList,
  removeListConfirm,
  closeModalOverlay,
  changeCheckbox,
  scrollBarFix,
  closeConfirmModal,
  closeEditModal,
  changeTop,
  removeTodoConfirm,
  listIsRemoving,
  nameIsEditing,
  editName,
  saveEditedName,
  todoIsEditing,
  todoEditing,
  removeTodo,
  saveEditedTodo,
  openListOption,
  changeTopFromTodoItem as changeTopByTodoItem,
  changeTopFromEditModal as changeTopByEditModal,
} from "../layout/main.js";

export const CustomList = {
  mount: function () {
    scrollBarFix();
  },

  render: function (props) {
    const pageData = DATA.custom.find((page) => page.id === props.id);
    const { name: pageName, content: pageContent } = pageData;
    const todoContent = pageContent
      .map(({ id, checked, content, top }) => {
        return `
                <li id="${id}" class="todo__item">
                  <label class="todo__checkbox checkbox">
                    <input type="checkbox" class="checkbox__input" ${
                      checked ? "checked" : ""
                    }>
                    <div class="checkbox__appearance"></div>
                  </label>
                  <p class="todo__content">${content}</p>
                  <i class="top ${
                    top ? "fa-solid" : "fa-regular"
                  } fa-star"></i> 
                </li>
        `;
      })
      .join("");

    return `
        <!-- 主內容區 header -->
        <div class="main__content-header">
            <div class="container">
                <div class="main__name-wrapper">
                    <div class="main__color-block"></div>
                    <input type="text" class="main__name" value="${pageName}" readonly>
                </div>
                <!-- 清單選單按鈕 -->
                <button class="btn btn--list-option"><i class="fa-solid fa-ellipsis"></i></button>
                <!-- 清單選單 -->
                <ul class="list-options">
                    <li class="list-option">
                      <a href="javascript:;" class="list-option__link list-option__link--rename">重新命名</a>
                    </li>
                    <li class="list-option">
                      <a href="javascript:;" class="list-option__link">編輯</a>
                    </li>
                    <li class="list-option">
                      <a href="javascript:;" class="list-option__link">排序</a>
                    </li>
                    <li class="list-option">
                      <a href="javascript:;" class="list-option__link list-option__link--remove">刪除清單</a>
                    </li>
                </ul>
            </div>
        </div>

        <!-- main content list -->
        <div class="main__content-list">
            <div class="container">
                <ul id="todo" class="todo">
                  ${todoContent}
                </ul>
            </div>
        </div>
    `;
  },

  listener: {
    click: function (e) {
      // * listOption 開啟 & 關閉
      // 判斷是否要開啟 listOption
      openListOption(e);
      // 點擊任意處來關閉 listOption
      clickToCloseListOption(e);

      // * confirmModal 的全局設定(只要用到 confirmModal 就需要此設定)
      // 在 confirm modal 為顯示的狀態時，無論使用者按下哪一個按鈕，都會關閉 confirm-modal
      // 至於是否要接著一起關閉 modal-overlay，取決於目前是否為 listIsRemoving 狀態，
      // 如果現在是 listIsRemoving 狀態，使用者在按下任何一個按鈕之後都意味著對話框將結束，
      // 如果現在不是 listIsRemoving 狀態，使用者在按下任何一個按鈕之後可能還會有後續的對話框，
      // 這時就不必關閉 modalOverlay
      if (e.target.id === "confirm-cancel" || e.target.id === "confirm-yes") {
        // 關閉 confirm modal
        closeConfirmModal();

        // 如果目前處於 listIsRemoving 狀態，一併關閉 modal-overlay
        if (listIsRemoving) {
          // 關閉 modal-overlay
          closeModalOverlay();
        }
      }


      // * listOption - 刪除清單功能
      // 刪除清單 - 偵測使用者是否有點擊 "刪除清單" 來決定是否開啟 "確認刪除 modal"
      if (e.target.classList.contains("list-option__link--remove")) {
        // 確認刪除過程
        removeListConfirm();
      }

      // 刪除清單 - 確認目前是否為 listRemoving 狀態，並偵測使用者是否有點擊"確定刪除"
      if (listIsRemoving && e.target.id === "confirm-yes") {
        // 刪除清單在 DATA 中的資料
        removeList(e);
      }

      // * listOption - 清單重新命名
      // 清單重新命名
      if (e.target.classList.contains("list-option__link--rename")) {
        // nameIsEditing = true;
        editName();
      }

      /* 
        如果在編輯清單名稱的狀態下，點按的既不是「重新命名」按鈕，
        也不是 main__name 本身的話，就將 main__name 設定回 readonly。
        設定回 readonly 屬性後，如果內容與原本的內容有所變化，就會觸發 change 事件
        調用 saveEditedName() 函數來儲存改變。
       */
      if (
        nameIsEditing &&
        !e.target.classList.contains("main__name") &&
        !e.target.classList.contains("list-option__link--rename")
      ) {
        document
          .querySelector(".main__name")
          .setAttribute("readonly", "readonly");
      }

      // * 置頂星號
      // 如果目前點擊的目標是 <i> tag，且向上層尋找可以找到 .todo__item
      if (e.target.tagName === "I" && e.target.closest(".todo__item")) {
        changeTopByTodoItem(e);
      } else if (
        // 如果上述方法獲取不到內容，則代表使用者現在點擊的是位於 editModal 的星星
        e.target.classList.contains("modal__top") || // 使用者可能點的是 label
        e.target.classList.contains("top") // 使用者可能點的是 <i> tag
      ) {
        changeTopByEditModal(e);
      }

      // * 開啟編輯視窗
      if (e.target.classList.contains("todo__item")) {
        todoEditing(e);
      }

      // * 關閉編輯視窗
      if (e.target.id === "edit-close") {
        // 關閉 edit-modal
        closeEditModal();
        // 關閉 modal-overlay
        closeModalOverlay();
      }

      // * 刪除單項 todo
      // 確認階段 - 跳出確認框
      if (e.target.id === "edit-delete") {
        // 隱藏 editModal (視覺上隱藏 editModal，並非真的關閉)
        hide("#edit-modal");
        // 取得 todo id ，並將其傳進 removeTodoConfirm 中做確認
        const removeTodoId = e.target.closest(".modal__form").dataset.id;
        removeTodoConfirm(removeTodoId);
      }

      // 若使用者在 todoEditing 模式下按下了取消按鈕，代表使用者決定不刪除此項 todo
      if (todoIsEditing && e.target.id === "confirm-cancel") {
        // 關閉 confirmModal
        closeConfirmModal();
        // 再度回到 editModal(將已經被隱藏的 editModal 再度展開)
        unhide("#edit-modal");
      }

      // 若使用者在 todoEditing 模式下按下了 confirm-yes 按鈕，代表使用者確定要刪除此項 todo
      if (todoIsEditing && e.target.id === "confirm-yes") {
        // 取得欲刪除的 todo 的 id (透過位於 .modal__form 中的 data-id 屬性取得 id)
        const removeTodoId =
          e.target.closest("#confirm-modal").nextElementSibling.children[0]
            .dataset.id;
        removeTodo(removeTodoId);
      }
    },

    change: (e) => {
      //* 變更 checkbox 狀態
      changeCheckbox(e);

      // * 偵測在 nameIsEditing 為 true 的狀態下 change 事件是否由 .main__name 觸發
      if (nameIsEditing && e.target.classList.contains("main__name")) {
        saveEditedName();
      }

      // * 偵測在 todoEditing 為 true 的狀態下 change 事件是否由 .modal__textarea 觸發
      if (todoIsEditing && e.target.classList.contains("modal__textarea")) {
        saveEditedTodo(e);
      }
    },

    keyup: (e) => {
      if (e.key === "Enter") {
        // 如果清單重新命名時下按 enter 可儲存編輯
        saveEditedName();
      }
    },
  },
};
