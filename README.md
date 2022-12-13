# Todo-Task-List-App
待辦事項網頁 App，具有列表分類、查看完成進度、搜尋待辦事項、切換深／淺色模式等功能。
<br />

## Demo
https://crecpz.github.io/Todo-Task-List-App/
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
  <br />

## 畫面
| Desktop | Mobile |
| ------------- | ------------- |
| ![Todo-Task-List-App](https://user-images.githubusercontent.com/81663340/205801126-1a165b07-d518-430c-8196-3d6d1770c753.png)  | ![Todo-Task-List-App-m](https://user-images.githubusercontent.com/81663340/205801139-b4e2c627-4bd3-48c2-be9c-7d0de5ef6336.png)  |
| ![Todo-Task-List-App-1](https://user-images.githubusercontent.com/81663340/205805475-f3c8ce91-8d75-47b9-81c3-091af459b58d.png) | ![Todo-Task-List-App-m1](https://user-images.githubusercontent.com/81663340/205804780-3157a965-5109-4914-b334-c55cb46e2e9e.png) |
