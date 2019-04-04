var myVar = setInterval(myTimer, 1000);
var BASE_YEAR = 1980;
var YEAR = 1980;
const COLLEGE = 'ACES';
var first = true;
var button = 'illinois';

function myTimer() {    
    // Using jQuery, read our data and call visualize(...) only once the page is ready:
    if (first) {
        first = false;
    } else {
        document.getElementById('chart').children[0].remove();
    }

    $(function () {
        const datasetPath = "datasets/" + YEAR.toString() + '-' + COLLEGE + '-GB' + '.csv';
        d3.csv(datasetPath).then(function (data) {
            // Call our visualize function:
            if (button == 'gender') {
                visualizeGender(data);
            } else {
                visualizeIllinois(data);
            }
            YEAR += 1;
            if (YEAR == 2018) {
                YEAR = BASE_YEAR;
            }
        });
    });
}

var visualizeGender = function(data) {
    // Boilerplate:
    var margin = { top: 50, right: 50, bottom: 50, left: 50, middle: 200},
        width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // Visualization Code
    var svg = d3.select("#chart")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .style("width", width + margin.left + margin.right)
                .style("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

    // title
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "italics")  
        .text(YEAR.toString());

    // Scale Years:
    var percentScale = d3.scaleLinear()
                    .domain([0, 1])
                    .range([0, (width / 2 - margin.middle / 2)]);

    // the width of each side of the chart
    var regionWidth = width/2 - margin.middle/2;

    // these are the x-coordinates of the y-axes
    var pointA = regionWidth;
    var pointB = regionWidth + margin.middle;

    function getMajors(data) {
        toReturn = [];
        for (row in data) {
            major = data[row]['Major Name'];
            if (major != undefined) {
                toReturn.push(major);
            }
        }
        return toReturn;
    }
    
    majors = getMajors(data);
    console.log(majors);

    // Scale Teams:
    var majorScale = d3.scaleBand()
                        .domain(majors)
                        .range([0, height]);

    // SET UP AXES
    var yAxisLeft = d3.axisLeft()
                    .scale(majorScale)
                    .tickSize(4,0)
                    .tickPadding(-margin.middle / 2);

    var yAxisRight = d3.axisRight()
            .scale(majorScale)
            .tickSize(4,0)
            .tickFormat('');

    var xAxisRight = d3.axisBottom()
                    .scale(percentScale)
                    .tickFormat(d3.format('.00%'));

    var xAxisLeft = d3.axisBottom()
    // REVERSE THE X-AXIS SCALE ON THE LEFT SIDE BY REVERSING THE RANGE
                    .scale(percentScale.copy().range([pointA, 0]))
                    .tickFormat(d3.format('.00%'));

    // MAKE GROUPS FOR EACH SIDE OF CHART
    // scale(-1,1) is used to reverse the left side so the bars grow left instead of right
    var leftBarGroup = svg.append('g')
        .attr('transform', translation(pointA, 0) + 'scale(-1,1)');
        
    var rightBarGroup = svg.append('g')
        .attr('transform', translation(pointB, 0));

    console.log('pointA', pointA)
    // DRAW AXES
    svg.append('g')
        .attr('class', 'axis y left')
        .attr('transform', translation(pointA, 0))
        .call(yAxisLeft)
        .selectAll('text')
        .style('text-anchor', 'middle');

    svg.append('g')
        .attr('class', 'axis y right')
        .attr('transform', translation(pointB, 0))
        .call(yAxisRight);

    svg.append('g')
        .attr('class', 'axis x left')
        .attr('transform', translation(0, height))
        .call(xAxisLeft);

    svg.append('g')
        .attr('class', 'axis x right')
        .attr('transform', translation(pointB, height))
        .call(xAxisRight);

    // DRAW BARS
    leftBarGroup.selectAll('.bar.left')
                .data(data)
                .enter().append('rect')
                    .attr('class', 'bar left')
                    .attr('x', 0)
                    .attr('y', function(d) {return majorScale(d["Major Name"]);})
                    .attr('width', function(d) { return percentScale(parseInt(d['Male']) / parseInt(d['Total']));})
                    .attr('height', 10)
                    .attr('fill', 'blue');

    rightBarGroup.selectAll('.bar.right')
                .data(data)
                .enter().append('rect')
                    .attr('class', 'bar right')
                    .attr('x', 0)
                    .attr('y', function(d) {return majorScale(d["Major Name"]);})
                    .attr('width', function(d) { return percentScale(parseInt(d['Female']) / parseInt(d['Total']));})
                    .attr('height', 10)
                    .attr('fill', 'pink');
};

