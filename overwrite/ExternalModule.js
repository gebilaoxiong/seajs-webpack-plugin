/**
 * @authors       gebilaoxiong (gebilaoxiong@gmail.com)
 * @date          2016-06-24 18:02:37
 * @description   rewrite ExternalModuleSoucePlugin.Apply()
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
 * rewrite
 */
function overwrite() {
  var me = this;

  return me.type === 'seajs' ?
    buildSeajsExternalModuleSource.call(me) :
    origin.apply(me, arguments);
};


/**
 * export seajs External module source
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