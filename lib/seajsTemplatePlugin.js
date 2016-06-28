/**
 * @authors       gebilaoxiong (gebilaoxiong@gmail.com)
 * @date          2016-06-24 14:52:00
 * @description   seajs template plugin
 */
var ConcatSource = require("webpack-core/lib/ConcatSource"),

  seajsTemplatePlugin;


seajsTemplatePlugin = module.exports = function() {};


seajsTemplatePlugin.prototype.apply = function(compilation) {
  
  // bind render-with-entry event
  compilation.templatesPlugin("render-with-entry", onRenderWidthEntry);

};


/**
 * render-with-entry evnet handler
 */
function onRenderWidthEntry(source, chunk, hash) {
  var externals;

  externals = chunk.modules.filter(function(module) {
    return module.external;
  });

  return wrapSource(externals, source);
};


function wrapSource(externals, source) {
  var requireModules, dependenciesArgs, prefix,
    sufix;

  // no externals
  if (!externals.length) {
    return new ConcatSource("define(function() { return ", source, "});");
  }

  // require('xxx'), require('xxx2')
  requireModules = externals.map(function(module) {
    return 'require("' + module.request + '")';
  }).join(", ");


  dependenciesArgs = externals.map(function(moudle) {
    return "__WEBPACK_EXTERNAL_MODULE_" + moudle.id + "__";
  }).join(", ");


  prefix = [
    '(function(factory){',
    '',
    '  define(function(require, exports, module){',
    '    module.exports = factory(' ,
    '     ' + requireModules,
    '    );',
    '  });',
    '',
    '})(function(' + dependenciesArgs + '){ return '
  ].join('\n');

  return new ConcatSource(prefix, source, "; });");
}