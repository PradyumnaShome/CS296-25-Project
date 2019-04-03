// Using jQuery, read our data and call visualize(...) only once the page is ready:
$(function () {
    const datasetPath = "datasets/change_in_major.csv";
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
        height = 1700 - margin.top - margin.bottom,
        padding = 20;

    const effectiveDimension = {
        width: width - margin.left - margin.right,
        height: height - margin.top - margin.bottom
    };

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
            return d["Major Name"] + ": " +
            "From " + d['Total_1985'] + " in 1985 to " + d['Total_2018'] + " in 2018.";
        });

    svg.selectAll(".line")
        .data(data)
        .enter()
        .append("line")
        .attr("x1", margin.left + 200)
        .attr("y1", function(d, i) {
            return effectiveDimension.height - d['Total_1985']
        })
        .attr("x2", effectiveDimension.width - margin.right - 100)
        .attr("y2", function(d, i) {
            return effectiveDimension.height - d['Total_2018']
        })
        .attr("stroke-width", 2)
        .attr("stroke", "black")
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("y", function(d, i) {
            return effectiveDimension.height - d['Total_1985']
        })
        .attr("x", margin.left + 200)
        .attr("text-anchor","end")
        .attr("font-size","12px")
        .text(function(d, i) {
            console.log(d['Major Name'])
            return d['Major Name']
        });

    svg.selectAll("text2")
        .data(data)
        .enter()
        .append("text")
        .attr("y", function(d, i) {
            return effectiveDimension.height - d['Total_2018']
        })
        .attr("x", effectiveDimension.width - margin.right - 100)
        .attr("font-size","12px")
        .text(function(d, i) {
            console.log(d['Major Name'])
            return d['Major Name']
        });
    
    svg.call(tip);
}