

Wisdom.ArcClock = function(input){

  var w = 1200,
      h = 800,
      x = d3.scale.ordinal().domain(d3.range(3)).rangePoints([0, w], 2);

  var sec = {name: "seconds", value: 0, size: 60};

  var arc = d3.svg.arc()
      .innerRadius(100)
      .outerRadius(140)
      .startAngle(0)
      .endAngle(function(d) { return (d.value / d.size) * 2 * Math.PI; });

  var svg = d3.select("#widgets")
    .append("div")
    .attr("class", "widget")
    .append("svg")
    .attr("viewBox", "0 0 "+w+" "+h);


  setInterval(function() {
    var now = new Date();

    sec.previous = sec.value;
    sec.value = now.getSeconds();

    var path = svg.selectAll("path")
        .data([sec]);

    path.enter().append("svg:path")
        .attr("transform", function(d, i) { return "translate(" + x(i) + "," + h/2 + ")"; })
      .transition()
        .ease("elastic")
        .duration(750)
        .attrTween("d", arcTween);

    path.transition()
        .ease("elastic")
        .duration(750)
        .attrTween("d", arcTween);

    path.exit().transition()
        .ease("bounce")
        .duration(750)
        .attrTween("d", arcTween)
        .remove();

  }, 1000);

  function arcTween(b) {
    var i = d3.interpolate({value: b.previous}, b);
    return function(t) {
      return arc(i(t));
    };
  }

};

Wisdom.ArcClock.prototype = new Wisdom.Base();