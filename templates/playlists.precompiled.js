(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['playlists'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, alias5=container.lambda, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    <tr id=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"index") || (data && lookupProperty(data,"index"))) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data,"loc":{"start":{"line":14,"column":12},"end":{"line":14,"column":22}}}) : helper)))
    + "\">\n      <th scope=\"row\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"index") || (data && lookupProperty(data,"index"))) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data,"loc":{"start":{"line":15,"column":22},"end":{"line":15,"column":32}}}) : helper)))
    + "</th>\n      <td><image width=\"150\" height=\"150\" class=\"img-thumbnail\" src=\""
    + alias4(alias5(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"images") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"url") : stack1), depth0))
    + "\"></image></td>\n      <td>"
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":17,"column":10},"end":{"line":17,"column":18}}}) : helper)))
    + "</td>\n      <td>"
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"owner") : depth0)) != null ? lookupProperty(stack1,"display_name") : stack1), depth0))
    + "</td>\n      <td><button class=\"sbtn sbtn-green\" id=\"select"
    + alias4(((helper = (helper = lookupProperty(helpers,"index") || (data && lookupProperty(data,"index"))) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data,"loc":{"start":{"line":19,"column":52},"end":{"line":19,"column":62}}}) : helper)))
    + "\" type=\"button\">Select</button></td>\n    </tr>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<h1 class=\"olive\">Playlist</h1>\n\n<table class=\"table table-dark\">\n  <thead>\n    <tr>\n      <th scope=\"col\">#</th>\n      <th scope=\"col\">Image</th>\n      <th scope=\"col\">Name</th>\n      <th scope=\"col\">Select</th>\n    </tr>\n  </thead>\n  <tbody>\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"items") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":13,"column":4},"end":{"line":21,"column":13}}})) != null ? stack1 : "")
    + "  </tbody>\n</table>\n";
},"useData":true});
})();