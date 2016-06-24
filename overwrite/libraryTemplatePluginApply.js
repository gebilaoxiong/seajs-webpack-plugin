/**
 * @authors       xiongyang (xiongyang@zhubajie.com)
 * @date          2016-06-24 17:59:03
 * @description   重写LibraryTemplatePlugin的Apply方法
 *                webpack这里设计得不是很好libraryTarget无法做扩展
 */
var LibraryTemplatePlugin = require("webpack/lib/LibraryTemplatePlugin"),

  originLibraryTemplateApply = LibraryTemplatePlugin.prototype.apply,

  seajsTemplatePlugin = require('../lib/seajsTemplatePlugin');


exports.apply = function() {
  LibraryTemplatePlugin.prototype.apply = overwrite
}


// 重写
function overwrite(compiler) {
  var me = this;

  // 添加seajs模板
  if (me.target === 'seajs') {
    compiler.plugin("this-compilation", function(compilation) {
      compilation.apply(new seajsTemplatePlugin());
    });
    return;
  }

  // 非seajs还是使用之前的方法
  originLibraryTemplateApply.apply(me, arguments);
};