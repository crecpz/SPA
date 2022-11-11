# Demo
https://crecpz.github.io/Todo-Task-List-App/

<img src="https://user-images.githubusercontent.com/81663340/201289161-559c392d-bfd5-4035-8ebf-889c818d5aef.png" width="50%" />


# 說明
- **總覽頁面** : 在總覽頁面中可以查看不同列表的完成進度。
- **預設列表** : 可存放未分類的待辦事項。
- **重要列表** : 可存放已加上星號的待辦事項。
- **自訂列表** : 可新增自訂列表來為待辦事項做分類，並可為其標示不同的顏色。
- **搜尋** : 可以透過輸入待辦事項內容進行搜尋。
- **深色 / 淺色模式** : 可變更深色或淺色主題，首次載入時的顏色取決於裝置系統設定。
- **資料儲存** : 資料將存放在 localStorage 中，即使關閉分頁，資料也不會消失。
- 使用原生 JavaScript 撰寫。
- 頁面的切換是透過監聽 `window` 的 `hashchange` 事件來偵測網址變化，再根據 `loaction.hash` 的值，渲染相對應的內容到畫面中。
