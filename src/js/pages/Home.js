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
    view: "grid-view",
  },

  mount: () => {
    scrollBarFix(".main__content-list");
  },

  render: () => {
    // @ 提醒:
    // 1.在「總覽」中並不會顯示出 top.js 的內容，因為不需要追蹤一個來自各頁內容的頁面完成進度
    // 2.以下頁面透過 Home.state.view 的值來顯示兩種不同的顯示方式，分別為 grid-view & list-view

    // 存放目前 view 模式
    const currentView = Home.state.view;

    // 於 home 的 grid-view 狀態隱藏 todoForm
    if (currentView === "grid-view") {
      document.querySelector(".todo-form").classList.add("hidden");
    } else {
      document.querySelector(".todo-form").classList.remove("hidden");
    }

    // 存放 grid-view 或是 list-view 的內容 (實際會放哪種內容在內取決於 currentView)
    let viewContent = "";

    // 獲取所有的頁面物件資料(排除 top 頁面)
    const pageContentObjects = getAllPage().filter(({ id }) => id !== "top");

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
              }" class="overview__link ${unCompleted === 0 ? "overview__link--completed" : ""}">
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
        
      viewContent = pageContentObjects.map(({ name, content, color }) => {
          // * 每一個 dropdown 內的 todoList 結構
          const todoListInDropdown = content
            .map(({ id, checked, content, top }) => {
              return `
                <li id="${id}" class="todo__item ${ checked ? "todo__item--isChecked" : ""}">
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
            return `
              <li class="dropdown">
                  <div class="dropdown__name" title="${name}">
                    ${
                      color === "default"
                        ? ""
                        : `<div class="dropdown__color-block color-block color-block-${color}"></div>`
                    }
                    <p class="dropdown__name-text">${name}</p>
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
        })
        .join("");
    }

    // * 決定最終要顯示什麼到 .main__content-list 內
    // 存放 .main__content-list 內要顯示的內容
    let contentsWillBeDisplayed = "";

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
        contentsWillBeDisplayed = createEmptyMsg(
          emptyMsg.home.gridView.msgText,
          emptyMsg.home.gridView.svgTag,
          "#888"
        );
      } else {
        contentsWillBeDisplayed = `<div class="overview">${viewContent}</div>`;
      }
    } else {
      if (noContent) {
        contentsWillBeDisplayed = createEmptyMsg(
          emptyMsg.home.listView.msgText,
          emptyMsg.home.listView.svgTag,
          "#888"
        );
      } else {
        contentsWillBeDisplayed = `<ul class="dropdowns"> ${viewContent}</ul>`;
      }
    }

    return `
            <!-- 主內容區 - header -->
            <div class="main__content-header">
                <div class="container">
                    <div class="main__name-wrapper">
                        <div class="main__color-block color-block--default"></div>
                        <h2 class="main__name">總覽</h2>
                        <button class="main__list-option-btn main__list-option-btn--default-list btn btn--list-option
                          ${currentView === "grid-view" ? "hidden" : ""}"
                        >
                            <i class="fa-solid fa-ellipsis-vertical"></i>
                        </button>
                        <!-- list-options -->
                        <ul class="list-options list-options--home">
                          <li class="list-option">
                            <a href="javascript:;" class="list-option__link remove-completed ${ hasCompletedTodo ? "" : "not-allowed"}">清除完成事項</a>
                          </li>
                        </ul>
                        <button class="main__clear-completed-btn remove-completed btn btn--primary btn--sm ${
                          currentView === "grid-view" || noContent
                            ? "hidden"
                            : ""
                        } ${ hasCompletedTodo ? "" : "not-allowed"}">
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
                </div>
            </div>

            <!-- 主內容區 - list -->
            <div class="main__content-list">
                <div class="container">
                    ${contentsWillBeDisplayed}
                </div>
            </div>
        `;
  },

  listener: {
    click: (e) => {
      pageClickEvent(e);
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

        if(e.target.dataset.view === "list-view"){
          switchRemoveCompletedBtn();
        }
        Router();
      }

      // * dropdown 切換
      if (e.target.classList.contains("dropdown__name")) {
        dropdownSwitch(e);
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
  },
};
