module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
  parserOptions: {
    parser: "babel-eslint"
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "prettier/prettier": [
        "error",
        {
            "editor.tabSize": 2,  // 缩进
            "singleQuote": true,  // 单引号
            "semi": true,  // 语句行尾添加分号
            "printWidth": 120,  // 行宽
            "trailingComma": "es5",  // 多行时任何可能的地方是否添加尾逗号
            "arrowParens": "avoid",  // 箭头函数只有一个参数时，参数是否使用圆括号
        }
    ]
  }
};
