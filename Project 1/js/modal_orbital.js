//TODO would be nice to add zoom here
class Modal_Orbital {

  /**
   * Class constructor with basic chart configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _data, _selectedData) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 600,
      containerHeight: _config.containerHeight || 300,
      margin: _config.margin || {top: 0, right: 0, bottom: 0, left: 0},
      tooltipPadding: _config.tooltipPadding || 15
    }
    this.allData = _data;
    this.data = _selectedData;
    this.initVis();
  }
  
  /**
   * We initialize scales/axes and append static elements, such as axis titles.
   */
  initVis() {
    let vis = this;

    // Calculate inner chart size. Margin specifies the space around the actual chart.
    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    //Source: http://hyperphysics.phy-astr.gsu.edu/hbase/Starlog/staspe.html
    vis.colorScale = d3.scaleOrdinal()
      .range(['#250AFB', '#0AC6FB', '#E3C907', '#ffa500', '#FB3A0A']) 
      .domain(['A', 'F', 'G', 'K', 'M']);


    //otherwise the planet would be too close to the sun!! and not readable
    vis.starToPlanetScale = d3.scaleLog()
      .domain([0.01, 7550])
      .range([vis.width/2, vis.width]);

  }

  /**
   * Prepare the data and scales before we render it.
   */
  updateVis() {
    let vis = this;

    console.log(vis.data)

    // Data preparation
    vis.colorValue = vis.data.star_type;
    vis.starToPlanetValue = vis.data.pl_orbsmax;
    vis.eccentricity = vis.data.pl_orbeccen;
    //https://www.cuemath.com/geometry/eccentricity-of-ellipse/
    vis.yRadius = Math.sqrt((1-(Math.pow(vis.eccentricity, 2)))*(Math.pow(vis.starToPlanetValue, 2))); 
    // //console.log(vis.starToPlanetValue, vis.eccentricity, vis.yRadius)
    // vis.pathLength = Math.PI*(vis.starToPlanetValue+vis.yRadius) //≈ π (a + b)
    // var gen = function* () {
    //   for (var i = 0; i < parseInt(vis.pathLength); i++ ) {
    //     yield i = (i==(parseInt(l)-2)) ? 0 : i;
    //   }
    // };
    // console.log(gen)



    // draw = { 
    //   const svg = d3.select(DOM.svg(width, height))
      
    //   const path = svg.append("path")
    //     .attr("d",d3.line()(pathCoordinates))
      
    //   return path.node()
    // }

    // movingX = { yield draw.getPointAtLength(timer).x }
    // Remove old SVG
    d3.selectAll("#orbital > *").remove();
    d3.selectAll("#orbitalData > *").remove();

    vis.renderVis();
  }

  /**
   * Bind data to visual elements.
   */
  renderVis() {
    let vis = this;

    //Create svg of orbit
    vis.svg = d3.select("#orbital")
      .append("svg")
      .attr("style", "outline: thin solid black;")
      .attr("width", vis.width)
      .attr("height", vis.height);

    //Tooltip Prep
    vis.tooltip = vis.svg.append('g')
      .attr('class', 'tooltip')
      .style('display', 'none');
    
    vis.tooltip.append('text');

    //create distance line
    let distanceLine = vis.svg.append('line')
      .style("stroke", "#D6D4CF")
      .style("stroke-width", 2)
      .attr("x1", vis.width/2)
      .attr("y1", vis.height/2)
      .attr("x2", vis.starToPlanetScale(vis.starToPlanetValue))
      .attr("y2", vis.height/2); 

    //create orbit ellipse
    vis.svg.append("ellipse")
      .attr("cx", vis.width/2)
      .attr("cy", vis.height/2)
      .attr("rx", vis.starToPlanetScale(vis.starToPlanetValue)-vis.width/2) 
      .attr("ry", vis.starToPlanetScale(vis.yRadius)-vis.width/2) //vis.width is not a mistake, it's because the scale is equal in x and y
      .style("stroke", "#D6D4CF")
      .style("stroke-width", 2)
      .style("fill", "none");
    //create Sun circle
    vis.svg.append("circle")
      .attr("cx", vis.width/2)
      .attr("cy", vis.height/2)
      .attr("r", 10) 
      .style("fill", vis.colorScale(vis.colorValue));

    //create Sun label
    vis.svg.append("text")
      .attr('class', 'label')
      .attr('y', vis.height/2+10)
      .attr('x', vis.width/2)
      .attr('dy', '.71em')
      .style('text-anchor', 'middl')
      .attr("fill", "black")
      .text("Sun");

    //create planet circle
    vis.svg.append("circle")
      .attr("cx",vis.starToPlanetScale(vis.starToPlanetValue) )
      .attr("cy", vis.height/2)
      .attr("r", 10) 
      .style("fill", "#808080");

    //create planet label
    vis.svg.append("text")
      .attr('class', 'label')
      .attr('y', vis.height/2+10)
      .attr('x', vis.starToPlanetScale(vis.starToPlanetValue))
      .attr('dy', '.71em')
      .style('text-anchor', 'middle')
      .attr("fill", "black")
      .text("Planet");





    //Create legend
    let specTypeData = ['A', 'F', 'G', 'K', 'M'];

    vis.dataSvg = d3.select("#orbitalData")
      .append("svg")
      .attr("style", "outline: thin solid black;")
      .attr("width", vis.width)
      .attr("height", 100);

    vis.dataSvg.append('text')
      .attr('class', 'axis-title')
      .attr('x', 5)
      .attr('y', 5)
      .attr('dy', '.71em')
      .style('font-weight', 'bold')
      .text('Spectral Type');
    

    // Add one dot in the legend for each name.
    vis.dataSvg.selectAll("mydots")
      .data(specTypeData)
      .enter()
      .append("circle")
        .attr("cx", 10)
        .attr("cy", function(d,i){ return 25 + i*12}) // 25 is where the first dot appears. 10 is the distance between dots
        .attr("r", 5)
        .style("fill", d => vis.colorScale(d))

    // Add one dot in the legend for each name.
    vis.dataSvg.selectAll("mylabels")
      .data(specTypeData)
      .enter()
      .append("text")
        .attr("x", 30)
        .attr("y", function(d,i){ return 25 + i*12}) // 25 is where the first dot appears. 10 is the distance between dots
        .style("fill",  d => vis.colorScale(d))
        .text(d => d)
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("font-weight", "bold")



    //interactions
    //TODO make line black when hover
    distanceLine
      .on('mouseenter', () => {
        vis.tooltip.style('display', 'block');
      })
      .on('mouseleave', () => {
        vis.tooltip.style('display', 'none');
      })
      .on('mouseover', (event,d) => {
        console.log(event)
        let x = (vis.width/2 + vis.starToPlanetScale(vis.starToPlanetValue))/2
        let y = vis.height/2
        vis.tooltip.select('text')
              .attr('transform', `translate(${x-25},${(y-15)})`)
              .text(`${vis.starToPlanetValue} [au]`);
      })

  }
}



