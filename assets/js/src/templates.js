this['JST'] = this['JST'] || {};

(function(){
this['JST'] || (this['JST'] = {});
this.JST["repo"] = function(context) { return HandlebarsTemplates["repo"](context); };
this.HandlebarsTemplates || (this.HandlebarsTemplates = {});
this.HandlebarsTemplates["repo"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


  buffer += "<h1>";
  stack1 = helpers.name || depth0.name
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</h1>\n<p>";
  stack1 = helpers.description || depth0.description
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "description", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</p>\n";
  return buffer;});
}).call(this);