class Barchart {

  /**
   * Class constructor with basic chart configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _data, _id, _dataCol) {
    // Configuration object with defaults
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 250,
      containerHeight: _config.containerHeight || 150,
      margin: _config.margin || {top: 10, right: 5, bottom: 40, left: 40},
      reverseOrder: _config.reverseOrder || false,
      tooltipPadding: _config.tooltipPadding || 15
    }
    this.data = _data;
    this.id = _id;
    this.dataCol = _dataCol;
    this.initVis();
  }
  
  /**
   * Initialize scales/axes and append static elements, such as axis titles
   */
  initVis() {
    let vis = this;

    // Calculate inner chart size. Margin specifies the space around the actual chart.
    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    // Initialize scales and axes
    // Important: we flip array elements in the y output range to position the rectangles correctly
    vis.yScale = d3.scaleLinear()
        .range([vis.height, 0]);

    vis.xScale = d3.scaleBand()
        .range([0, vis.width])
        .paddingInner(0.2);

    vis.xAxis = d3.axisBottom(vis.xScale)
        .ticks(4)
        .tickSizeOuter(0);

    vis.yAxis = d3.axisLeft(vis.yScale)
        .ticks(6)
        .tickSizeOuter(0);
        //.tickFormat(d3.formatPrefix('.0s', 1e6)); // Format y-axis ticks as millions

    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement)
        .attr('width', vis.config.containerWidth)
        .attr('height', vis.config.containerHeight);

    // SVG Group containing the actual chart; D3 margin convention
    vis.chart = vis.svg.append('g')
        .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    // Append empty x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${vis.height})`);
    
