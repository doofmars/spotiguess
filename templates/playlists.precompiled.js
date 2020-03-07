(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['playlists'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, alias5=container.lambda, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<h1>Logged in as "
    + alias4(((helper = (helper = lookupProperty(helpers,"display_name") || (depth0 != null ? lookupProperty(depth0,"display_name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"display_name","hash":{},"data":data,"loc":{"start":{"line":1,"column":17},"end":{"line":1,"column":33}}}) : helper)))
    + "</h1>\n<div class=\"media\">\n  <div class=\"pull-left\">\n    <img class=\"media-object\" width=\"150\" src=\""
    + alias4(alias5(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"images") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"url") : stack1), depth0))
    + "\" />\n  </div>\n  <div class=\"media-body\">\n    <dl class=\"dl-horizontal\">\n      <dt>Display name</dt><dd class=\"clearfix\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"display_name") || (depth0 != null ? lookupProperty(depth0,"display_name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"display_name","hash":{},"data":data,"loc":{"start":{"line":8,"column":48},"end":{"line":8,"column":64}}}) : helper)))
    + "</dd>\n      <dt>Id</dt><dd>"
    + alias4(((helper = (helper = lookupProperty(helpers,"id") || (depth0 != null ? lookupProperty(depth0,"id") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":9,"column":21},"end":{"line":9,"column":27}}}) : helper)))
    + "</dd>\n      <dt>Email</dt><dd>"
    + alias4(((helper = (helper = lookupProperty(helpers,"email") || (depth0 != null ? lookupProperty(depth0,"email") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"email","hash":{},"data":data,"loc":{"start":{"line":10,"column":24},"end":{"line":10,"column":33}}}) : helper)))
    + "</dd>\n      <dt>Spotify URI</dt><dd><a href=\""
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"external_urls") : depth0)) != null ? lookupProperty(stack1,"spotify") : stack1), depth0))
    + "\">"
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"external_urls") : depth0)) != null ? lookupProperty(stack1,"spotify") : stack1), depth0))
    + "</a></dd>\n      <dt>Link</dt><dd><a href=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"href") || (depth0 != null ? lookupProperty(depth0,"href") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"href","hash":{},"data":data,"loc":{"start":{"line":12,"column":32},"end":{"line":12,"column":40}}}) : helper)))
    + "\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"href") || (depth0 != null ? lookupProperty(depth0,"href") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"href","hash":{},"data":data,"loc":{"start":{"line":12,"column":42},"end":{"line":12,"column":50}}}) : helper)))
    + "</a></dd>\n      <dt>Profile Image</dt><dd class=\"clearfix\"><a href=\""
    + alias4(alias5(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"images") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"url") : stack1), depth0))
    + "\">"
    + alias4(alias5(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"images") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"url") : stack1), depth0))
    + "</a></dd>\n      <dt>Country</dt><dd>"
    + alias4(((helper = (helper = lookupProperty(helpers,"country") || (depth0 != null ? lookupProperty(depth0,"country") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"country","hash":{},"data":data,"loc":{"start":{"line":14,"column":26},"end":{"line":14,"column":37}}}) : helper)))
    + "</dd>\n    </dl>\n  </div>\n</div>\n";
},"useData":true});
})();