var visualizeIllinois = function(data) {
    // Boilerplate:
    var margin = { top: 50, right: 50, bottom: 50, left: 50, middle: 200},
        width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // Visualization Code
    var svg = d3.select("#chart")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .style("width", width + margin.left + margin.right)
                .style("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

    // title
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "italics")  
        .text(YEAR.toString());

    // Scale Years:
    var percentScale = d3.scaleLinear()
                    .domain([0, 1])
                    .range([0, (width / 2 - margin.middle / 2)]);

    // the width of each side of the chart
    var regionWidth = width/2 - margin.middle/2;

    // these are the x-coordinates of the y-axes
    var pointA = regionWidth;
    var pointB = regionWidth + margin.middle;

    function getMajors(data) {
        toReturn = [];
        for (row in data) {
            major = data[row]['Major Name'];
            if (major != undefined) {
                toReturn.push(major);
            }
        }
        return toReturn;
    }
    
    majors = getMajors(data);

    // Scale Teams:
    var majorScale = d3.scaleBand()
                        .domain(majors)
                        .range([0, height]);

    // SET UP AXES
    var yAxisLeft = d3.axisLeft()
                    .scale(majorScale)
                    .tickSize(4,0)
                    .tickPadding(-margin.middle / 2);

    var yAxisRight = d3.axisRight()
            .scale(majorScale)
            .tickSize(4,0)
            .tickFormat('');

    var xAxisRight = d3.axisBottom()
                    .scale(percentScale)
                    .tickFormat(d3.format('.00%'));

    var xAxisLeft = d3.axisBottom()
    // REVERSE THE X-AXIS SCALE ON THE LEFT SIDE BY REVERSING THE RANGE
                    .scale(percentScale.copy().range([pointA, 0]))
                    .tickFormat(d3.format('.00%'));

    // MAKE GROUPS FOR EACH SIDE OF CHART
    // scale(-1,1) is used to reverse the left side so the bars grow left instead of right
    var leftBarGroup = svg.append('g')
        .attr('transform', translation(pointA, 0) + 'scale(-1,1)');
        
    var rightBarGroup = svg.append('g')
        .attr('transform', translation(pointB, 0));

    console.log('pointA', pointA)
    // DRAW AXES
    svg.append('g')
        .attr('class', 'axis y left')
        .attr('transform', translation(pointA, 0))
        .call(yAxisLeft)
        .selectAll('text')
        .style('text-anchor', 'middle');

    svg.append('g')
        .attr('class', 'axis y right')
        .attr('transform', translation(pointB, 0))
        .call(yAxisRight);

    svg.append('g')
        .attr('class', 'axis x left')
        .attr('transform', translation(0, height))
        .call(xAxisLeft);

    svg.append('g')
        .attr('class', 'axis x right')
        .attr('transform', translation(pointB, height))
        .call(xAxisRight);

    // DRAW BARS
    leftBarGroup.selectAll('.bar.left')
                .data(data)
                .enter().append('rect')
                    .attr('class', 'bar left')
                    .attr('x', 0)
                    .attr('y', function(d) {return majorScale(d["Major Name"]);})
                    .attr('width', function(d) { return percentScale(parseInt(d['Illinois']) / parseInt(d['Total']));})
                    .attr('height', 10)
                    .attr('fill', 'blue');

    rightBarGroup.selectAll('.bar.right')
                .data(data)
                .enter().append('rect')
                    .attr('class', 'bar right')
                    .attr('x', 0)
                    .attr('y', function(d) {return majorScale(d["Major Name"]);})
                    .attr('width', function(d) { return percentScale(parseInt(d['Non-Illinois']) / parseInt(d['Total']));})
                    .attr('height', 10)
                    .attr('fill', 'orange');
};

function translation(x,y) {
    return 'translate(' + x + ',' + y + ')';
}

var parseTime = d3.timeParse("%Y");
