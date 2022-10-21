import { getAllTodos, getSearchResult, searchResult } from "../function/helper.js";
import { createEmptyMsg, emptyMsg, switchSearchPage } from "../function/ui.js";
import { Router } from "../routes/Router.js";

export const Search = {
  state: {
    isSearching: true,
  },

  mount: () => {

  },

  render: () => {
    // 準備空白訊息
    const emptyMsgContent = createEmptyMsg(
      emptyMsg.search.msgText,
      emptyMsg.search.svgTag,
      "#888"
    );

    const noSearchResult = searchResult.length === 0;
      console.log(searchResult)
    const result = searchResult.length !== 0
      ? searchResult.map(({ id, checked, content, top }) => {
        return `
          <li id="${id}" class="todo__item ${checked ? "todo__item--isChecked" : ""}">
            <label class="todo__checkbox checkbox">
              <input type="checkbox" class="checkbox__input" ${checked ? "checked" : ""}>
              <div class="checkbox__appearance"></div>
            </label>
            <p class="todo__content">${content}</p>
            <i class="top ${top ? "fa-solid" : "fa-regular"} fa-star"></i> 
          </li>
        `;
      }).join("") 
      : '<p class="text-center">找不到您輸入的內容</p>';

    // console.log(noSearchResult)


    // <!-- 主內容區 - header -->
    // <div class="main__content-header">
    //     <div class="container">
    //       <div class="search">
    //         <form class="main__form search__form">
    //           <input type="text" id="search-input" class="search__input main__input" />
    //           <i class="fa-solid fa-magnifying-glass"></i>
    //         </form>
    //       </div>
    //     </div>
    // </div>

    return `

      <!-- 主內容區 - list -->
      <div class="main__search-result">
        <div class="container">
          ${noSearchResult
        ? emptyMsgContent
        : `<ul id="todo" class="todo">${result}</ul>`
      }
        </div>
      </div>
    `;
  },

  listener: {
    click: (e) => {
      if (e.target.id === "back-btn") {
        switchSearchPage();
        history.back();
      }
    },
    // && e.target.value.trim() !== ""
    input: (e) => {
      if (e.target.id === "search-input") {
        getSearchResult(e);
        Router();
      }
    },
  }
};
