
var interval = setInterval(function() {
    if (!isRunning) {
        // not running, do nothing
    } else {
        // it is running, do stuff.
        myTimer()
    }
}, 3000);
var BASE_YEAR = 1980;
var YEAR = 1980;
var COLLEGE = 'Engineering';
var first = true;
var isRunning = true;

window.onload = function () {
    selector = document.getElementById("college-select");
    selector.onchange = function() {
        COLLEGE = selector.options[selector.selectedIndex].text;
    }

    startButton = document.getElementById("toggle-animation")
    startButton.onclick = function () {
        if (isRunning === false) {
            isRunning = true;
            startButton.innerHTML = "Pause"
        } else {
            isRunning = false;
            startButton.innerHTML = "Play"
        }
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
        return parseInt(d["Total_" + currentYearStart])
    })

    var maxEnd = d3.max(data.filter(function(d) {
        return (d["College"] == currentCollege)
    }), function(d) {
        return parseInt(d["Total_" + currentYearEnd])
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
        .range([effectiveDimension.height, 150])
        .clamp(true);

    var filteredData = data.filter(function(d) {
        return (d["College"] == currentCollege && parseInt(d["Total_" + currentYearStart]) > 50)
    })

    var defs = svg.append("defs");

    var gradient = defs.append("linearGradient")
        .attr("id", "svgGradient")
        .attr("x1", "0%")
        .attr("x2", "100%")
        .attr("y1", "0%")
        .attr("y2", "100%");

    gradient.append("stop")
        .attr('class', 'start')
        .attr("offset", "0%")
        .attr("stop-color", "red")
        .attr("stop-opacity", 1);

    gradient.append("stop")
        .attr('class', 'end')
        .attr("offset", "100%")
        .attr("stop-color", "blue")
        .attr("stop-opacity", 1);

    svg.selectAll("slope-line")
        .data(filteredData)
        .enter()
        .append("line")
        .attr("x1", margin.left + slopegraphMargin)
        .attr("y1", function(d, i) {
            return yScale(d['Total_' + currentYearStart]);
        })
        .attr("x2", effectiveDimension.width - margin.right - 2*slopegraphMargin)
        .attr("y2", function(d, i) {
            return yScale(d['Total_' + currentYearEnd]);
        })
        .attr("stroke-width", 5)
        .attr("stroke", "url(#svgGradient)")
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
        .attr("stroke","url(#svgGradient)")
        .attr("stroke-width", 4)
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
        .attr("stroke","url(#svgGradient)")
        .attr("stroke-width", 4)
        .attr("fill","white")
        .attr("r", 5)
        .attr("cx", effectiveDimension.width - margin.right - 2*slopegraphMargin)
        .attr("cy", function(d, i) {
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

    relax(leftSlopeLabels, "yLeftPosition");
        leftSlopeLabels.selectAll("text")
            .attr("y", d => d.yLeftPosition);
          
    relax(rightSlopeLabels, "yRightPosition");
        rightSlopeLabels.selectAll("text")
            .attr("y", d => d.yRightPosition);

    // Function to reposition an array selection of labels (in the y-axis)
    function relax(labels, position) {
        again = false;
        labels.each(function (d, i) {
          a = this;
          da = d3.select(a).datum();
          y1 = da[position];
          labels.each(function (d, j) {
            b = this;
            if (a == b) return;
            db = d3.select(b).datum();
            y2 = db[position];
            deltaY = y1 - y2;
  
            if (Math.abs(deltaY) > 18) return;
  
            // again = true;
            sign = deltaY > 0 ? 1 : -1;
            adjust = sign * 0.5;
            da[position] = +y1 + adjust;
            db[position] = +y2 - adjust;
  
            // if (again) {
            //   relax(labels, position);
            // }
          })
        })
    }

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