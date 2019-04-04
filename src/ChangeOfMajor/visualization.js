var myVar = setInterval(myTimer, 5000);
var BASE_YEAR = 1980;
var YEAR = 1980;
var COLLEGE = 'Engineering';
var first = true;

window.onload = function () {
    selector = document.getElementById("college-select");
    selector.onchange = function() {
        console.log(selector.options[selector.selectedIndex].text);
        COLLEGE = selector.options[selector.selectedIndex].text;
    }
};

function myTimer() { 
    // Using jQuery, read our data and call visualize(...) only once the page is ready:
    if (first) {
        first = false;
    } else {
        document.getElementById('slopegraph').children[0].remove();
    }
    // Using jQuery, read our data and call visualize(...) only once the page is ready:
    $(function () {
        const datasetPath = "datasets/majors_transposed.csv";
        d3.csv(datasetPath).then(function (data) {
            // Write the data to the console for debugging:
            console.log(data);

            // Call our visualize function:
            visualize(data, YEAR, YEAR + 5, COLLEGE);

            YEAR += 5;
            if (YEAR == 2015) {
                document.getElementById('slopegraph').children[0].remove();
                YEAR = BASE_YEAR;
                visualize(data, BASE_YEAR, 2018, COLLEGE);
            }
        });
    });
}

var visualize = function (data, currentYearStart, currentYearEnd, currentCollege) {
    // Boilerplate:
    var margin = { top: 50, right: 50, bottom: 50, left: 100 },
        width = 1500 - margin.left - margin.right,
        height = 1000 - margin.top - margin.bottom,
        padding = 50;

    const effectiveDimension = {
        width: width - margin.left - margin.right,
        height: height - margin.top - margin.bottom
    };

    var slopegraphMargin = 120;

    var maxStart = d3.max(data.filter(function(d) {
        return (d["College"] == currentCollege)
    }), function(d) {
        return d["Total_" + currentYearStart]
    })

    var maxEnd = d3.max(data.filter(function(d) {
        return (d["College"] == currentCollege)
    }), function(d) {
        return d["Total_" + currentYearEnd]
    })

    var maxTotal = d3.max([maxStart, maxEnd])

    d3.select("#chart")
        .attr("align","center");

    var svg = d3.select("#slopegraph")
        .append("svg")
        .attr("width", effectiveDimension.width)
        .attr("height", effectiveDimension.height)
        .style("width", effectiveDimension.width)
        .style("height", effectiveDimension.height)
        .append("g");

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d, i) {
            return d["Major Name"];
        });
    
    var yScale = d3.scaleLinear()
        .domain([0, maxTotal])
        .range([effectiveDimension.height, 150]);

    // var yScale = function(d) {
    //     return effectiveDimension.height - d + 150;
    // }

    console.log(effectiveDimension.height)
    console.log(maxTotal)

    console.log(yScale(0))

    var filteredData = data.filter(function(d) {
        return (d["College"] == currentCollege && parseInt(d["Total_" + currentYearStart]) > 50)
    })

    svg.selectAll("slope-line")
        .data(filteredData)
        .enter()
        .append("line")
        .attr("x1", margin.left + slopegraphMargin)
        .attr("y1", function(d, i) {
            if (d['Total_' + currentYearStart] > maxTotal || d['Total_' + currentYearStart] < 0) {
                console.log("holy moly!")
            }
            return yScale(d['Total_' + currentYearStart]);
        })
        .attr("x2", effectiveDimension.width - margin.right - 2*slopegraphMargin)
        .attr("y2", function(d, i) {
            if (d['Total_' + currentYearEnd] > maxTotal || d['Total_' + currentYearEnd] < 0) {
                console.log("holy moly!")
            }
            // console.log(yScale(d['Total_' + currentYearEnd]))
            return yScale(d['Total_' + currentYearEnd]);
        })
        .attr("stroke-width", 3)
        .attr("stroke", "black")
        .attr("id", "slope")
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);
    
    leftSlopeLabels = svg.selectAll("left_text")
        .data(filteredData)
        .enter()
        .append("text")
        .attr("y", function(d, i) {
            return yScale(d['Total_' + currentYearStart]);
        })
        .attr("x", margin.left + slopegraphMargin - 10)
        .attr("text-anchor","end")
        .attr("font-size","12px")
        .text(function(d, i) {
            return d['Major Name'] + ": " + parseInt(d['Total_' + currentYearStart])
        });

    rightSlopeLabels = svg.selectAll("right_text")
        .data(filteredData)
        .enter()
        .append("text")
        .attr("y", function(d, i) {
            return yScale(d['Total_' + currentYearEnd]);
        })
        .attr("x", effectiveDimension.width - margin.right - 2*slopegraphMargin + 10)
        .attr("font-size","12px")
        .text(function(d, i) {
            return d['Major Name'] + ": " + parseInt(d['Total_' + currentYearEnd])
        });

    svg.selectAll("left_circles")
        .data(filteredData)
        .enter()
        .append("circle")
        .attr("stroke","black")
        .attr("stroke-width", 2)
        .attr("fill","white")
        .attr("r", 5)
        .attr("cx", margin.left + slopegraphMargin)
        .attr("cy", function(d, i) {
            return yScale(d['Total_' + currentYearStart])
        });

    svg.selectAll("right_circles")
        .data(filteredData)
        .enter()
        .append("circle")
        .attr("stroke","black")
        .attr("stroke-width", 2)
        .attr("fill","red")
        .attr("r", 5)
        .attr("cx", effectiveDimension.width - margin.right - 2*slopegraphMargin)
        .attr("cy", function(d, i) {
            console.log("hello")
            return yScale(d['Total_' + currentYearEnd])
        });
    
    svg.append("line")
        .attr("x1", margin.left + slopegraphMargin)
        .attr("y1", 150)
        .attr("x2", margin.left + slopegraphMargin)
        .attr("y2", height)
        .attr("stroke-width", 3)
        .attr("stroke", "black")
        .attr("stroke-linecap","round");
            
    svg.append("line")
        .attr("x1", effectiveDimension.width - margin.right - 2*slopegraphMargin)
        .attr("y1", 150)
        .attr("x2", effectiveDimension.width - margin.right - 2*slopegraphMargin)
        .attr("y2", height)
        .attr("stroke-width", 3)
        .attr("stroke", "black")
        .attr("stroke-linecap","round");

    svg.call(tip);

    svg.append("text")
        .attr("x", margin.left + slopegraphMargin - 10)
        .attr("y", 100)
        .style("font-size", "20px") 
            .text(currentYearStart);

    svg.append("text")
        .attr("x", effectiveDimension.width - margin.right - 2*slopegraphMargin - 10)
        .attr("y", 100)
        .style("font-size", "20px") 
      	.text(currentYearEnd);
}