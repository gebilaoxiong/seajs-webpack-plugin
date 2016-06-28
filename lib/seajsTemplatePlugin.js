/**
 * @authors       gebilaoxiong (gebilaoxiong@gmail.com)
 * @date          2016-06-24 14:52:00
 * @description   seajs template plugin
 */
var ConcatSource = require("webpack-core/lib/ConcatSource"),

  seajsTemplatePlugin;


seajsTemplatePlugin = module.exports = function(name) {
  this.name = name;
};

seajsTemplatePlugin.prototype.apply = function(compilation) {
  var mainTemplate = compilation.mainTemplate;

  // bind render-with-entry event
  compilation.templatesPlugin("render-with-entry", function onRenderWidthEntry(source, chunk, hash) {
    var externals, externalsDepsArray, variable,
      prefix, name;

    externals = chunk.modules.filter(function(module) {
      return module.external;
    });

    // no externals
    if (!externals.length) {
      return new ConcatSource("define(function() { return ", source, "})");
    }

    externalsDepsArray = externals.map(function(module) {
      return "'" + module.request + "'";
    }).join(", ");

    // externals variable
    // var __WEBPACK_EXTERNAL_MODULE_1__ = require("xxx");
    variable = externals.map(function(module) {
      return "var __WEBPACK_EXTERNAL_MODULE_" + module.id + "__ = require('" + module.request + "')";
    }).join(";\n     ");

    // joint
    prefix = ["define("];

    if (this.name) {
      name = mainTemplate.applyPluginsWaterfall("asset-path", this.name, {
        hash: hash,
        chunk: chunk
      });

      prefix.push(JSON.stringify(name) + ', ');
    }

    prefix.push("[" + externalsDepsArray + "] , function(require, exports, module){;\n     " + variable + ";\n     module.exports = ");

    return new ConcatSource(prefix.join(''), source, "})");
  }.bind(this));
  
  mainTemplate.plugin("global-hash-paths", function(paths) {
    if (this.name) paths.push(this.name);
    return paths;
  }.bind(this));

  mainTemplate.plugin("hash", function(hash) {
    hash.update("exports cmd");
    hash.update(this.name + "");
  }.bind(this));
};