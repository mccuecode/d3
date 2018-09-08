
var svgWidth = 900  ;
var svgHeight = 500;

var margin = {top: 20, right: 40, bottom: 80, left:10};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;



var svg = d3
    .select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var chart = svg.append("g");


d3.select(".chart")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


d3.csv("data/data.csv", function(error, csvdata) {

    for (var i = 0; i < csvdata.length; i++){
        // console.log(data.abbr);
        console.log(csvdata[i].abbr)
    }
    if (error) throw error;

    csvdata.forEach(function(d) {
        d.poverty = +d.poverty;
        d.healthcare = +d.healthcare;        
    });

    
    var yLinearScale = d3.scaleLinear()
        .range([height, 0]);

    var xLinearScale = d3.scaleLinear()
        .range([0, width]);

    
    var bottomAxis = d3.axisBottom(xLinearScale);

    var leftAxis = d3.axisLeft(yLinearScale);

    function findMinAndMax(dataColumnX) {
        xMin = d3.min(csvdata, function(d) {
            return +d[dataColumnX] * 0.8;
        });

        xMax =  d3.max(csvdata, function(d) {
            return +d[dataColumnX] * 1.1;
        });

        yMax = d3.max(csvdata, function(d) {
            return +d.healthcare * 1.1;
        });
    }
    
    var currentAxisLabelX = "poverty";

    
    findMinAndMax(currentAxisLabelX);

    
    xLinearScale.domain([xMin, xMax]);
    yLinearScale.domain([0, yMax]);

    // Create tooltip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .html(function(d) {
            var state = d.abbr;
            var poverty = +d.poverty;
            var healthcare = +d.healthcare;
            return (d.state + "<br> In Poverty: " + poverty + "%<br> Lack Healthcare: " + healthcare + "%");
        });

    chart.call(toolTip);


    
    chart
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    
    .attr("class", "x-axis")
    .call(bottomAxis);

    
    chart
        .append("g")
        .call(leftAxis);

    
    chart    
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .attr("class", "axis-text")
    .attr("data-axis-name", "healthcare")
    .text("Lacks Healthcare(%)");

    
    chart
    .append("text")
    .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")")
    .attr("data-axis-name", "poverty")
    .text("In Poverty (%)");

    var circles = chart.selectAll(".state")
        .data(csvdata)
        .enter()

    circles
        .append("circle")
        .attr("class", "state")  
        .attr("cx", function(d, index) {
            return xLinearScale(+d[currentAxisLabelX]);
        })
        .attr("cy", function(d, index) {
            return yLinearScale(d.healthcare);
        })
        .attr("r", "15")
        .style("fill","lightblue") 
        .style("opacity", .9)
        .style("stroke-width", ".2");
    
    circles
        .append("text")
        .attr("x", function(d, index) {
            return xLinearScale(+d[currentAxisLabelX]- 0.08);
        })
        .attr("y", function(d, index) {
            return yLinearScale(d.healthcare - 0.2);
        })
        .text(function(d){
            return d.abbr;
        })
        .attr("class", "circleText")
        
        .on("mouseover", function(d) {
          toolTip.show(d);
        })
        
        .on("mouseout", function(d, index) {
          toolTip.hide(d);
        });         

});

