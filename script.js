let ori_data;

async function loadData(url){
    let data = await d3.csv(url, d3.autoType);
    return data;
}

async function main(){
    const url = "wealth-health-2014.csv";
    ori_data = await loadData(url);

    const margin = ({top: 30, right: 30, bottom: 30, left: 30})
    const width = 750 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const svg = d3.select('.chart')
                    .append('svg') 
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
	                .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const lifeArr = [];
    const incomeArr = [];
    ori_data.forEach(a => lifeArr.push(a.LifeExpectancy));
    ori_data.forEach(a => incomeArr.push(a.Income));

    const xRange = d3.extent(incomeArr);
    const yRange = d3.extent(lifeArr);

    var xScale = d3.scaleLinear()
                    .domain([xRange[0], xRange[1]])
                    .range([0, 690])

    var yScale = d3.scaleLinear()
                    .domain([yRange[1], yRange[0]])
                    .range([0, 540])    

    const xAxis = d3.axisBottom()
    .ticks(5, "s")
	.scale(xScale);

    const yAxis = d3.axisLeft()
    .ticks(6, "s")
	.scale(yScale);

    svg.append("g")
	.attr("class", "axis x-axis")
    .attr("transform", `translate(0, ${height})`)
	.call(xAxis);
    
    svg.append("g")
	.attr("class", "axis y-axis")
    .attr("transform", `translate(0, ${width} - 20)`)
	.call(yAxis);

    let regionArr = [];
    ori_data.forEach(a => regionArr.push(a.Region));

    let uniqueRegion = [...new Set(regionArr)];

    const color = d3.scaleOrdinal(d3.schemeTableau10).domain(regionArr);

    let popArr = [];
    ori_data.forEach(a => popArr.push(a.Population));
    popArr.sort((a, b) => b - a);
    console.log(popArr);

    const comma = d3.format(",");

    svg.selectAll("scatter-plot")
        .data(ori_data)
        .enter()
        .append("circle")
        .attr('cx', d => xScale(d.Income))
        .attr('cy', d => yScale(d.LifeExpectancy))
        .attr('r', function(d){
            if (d.Population >= 1000000000) return 45;
            else if (d.Population >= 100000000) return 22;
            else if (d.Population >= 10000000) return 13;
            else if (d.population >= 1000000) return 11;
            else if (d.population >= 100000) return 19;
            else return 7;
        })
        .attr('fill', "rgb(76, 162, 219)")
        .attr('opacity', "0.65")
        .attr('stroke', "black")
        .attr("fill", function(d){return color(d.Region)})
        .on("mouseenter", (event, d) =>{
            const pos = d3.pointer(event, window);
            d3.select(event.target).attr("opacity", "1");
            d3.select(".tooltip")
                .attr("class", "tooltip")
                .style("display", "block")
                .style("left", pos[0] - 140 + 'px')
                .style("top", pos[1] - 30 + 'px')
                .html(
                    "Country: " + d.Country + "<br>" +
                    "Region: " + d.Region + "<br>" +
                    "Population: " + comma(d.Population) + "<br>" +
                    "Income: " + comma(d.Income) + "<br>" +
                    "Life Expectancy: " + d.LifeExpectancy + "<br>"
                );
        })
        .on("mouseleave", (event, d) =>{
            d3.select(event.target).attr("opacity", "0.65");
            d3.select(".tooltip")
                .style("display", "none");
        });
    
    svg.append("text")
        .attr('x', 635)
        .attr('y', 535)
        .text("Income")

    svg.append("text")
        .attr('x', 10)
        .attr('y', 0)
        .attr('class', 'vertical')
        .text("Life Expectancy")

    svg.selectAll("legend")
        .data(uniqueRegion)
        .enter()
        .append("g")
        .append("rect")
        .attr("x", 500)
        .attr("y", function(d,i){ return 300 + i*25.5})
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", function(d){
            return color(d)
        })

    svg.selectAll("legendText")
        .data(uniqueRegion)
        .enter()
        .append("text")
        .attr("x", 523)
        .attr("y", function(d,i){ return 309 + i*26})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
}

main();