d3.csv('data/goodreads.csv', function(dataset) {
    var rect_h = 15,
        w = 800,
        extra_w = w + 200,
        h = dataset.length * rect_h,
        padding = 40,
        start_date = '2012-01-01',
        end_date = '2012-12-31';

    var parse = d3.time.format.utc("%Y-%m-%d").parse;


    function getDateStart(date_start)
    {
        date_min = parse(start_date);
        if (date_start.getTime() < date_min.getTime())
            return date_min;

        return date_start;
    }

    function getDateEnd(date_end)
    {
        date_max = parse(end_date);
        if (date_end.getTime() > date_max.getTime())
            return date_max;

        return date_end;
    }


    var x = d3.time.scale()
                    .range([0, 800])
                    .domain([parse(start_date), parse(end_date)]);

    var color = d3.scale.linear()
                        .range(['#F2EDD8', '#F7CD11'])
                        .domain([0, 5])

    var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient('bottom')
                    .tickSize(5)
                    .tickFormat(d3.time.format("%b"));

    var svg = d3.select('#books')
                .append('svg')
                .attr('width', extra_w + padding * 2)
                .attr('height', h + padding * 2)
                .attr('transform', 'translate('+padding+','+ padding +')');

    svg.selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('class', 'bg')
        .attr('x', padding)
        .attr('y', function(d, i) { return (i * rect_h)})
        .attr('width', w)
        .attr('height', rect_h - 1);

    svg.selectAll('rect .book')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('class', 'book')
        .attr('x', function(d) { return x(getDateStart(parse(d.date_start))) + padding })
        .attr('y', function(d, i) { return (i * rect_h) + 0.5})
        .attr('width', function(d) { return x(getDateEnd(parse(d.date_end))) - x(getDateStart(parse(d.date_start))) })
        .attr('height', rect_h - 2) // padding + stroke
        .attr('fill', function(d) { return color(d.rating) })
		.on('mouseover', function(d) {
			svg.append('image')
					.attr('id', 'book_cover')
					.attr('x', extra_w - 150)
					.attr('y', 0)
					.attr('width', 120)
					.attr('height', 150)
					.attr('xlink:href', d.image_url );		
		})
		.on('mouseout', function(d) {
			svg.select('image#book_cover')
				.remove();
		});

    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate('+padding+','+ h  +')')
        .call(xAxis);

});
