// Using jQuery, read our data and update visualization every second

var college = "LAS"
var changedCollege = false;
$(function () {
    var year = 1979;
    college = "LAS";
    changedCollege = false;
    window.setInterval(function(){
        if(changedCollege == true){
            year = 1979;
            changedCollege = false;
        }

        year++;
        if(year > 2018){
            year = 1980;
        }
        var title = college + " " + year;
        var datasetPath = "datasets/" + year + "-" + college + "-mp.csv";
        d3.csv(datasetPath).then(function(data){visualize(data, title)});
    }, 750);

});


var chooseCollege = function(college_name) {
    college = college_name;
    changedCollege = true;
}

var visualize = function (data, title) {
    // Boilerplate:
    const canvasDimension = { width: 1024, height: 800 };
    var margin = { top: 100, right: 50, bottom: 200, left: 100 };

    const effectiveDimension = {
        width: canvasDimension.width - margin.left - margin.right,
        height: canvasDimension.height - margin.top - margin.bottom
    };

    $('#chart').empty();

    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", canvasDimension.width)
        .attr("height", canvasDimension.height)
        .style("width", canvasDimension.width)
        .style("height", canvasDimension.height)
        .append("g");

    // Visualization Code:

    var background = svg
        .append("rect")
        .attr("width", effectiveDimension.width)
        .attr("height", effectiveDimension.height)
        .attr("x", margin.left)
        .attr("y", margin.top)
        .attr("fill", "paleturquoise")
        .attr("stroke", "blue");

    var majors = new Set([]);

    data.forEach(element => {
        majors.add(element["Major Name"]);
    });

    var majors = Array.from(majors);

    var yScale = d3.scaleLinear()
        .range([0, effectiveDimension.height])
        .domain([100, 0])

    var heightScale = d3.scaleLinear()
        .range([0, effectiveDimension.height])
        .domain([0, 100])

    var yAxis = d3.axisLeft()
        .scale(yScale)

    var xScale = d3.scaleBand()
        .domain(majors)
        .range([0, effectiveDimension.width])

    var xAxis = d3.axisBottom()
        .scale(xScale);

    svg.append('g')
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
        .call(yAxis);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + margin.left + ", " + (effectiveDimension.height + margin.top) + ")")
        .call(xAxis)
        .selectAll('text')
        .style("text-anchor", "end")
        .attr("dx", "-1em")
        .attr("dy", "-0.1em")
        .attr("transform", "rotate(-60)");

    var total = 0;
    data.forEach(element => {
        total += parseInt(element["Total"])
    })

    svg.selectAll("Major Name")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return margin.left + xScale(d["Major Name"])
        })
        .attr("width", xScale.bandwidth())
        .attr("y", function (d) {
            return effectiveDimension.height + margin.top - heightScale(100 * d["Total"] / total)
        })
        .attr("height", function (d) {
            height = heightScale(100 * d["Total"] / total)
            return height
        })
        .attr("stroke", "black")
        .attr("fill", "orange");

    svg.append("text")
        .attr("transform", "translate(" + (margin.left + effectiveDimension.width / 2) + ", " + (effectiveDimension.height + margin.top + margin.bottom * 4.0 / 5.0) + ")")
        .style("text-anchor", "middle")
        .text("Major");

    svg.append("text")
        .attr("transform", "translate(" + margin.left/2  + ", " + (margin.top + effectiveDimension.height/2) + ")")
        .style("text-anchor", "middle")
        .text("%");

    svg.append("text")
        .attr("transform", "translate(" + (margin.left + effectiveDimension.width / 2) + ", " + (margin.top * 3 / 4) + ")")
        .style("text-anchor", "middle")
        .text(title);

    svg.append("text")
        .attr("transform", "translate(" + (margin.left/2 + effectiveDimension.width) + ", " + (margin.top * 3 / 4) + ")")
        .style("text-anchor", "middle")
        .text("Total: " + total);
}