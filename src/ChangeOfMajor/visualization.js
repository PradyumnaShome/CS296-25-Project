// Using jQuery, read our data and call visualize(...) only once the page is ready:
$(function () {
    const datasetPath = "datasets/majors_transposed.csv";
    d3.csv(datasetPath).then(function (data) {
        // Write the data to the console for debugging:
        console.log(data);

        // Call our visualize function:
        var currentYearStart = "1990";
        var currentYearEnd = "1995";
        var currentCollege = "Engineering";

        visualize(data, currentYearStart, currentYearEnd, currentCollege);
    });
});

var visualize = function (data, currentYearStart, currentYearEnd, currentCollege) {
    // Boilerplate:
    var margin = { top: 50, right: 50, bottom: 50, left: 100 },
        width = 1500 - margin.left - margin.right,
        height = 1400 - margin.top - margin.bottom,
        padding = 50;

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
        .style("opacity", 0.1)
        .offset([-10, 0])
        .html(function (d, i) {
            return d["Major Name"];
        });
    
    var yScale = d3.scaleLinear()
        .domain([0, maxTotal])
        .range([effectiveDimension.height, margin.top + 200]);

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
        .attr("x", effectiveDimension.width - margin.right - slopegraphMargin + 10)
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
        .attr("cx", effectiveDimension.width - margin.right - slopegraphMargin)
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
        .attr("x1", effectiveDimension.width - margin.right - slopegraphMargin)
        .attr("y1", 150)
        .attr("x2", effectiveDimension.width - margin.right - slopegraphMargin)
        .attr("y2", height)
        .attr("stroke-width", 3)
        .attr("stroke", "black")
        .attr("stroke-linecap","round");

    d3.selectAll(".slope-line")
        .attr("opacity", config.unfocusOpacity);

    svg.call(tip);

    svg.selectAll("first-title")
        .enter()
        .append("text")
        .attr("x", margin.left + slopegraphMargin - 10)
        .attr("y", 100)
        .style("font-size", "16px") 
            .text(currentYearStart);

    svg.selectAll("second-title")
        .enter()
        .append("text")
        .attr("x", effectiveDimension.width - margin.right - slopegraphMargin - 10)
        .attr("y", 100)
        .style("font-size", "16px") 
      	.text(currentYearEnd);
          
    // relax(leftSlopeLabels, "yLeftPosition");
    //     leftSlopeLabels.selectAll("text")
    //         .attr("y", d => d.yLeftPosition);
          
    // relax(rightSlopeLabels, "yRightPosition");
    //     rightSlopeLabels.selectAll("text")
    //         .attr("y", d => d.yRightPosition);

    // // Function to reposition an array selection of labels (in the y-axis)
    // function relax(labels, position) {
    //     again = false;
    //     labels.each(function (d, i) {
    //       a = this;
    //       da = d3.select(a).datum();
    //       y1 = da[position];
    //       labels.each(function (d, j) {
    //         b = this;
    //         if (a == b) return;
    //         db = d3.select(b).datum();
    //         y2 = db[position];
    //         deltaY = y1 - y2;
  
    //         if (Math.abs(deltaY) > config.labelPositioning.spacing) return;
  
    //         again = true;
    //         sign = deltaY > 0 ? 1 : -1;
    //         adjust = sign * config.labelPositioning.alpha;
    //         da[position] = +y1 + adjust;
    //         db[position] = +y2 - adjust;
  
    //         if (again) {
    //           relax(labels, position);
    //         }
    //       })
    //     })
    // }

    function handle_transition(new_currentYearStart, new_currentYearEnd, new_currentCollege) {
        console.log("new current year start " + new_currentYearStart)
        console.log("new current year end " + new_currentYearEnd)
        console.log("new current college " + new_currentCollege)

        var maxStart = d3.max(data.filter(function(d) {
            return (d["College"] == new_currentCollege)
        }), function(d) {
            return d["Total_" + new_currentYearStart]
        })
    
        var maxEnd = d3.max(data.filter(function(d) {
            return (d["College"] == new_currentCollege)
        }), function(d) {
            return d["Total_" + new_currentYearEnd]
        })
    
        var maxTotal = d3.max([maxStart, maxEnd])
    
        var minStart = d3.min(data.filter(function(d) {
            return (d["College"] == new_currentCollege)
        }), function(d) {
            return d["Total_" + new_currentYearStart]
        })
    
        var minEnd = d3.min(data.filter(function(d) {
            return (d["College"] == new_currentCollege)
        }), function(d) {
            return d["Total_" + new_currentYearEnd]
        })

        var minTotal = d3.min([maxStart, maxEnd])

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .style("opacity", 0.1)
            .offset([-10, 0])
            .html(function (d, i) {
                return d["Major Name"];
            });
        
        var yScale = d3.scaleLinear()
            .domain([0, maxTotal])
            .range([effectiveDimension.height, margin.top + 200]);

        console.log(yScale(0))

        var filteredData = data.filter(function(d) {
            console.log("here")
            return (d["College"] == new_currentCollege && parseInt(d["Total_" + new_currentYearStart]) > 50)
        })

        svg.selectAll("line")
            .data(filteredData)
            .transition()
                .attr("x1", margin.left + slopegraphMargin)
                .attr("y1", function(d, i) {
                    return yScale(d['Total_' + new_currentYearStart]);
                })
                .attr("x2", effectiveDimension.width - margin.right - slopegraphMargin)
                .attr("y2", function(d, i) {
                    console.log("hello")
                    return yScale(d['Total_' + new_currentYearEnd]);
                })
                .duration(1500)
                .delay(200)
            // .attr("stroke-width", 3)
            // .attr("stroke", "black")
            // .on('mouseover', tip.show)
            // .on('mouseout', tip.hide);
        
        svg.selectAll("left_text")
            .data(filteredData)
            .transition()
                .attr("y", function(d, i) {
                    return yScale(d['Total_' + currentYearStart]);
                })
                .attr("x", margin.left + slopegraphMargin - 10)
                .text(function(d, i) {
                    return d['Major Name'] + ": " + parseInt(d['Total_' + currentYearStart])
                })
                .duration(1500)
                .delay(200)

        rightSlopeLabels = svg.selectAll("right_text")
            .data(filteredData)
            .transition()
                // .append("text")
                .attr("y", function(d, i) {
                    return yScale(d['Total_' + currentYearEnd]);
                })
                .attr("x", effectiveDimension.width - margin.right - slopegraphMargin + 10)
                .text(function(d, i) {
                    return d['Major Name'] + ": " + parseInt(d['Total_' + currentYearEnd])
                })
                .duration(1500)
                .delay(200)

        svg.selectAll("left_circles")
            .data(filteredData)
            .transition()
                // .data(filteredData)
                // .append("circle")
                .attr("r", 5)
                .attr("cx", margin.left + slopegraphMargin)
                .attr("cy", function(d, i) {
                    return yScale(d['Total_' + currentYearStart])
                })
                .duration(1500)
                .delay(200)

        svg.selectAll("right_circles")
            .data(filteredData)
            .transition()
                // .append("circle")
                .attr("stroke","black")
                .attr("stroke-width", 2)
                .attr("r", 5)
                .attr("cx", effectiveDimension.width - margin.right - slopegraphMargin)
                .attr("cy", function(d, i) {
                    console.log("hello")
                    return yScale(d['Total_' + currentYearEnd])
                })
                .duration(1500)
                .delay(200)

        svg.call(tip);

        // svg.selectAll("first-title")
        //     .attr("x", margin.left + slopegraphMargin - 10)
        //     .attr("y", 100)
        //     .style("font-size", "16px") 
        //         .text(currentYearStart);

        // svg.selectAll("second-title")
        //     .attr("x", effectiveDimension.width - margin.right - slopegraphMargin - 10)
        //     .attr("y", 100)
        //     .style("font-size", "16px") 
        //     .text(currentYearEnd);
    }

    d3.select("#label-option-start").on("change", function(){
        myInput = this.value
        currentYearStart = myInput
        handle_transition(currentYearStart, currentYearEnd, currentCollege);
    })

    d3.select("#label-option-end").on("change", function(){
        myInput = this.value
        currentYearEnd = myInput;
        handle_transition(currentYearStart, currentYearEnd, currentCollege);
    })

    d3.select("#label-option-college").on("change", function(){
        myInput = this.value
        currentCollege = this.value
        handle_transition(myInput, currentYearEnd, currentCollege);
    })


}