# Todo-Task-List-App
可新增自訂列表、查看完成進度的待辦事項 App


## Demo
https://crecpz.github.io/Todo-Task-List-App/

<img src="https://user-images.githubusercontent.com/81663340/204447623-e5bf41c7-9978-47a1-8341-778c77b3814c.png" width="50%" />

## 說明

**功能**
  - **總覽頁面**：可在總覽頁面中查看不同列表的完成進度。
  - **預設列表**：可存放未分類的待辦事項。
  - **重要列表**：可存放已加上星號的待辦事項。
  - **自訂列表**：可新增不同的列表來將待辦事項進行分類，也可以為列表標示不同的顏色以做區分。
  - **搜尋**：可搜尋待辦事項內容。
  - **深 / 淺色模式**：可變更深色或淺色主題。
<br />

**使用技術**
  - **樣式管理**：SCSS 。
  - **深 / 淺色模式**：Media Query（使用 `prefers-color-scheme` 媒體特性偵測系統設定）,  CSS Variables。
  - **DOM 操作、內容增刪改查之處理**：JavaScript 。
  - **頁面呈現**：使用 SPA（Single-page application）的方式呈現，當 `hashchange` 事件觸發時，根據 `window.location.hash` 值，渲染相對應的頁面內容至畫面中。
  - **資料儲存**：localStorage。
