/*

  Gauge 

  param input [Object]:
  {
     value: 33 // metric
     max: 100  // max value
  }

*/


;(function(Wisdom, undefined){

  function Gauge(input){

    this.w = 600;
    this.h = 600;
    this.angle = input.angle || 0.5;
    this.innerRadius = 280 - input.thickness*280 || 260;
    this.max = input.max;
    this.value = input.value;
    this.previous = 0;

    // Create SVG element
    this.svg = d3.select("#widgets")
      .append("div")
      .attr("class", "widget")
      .append("svg")
      .attr("viewBox", "0 0 "+this.w+" "+this.h);

    this.render(this.value);
  }

  Gauge.prototype = new Wisdom.Base();


  // Arc string generator funtion
  Gauge.prototype.arc = d3.svg.arc()
      .innerRadius(function(){return this.innerRadius;})
      .outerRadius(280)
      .startAngle(function(d) { return this.genArcData(d).start; })
      .endAngle(function(d) { return this.genArcData(d).end; });


  Gauge.prototype.genArcData = function(data) {
    var valueAngle = (data.value / this.max) * Math.PI * this.angle*2 - this.angle * Math.PI;

    if(data.isMetric)
      return { start: -this.angle*Math.PI, end: valueAngle };
    return { start: valueAngle, end: this.angle*Math.PI };
  };


  Gauge.prototype.arcTween = function(arcData) {
    var that = this;
    var i = d3.interpolate({ value: this.previous }, arcData);

    return function(t) {
      return that.arc(i(t));
    };
  };

  Gauge.prototype.render = function(newValue){
    var that = this;
    this.previous = this.value;
    this.value = newValue;

    // Create paths for each arc of data, ie: two in this case, value arc, rest(background) arc
    var path = this.svg.selectAll("path")
        .data([
          { value: newValue, isMetric: true },   // metric arc
          { value: newValue, isMetric: false }   // background arc
        ]);

    // Enter Path
    path.enter().append("path")
        .attr("transform", function(d, i) { return "translate(" + that.w/2 + "," + that.h/2 + ")"; })
        .attr("class", function(d){ if(d.isMetric) return "gauge-arc-metric"; })
      .transition()
        .ease("elastic")
        .duration(750)
        .attrTween("d", that.arcTween.bind(that));

    // Update
    path.transition()
        .ease("quad-out")
        .duration(750)
        .attrTween("d", that.arcTween.bind(that));

    // Exit
    path.exit().transition()
        .ease("bounce")
        .duration(750)
        .attrTween("d", that.arcTween.bind(that))
        .remove();


    var text = this.svg.selectAll("text")
        .data(newValue);

    text.enter().append("text");

    text.text(function(){ return newValue;})
        .attr("x", this.w/2)
        .attr("y", this.h/2);

    text.exit().remove();
  };

  Wisdom.Gauge = Gauge;

})(Wisdom);