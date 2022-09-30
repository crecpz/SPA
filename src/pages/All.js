import {
  DATA,
  setStorage,
  getCurrentTodo,
} from "../utils/function.js";

import {
  openListOption,
  clickToCloseListOption,
  removeList,
  openConfirmModal,
  closeModal,
  checkbox,
  scrollBarFix,
  dropdownSwitch,
} from "../layout/main.js";

export const All = {
  mount: function () {
    scrollBarFix();
  },

  render: function () {
    const allContent = getAllContentObj();
    const { name: pageName } = DATA.default.find((page) => page.id === "all");

    const dropdownsContent = allContent
      .map(({ name, content }) => {
        return `
          <li class="dropdown">
            <div class="dropdown__name">
              <i class="dropdown__arrow fa-solid fa-chevron-right"></i>
              ${name}
            </div>
            <div class="dropdown__cover">
              <ul class="todo">
                ${content.map((todo) => {
                  return `
                    <li id="${todo.id}" class="todo__item">
                      <label class="todo__label">
                          <input type="checkbox" 
                                class="todo__checkbox"
                                ${todo.checked ? "checked" : ""}
                          >
                          <span class="todo__checkmark"></span>
                          <p class="todo__content">${todo.content}</p>
                      </label>
                      <i class="todo__top ${todo.top ? "fa-solid" : "fa-regular"} fa-star"></i> 
                    </li>
                  `;
                }).join("")}
              </ul>
            </div>
          </li>
        `;
        }).join("");

    return `
        <!-- 主內容區 header -->
        <div class="main__content-header">
          <div class="container">
            <div class="main__name-wrapper">
              <div class="main__color-block"></div>
              <h2 class="main__name">${pageName}</h2>
            </div>
            <!-- 清單選單按鈕 -->
            <button class="btn btn--list-option"><i class="fa-solid fa-ellipsis"></i></button>
            <!-- 清單選單 -->
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
            <ul class="dropdowns">
              ${dropdownsContent}
            </ul>
          </div>
        </div>
    `;

    /**
     * __彙整 All.js 頁面中需要的 data__
     *
     * 遍歷 DATA 內的 default & custom，並找出符合以下任一項條件的 Object:
     * 
     *  1.頁面資料中 id !== 'all' 的 Object
     * 
     *  2.來自於 All.js 頁面中，它自己所新增的 todo Object (也就是該項 todo Object 的 srcId 屬性 === 'all')
     *
     * - 返回值: 
     *    - 返回 `allContentObj` Array
     *    - 遍歷頁面物件資料，如果找到頁面資料中 id !== 'all'，直接將頁面此物件加進 allContentObj Array 中。
     *    - 遍歷頁面物件資料，如果該物件 id === 'all'，則遍歷該物件內的 content 屬性的 Array，找出元素 srcId 屬性 === 'all'
     *    的物件，並將找到的結果放入新的頁面物件資料當中的 content 屬性中。
     *
     * 備註:此新頁面屬性將作為 All.js 頁面中的頁面資料。這麼做的原因是因為在 All.js 內只需要顯示出來自於 All 頁面新增的 todo 即可。
     *      不需要把整個 all 的資料都渲染出來，這樣資料會重複。
     */
    function getAllContentObj() {
      const allContentObj = [];
      for (let pageType in DATA) {
        DATA[pageType].forEach((pageObj) => {
          if (pageObj.id !== "all") {
            allContentObj.push(pageObj);
          } else {
            // 找出 all 頁面中自己的 todo
            const allOwnContent = pageObj.content.filter(
              (todo) => todo.srcId === "all"
            );
            // 建立物件，並在物件中的 content 中放入 allOwnContent
            allContentObj.push({
              id: "all",
              name: "全部",
              content: [...allOwnContent],
              color: "",
            });
          }
        });
      }
      return allContentObj;
    }
  },

  listener: {
    click: (e) => {
      // 選項(listOption): 刪除清單
      openListOption(e); // 監聽 listOption 按鈕來決定是否開啟 listOption
      clickToCloseListOption(e); // 點擊任意處來關閉 listOption
      openConfirmModal(e); // 偵測使用者是否有點擊 "刪除清單"
      closeModal(e); // 偵測使用者是否有點擊"取消"
      removeList(e); // 偵測使用者是否有點擊"刪除"

      // dropdown
      if (e.target.classList.contains("dropdown__name")) {
        dropdownSwitch(e);
      }

      // 置頂星號
      if (e.target.classList.contains("todo__top")) {
        // 取得當前 todo
        const currentTodo = getCurrentTodo(e);
        currentTodo.top = !currentTodo.top;
        e.target.classList.toggle("fa-solid");
        e.target.classList.toggle("fa-regular");
        // 存進 localStorage
        setStorage(DATA);
      }
    },

    change: function (e) {
      // checkbox
      checkbox(e);
    },
  },
};
