/**
 * @authors       xiongyang (xiongyang@zhubajie.com)
 * @date          2016-06-24 18:02:37
 * @description   重写ExternalModuleSoucePlugin的Apply方法
 *                webpack这里设计得不是很好libraryTarget无法做扩展
 */

var ExternalModule = require("webpack/lib/ExternalModule"),

  OriginalSource = require("webpack-core/lib/OriginalSource"),

  RawSource = require("webpack-core/lib/RawSource"),

  WebpackMissingModule = require("webpack/lib/dependencies/WebpackMissingModule"),

  origin = ExternalModule.prototype.source;



exports.apply = function() {
  ExternalModule.prototype.source = overwrite
}



/**
 * 重写
 */
function overwrite() {
  var me = this;

  return me.type === 'seajs' ?
    buildSeajsExternalModuleSource.call(me) :
    origin.apply(me, arguments);
};


/**
 * 构建seajs ExternalModule 代码
 */
function buildSeajsExternalModuleSource() {
  var me = this,
    code;

  if (me.optional) {
    code = "if(typeof __WEBPACK_EXTERNAL_MODULE_" + me.id + "__ === 'undefined') {" + WebpackMissingModule.moduleCode(request) + "}\n";
  }

  code = "module.exports = __WEBPACK_EXTERNAL_MODULE_" + me.id + "__;";

  return me.useSourceMap ?
    new OriginalSource(code, me.identifier()) :
    new RawSource(code);
}