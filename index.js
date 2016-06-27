/**
 * @authors       gebilaoxiong (gebilaoxiong@gmail.com)
 * @date          2016-06-24 14:52:00
 * @description   采用重写的方法
 *                将webpack打包生成的文件转换成seajs模块文件。
 */


var seajsWebpackPlugin;

overwrites = [

  require('./overwrite/ExternalModule'),

  require('./overwrite/LibraryTemplatePlugin')
]


seajsWebpackPlugin = module.exports = function(){};


/**
 * 将重写的方法应用到webpack上
 */
seajsWebpackPlugin.prototype.apply = function() {

  // 应用重写
  overwrites.forEach(function(item){
    item.apply();
  });

};