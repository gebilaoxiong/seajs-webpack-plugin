/**
 * @authors       gebilaoxiong (gebilaoxiong@gmail.com)
 * @date          2016-06-24 17:59:03
 * @description   rewrite LibraryTemplatePlugin.Apply()
 */
var LibraryTemplatePlugin = require("webpack/lib/LibraryTemplatePlugin"),

  origin = LibraryTemplatePlugin.prototype.apply,

  seajsTemplatePlugin = require('../lib/seajsTemplatePlugin');


exports.apply = function() {
  LibraryTemplatePlugin.prototype.apply = overwrite
}


// rewrite
function overwrite(compiler) {
  var me = this;

  // To add seajs libraryTarget 
  if (me.target === 'seajs') {
    compiler.plugin("this-compilation", function(compilation) {
      compilation.apply(new seajsTemplatePlugin());
    });
    return;
  }

  // If not seajs, use origin
  origin.apply(me, arguments);
};