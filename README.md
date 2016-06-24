# seajs-webpack-plugin

将webpack打包生成的文件转换成seajs模块文件。


**安装：**

npm:

```
  npm install seajs-webpack-plugin --save

```


**使用:**

webpack.config.js

```

var seajsWebpackPlugin = require('seajs-webpack-plugin');


module.exports = {

  output: {

    // ..

    libraryTarget: 'seajs'

  },

  // 插件
  plugins: [
    new seajsWebpackPlugin()
  ]
}

```
