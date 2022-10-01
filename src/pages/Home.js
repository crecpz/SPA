import { scrollBarFix } from "../layout/main.js";
import { DATA, fillZero, getAllPage } from "../utils/function.js";

export const Home = {
    mount: function () {
        scrollBarFix();
    },

    render: function () {
        // 將 DATA 內的所有 pageObj 資料拉進 overviewData Array 中
        // 每一張卡片都將會利用此 overviewData 來渲染。
        const overviewData = [];

        // 這個 array 是所有的 todo ，會用在總覽的「全部」
        const allTodos = getAllPage()
            .map(({ content }) => content)
            .reduce((acc, cur) => acc.concat(cur), []);
            // console.log(allTodos)

        for (let pageType in DATA) {
            DATA[pageType].forEach((page) => {
                // if(page.id === 'all'){

                //     // page.content.slice();

                // }

                // 為每個 pageObj 加上 isCustom 屬性，後續此屬性用來決定 overviewCard 的超連結網址結構
                if (pageType === "custom") {
                    page.isCustom = true;
                }
                overviewData.push(page);
            });
        }

        
        console.log(overviewData)

        // 利用 map 遍歷 overviewData
        const overviewCards = overviewData
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

    listener: {
        // click: (e) => { },
    },
};
