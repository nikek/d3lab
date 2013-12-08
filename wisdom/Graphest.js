
var Wisdom = Wisdom || {};

Wisdom.Graphest = (function(undefined){

  function Graphest(input){
    var that = this;
    // Setup stage
    this.w = 900;
    this.h = 600;
    this.useArea = input.useArea || false;
    this.colorClass = input.colorClass || "";
    this.interpolator = input.interpolator || "cardinal";
    this.tension = input.tension || 0.96;

    // Setup metrics
    this.dataPoints = input.data;

    // Create SVG element
    this.svg = d3.select(input.wrapper)
      .append("div")
      .attr("class", "widget")
      .append("svg")
      .attr("viewBox", "0 0 "+this.w+" "+this.h);

    this.setupScales();

    this.line = d3.svg.line()
      .x(function(d) { return that.x(d.x); })
      .y(function(d) { return that.y(d.y); })
      .interpolate(this.interpolator)
      .tension(this.tension);

    this.area = d3.svg.area()
      .x(function(d) { return that.x(d.x); })
      .y0(function(d) { return that.y(d.y); })
      .y1(function(d) { return that.y(-that.maxY); })
      .interpolate(this.interpolator)
      .tension(this.tension);

    // INIT
    this.render();
  }


  // RENDER
  Graphest.prototype.render = function(){
    this.setupScales();
    this.genLine();
    if(this.useArea) this.genArea();
  };


  // DATA HANDLING
  Graphest.prototype.addValue = function(value){
    this.dataPoints.push(value);
    this.render();
  };


  // GRAPH CONTROLS
  Graphest.prototype.setupScales = function(){
    this.minX = this.dataPoints[0].x;
    this.maxY = d3.max(this.dataPoints, function(d){ return d.y; });
    this.x = d3.scale.linear().domain([this.minX, this.dataPoints.length-1]).range([0, this.w]);
    this.y = d3.scale.linear().domain([0, this.maxY]).range([this.h, 3]); // last num here yields a small space for cardinal overflow
  };


  // GENERATORS
  Graphest.prototype.genLine = function(){

    var path = this.svg.selectAll('.line')
                  .data([this.dataPoints]);

    path.enter().append('path').attr('class', 'line ' + this.colorClass);
    path.attr('d', this.line);
  };


  Graphest.prototype.genArea = function(){
    
    var area = this.svg.selectAll('.area')
                  .data([this.dataPoints]);

    area.enter().append('path').attr('class', 'area ' + this.colorClass);
    area.attr('d', this.area);
  };



  return Graphest;

})();