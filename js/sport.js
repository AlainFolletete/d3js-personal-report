d3.csv('data/cardioActivities.csv', function(dataset) {
	var activity_color = d3.scale.category10();
	var year = 2012;

	var margin = {top: 40, right: 100, bottom: 40, left: 40}

	var w = 960 - margin.right - margin.left,				
		h = 300,
		radius = 6;

	var parse = d3.time.format.utc("%Y-%m-%d").parse;
	var parse_time = d3.time.format.utc("%H:%M:%S").parse;

	// clean data 
	var activities = [];
	dataset.forEach(function (d, i) {
		if (activities.indexOf(d.Type) == -1)
			activities.push(d.Type);

		date_infos = d.Date.split(' ');
		d.date = parse(date_infos[0]);
		d.time = parse_time(date_infos[1]);
	});

	var scale_x = d3.time.scale()
						.range([0,w])
						.domain([parse(year+'-1-1'), parse(year+'-12-31')]);

	var scale_y = d3.time.scale()
						.range([0, h])
						.domain([parse_time('06:00:00'), parse_time('23:00:00')]);

	var xAxis = d3.svg.axis()
					.scale(scale_x)						
					.orient('bottom')
					.tickFormat(d3.time.format.utc("%b"));

	var yAxis = d3.svg.axis()
					.scale(scale_y)
					.orient('left')
					.ticks(d3.time.hours, 6)
					.tickSize(-w);

	var svg = d3.select('#sport')
				.append('svg')
				.attr('width', w + margin.right + margin.left)
				.attr('height', h + margin.top + margin.bottom)
				.append('g')
				.attr('transform', "translate("+margin.left+", "+margin.top+")");

	// background
	svg.append('rect')
		.attr('class', 'bg')
		.attr('width', w)
		.attr('height', h);

	// x grid
	svg.append('g')
			.attr('class', 'x grid')
			.call(xAxis.tickSize(-h));

	svg.append('g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(0, '+h+')')
			.call(xAxis.tickSize(-5));

	svg.append('g')
			.attr('class', 'y grid')
			.call(yAxis);

	// center months labels
	svg.selectAll('.x.axis text')
		.style('text-anchor', 'middle')
		.attr('x', -w / 12 / 2);

	svg.selectAll('circle')
		.data(dataset)	
		.enter()
		.append('circle')
		.attr('cx', function(d) { return scale_x(d.date) })
		.attr('cy', function(d) { return scale_y(d.time) })
		.attr('r', radius)
		.attr('fill', function(d) { return activity_color(d.Type) })
		.on("mouseover", function(d) {
			svg.selectAll('circle').classed('hover', function(dd) { return dd.Type == d.Type });
		})	
		.on("mouseout", function(d) {
			svg.selectAll("circle").classed("hover", false);
		});


	var legend = svg.selectAll('g .legend')
					.data(activities)
					.enter()
					.append('g')
					.attr('class', 'legend')
					.attr('transform', function (d, i) { return "translate(0, "+(i * 20)+")"; });

    legend.append('rect')
        .attr('x', w + 20)
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', function(d) { return activity_color(d) })

    legend.append("text")
      .attr("x", w + 40)
      .attr("y", 7)
      .attr("dy", ".35em")
      .text(function(d) { return d; });
});
