import { scrollBarFix } from "../layout/main.js";
import { DATA, fillZero, getAllPage, getAllTodos } from "../utils/function.js";

export const Home = {
    mount: function () {
        scrollBarFix();
    },

    render: function () {
        // 準備「全部」總覽卡片:
        // 1.從 DATA.default 拷貝一個「 all 」物件
        const cloneAll = Object.assign({}, DATA.default.find(({ id }) => id === 'all'));
        // 2.替換 content 屬性: content 內原本只包含來自「All.js」自身的 todo，現在改放入所有的 todo 進去
        cloneAll.content = getAllTodos();

        // 準備「置頂」總覽卡片:
        // 1.從 DATA.default 拷貝一個「 top 」物件
        const cloneTop = Object.assign({}, DATA.default.find(({ id }) => id === 'top'));
        // 2.替換 content 屬性: content 內原本只包含來自「top.js」自身的 todo，現在改放入所有帶有星號的 todo 進去
        cloneTop.content = getAllTodos().filter(({ top }) => top === true);

        // 準備 custom 總覽卡片
        const custom = DATA.custom;

        // 如果頁面物件是來自於 custom ，則為頁面物件新增一個 isCustom = true
        // 此屬性可以在遍歷的時候用來辨別 <a> 的 href 內容是否該加 customlist/
        custom.forEach((pageObj) => {
            pageObj.isCustom = true;
        });

        // 準備將要顯示的內容
        const contentsWillBeDisplayed = [cloneAll, cloneTop, ...custom];

        // 利用 map 遍歷 overviewData
        const overviewCards = contentsWillBeDisplayed
            .map(({ name: pageName, content, isCustom, id }) => {
                // 以下分別為: 全部數量、未完成數量、已完成數量、完成百分比
                const all = content.length;
                const unCompleted = content.filter((todo) => !todo.checked).length;
                const completed = content.filter((todo) => todo.checked).length;
                const percentage = isNaN(Math.round((completed / all) * 100))
                    ? "0"
                    : fillZero(Math.round((completed / all) * 100));


                return `
                    <a href="#/${isCustom ? "customlist/" + id : id}" class="overview__link">
                        <div class="overview__header">${pageName}</div>
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
            }).join("");

        return `
            <!-- 主內容區 header -->
            <div class="main__content-header">
                <div class="container">
                    <div class="main__name-wrapper">
                        <div class="main__color-block"></div>
                        <h2 class="main__name">總覽</h2>
                    </div>
                </div>
            </div>

            <!-- main content list -->
            <div class="main__content-list">
                <div class="container">
                    <div class="overview">
                        ${overviewCards}
                    </div>
                </div>
            </div>
        `;
    },
};
