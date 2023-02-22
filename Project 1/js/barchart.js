class Barchart {

  /**
   * Class constructor with basic chart configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _data, _xdata, _ydata) {
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
    this.xdata = _xdata;
    this.ydata = _ydata;
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
        .range([vis.height, 0]) 

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

    // Reverse column order depending on user selection
    // if (vis.config.reverseOrder) {
    //   vis.data.reverse();
    // }
    //vis.data = vis.data.sort((a, b) => b[this.ydata] - a[this.ydata])

    // Specificy x- and y-accessor functions
    vis.xValue = d => d[this.xdata];
    vis.yValue = d => d[this.ydata];

    // Set the scale input domains
    vis.xScale.domain(vis.data.map(vis.xValue));
    //console.log(d3.max(vis.data, vis.yValue))
    vis.yScale.domain([0, d3.max(vis.data, vis.yValue)]);

    vis.renderVis();
  }

  /**
   * Bind data to visual elements
   */
  renderVis() {
    let vis = this;
    // Add rectangles
    let bars = vis.chart.selectAll('.bar')
        .data(vis.data, vis.xValuef)
      .join('rect');
    
    bars.style('opacity', 0.5)
      .transition().duration(1000)
        .style('opacity', 1)
        .attr('class', 'bar')
        .attr('x', d => vis.xScale(vis.xValue(d)))
        .attr('width', vis.xScale.bandwidth())
        .attr('height', d => vis.height - vis.yScale(vis.yValue(d)))
        .attr('y',  d => vis.yScale(vis.yValue(d)))

    // Tooltip event listeners
    bars
        .on('click', (event, d) => {
          if (event.target.ownerSVGElement.id == "chart3"){
            console.log("Chart3 new window opened")
            console.log(d)
            if (d.type == "A"){
              window.open(
                'https://en.wikipedia.org/wiki/Stellar_classification#Class_A',
                '_blank'
              );
            }
            else if(d.type == "F"){
              window.open(
                'https://en.wikipedia.org/wiki/Stellar_classification#Class_F',
                '_blank'
              );
            }
            else if(d.type == "G"){
              window.open(
                'https://en.wikipedia.org/wiki/Stellar_classification#Class_G',
                '_blank'
              );
            }
            else if(d.type == "K"){
              window.open(
                'https://en.wikipedia.org/wiki/Stellar_classification#Class_K',
                '_blank'
              );
            }
            else if(d.type == "M"){
              window.open(
                'https://en.wikipedia.org/wiki/Stellar_classification#Class_M',
                '_blank'
              );
            }

          }
          else if (event.target.ownerSVGElement.id == "chart4"){
            console.log("Chart 4 new window opened ")
            console.log(d)
            if (d.discovery == "Transit"){
              window.open(
                'https://en.wikipedia.org/wiki/Methods_of_detecting_exoplanets#Transit_photometry',
                '_blank'
              );
            }
            else if(d.discovery == "Radial Velocity"){
              window.open(
                'https://en.wikipedia.org/wiki/Methods_of_detecting_exoplanets#Radial_velocity',
                '_blank'
              );
            }
            else if(d.discovery == "Microlensing"){
              window.open(
                'https://en.wikipedia.org/wiki/Methods_of_detecting_exoplanets#Gravitational_microlensing',
                '_blank'
              );
            }
            else if(d.discovery == "Imaging"){
              window.open(
                'https://en.wikipedia.org/wiki/Methods_of_detecting_exoplanets#Direct_imaging',
                '_blank'
              );
            }
            else if(d.discovery == "Transit Timing Variations"){
              window.open(
                'https://en.wikipedia.org/wiki/Methods_of_detecting_exoplanets#Transit_timing',
                '_blank'
              );
            }
            else if(d.discovery == "Eclipse Timing Variations"){
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
        })
        .on('mouseover', (event,d) => {
          d3.select('#tooltip')
            .style('opacity', 1)
            .html(`<div class="tooltip-label">Number of stars</div>${d.count}`)
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
}

