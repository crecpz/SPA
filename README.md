# Todo-Task-List-App
可新增自訂列表、可查看完成進度的待辦事項網頁 App。
<br />

## Demo
https://crecpz.github.io/Todo-Task-List-App/

<img src="https://user-images.githubusercontent.com/81663340/204447623-e5bf41c7-9978-47a1-8341-778c77b3814c.png" width="50%" />
<br />

## 介紹

**特色**
- **進度總覽**：透過總覽頁面查看不同列表的完成進度。
- **預設列表**：存放未分類的待辦事項。
- **重要列表**：存放已被加上星號的待辦事項。
- **自訂列表**：使用者可自行新增列表，來為待辦事項分類，並可以為列表標示不同的顏色。
- **搜尋功能**：透過搜尋功能尋找特定的待辦事項。
- **深 / 淺色模式**：可切換深色或淺色主題。

**使用技術**
  - 使用 JavaScript 開發。
  - 使用 SPA（Single-page application）的方式實現頁面跳轉（透過監聽 `window` 的 `hashchange` 事件，來偵測網址列變化，再根據 `window.location.hash` 的值，渲染對應的頁面內容至畫面）。
  - 使用 SCSS 管理樣式、建構 RWD 版型。
  - 使用 CSS Variables 與 Media Query `prefers-color-scheme` 媒體特性，實現深／淺色模式切換。
  - 使用 localStorage 儲存資料。
