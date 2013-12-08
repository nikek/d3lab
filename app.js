// Modular D3



(function (d3, undefined) {

	// Widget storage
	var monastery = [];


	// BARCHARTS
	// For each data array in dataset, create a BarChart and push it onto monastery array

	// Input data
	var barChartDataset = [
		[1, 54, 23, 84, 95, 55, 31, 5, 0, 4, 29],
		[1, 4, 93, 24, 45, 52, 53, 59, 4, 40, 19],
		[10, 24, 13, 64, 75, 13, 3, 43, 7, 43, 79]
	];

	barChartDataset.forEach(function(data, i){

		var barChart = new Wisdom.BarChart({
			data: data,
			container: "#monastery",
			color: "rgb("+ (123*i) +", 54, 150)"
		});

		monastery.push(barChart);
	});


	// ARCCLOCK
	var arcClock = new Wisdom.ArcClock({
		options: "hej"
	});
	monastery.push(arcClock);


	// 
	// monastery.gain(new Wisdom.Gauge())

	var gauge = new Wisdom.ArcGauge({
		value: 0,
		max: 100,
		angle: 0.5,
		thickness: 0.1,
		wrapper: "#widgets"
	});

	setInterval(function(){
		var newData = Math.floor(Math.random()*100);
		gauge.render(newData);
	}, 1000);

	// Test with no data.
	monastery.push( new Wisdom.BarChart({}) );

}(d3));