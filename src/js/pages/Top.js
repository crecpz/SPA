import { scrollBarFix } from "../function/fix.js";
import { getAllPage, getAllTodos, hide, unhide } from "../function/helper.js";
import { clearColorSelectorActive, closeConfirmModal, closeEditModal, closeEditNameModal, closeModalOverlay, createNewList, listIsAdding, listIsRemoving, removeTodoConfirm, todoEditing, todoIsEditing } from "../function/modal.js";
import { changeCheckbox, changeTopByEditModal, changeTopByTodoItem, DATA, removeTodo, saveEditedTodo } from "../function/storage.js";
import { clickToCloseListOption, openListOption } from "../function/ui.js";



export const Top = {
  mount: function () {
    scrollBarFix();
  },

  render: function () {
    // 找出此頁面 object
    const pageObj = DATA.default.find(({ id }) => id === "top");
    // 提取出 pageName
    const { name: pageName} = pageObj;
    // 找出所有 top 屬性帶有 true 的 todo Object，放入 pageContent 中
    const pageContent = getAllTodos().filter((todo) => todo.top === true);

    // 遍歷 pageContent: 準備好所有會在 Top.js 會出現的 todoList
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
                <div class="main__color-block color-block--default"></div>
                <h2 class="main__name">${pageName}</h2>
              </div>
              <!-- 列表選單按鈕 -->
              <button class="btn btn--list-option"><i class="fa-solid fa-ellipsis"></i></button>
              <!-- 列表選單 -->
              <ul class="list-options">
                  <li class="list-option">
                    <a href="javascript:;" class="list-option__link">編輯</a>
                  </li>
                  <li class="list-option">
                    <a href="javascript:;" class="list-option__link">排序</a>
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
      // * 列表名稱設定相關(editNameModal)
      // 當使用者在 「任何情況下」 按下 editNameModal 內的 "完成按鈕"
      if (e.target.id === "edit-name-close") {
        // 關閉 editNameModal & modalOverlay
        closeEditNameModal();
        closeModalOverlay();
      }
      // 當使用者在 「 listIsAdding 狀態下」 按下 editNameModal 內的 "完成按鈕"
      if (listIsAdding && e.target.id === "edit-name-close") {
        // 彙整使用者在 editNameModal 輸入的內容，套用到新的列表名稱設定上
        createNewList(e);
      }
      // 控制顏色選擇器的 active 顯示
      if (e.target.classList.contains("modal__color-block")) {
        clearColorSelectorActive();
        e.target.classList.add("modal__color-block--active");
      }

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
      
      // ! 這個函式之後再回過頭來看在重要取消後何去何從
      // * 重要星號
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

    change: function (e) {
      //* 變更 checkbox 狀態
      changeCheckbox(e);

      // * 偵測在 todoEditing 為 true 的狀態下 change 事件是否由 .modal__textarea 觸發
      if (todoIsEditing && e.target.classList.contains("modal__textarea")) {
        saveEditedTodo(e);
      }
    },
  },
};
