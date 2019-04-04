// Using jQuery, read our data and call visualize(...) only once the page is ready:
$(function () {
    const datasetPath = "datasets/majors_transposed.csv";
    d3.csv(datasetPath).then(function (data) {
        // Write the data to the console for debugging:
        console.log(data);

        // Call our visualize function:
        visualize(data);
    });
});

var visualize = function (data) {
    // Boilerplate:
    var margin = { top: 50, right: 50, bottom: 50, left: 50 },
        width = 1500 - margin.left - margin.right,
        height = 1000 - margin.top - margin.bottom,
        padding = 20;

    const effectiveDimension = {
        width: width - margin.left - margin.right,
        height: height - margin.top - margin.bottom
    };

    var config = {
        xOffset: 0,
        yOffset: 0,
        width: width,
        height: height,
        labelPositioning: {
          alpha: 0.5,
          spacing: 18
        },
        leftTitle: "2013",
        rightTitle: "2016",
        labelGroupOffset: 5,
        labelKeyOffset: 50,
        radius: 6,
        // Reduce this to turn on detail-on-hover version
        unfocusOpacity: 0.3
      }

    var slopegraphMargin = 75;

    var currentYearStart = "1990";
    var currentYearEnd = "1995";
    var currentCollege = "Engineering";

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

    var minStart = d3.min(data.filter(function(d) {
        return (d["College"] == currentCollege)
    }), function(d) {
        return d["Total_" + currentYearStart]
    })

    var minEnd = d3.min(data.filter(function(d) {
        return (d["College"] == currentCollege)
    }), function(d) {
        return d["Total_" + currentYearEnd]
    })

    var minTotal = d3.min([maxStart, maxEnd])

    console.log(minTotal)

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
        .range([effectiveDimension.height, margin.top + 50]);

    console.log(yScale(0))

    var filteredData = data.filter(function(d) {
        return (d["College"] == currentCollege && parseInt(d["Total_" + currentYearStart]) > 50)
    })

    svg.selectAll(".slope-line")
        .data(filteredData)
        .enter()
        .append("line")
        .attr("x1", margin.left + slopegraphMargin)
        .attr("y1", function(d, i) {
            return yScale(d['Total_' + currentYearStart]);
        })
        .attr("x2", effectiveDimension.width - margin.right - slopegraphMargin)
        .attr("y2", function(d, i) {
            return yScale(d['Total_' + currentYearEnd]);
        })
        .attr("stroke-width", 3)
        .attr("stroke", "black")
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);
    
    leftSlopeLabels = svg.selectAll("left_text")
        .data(filteredData)
        .enter()
        .append("text")
        .attr("y", function(d, i) {
            return yScale(d['Total_' + currentYearStart]);
        })
        .attr("x", margin.left + slopegraphMargin)
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
        .attr("x", effectiveDimension.width - margin.right - slopegraphMargin)
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
        .attr("fill","white")
        .attr("r", 5)
        .attr("cx", effectiveDimension.width - margin.right - slopegraphMargin)
        .attr("cy", function(d, i) {
            return yScale(d['Total_' + currentYearEnd])
        });
    
    svg.selectAll(".border-lines")
        .enter()
        .append("line")
            .attr("x1", margin.left + slopegraphMargin)
            .attr("y1", 0)
            .attr("x2", margin.left + slopegraphMargin)
            .attr("y2", height)
            .attr("stroke-width", 3)
            .attr("stroke", "black")
        .append("line")
            .attr("x1", effectiveDimension.width - margin.right - slopegraphMargin)
            .attr("y1", 0)
            .attr("x2", effectiveDimension.width - margin.right - slopegraphMargin)
            .attr("y2", height)
            .attr("stroke-width", 3)
            .attr("stroke", "black");

    relax(leftSlopeLabels, "yLeftPosition");
        leftSlopeLabels.selectAll("text")
            .attr("y", d => d.yLeftPosition);
        
    relax(rightSlopeLabels, "yRightPosition");
        rightSlopeLabels.selectAll("text")
            .attr("y", d => d.yRightPosition);

    d3.selectAll(".slope-line")
        .attr("opacity", config.unfocusOpacity);

    svg.call(tip);

    svg.append("tile")
        .attr("x", 200)
        .attr("y", 400)
        .style("font-size", "16px") 
            .text(currentYearStart);

    var titles = svg.append("g")
        .enter()
      	.attr("class", "title");
      
      titles.append("text")
        .attr("text-anchor", "end")
        .attr("x", 200)
        .attr("y", 400)
      	.attr("dx", -10)
        .attr("dy", -margin.top / 2)
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
      	.text(currentYearStart);
      
      titles.append("text")
      	.attr("x", config.width)
      	.attr("dx", 10)
      	.attr("dy", -margin.top / 2)
      	.text(currentYearEnd);

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
  
            if (Math.abs(deltaY) > config.labelPositioning.spacing) return;
  
            again = true;
            sign = deltaY > 0 ? 1 : -1;
            adjust = sign * config.labelPositioning.alpha;
            da[position] = +y1 + adjust;
            db[position] = +y2 - adjust;
  
            if (again) {
              relax(labels, position);
            }
          })
        })
    }
}