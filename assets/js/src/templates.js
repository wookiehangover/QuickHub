this['JST'] = this['JST'] || {};

(function(){
this['JST'] || (this['JST'] = {});
this.JST["commit"] = function(context) { return HandlebarsTemplates["commit"](context); };
this.HandlebarsTemplates || (this.HandlebarsTemplates = {});
this.HandlebarsTemplates["commit"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, stack2, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  ";
  stack1 = helpers.author || depth0.author
  stack1 = stack1.username;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "author.username", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\n  ";
  stack1 = helpers.timestamp || depth0.timestamp
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "timestamp", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\n  <a href=\"";
  stack1 = helpers.url || depth0.url
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "url", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\" target=\"_blank\">view</a>\n  <p>";
  stack1 = helpers.message || depth0.message
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "message", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</p>\n";
  return buffer;}

  buffer += "<h1><a href=\"";
  stack1 = helpers.repository || depth0.repository
  stack1 = stack1.url;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "repository.url", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\" target=\"_blank\">";
  stack1 = helpers.repository || depth0.repository
  stack1 = stack1.name;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "repository.name", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</a></h1>\n";
  stack1 = helpers.head_commit || depth0.head_commit
  stack2 = helpers['with']
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  stack1 = stack2.call(depth0, stack1, tmp1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;});
}).call(this);

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
  buffer += escapeExpression(stack1) + "</p>\n<a href=\"#\">Create Hook</a>\n";
  return buffer;});
}).call(this);