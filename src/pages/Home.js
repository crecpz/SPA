import { DATA, fillZero } from "../utils/function.js";

export const Home = {
    state: {
    },

    mount: function () {
    },

    render: function () {
        const overviewCards = getOverviewData()
            .map(({ name, content, isCustom, id }) => {
                const pageName = name;
                const all = content.length;
                const unCompleted = content.filter((todo) => !todo.checked).length;
                const completed = content.filter((todo) => todo.checked).length;
                const percentage = isNaN(Math.round((completed / all) * 100))
                    ? "0"
                    : fillZero(Math.round((completed / all) * 100));


                return `
                    <a href="#/${isCustom ? "customlist/" + id : id
                    }" class="overview__link">
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
            })
            .join("");

        return `
            <!-- 主內容區 header -->
            <div class="main__content-header">
                <div class="container">
                    <h2 class="main__title">
                        <div class="main__color-block"></div>
                    </h2>
                    <!-- 清單選單按鈕 -->
                    <button class="btn btn--list-option"><i class="fa-solid fa-ellipsis"></i></button>
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
        click: (e) => { },
    },
};
