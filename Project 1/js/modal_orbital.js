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
    vis.starColorScale = d3.scaleOrdinal()
      .range(['#250AFB', '#0AC6FB', '#E3C907', '#ffa500', '#FB3A0A']) 
      .domain(['A', 'F', 'G', 'K', 'M']);


    //otherwise the planet would be too close to the sun!! and not readable
    vis.starToPlanetScale = d3.scaleLog()
      .domain([0.01, 7550])
      .range([vis.width/2, vis.width]);

    vis.planetColorScale = d3.scaleOrdinal()
    .range(d3.schemeCategory10.splice(0, 7)) 
    .domain(['Asteroidan', 'Mercurian', 'Subterran', 'Terran', 'Superterran', 'Neptunian', 'Jovian']);

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
    vis.planetSize = vis.data.pl_rade;
    vis.sunSize = vis.data.st_rad*109.1/vis.planetSize*5;
    vis.planetSizeDesc = colorPlanet(vis.planetSize);
    //TODO fix radius
    //https://www.cuemath.com/geometry/eccentricity-of-ellipse/
    vis.yRadius = Math.sqrt((1-(Math.pow(vis.eccentricity, 2)))*(Math.pow(vis.starToPlanetValue, 2))); 

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
      .style("fill", vis.starColorScale(vis.colorValue));

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
    vis.planet = vis.svg.append("circle")
      .attr("cx", vis.starToPlanetScale(vis.starToPlanetValue))
      .attr("cy", vis.height/2)
      .attr("r", 5) 
      .style("fill", vis.planetColorScale(vis.planetSizeDesc));

    //create planet label
    vis.svg.append("text")
      .attr('class', 'label')
      .attr('y', vis.height/2+10)
      .attr('x', vis.starToPlanetScale(vis.starToPlanetValue))
      .attr('dy', '.71em')
      .style('text-anchor', 'middle')
      .attr("fill", "black")
      .text("Planet");


    //Source: https://squiggle.city/~frencil/archives/20150501.html
    //TODO: animate the orbit


    // The distances of the planets to their star
		// The orbits of the planets around their star (note, these are ellipses)


    //////////////////////////////////////////Display data for current click
    vis.svg.append('text')
      .attr('class', 'axis-title')
      .attr('x', 5)
      .attr('y', 5)
      .attr('dy', '.71em')
      .style('font-weight', 'bold')
      .text(`Exoplanet Name: ${vis.data.pl_name}`);

    vis.svg.append('text')
      .attr('class', 'axis-title')
      .attr('x', 5)
      .attr('y', 20)
      .attr('dy', '.71em')
      .text(`Planet mass: ${vis.data.sys_name}`);

    vis.svg.append('text')
      .attr('class', 'axis-title')
      .attr('x', 5)
      .attr('y', 35)
      .attr('dy', '.71em')
      .text(`Number of stars in system: ${vis.data.sy_snum}`);


    //Notes
    vis.svg.append('text')
      .attr('class', 'axis-title')
      .attr('x', 5)
      .attr('y', 380-30)
      .attr('dy', '.71em')
      .style('text-anchor', 'start')
      .text('Shown here are accurate scaled distances of');

    vis.svg.append('text')
      .attr('class', 'axis-title')
      .attr('x', 5)
      .attr('y',  380-15)
      .attr('dy', '.71em')
      .style('text-anchor', 'start')
      //.style('font-weight', 'bold')
      .text('the sun to the exoplanet, as well as the orbit ellipse');
    
    vis.svg.append('text')
      .attr('class', 'axis-title')
      .attr('x', 5)
      .attr('y',  380)
      .attr('dy', '.71em')
      .style('font-weight', 'bold')
      .text('Note: Sun and Planet size are not to scale.');
      

    



    //Source: https://d3-graph-gallery.com/graph/custom_legend.html
    //Create legend
    let specTypeData = ['A', 'F', 'G', 'K', 'M'];
    let planetDescData = ['Asteroidan', 'Mercurian', 'Subterran', 'Terran', 'Superterran', 'Neptunian', 'Jovian'];

    vis.dataSvg = d3.select("#orbitalData")
      .append("svg")
      .attr("style", "outline: thin solid black;")
      .attr("width", vis.width)
      .attr("height", 120);

    // Add legend title for stars
    vis.dataSvg.append('text')
      .attr('class', 'axis-title')
      .attr('x', 5)
      .attr('y', 5)
      .attr('dy', '.71em')
      .style('font-weight', 'bold')
      .text('Star Spectral Type');
    

    // Add one dot in the legend for each star
    vis.dataSvg.selectAll("starLegendDots")
      .data(specTypeData)
      .enter()
      .append("circle")
        .attr("cx", 10)
        .attr("cy", function(d,i){ return 25 + i*12}) // 25 is where the first dot appears. 10 is the distance between dots
        .attr("r", 5)
        .style("fill", d => vis.starColorScale(d))

    // Add desc in the legend for each star
    vis.dataSvg.selectAll("starLegendLabels")
      .data(specTypeData)
      .enter()
      .append("text")
        .attr("x", 30)
        .attr("y", function(d,i){ return 25 + i*12}) // 25 is where the first dot appears. 10 is the distance between dots
        .style("fill",  d => vis.starColorScale(d))
        .text(d => d)
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("font-weight", "bold")

    // Add title for planet legend
    vis.dataSvg.append('text')
      .attr('class', 'axis-title')
      .attr('x', 140)
      .attr('y', 5)
      .attr('dy', '.71em')
      .style('font-weight', 'bold')
      .text('Planet Type');

      // Add one dot in the legend for each planet
    vis.dataSvg.selectAll("planetLegendDots")
      .data(planetDescData)
      .enter()
      .append("rect")
        .attr("x", 145)
        .attr("y", function(d,i){ return 18 + i*12}) // 25 is where the first dot appears. 10 is the distance between dots
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", d => vis.planetColorScale(d))

    // Add desc in the legend for each planet
    vis.dataSvg.selectAll("planetLegendLabels")
      .data(planetDescData)
      .enter()
      .append("text")
        .attr("x", 165)
        .attr("y", function(d,i){ return 25 + i*12}) // 25 is where the first dot appears. 10 is the distance between dots
        .style("fill",  d => vis.planetColorScale(d))
        .text(d => d)
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("font-weight", "bold")

    vis.dataSvg.append('text')
      .attr('class', 'axis-title')
      .attr('x', 300)
      .attr('y', 5)
      .attr('dy', '.71em')
      .style("font-weight", "bold")
      .text("Orbital Data");


    vis.dataSvg.append('text')
      .attr('class', 'axis-title')
      .attr('x', 300)
      .attr('y', 20)
      .attr('dy', '.71em')
      .text(`Number of planets in system: ${vis.data.sy_pnum}`);

    vis.dataSvg.append('text')
      .attr('class', 'axis-title')
      .attr('x', 300)
      .attr('y', 35)
      .attr('dy', '.71em')
      .text(`Longest radius of an elliptic orbit: ${vis.data.pl_orbsmax} [au]`);

    vis.dataSvg.append('text')
      .attr('class', 'axis-title')
      .attr('x', 300)
      .attr('y', 50)
      .attr('dy', '.71em')
      .text(`Eccentricity: ${vis.data.pl_orbeccen}`);

    vis.dataSvg.append('text')
      .attr('class', 'axis-title')
      .attr('x', 300)
      .attr('y', 65)
      .attr('dy', '.71em')
      .text(`Planet radius: ${vis.data.pl_rade} [Earth radius]`);

    vis.dataSvg.append('text')
      .attr('class', 'axis-title')
      .attr('x', 300)
      .attr('y', 80)
      .attr('dy', '.71em')
      .text(`Star radius: ${vis.data.st_rad*109.1} [Earth radius]`);


    
  



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


function colorPlanet(plMass){
  if (plMass < 0.0001) return "Asteroidan"
  else if (plMass >= 0.0001 && plMass < 0.1) return "Mercurian"
  else if (plMass >= 0.1 && plMass < 0.5) return "Subterran"
  else if (plMass >= 0.5 && plMass < 2) return "Terran"
  else if (plMass >= 2 && plMass < 10) return "Superterran"
  else if (plMass >= 10 && plMass < 50) return "Neptunian"
  else if (plMass >= 50) return "Jovian"
}