let ori_data;

async function loadData(url){
    let data = await d3.csv(url, d3.autoType);
    return data;
}

async function main(){
    const url = "wealth-health-2014.csv";
    ori_data = await loadData(url);

    const svg = d3.select('.chart')
                    .append('svg') 
                    .attr("width", 1100)
                    .attr("height", 900)

    const lifeArr = [];
    const incomeArr = [];
    ori_data.forEach(a => lifeArr.push(a.LifeExpectancy));
    ori_data.forEach(a => incomeArr.push(a.Income));

    const xRange = d3.extent(incomeArr);
    const yRange = d3.extent(lifeArr);

    var xScale = d3.scaleLinear()
                    .domain([xRange[0], xRange[1]])
                    .range([0, 1100])

    var yScale = d3.scaleLinear()
                    .domain([yRange[1], yRange[0]])
                    .range([0, 900])

    svg.selectAll("scatter-plot")
        .data(ori_data)
        .enter()
        .append("circle")
        .attr('cx', d => xScale(d.Income))
        .attr('cy', d => yScale(d.LifeExpectancy))
        .attr('r', function(d){
            return 10;
        })
        .attr('fill', "rgb(76, 162, 219)")
        .attr('opacity', "0.7")
        .attr('stroke', "black")
}

main();