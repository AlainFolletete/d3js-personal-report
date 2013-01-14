var dataset = [
	{ title: 'The Four Hour Workweek', date_start: '01-01-2012', date_end: '31-01-2012', grade: '4' },
	{ title: 'Predictably Irrational', date_start: '01-02-2012', date_end: '29-02-2012', grade: '5' },
	{ title: 'The Art Of The Start', date_start: '24-02-2012', date_end: '14-03-2012', grade: '2' },
	{ title: 'Never Eat Alone', date_start: '14-03-2012', date_end: '28-03-2012', grade: '3' },
	{ title: 'Made To Stick', date_start: '14-04-2012', date_end: '16-06-2012', grade: '4' },
	{ title: 'Blue Ocean Strategy', date_start: '18-06-2012', date_end: '01-07-2012', grade: '1' },
	{ title: 'Competitive Strategy', date_start: '01-08-2012', date_end: '08-09-2012', grade: '5' },
	{ title: 'Competitive Strategy', date_start: '20-12-2012', date_end: '02-01-2013', grade: '2' }
];



var rect_h = 15,
	w = 800,
	h = dataset.length * rect_h, 
	padding = 40;

var parse = d3.time.format.utc("%d-%m-%Y").parse;


function getDateStart(date_start)
{
	date_min = parse('01-01-2012');
	if (date_start.getTime() < date_min.getTime())
		return date_min;

	return date_start;
}

function getDateEnd(date_end)
{
	date_max = parse('31-12-2012');
	if (date_end.getTime() > date_max.getTime())
		return date_max;

	return date_end;
}


var x = d3.time.scale()
				.range([0, 800])
				.domain([parse('01-01-2012'), parse('31-12-2012')]);

var color = d3.scale.linear()
					.range(['#F2EDD8', '#F7CD11'])
					.domain([0, 5])

var xAxis = d3.svg.axis()
				.scale(x)
				.orient('bottom')
				.tickSize(5)
				.tickFormat(d3.time.format.utc("%b"));

var svg = d3.select('#books')
			.append('svg')
			.attr('width', w + padding * 2)
			.attr('height', h + padding * 2)
			.attr('transform', 'translate('+padding+','+ padding +')');

// center months labels
svg.selectAll('.x.axis text')
	.style('text-anchor', 'middle')
	.attr('x', -w / 12 / 2);

svg.selectAll('rect .bingo')
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
	.attr('width', function(d) { return x(getDateEnd(parse(d.date_end))) - x(parse(d.date_start)) })
	.attr('height', rect_h - 2) // padding + stroke
	.attr('fill', function(d) { return color(d.grade) })

svg.append('g')
	.attr('class', 'x axis')
	.attr('transform', 'translate('+padding+','+ h  +')')
	.call(xAxis);
