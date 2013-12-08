// Inherits from Widget
// For creating barcharts

Wisdom.BarChart = function(input){
	var input = input || {};

	var data = this.thisOr(input.data, [1,40,90]);
	var color = this.thisOr(input.color, "silver");
	var container = this.thisOr(input.container, "body");

	// ratio
	var w = 1200;
	var h = 800;

	// Should be done with scales
	var barWidth = w / data.length;
	var maxVal = d3.max(data);

	// Scale
	var xScale = d3.scale.linear()
					.domain([0,data.length])
					.range([0, w]);

	var svg = d3.select("#widgets")
		.append("div")
		.attr("class", "widget")
		.append("svg")
		.attr("viewBox", "0 0 "+w+" "+h);

	// Add rectangles
	var rects = svg.selectAll("rect")
		.data(data)
		.enter()
			.append("rect")
			.attr("fill", color)
			.attr("width", function(){ return barWidth; })
			.attr("height", 0)
			.attr("x", function(d, i){ return xScale(i); })
			.attr("y", h);

	// Transition height and add labels
	rects.transition()
		.duration(750)
		.attr("height", function(d){ return d/maxVal*h; })
		.attr("y", function(d){ return h - (d/maxVal*h); })
		.each("end", function() {
			this.selectAll("text")
			.data(data)
			.enter()
				.append("text")
				.classed("hidden", true)
				.text(function(d){ return d; })
				.attr("x", function(d, i){ return xScale(i)+barWidth/2; })
				.attr("y", function(d, i){ 
					var pos = h-(d/maxVal*h);
					if(pos < h*0.9)	return pos+h*0.08;
					else return pos-h*0.02;
				})
				.attr("fill", function(d){
					var pos = h-(d/maxVal*h);
					if(pos < h*0.9)	return "white";
					else return "black";
				})
				.transition().duration(0).each("end", function(){
					d3.select(this).classed("hidden", false);
				});
		}.bind(svg));

};

Wisdom.BarChart.prototype = new Wisdom.Base();