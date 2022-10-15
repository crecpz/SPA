import { scrollBarFix } from "../function/fix.js";
import {
    fillZero,
    getAllPage,
    getAllTodos,
    getPage,
    hide,
    unhide,
} from "../function/helper.js";
import {
    clearColorSelectorActive,
    closeConfirmModal,
    closeEditModal,
    closeEditNameModal,
    closeModalOverlay,
    createNewList,
    listIsAdding,
    listIsRemoving,
    removeTodoConfirm,
    todoEditing,
    todoIsEditing,
} from "../function/modal.js";
import {
    changeCheckbox,
    changeTopByEditModal,
    changeTopByTodoItem,
    DATA,
    removeTodo,
    saveEditedTodo,
} from "../function/storage.js";
import {
    clickToCloseListOption,
    dropdownSwitch,
    openListOption,
} from "../function/ui.js";
import { Router } from "../routes/Router.js";

export const Home = {
    state: {
        view: "grid-view",
    },

    mount: function () {
        scrollBarFix();
    },

    render: function () {
        // @ 提醒: 
        // 1.在「總覽」中並不打算顯示出 top.js 的內容，因為不需要追蹤一個來自各頁內容的頁面完成進度
        // 2.以下頁面透過 Home.state.view 的值來顯示兩種不同的顯示方式，分別為 grid-view & list-view
        const currentView = Home.state.view;
        let contentsWillBeDisplayed = "";

        // * --------------------------- grid-view  -----------------------------------

        if (currentView === "grid-view") {
            // * 準備「預設列表」總覽卡片:
            const defaultlist = getPage("defaultlist");

            // * 準備自訂列表總覽卡片
            // 如果頁面物件是來自於 customlist ，則為頁面物件新增一個 isCustom 的屬性並設為 true，
            // 此屬性可以在下面遍歷的時候用來判斷 <a> 的 href 內容是否該加 customlist/。
            // (因為 customlist 的網址結構跟其他頁面不同)
            const custom = DATA.custom;
            custom.forEach((pageObj) => {
                pageObj.isCustom = true;
            });

            // 將上述準備的的內容放入陣列
            const contentArray = [defaultlist, ...custom];
            // 利用 map 遍歷 overviewData
            contentsWillBeDisplayed = contentArray
                .map(({ name: pageName, content, isCustom, id, color }) => {
                    // 如果 content 裡面沒內容，則不渲染 overview 卡片
                    if (content.length === 0) {
                        return "";
                    }

                    // 全部數量
                    const all = content.length;
                    // 未完成數量
                    const unCompleted = content.filter((todo) => !todo.checked).length;
                    // 已完成數量
                    const completed = content.filter((todo) => todo.checked).length;
                    // 完成百分比
                    const percentage = isNaN(Math.round((completed / all) * 100))
                        ? "0"
                        : fillZero(Math.round((completed / all) * 100));
                    return `
                    <a href="#/${isCustom ? "customlist/" + id : id
                        }" class="overview__link">
                        <div class="overview__header">
                            ${color
                            ? `<div class="overview__color-block color-block color-block-${color}"></div>`
                            : ""
                        }
                            ${pageName}
                        </div>
                        <div class="overview__content">
                            <div class="overview__text overview__text--column">待完成
                                <span class="overview__number overview__number--lg">${unCompleted}</span>
                            </div>
                            <div class="overview__group">
                                <div class="overview__text">全部
                                    <span class="overview__number overview__number--sm">${all}</span>
                                    </div>
                                    <div class="overview__text">已完成
                                    <span class="overview__number overview__number--sm">${completed}</span>
                                    </div>
                            </div>
                            <div class="overview__progress-bar progress">
                            <span class="progress__value">${percentage}%
                            </span>
                            <div class="progress__outer">
                                    <div class="progress__inner" style="width:${percentage}%"></div>
                                </div>
                            </div>
                        </div>
                    </a>
                `;
                })
                .join("");

        } else if (currentView === "list-view") {
            // * --------------------------- list-view  -----------------------------------
            //  將有頁面的物件資料放進 allPages
            const contentArray = getAllPage().filter(({ id }) => id !== "top");
            contentsWillBeDisplayed = contentArray.map(({ name, content, color }) => {
                // 每一個 dropdown 內的 todoList 內容
                const todoListInDropdown = content.map(({ id, checked, content, top }) => {
                    return `
                        <li id="${id}" class="todo__item">
                            <label class="todo__checkbox checkbox">
                                <input type="checkbox" class="checkbox__input" ${checked ? "checked" : ""}>
                                <div class="checkbox__appearance"></div>
                            </label>
                            <p class="todo__content">${content}</p>
                            <i class="top ${top ? "fa-solid" : "fa-regular"} fa-star"></i> 
                        </li>
                    `;
                }).join("")


                // 判斷如果 content 沒任何內容，就渲染空字串就好
                if (content.length === 0) {
                    return "";
                } else {
                    return `
                        <li class="dropdown">
                            <div class="dropdown__name">
                                ${color ? `<div class="dropdown__color-block color-block color-block-${color}"></div>` : ""}
                                ${name}
                                <i class="dropdown__arrow fa-solid fa-chevron-right"></i>
                            </div>
                            <div class="dropdown__cover">
                                <ul class="todo">
                                    ${todoListInDropdown}
                                </ul>
                            </div>
                        </li>
                    `;
                }
            }).join("");
        }

        return `
            <!-- 主內容區 header -->
            <div class="main__content-header">
                <div class="container">
                    <div class="main__name-wrapper">
                        <div class="main__color-block color-block--default"></div>
                        <h2 class="main__name">總覽</h2>
                        <div class="main__button-group">
                            <button data-view="grid-view" class="main__view-btn btn ${currentView === "grid-view" ? "main__view-btn--active" : ""}">
                                <i class="fa-solid fa-table-cells-large"></i>
                            </button>
                            <button data-view="list-view" class="main__view-btn btn ${currentView === "list-view" ? "main__view-btn--active" : ""}">
                                <i class="fa-solid fa-list-ul"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- main content list -->
            <div class="main__content-list">
                <div class="container">
                ${currentView === "grid-view"
                ? `<div class="overview">${contentsWillBeDisplayed}</div>`
                : `<ul class="dropdowns"> ${contentsWillBeDisplayed}</ul>`}
                </div>
            </div>
        `;
    },

    listener: {
        click: (e) => {
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

            // * 變更列表視圖
            if (e.target.classList.contains("main__view-btn")) {
                // 偵測使用者點擊的 view 模式，來改變 state 的值，
                // 此 state 的值用來決定本頁要渲染的 view 模式
                Home.state.view = e.target.dataset.view;

                document
                    .querySelectorAll(".main__view-btn")
                    .forEach((btn) => btn.classList.remove("main__view-btn--active"));
                e.target.classList.add("main__view-btn--active");

                if (e.target.id === "grid-view") {
                    Home.state.view = "grid-view";
                }

                if (e.target.id === "list-view") {
                    Home.state.view = "list-view";
                }

                Router();
            }

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

            // * dropdown 切換
            if (e.target.classList.contains("dropdown__name")) {
                dropdownSwitch(e);
            }

            // * confirmModal 的全局設定
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
            // checkbox
            changeCheckbox(e);

            // * 偵測在 todoEditing 為 true 的狀態下 change 事件是否由 .modal__textarea 觸發
            if (todoIsEditing && e.target.classList.contains("modal__textarea")) {
                saveEditedTodo(e);
            }
        },
    },
};
