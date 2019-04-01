
// Using jQuery, read our data and call visualize(...) only once the page is ready:
$(function() {
  d3.csv("IllinoisStudentsByCurriculum.csv").then(function(data) {
    // Write the data to the console for debugging:
    console.log(data);

    // Call our visualize function:
    visualize(data);
  });
});


var visualize = function(data) {
  // Boilerplate:
  var margin = { top: 50, right: 50, bottom: 50, left: 150 },
     width = 1000 - margin.left - margin.right,
     height = 5000 - margin.top - margin.bottom;

  var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("width", width + margin.left + margin.right)
    .style("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var college = data.map(function (d){
    return d["College"];
  });
  college = d3.set(college).values();
  console.log(college);

  var years = data.map(function (d){
    return d["Fall"]
  });
  console.log(years);


  var collegecale = d3.scalePoint()
                          .domain(college)
                          .range([0, height]);

  var yearscale = d3.scalePoint()
                          .domain(years)
                          .range([width, 0]);

  var collegeaxis = d3.axisLeft(collegecale);
  svg.append("g")
     .attr("class", "axis")
     .call(collegeaxis);


  var yearsaxis = d3.axisTop(yearscale)
                    .tickValues([1985, 1990, 1995, 2000, 2005, 2010, 2015]);
  svg.append("g")
     .attr("class", "axis")
     .call(yearsaxis);


  // Visualization Code:
  svg.selectAll("circles")
     .data(data)
     .enter()
     .append("circle")
     .attr("r", function (d, i) {
       return 4;
     })
     .attr("cx", function (d, i) {
       return yearscale( d["Fall"] );
     })
     .attr("cy", function (d, i) {
       return collegecale( d["College"] );
     })
     .attr("fill", "red")
     .attr("stroke", "black")
     ;

};
