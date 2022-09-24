const demo = {
  home: {
    // 總覽
    // 還沒想到要根據什麼呈現在上面?
  },

  all: {
    id: "all",
    name: "全部",
    color: "",
    content: [
      //   {
      //     id: "",
      //     checked: false,
      //     content: "this is todo A.",
      //     top: false,
      //   },
    ],
  },

  top: {
    id: "top",
    name: "置頂",
    color: "",
    content: [
      {
        id: "",
        checked: false,
        content: "this is todo A.",
        top: true, // 凡是在 top 內的都是 true
      },
    ],
  },

  // 未來應該會新增
  completed: [
    {
      id: "",
      checked: true, // 凡是完成的都是 true
      content: "this is todo A.",
      top: true,
    },
  ],

  // 存取自訂清單
  custom: [
    {
      id: "",
      name: "未命名清單",
      color: "",
      content: [
        {
          checked: false,
          content: "this is todo A.",
          top: false,
        },
      ],
    },
  ],
};
