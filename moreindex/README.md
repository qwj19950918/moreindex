# VUE打包多页面文件

> 使用VUE为公司APP作H5嵌套，由于功能互无联系，多个功能的页面，自己觉得只有打包出多个html交给APP，所以使用的VUE需要打包多文件。

> 从开发到结束，了解了这个环境的设置，是看了一位大神的GIT学习到的。（大神的git https://github.com/JaneSu/multiple-vue-page）。

> 把他传到自己的git上面，也是因为这是自己没有接触过的东西，自己学习到了，就像分享出来，也有一些自己发现的需要注意的地方，也会说出来。


## 准备工作

> 首先VUE的脚手架安装，这个相信大家都是没有问题的。

> 找到vue项目中的package.json > "devDependencies":{ 添加 "glob": "^7.0.3"}

## 打包多页面环境设置


## vue > build > utils.js > 页面最下面添加
``` bash

/* 这里是添加的部分 ---------------------------- 开始 */

// glob是webpack安装时依赖的一个第三方模块，还模块允许你使用 *等符号, 例如lib/*.js就是获取lib文件夹下的所有js后缀名的文件
var glob = require('glob')
// 页面模板
var HtmlWebpackPlugin = require('html-webpack-plugin')
// 取得相应的页面路径，因为之前的配置，所以是src文件夹下的pages文件夹
var PAGE_PATH = path.resolve(__dirname, '../src/pages')
// 用于做相应的merge处理
var merge = require('webpack-merge')


//多入口配置
// 通过glob模块读取pages文件夹下的所有对应文件夹下的js后缀文件，如果该文件存在
// 那么就作为入口处理
exports.entries = function () {
  var entryFiles = glob.sync(PAGE_PATH + '/*/*.js')
  var map = {}
  entryFiles.forEach((filePath) => {
    var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
    map[filename] = filePath
  })
  return map
}

//多页面输出配置
// 与上面的多页面入口配置相同，读取pages文件夹下的对应的html后缀文件，然后放入数组中
exports.htmlPlugin = function () {
  let entryHtml = glob.sync(PAGE_PATH + '/*/*.html')
  let arr = []
  entryHtml.forEach((filePath) => {
    let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
    let conf = {
      // 模板来源
      template: filePath,
      // 文件名称
      filename: filename + '.html',
      // 页面模板需要加对应的js脚本，如果不加这行则每个页面都会引入所有的js脚本
      chunks: ['manifest', 'vendor', filename],
      inject: true
    }
    if (process.env.NODE_ENV === 'production') {
      conf = merge(conf, {
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
        },
        chunksSortMode: 'dependency'
      })
    }
    arr.push(new HtmlWebpackPlugin(conf))
  })
  return arr
}
/* 这里是添加的部分 ---------------------------- 结束 */


```
## vue > build > webpack.base.conf.js > module.exports
``` bash
  // entry: {
  //   app: './src/main.js'
  // },
> entry: utils.entries(),//修改入口文件

```

## vue > build > webpack.dev.conf.js > plugins
``` bash
  //注释
    // new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   template: 'index.html',
    //   inject: true
    // }),
  //结束
  plugins[].concat(utils.htmlPlugin()) //添加
```
## vue > build >webpack.prod.conf.js > plugins
``` bash
//注释
    // new HtmlWebpackPlugin({
    //   filename: config.build.index,
    //   template: 'index.html',
    //   inject: true,
    //   minify: {
    //     removeComments: true,
    //     collapseWhitespace: true,
    //     removeAttributeQuotes: true
    //     // more options:
    //     // https://github.com/kangax/html-minifier#options-quick-reference
    //   },
    //   // necessary to consistently work with multiple chunks via CommonsChunkPlugin
    //   chunksSortMode: 'dependency'
    // }),
//结束
plugins[]..concat(utils.htmlPlugin()) //添加

```
## 至此webpack 配置结束了 但是需要改变文件路径



For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
