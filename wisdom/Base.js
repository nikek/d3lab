// This is inherited by other charts and widgets

var Wisdom = {};

Wisdom.Base = function(){};

Wisdom.Base.prototype.thisOr = function(thing, def){
	return typeof thing !== "undefined" ? thing : def;
};