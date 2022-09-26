import { navSwitcher } from "../layout/nav.js";
import { modeSwitcher } from "../utils/mode.js";
import { openListOption, clickToCloseListOption } from "../layout/main.js";

export const Home = {
    mount: () => {
        // removeAllListeners()
    },

    render: () => {
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
                    <a href="#" class="overview__link">
                        <div class="overview__header">工作</div>
                        <div class="overview__content">
                            <div class="overview__text overview__text--column">待完成
                                <span class="overview__number overview__number--lg">15</span>
                            </div>
                            <div class="overview__group">
                                <div class="overview__text">全部
                                    <span class="overview__number overview__number--sm">35</span>
                                </div>
                                <div class="overview__text">已完成
                                    <span class="overview__number overview__number--sm">08</span>
                                </div>
                            </div>
                            <div class="overview__progress-bar progress">
                                <span class="progress__value">36%</span>
                                <div class="progress__outer">
                                    <div class="progress__inner"></div>
                                </div>
                            </div>
                        </div>
                    </a>

                    <a href="#" class="overview__link">
                        <div class="overview__header">工作</div>
                        <div class="overview__content">
                            <div class="overview__text overview__text--column">待完成
                                <span class="overview__number overview__number--lg">15</span>
                            </div>
                            <div class="overview__group">
                                <div class="overview__text">全部
                                    <span class="overview__number overview__number--sm">35</span>
                                </div>
                                <div class="overview__text">已完成
                                    <span class="overview__number overview__number--sm">08</span>
                                </div>
                            </div>
                            <div class="overview__progress-bar progress">
                                <span class="progress__value">36%</span>
                                <div class="progress__outer">
                                    <div class="progress__inner"></div>
                                </div>
                            </div>
                        </div>
                    </a>

                    <a href="#" class="overview__link">
                        <div class="overview__header">工作</div>
                        <div class="overview__content">
                            <div class="overview__text overview__text--column">待完成
                                <span class="overview__number overview__number--lg">15</span>
                            </div>
                            <div class="overview__group">
                                <div class="overview__text">全部
                                    <span class="overview__number overview__number--sm">35</span>
                                </div>
                                <div class="overview__text">已完成
                                    <span class="overview__number overview__number--sm">08</span>
                                </div>
                            </div>
                            <div class="overview__progress-bar progress">
                                <span class="progress__value">36%</span>
                                <div class="progress__outer">
                                    <div class="progress__inner"></div>
                                </div>
                            </div>
                        </div>
                    </a>

                    <a href="#" class="overview__link">
                        <div class="overview__header">工作</div>
                        <div class="overview__content">
                            <div class="overview__text overview__text--column">待完成
                                <span class="overview__number overview__number--lg">15</span>
                            </div>
                            <div class="overview__group">
                                <div class="overview__text">全部
                                    <span class="overview__number overview__number--sm">35</span>
                                </div>
                                <div class="overview__text">已完成
                                    <span class="overview__number overview__number--sm">08</span>
                                </div>
                            </div>
                            <div class="overview__progress-bar progress">
                                <span class="progress__value">36%</span>
                                <div class="progress__outer">
                                    <div class="progress__inner"></div>
                                </div>
                            </div>
                        </div>
                    </a>

                    <a href="#" class="overview__link">
                        <div class="overview__header">工作</div>
                        <div class="overview__content">
                            <div class="overview__text overview__text--column">待完成
                                <span class="overview__number overview__number--lg">15</span>
                            </div>
                            <div class="overview__group">
                                <div class="overview__text">全部
                                    <span class="overview__number overview__number--sm">35</span>
                                </div>
                                <div class="overview__text">已完成
                                    <span class="overview__number overview__number--sm">08</span>
                                </div>
                            </div>
                            <div class="overview__progress-bar progress">
                                <span class="progress__value">36%</span>
                                <div class="progress__outer">
                                    <div class="progress__inner"></div>
                                </div>
                            </div>
                        </div>
                    </a>

                    <a href="#" class="overview__link">
                        <div class="overview__header">工作</div>
                        <div class="overview__content">
                            <div class="overview__text overview__text--column">待完成
                                <span class="overview__number overview__number--lg">15</span>
                            </div>
                            <div class="overview__group">
                                <div class="overview__text">全部
                                    <span class="overview__number overview__number--sm">35</span>
                                </div>
                                <div class="overview__text">已完成
                                    <span class="overview__number overview__number--sm">08</span>
                                </div>
                            </div>
                            <div class="overview__progress-bar progress">
                                <span class="progress__value">36%</span>
                                <div class="progress__outer">
                                    <div class="progress__inner"></div>
                                </div>
                            </div>
                        </div>
                    </a>

                    <a href="#" class="overview__link">
                        <div class="overview__header">工作</div>
                        <div class="overview__content">
                            <div class="overview__text overview__text--column">待完成
                                <span class="overview__number overview__number--lg">15</span>
                            </div>
                            <div class="overview__group">
                                <div class="overview__text">全部
                                    <span class="overview__number overview__number--sm">35</span>
                                </div>
                                <div class="overview__text">已完成
                                    <span class="overview__number overview__number--sm">08</span>
                                </div>
                            </div>
                            <div class="overview__progress-bar progress">
                                <span class="progress__value">36%</span>
                                <div class="progress__outer">
                                    <div class="progress__inner"></div>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    `;
    },

    listener: {
        click: (e) => { },
    },
};