    // Append y-axis group 
    vis.yAxisG = vis.chart.append('g')
        .attr('class', 'axis y-axis');
  }

  /**
   * Prepare data and scales before we render it
   */
  updateVis() {
    let vis = this;

    let aggregatedDataMap = d3.rollups(vis.data, v => v.length, d => d[vis.dataCol])
    vis.aggregatedData = Array.from(aggregatedDataMap, ([key, count]) => ({ key, count }))
    //console.log(vis.aggregatedData)

    if(vis.dataCol == "star_type" || vis.dataCol == "habitable"){
      const found = vis.aggregatedData.find(element => element.key === undefined);
      if(found){
        found.key = "No data";
      }
    }
    //console.log(vis.aggregatedData)
    
    
    
    // Reverse column order depending on user selection
    // if (vis.config.reverseOrder) {
    //   vis.data.reverse();
    // }

    // Specificy x- and y-accessor functions
    if (vis.dataCol == "sy_snum" || vis.dataCol == "sy_pnum"){
      vis.aggregatedData = vis.aggregatedData.sort((a, b) =>  a.key - b.key);
    }
    else{
      vis.aggregatedData = vis.aggregatedData.sort((a, b) => b.count - a.count);
    }
    
    if (vis.dataCol == "discoverymethod"){
      let other_discovery_count = vis.aggregatedData.reduce(function (sum, item) {
        return sum + ((vis.aggregatedData.indexOf(item) >= 5) ? item.count : 0);
      }, 0);
      vis.aggregatedData = vis.aggregatedData.slice(0, 5);
      vis.aggregatedData.push({key: "Other", count: other_discovery_count});
    }
    vis.xValue = d => d.key;
    vis.yValue = d => d.count;

    // Set the scale input domains
    vis.xScale.domain(vis.aggregatedData.map(vis.xValue));
    vis.yScale.domain([0, d3.max(vis.aggregatedData, vis.yValue)]);

    vis.renderVis();
  }

  /**
   * Bind data to visual elements
   */
  renderVis() {
    let vis = this;
    
    // Add rectangles
    let bars = vis.chart.selectAll('.bar')
        .data(vis.aggregatedData, vis.xValue)
      .join('rect');
    
    bars.style('opacity', 0.5)
      .transition().duration(1000)
        .style('opacity', 1)
        .style('display', 'block')
        .attr('class', 'bar')
        .attr('x', d => vis.xScale(vis.xValue(d)))
        .attr('width', vis.xScale.bandwidth())
        .attr('height', d => vis.height - vis.yScale(vis.yValue(d)))
        .attr('y',  d => vis.yScale(vis.yValue(d)))

    // Tooltip event listeners
    bars
        .on('click', (event, d) =>{
          console.log("bar clicked")
          //console.log(event, d)
          //console.log(event.srcElement)
          //console.log(planetFilter)
          const isActive = planetFilter.length > 0;
          //console.log(isActive)
          if (isActive) {
            planetFilter = [];//planetFilter.filter(f => f !== d.pl_name); // Remove filter
          } 
          else {
            data.forEach(function(element){
              if (element[vis.dataCol] == d.key) planetFilter.push(element.pl_name);
            })
          }
          console.log("values added to filter")
          //console.log(planetFilter)
          //console.log(d3.select(this))
          //console.log(d3.select(event.srcElement))
          d3.select(event.srcElement).classed('active', !isActive);
          filterData(vis.dataCol);
        })
        .on('mouseover', (event,d) => {
          d3.select('#tooltip')
            .style('opacity', 1)
            .style('display', 'block')
            .html(`<div class="tooltip-label">Number of exoplanets</div>${d.count}`)
            //console.log(vis.yValue(d))
        })
        .on('mousemove', (event) => {
          d3.select('#tooltip')
            .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
            .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
        })
        .on('mouseleave', () => {
          d3.select('#tooltip').style('opacity', 0);
        });

    let tick = d3.selectAll('.tick')
    tick
        .on('mouseover', (event,d) => {
          if (event.target.ownerSVGElement.id == "chart3" || event.target.ownerSVGElement.id == "chart4"){
            d3.select('#tooltip')
            .style('opacity', 1)
            .style('display', 'block')
            .text(`Click to see more info on ${d}`)
          }       
        })
        .on('mousemove', (event) => {
          d3.select('#tooltip')
            .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
            .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
        })
        .on('mouseleave', () => {
          d3.select('#tooltip').style('opacity', 0);
        })
        .on('click', (event, d) => {
          //alert("I've been clicked!" + d)
          //console.log(event.target.ownerSVGElement.id)
          //console.log(d)
          if (event.target.ownerSVGElement.id == "chart3"){
            console.log("Chart3 new window opened")
            vis.chart3PopUp(d);
          }
          else if (event.target.ownerSVGElement.id == "chart4"){
            console.log("Chart4 new window opened ")
            vis.chart4Popup(d);
          }
        });
       
    //update x axis
    vis.xAxisG
        .transition().duration(1000)
        .call(vis.xAxis);


    //rotate x labels for chart4
    if(vis.config.parentElement == "#chart4"){
      vis.xAxisG
        .selectAll("text")  
          .style("font-size", "0.86em")    
    }
    
    //update y axis
    vis.yAxisG.call(vis.yAxis);
  }
  
  //function for creating a popup to tell user they can see more info from bar chart
  chart3PopUp(d) {
    if (d == "A"){
      window.open(
        'https://en.wikipedia.org/wiki/Stellar_classification#Class_A',
        '_blank'
      );
    }
    else if(d == "F"){
      window.open(
        'https://en.wikipedia.org/wiki/Stellar_classification#Class_F',
        '_blank'
      );
    }
    else if(d == "G"){
      window.open(
        'https://en.wikipedia.org/wiki/Stellar_classification#Class_G',
        '_blank'
      );
    }
    else if(d == "K"){
      window.open(
        'https://en.wikipedia.org/wiki/Stellar_classification#Class_K',
        '_blank'
      );
    }
    else if(d == "M"){
      window.open(
        'https://en.wikipedia.org/wiki/Stellar_classification#Class_M',
        '_blank'
      );
    }
  
  }

  chart4Popup(d){
    if (d == "Transit"){
      window.open(
        'https://en.wikipedia.org/wiki/Methods_of_detecting_exoplanets#Transit_photometry',
        '_blank'
      );
      }
      else if(d == "Radial Velocity"){
        window.open(
          'https://en.wikipedia.org/wiki/Methods_of_detecting_exoplanets#Radial_velocity',
          '_blank'
        );
      }
      else if(d == "Microlensing"){
        window.open(
          'https://en.wikipedia.org/wiki/Methods_of_detecting_exoplanets#Gravitational_microlensing',
          '_blank'
        );
      }
      else if(d == "Imaging"){
        window.open(
          'https://en.wikipedia.org/wiki/Methods_of_detecting_exoplanets#Direct_imaging',
          '_blank'
        );
      }
      else if(d == "Transit Timing Variations"){
        window.open(
          'https://en.wikipedia.org/wiki/Methods_of_detecting_exoplanets#Transit_timing',
          '_blank'
        );
      }
      else if(d == "Eclipse Timing Variations"){
        window.open(
          'https://en.wikipedia.org/wiki/Methods_of_detecting_exoplanets#Eclipsing_binary_minima_timing',
          '_blank'
        );
      }
      else{
        window.open(
          'https://en.wikipedia.org/wiki/Methods_of_detecting_exoplanets',
          '_blank'
        );
      }
  }
}