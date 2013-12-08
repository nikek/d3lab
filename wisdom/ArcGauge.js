/*

  ArcGauge

*/

Wisdom.ArcGauge = (function(undefined){

  function ArcGauge(input){
    var that = this;
    console.log(this);
    // Setup stage
    this.w = 600;
    this.h = 600;
    this.outerRadius = 280;
    this.innerRadius = this.outerRadius - input.thickness*this.outerRadius || 260;
    this.angle = input.angle*Math.PI || 0.5*Math.PI;

    // Setup metrics
    this.previous = 0;
    this.value = input.value;
    this.max = input.max;

    // Create SVG element
    this.svg = d3.select(input.wrapper)
      .append("div")
      .attr("class", "widget")
      .append("svg")
      .attr("viewBox", "0 0 "+this.w+" "+this.h);

    // Create shadow filter and put it in svg elem
    this.generateShadow(this.svg.append('defs')[0][0]);

    // Create background arc
    var bg = this.svg.selectAll("path")
        .data([this.max])
        .enter()
          .append("path")
          .attr("transform", function(d, i) { return "translate(" + that.w/2 + "," + that.h/2 + ")"; })
          .attr("style", "fill:#ddd")
          .attr("filter", "url(#inner-shadow)")
          .attr("d", that.arc.bind(that));

    // INIT
    this.render(this.value);
  }

  ArcGauge.prototype = new Wisdom.Base();


  // Arc string generator
  ArcGauge.prototype.arc = d3.svg.arc()
      .innerRadius(function(){ return this.innerRadius; })
      .outerRadius(function(){ return this.outerRadius; })
      .startAngle(function() { return -this.angle; })
      .endAngle(function(d) { return this.genValueAngle(d); });

  // Gen angle for a metric value
  ArcGauge.prototype.genValueAngle = function(value) {
    var vangle = ((value / this.max) * 2 - 1) * this.angle;

    if(vangle < -this.angle) return -this.angle;
    if(vangle > this.angle) return this.angle;
    return vangle;
  };

  // Gen the interpolated arcs during transition between two values
  ArcGauge.prototype.arcTween = function(value) {
    var that = this;
    var i = d3.interpolate(this.previous, value);
    return function(t) {
      return that.arc(i(t));
    };
  };

  // New value, add metric arc and text if not populated else update them
  ArcGauge.prototype.render = function(newValue){
    this.previous = this.value;
    this.value = newValue;

    this.handleArc();
    this.handleText();
  };

  // Create or update metric arc
  ArcGauge.prototype.handleArc = function(){
    var that = this;

    // Create paths for each arc of data, ie: two in this case, value arc, rest(background) arc
    var path = this.svg.selectAll(".arcgauge-metric")
        .data([this.value]);

    // Enter Path
    path.enter().append("path")
        .attr("transform", function(d, i) { return "translate(" + that.w/2 + "," + that.h/2 + ")"; })
        .attr("class", "arcgauge-metric")
        .attr("filter", "url(#inner-shadow)");

    // Update
    path.transition()
        .ease("quad-out")
        .duration(750)
        .attrTween("d", this.arcTween.bind(this));

    // Exit
    path.exit().transition()
        .ease("bounce")
        .duration(750)
        .attrTween("d", this.arcTween.bind(this))
        .remove();
  };

  // Create or update text
  ArcGauge.prototype.handleText = function() {
    var text = this.svg.selectAll("text").data([this.value]);

    text.enter()
      .append("text")
        .attr("x", this.w/2)
        .attr("y", this.h/2);

    text.text(function(d){ return d; });
    text.exit().remove();
  };

  // Gen svg inner-shadow filter
  ArcGauge.prototype.generateShadow = function(defs) {

    var svg = "http://www.w3.org/2000/svg";
    var obj = {
      config: {
        shadowOpacity: 0.2,
        shadowSize: 8,
        shadowVerticalOffset: 1
      }
    };

    var gaussFilter, feOffset, feGaussianBlur, feComposite1, feFlood, feComposite2, feComposite3;

    // FILTER
    gaussFilter = document.createElementNS(svg,"filter");
    gaussFilter.setAttribute("id","inner-shadow");
    defs.appendChild(gaussFilter);

    // offset
    feOffset = document.createElementNS(svg,"feOffset");
    feOffset.setAttribute("dx", 0);
    feOffset.setAttribute("dy", obj.config.shadowVerticalOffset);
    gaussFilter.appendChild(feOffset);

    // blur
    feGaussianBlur = document.createElementNS(svg,"feGaussianBlur");
    feGaussianBlur.setAttribute("result","offset-blur");
    feGaussianBlur.setAttribute("stdDeviation", obj.config.shadowSize);
    gaussFilter.appendChild(feGaussianBlur);

    // composite 1
    feComposite1 = document.createElementNS(svg,"feComposite");
    feComposite1.setAttribute("operator","out");
    feComposite1.setAttribute("in", "SourceGraphic");
    feComposite1.setAttribute("in2","offset-blur");
    feComposite1.setAttribute("result","inverse");
    gaussFilter.appendChild(feComposite1);

    // flood
    feFlood = document.createElementNS(svg,"feFlood");
    feFlood.setAttribute("flood-color","black");
    feFlood.setAttribute("flood-opacity", obj.config.shadowOpacity);
    feFlood.setAttribute("result","color");
    gaussFilter.appendChild(feFlood);

    // composite 2
    feComposite2 = document.createElementNS(svg,"feComposite");
    feComposite2.setAttribute("operator","in");
    feComposite2.setAttribute("in", "color");
    feComposite2.setAttribute("in2","inverse");
    feComposite2.setAttribute("result","shadow");
    gaussFilter.appendChild(feComposite2);

    // composite 3
    feComposite3 = document.createElementNS(svg,"feComposite");
    feComposite3.setAttribute("operator","over");
    feComposite3.setAttribute("in", "shadow");
    feComposite3.setAttribute("in2","SourceGraphic");
    gaussFilter.appendChild(feComposite3);

    // var clear
    gaussFilter = null;
    feOffset = null;
    feGaussianBlur = null;
    feComposite1 = null;
    feFlood = null;
    feComposite2 = null;
    feComposite3 = null;

  };

  return ArcGauge;

})();