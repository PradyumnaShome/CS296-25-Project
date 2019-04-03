
// Using jQuery, read our data and call visualize(...) only once the page is ready:
$(function () {
    const datasetPath = "major-change-data.csv";
    d3.csv(datasetPath).then(function (data) {
        // Write the data to the console for debugging:
        console.log(data);

        // Call our visualize function:
        visualize(data);
    });
});


var visualize = function (data) {
    // Boilerplate:
    const canvasDimension = { width: 1024, height: 800 };
    var margin = { top: 50, right: 50, bottom: 50, left: 50 };

    const effectiveDimension = {
        width: canvasDimension.width - margin.left - margin.right,
        height: canvasDimension.height - margin.top - margin.bottom
    };

    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", canvasDimension.width)
        .attr("height", canvasDimension.height)
        .style("width", canvasDimension.width)
        .style("height", canvasDimension.height)
        .append("g");

    // Visualization Code:

    var canvasBackground = svg
        .append("rect")
        .attr("width", canvasDimension.width)
        .attr("height", canvasDimension.height)
        .attr("x", 0)
        .attr("y", 0)
        .attr("fill", "dodgerblue")
        .attr("stroke", "black");

    var background = svg
        .append("rect")
        .attr("width", effectiveDimension.width)
        .attr("height", effectiveDimension.height)
        .attr("x", margin.left)
        .attr("y", margin.top)
        .attr("fill", "seagreen")
        .attr("stroke", "blue");
    
    
}