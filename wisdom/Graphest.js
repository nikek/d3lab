
var Wisdom = Wisdom || {};

Wisdom.Graphest = (function(undefined){

  function Graphest(input){
    var that = this;
    // Setup stage
    this.w = 900;
    this.h = 600;

    // Setup metrics
    this.dataPoints = input.data;

    // Create SVG element
    this.svg = d3.select(input.wrapper)
      .append("div")
      .attr("class", "widget")
      .append("svg")
      .style("background-color", "#f3f3f3")
      .attr("viewBox", "0 0 "+this.w+" "+this.h);

    this.setupScales();

    this.line = d3.svg.line()
      .x(function(d) { return that.x(d.x); })
      .y(function(d) { return that.y(d.y); })
      .interpolate("monotone");

    // INIT
    this.render();
  }

  Graphest.prototype.addValue = function(value){
    this.dataPoints.push(value);
    this.render();
  };

  Graphest.prototype.setupScales = function(){
    this.minX = this.dataPoints[0].x;
    this.maxY = d3.max(this.dataPoints, function(d){ return d.y; });
    this.x = d3.scale.linear().domain([this.minX, this.dataPoints.length-1]).range([0, this.w]);
    this.y = d3.scale.linear().domain([0, this.maxY]).range([this.h, 0]);
  }

  Graphest.prototype.render = function(){
    console.log(this.dataPoints);
    var that = this;

    this.setupScales();

    var path = this.svg.selectAll('path')
                  .data([this.dataPoints]);

    path.enter().append('svg:path').attr('fill', 'none').attr('stroke', 'green').attr('stroke-width', '2');

    path.attr('d', that.line);

  };

  return Graphest;

})();