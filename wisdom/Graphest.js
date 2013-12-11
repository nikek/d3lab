
var Wisdom = Wisdom || {};

Wisdom.Graphest = (function(undefined){

  function Graphest(input){
    
    // Setup stage
    this.w = 900;
    this.h = 600;
    this.inputSeries = input.data;
    this.colorClass = input.colorClass || [];
    this.interpolator = input.interpolator || "cardinal";
    this.tension = input.tension || 0.96;
    this.stacked = input.stacked || false;
    this.transitionTime = input.transitionTime || 300;

    // Create SVG element
    this.svg = d3.select(input.wrapper)
      .append("div")
      .attr("class", "widget")
      .append("svg")
      .attr("viewBox", "0 0 "+this.w+" "+this.h);


    this.setupLayouts();
    this.setupDataset();
    this.setupScales();
    this.setupRenderers();

    this.render();
  }

  Graphest.prototype.setupLayouts = function(){
    this.stack = d3.layout.stack()
      .offset("zero")
      .values(function(d){ return d; });
  };
  
  Graphest.prototype.setupDataset = function(){
    this.seriesDataset = clone(this.inputSeries);
    this.seriesDataset = this.seriesDataset.map(function(series){
      return series.dataPoints;
    });

    if(!this.stacked){
      this.seriesDataset.forEach(function(series){
        series.forEach(function(point){
          point.y0 = 0;
        });
      });
    }
    else{
      this.seriesDataset = this.stack(this.seriesDataset);
    }
  };

  Graphest.prototype.setupRenderers = function(){
    var that = this;
    this.line = d3.svg.line()
      .x(function(d) { return that.x(d.x); })
      .y(function(d) { return that.y(d.y+d.y0); })
      .interpolate(this.interpolator)
      .tension(this.tension);

    this.area = d3.svg.area()
      .x(function(d) { return that.x(d.x); })
      .y0(function(d) { return that.y(d.y0); })
      .y1(function(d) { return (that.y(d.y+d.y0)); })
      .interpolate(this.interpolator)
      .tension(this.tension);
  };

  Graphest.prototype.render = function(){
    this.inputSeries.forEach(function(series, i){
      this.draw(i, "line");
      if(series.renderer !== "line") this.draw(i, "area");
    }.bind(this));
  };

  Graphest.prototype.update = function(){
    this.setupDataset();
    this.setupScales();
    this.render();
  };

  // DATA HANDLING
  Graphest.prototype.addValue = function(index, value){
    this.seriesDataset[index].push(value);
    this.render();
  };


  // GRAPH CONTROLS
  Graphest.prototype.setupScales = function(){
    this.xMin = d3.min(this.seriesDataset, function(d){ return d[0].x; });
    this.xMax = d3.max(this.seriesDataset, function(d){ return d[d.length-1].x; });
    this.yMin = this.stacked ? 0 : d3.min(this.seriesDataset, function(d){ return d3.min(d, function(d){ return d.y+d.y0; });});
    this.yMax = d3.max(this.seriesDataset, function(d){ return d3.max(d, function(d){ return d.y+d.y0; }); });

    this.x = d3.scale.linear().domain([this.xMin, this.xMax]).range([0, this.w]);
    this.y = d3.scale.linear().domain([this.yMin, this.yMax]).range([this.h, 3]); // last num here yields a small space for cardinal overflow
  };


  // GENERATOR
  Graphest.prototype.draw = function(index, type){
    var path = this.svg.selectAll('#'+type+index).data([this.seriesDataset[index]]);

    path.enter().append('path')
      .attr('id', type+index)
      .attr('class', type + ' ' + this.colorClass[index]);
    
    path
      .transition()
      .duration(this.transitionTime)
      .attr("d", this[type]); // renderer function, declared in constructor
  };



  // Public methods 
  Graphest.prototype.toggleStacked = function(){
    this.stacked = !this.stacked;
    this.update();
  };


  // Helper functions
  function clone(obj) {
    if (typeof obj !== "object") return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
  }

  return Graphest;

})();