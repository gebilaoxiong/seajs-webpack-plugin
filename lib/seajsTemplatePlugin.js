/**
 * @authors       gebilaoxiong (gebilaoxiong@gmail.com)
 * @date          2016-06-24 14:52:00
 * @description   seajs编译模板
 */
var ConcatSource = require("webpack-core/lib/ConcatSource"),

  seajsTemplatePlugin;


seajsTemplatePlugin = module.exports = function() {};


// 插件注册
seajsTemplatePlugin.prototype.apply = function(compilation) {
  
  // 绑定render-with-entry事件
  compilation.templatesPlugin("render-with-entry", onRenderWidthEntry);

};


/**
 * 针对所有entry做处理
 */
function onRenderWidthEntry(source, chunk, hash) {
  var externals;

  // 收集所有非打包资源模块
  externals = chunk.modules.filter(function(module) {
    return module.external;
  });

  return wrapSource(externals, source);
};


/**
 * 输出带有依赖的壳
 */
function wrapSource(externals, source) {
  var requireModules, dependenciesArgs, prefix,
    sufix;

  // 没有依赖
  if (!externals.length) {
    return new ConcatSource("define(function() { return ", source, "});");
  }

  // require('xxx'), require('xxx2')
  requireModules = externals.map(function(module) {
    return 'require("' + module.request + '")';
  }).join(", ");


  // 依赖模块变量名
  dependenciesArgs = externals.map(function(moudle) {
    return "__WEBPACK_EXTERNAL_MODULE_" + moudle.id + "__";
  }).join(", ");


  prefix = [
    '(function(factory){',
    '',
    '  define(function(require, module, exports){',
    '    module.exports = factory(' ,
    '     ' + requireModules,
    '    );',
    '  });',
    '',
    '})(function(' + dependenciesArgs + '){ return '
  ].join('\n');

  return new ConcatSource(prefix, source, "; });");
}