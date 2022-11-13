import { scrollBarFix } from "../function/fix.js";
import { fillZero, getAllPage } from "../function/helper.js";
import { todoIsEditing } from "../function/modal.js";
import { changeCheckbox, DATA, saveEditedTodo } from "../function/storage.js";
import {
  createEmptyMsg,
  dropdownSwitch,
  emptyMsg,
  hasCompletedTodo,
  pageClickEvent,
  switchRemoveCompletedBtn,
} from "../function/ui.js";
import { Router } from "../routes/Router.js";

export const Home = {
  state: {
    // 記錄目前的總覽模式(grid-view & list-view)
    view: "grid-view",
    // 紀錄 list-view 中的 dropdown 目前是展開還是收起
    // expandInfo 內放的是: {id: "string", isExpand: boolean}
    expandInfo: [],
  },

  render() {
    // @ 提醒:
    // 1.在「總覽」中並不會顯示出 top.js 的內容，因為 top 的內容是來自於所有頁面中加上星號的內容，不需要在顯示它的進度。
    // 2.以下頁面透過 Home.state.view 的值來顯示兩種不同的顯示方式，分別為 grid-view & list-view，該狀態存放在 Home.state 中。

    // 存放目前 view 模式
    // const currentView = Home.state.view;
    const currentView = this.state.view;

    // 存放 grid-view 或是 list-view 的內容 (實際會放哪種內容在內取決於 currentView)
    let viewContent = "";

    // 獲取所有的頁面物件資料(排除 top 頁面)
    const pageContentObjects = getAllPage().filter(({ id }) => id !== "top");

    // 如果 state.expandInfo 為空陣列，則放入初始值
    if (this.state.expandInfo.length === 0) {
      this.state.expandInfo = pageContentObjects.map(({ id }) => ({
        id: id,
        isExpand: false,
      }));
    }

    // * --------------------------- grid-view  -----------------------------------

    if (currentView === "grid-view") {
      // * 準備「自訂列表」總覽卡片
      // 如果頁面物件是來自於 customlist ，則為頁面物件新增一個 isCustom 的屬性並設為 true，
      // 此屬性可以在下面遍歷的時候用來判斷 <a> 的 href 內容是否該加 customlist/。
      // (因為 customlist 的網址結構跟其他頁面不同)
      // const custom = DATA.custom;
      DATA.custom.forEach((pageObj) => {
        pageObj.isCustom = true;
      });

      viewContent = pageContentObjects
        .map(({ name: pageName, content, isCustom, id, color }) => {
          // 如果 content 裡面沒內容，則不渲染 overview 卡片
          if (content.length === 0) {
            return "";
          }

          // 全部數量
          const all = content.length;
          // 待完成數量
          const unCompleted = content.filter((todo) => !todo.checked).length;
          // 已完成數量
          const completed = content.filter((todo) => todo.checked).length;
          // 完成百分比
          const percentage = isNaN(Math.round((completed / all) * 100))
            ? "0"
            : fillZero(Math.round((completed / all) * 100));

          return `
              <a href="#/${
                isCustom ? "customlist/" + id : id
              }" class="overview__link ${
            unCompleted === 0 ? "overview__link--completed" : ""
          }">
                  <div class="overview__header" title="${pageName}">
                      ${
                        color === "default"
                          ? ""
                          : `<div class="overview__color-block color-block color-block-${color}"></div>`
                      }
                      <p class="overview__name-text">${pageName}</p>
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
                        <span class="progress__value">${percentage}%</span>
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

      viewContent = pageContentObjects
        .map(({ id, name, content, color }) => {
          // * 每一個 dropdown 內的 todoList 結構
          const todoListInDropdown = content
            .map(({ id, checked, content, top }) => {
              return `
                <li id="${id}" class="todo__item ${
                checked ? "todo__item--isChecked" : ""
              }">
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

          // * 每一個 dropdown 結構
          if (content.length === 0) {
            // 如果 content 沒任何內容，就渲染空字串
            return "";
          } else {
            // 設定目前的 dropdown__cover 高度
            let dropdownCoverStyle = "";
            // 根據目前的 expand 狀態決定是否要在相對應的元素上面放上相對應的 class
            let dropdownCoverClosing = "";
            let dropdownArrowClass = "";
            // 此變數表示: 當前的 dropdown 是新的(原本 expandInfo 沒有)，預設 false
            let isNewExpandInfo = false;
            // 如果在 state.expandInfo 找得到資料
            if (this.state.expandInfo.find((i) => i.id === id)) {
              // 則根據資料的內容決定其高度
              if (!this.state.expandInfo.find((i) => i.id === id).isExpand) {
                dropdownArrowClass = "dropdown__arrow--closing";
                dropdownCoverStyle = "height: 0px;";
                dropdownCoverClosing = "dropdown__cover--closing";
              }
            } else {
              // 如果找不到資料
              // 新增一個(預設讓它收合)
              this.state.expandInfo.push({ id: id, isExpand: false });
              // 新增初始值之後，將 isNewExpandInfo 設為 true
              isNewExpandInfo = true;
              // 下面的 dropdown__cover 內的 style="" 屬性將會依據此 dropdown 是不是新的來決定
              // 如果目前的 dropdown 是新的，則將其設為 height: 0px;
              // 反之，則根據上面 dropdownCoverStyle 的結果。
            }

            return `
              <li class="dropdown">
                  <div class="dropdown__name" title="${name}" data-id="${id}">
                    ${
                      color === "default"
                        ? ""
                        : `<div class="dropdown__color-block color-block color-block-${color}"></div>`
                    }
                    <p class="dropdown__name-text">${name}</p>
                    <i class="dropdown__arrow fa-solid fa-chevron-right ${dropdownArrowClass}"></i>
                  </div>
                  <div class="dropdown__cover ${dropdownCoverClosing}"
                    style="${
                      isNewExpandInfo ? "height: 0px;" : dropdownCoverStyle
                    }"
                  >
                    <ul class="todo">
                        ${todoListInDropdown}
                    </ul>
                  </div>
              </li>
            `;
          }
        })
        .join("");
    }

    // * 決定最終要顯示什麼到 .main__content-list 內
    // 存放 .main__content-list 內要顯示的內容
    let displayContent = "";

    // 檢查 pageContentObjects 中所有物件的 content 屬性，看看是否全部都沒有內容
    // (如果全部都沒內容就必須讓 empty-msg 出現)
    const noContent = pageContentObjects.every(
      (pageObj) => pageObj.content.length === 0
    );
    // contentsWillBeDisplayed 的內容將會是以下狀況其一:
    // 1. currentView === grid-view && noContent === true ---> contentsWillBeDisplayed = grid-view 專用的 emptyMsg
    // 2. currentView === grid-view && noContent === false ---> contentsWillBeDisplayed =  grid-view 的內容
    // 3. currentView === list-view && noContent === true ---> contentsWillBeDisplayed = list-view 專用的 emptyMsg
    // 4. currentView === list-view && noContent === false ---> contentsWillBeDisplayed = list-view 的內容
    if (currentView === "grid-view") {
      if (noContent) {
        displayContent = createEmptyMsg(
          emptyMsg.home.gridView.msgText,
          emptyMsg.home.gridView.svgTag,
          "#888"
        );
      } else {
        displayContent = `<div class="overview">${viewContent}</div>`;
      }
    } else {
      if (noContent) {
        displayContent = createEmptyMsg(
          emptyMsg.home.listView.msgText,
          emptyMsg.home.listView.svgTag,
          "#888"
        );
      } else {
        displayContent = `<ul class="dropdowns"> ${viewContent}</ul>`;
      }
    }

    return `
            <!-- 主內容區 - header -->
            <div class="container">
              <div class="main__content-header">
                <div class="main__name-wrapper">
                    <div class="main__color-block color-block--default"></div>
                    <p class="main__name">總覽</p>
                    <button class="main__list-option-btn main__list-option-btn--default-list btn btn--list-option
                      ${currentView === "grid-view" ? "hidden" : ""}"
                    >
                        <i class="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                    <!-- list-options -->
                    <ul class="list-options list-options--home">
                      <li class="list-option">
                        <a href="javascript:;" class="list-option__link remove-completed ${
                          hasCompletedTodo ? "" : "not-allowed"
                        }">清除完成事項</a>
                      </li>
                    </ul>
                    <button class="main__clear-completed-btn remove-completed btn btn--primary btn--sm ${
                      currentView === "grid-view" || noContent ? "hidden" : ""
                    } ${hasCompletedTodo ? "" : "not-allowed"}">
                      清除完成事項
                    </button>
                    <div class="main__view-btns">
                        <button data-view="grid-view" class="main__view-btn btn 
                            ${
                              currentView === "grid-view"
                                ? "main__view-btn--active"
                                : ""
                            }">
                            <i class="fa-solid fa-table-cells-large"></i>
                        </button>
                        <button data-view="list-view" class="main__view-btn btn 
                            ${
                              currentView === "list-view"
                                ? "main__view-btn--active"
                                : ""
                            }">
                            <i class="fa-solid fa-list-ul"></i>
                        </button>
                    </div>
                </div>
                <!-- 輸入框 -->
                <form class="main__form todo-form ${
                  currentView === "grid-view" ? "hidden" : ""
                }">
                    <input type="text" id="todo-input" class="main__input todo-form__input" placeholder="輸入待辦事項...">
                    <button id="todo-submit" class="btn todo-form__submit">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </form>
              </div>

            <!-- list -->
            <div class="main__content-list">
              ${displayContent}
            </div>
          </div>
        `;
  },

  listener: {
    click: (e) => {
      pageClickEvent(e);

      if (e.target.id === "todo-submit") {
        document
          .querySelector('[data-id="defaultlist"]')
          .classList.add("animation-light-up");
      }

      // * 變更列表 view 模式
      if (
        e.target.classList.contains("main__view-btn") &&
        e.target.dataset.view !== Home.state.view // 重複點按相同的按鈕不需要執行
      ) {
        // 偵測使用者點擊的 view 模式，來改變 state 的值，
        // 此 state 的值用來決定本頁要渲染的 view 模式
        Home.state.view = e.target.dataset.view;

        // 取消任一被按下的 view btn，並將最新按到的 active
        document
          .querySelectorAll(".main__view-btn")
          .forEach((btn) => btn.classList.remove("main__view-btn--active"));
        e.target.classList.add("main__view-btn--active");

        if (e.target.dataset.view === "list-view") {
          switchRemoveCompletedBtn();
        }
        Router();
      }

      // * dropdown 切換
      if (e.target.classList.contains("dropdown__name")) {
        dropdownSwitch(e);

        // 取得 state.expandInfo
        const expandInfo = Home.state.expandInfo;
        // 尋找目前 e.target 的 data-id 是否存在於 state.expandInfo 中
        const currentExpand = expandInfo.find(
          ({ id }) => e.target.dataset.id === id
        );
        // 若存在
        if (currentExpand) {
          // 翻轉該項的 isExpand 值
          currentExpand.isExpand = !currentExpand.isExpand;
        } else {
          // 若不存在，則將其新增一個初始值
          expandInfo.push({ id: e.target.dataset.id, isExpand: false });
        }
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

    keyup: (e) => {
      if (e.key === "Enter") {
        document.getElementById("todo-input").focus();
      }
    },
  },
};
