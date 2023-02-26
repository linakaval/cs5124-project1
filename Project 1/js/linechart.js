// Initialize helper function
const parseTime = d3.timeParse("%Y");

class LineChart {

  /**
   * Class constructor with basic chart configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _data, _id, _dataCol) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 800,
      containerHeight: _config.containerHeight || 240,
      margin: _config.margin || {top: 30, right: 50, bottom: 30, left: 50}
    }
    this.data = _data;
    this.id = _id;
    this.dataCol = _dataCol;
    this.initVis();
  }
  
  /**
   * Initialize scales/axes and append static chart elements
   */
  initVis() {
    let vis = this;

    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    vis.xScale = d3.scaleTime()
        .range([0, vis.width]);

    vis.yScale = d3.scaleLinear()
        .range([vis.height, 0])
        .nice();

    // Initialize axes
    vis.xAxis = d3.axisBottom(vis.xScale)
        .ticks(6)
        .tickSizeOuter(0)
        .tickPadding(10);
        //.tickFormat(d3.format("Y"));
    vis.yAxis = d3.axisLeft(vis.yScale)
        .ticks(4)
        .tickSizeOuter(0)
        .tickPadding(10);

    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement)
        .attr('width', vis.config.containerWidth)
        .attr('height', vis.config.containerHeight);

    // Append group element that will contain our actual chart (see margin convention)
    vis.chart = vis.svg.append('g')
        .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    // Append empty x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${vis.height})`);
    
    // Append y-axis group
    vis.yAxisG = vis.chart.append('g')
        .attr('class', 'axis y-axis');

    // We need to make sure that the tracking area is on top of other chart elements
    vis.marks = vis.chart.append('g');
    vis.trackingArea = vis.chart.append('rect')
        .attr('width', vis.width)
        .attr('height', vis.height)
        .attr('fill', 'none')
        .attr('pointer-events', 'all');

        //(event,d) => {

    // Empty tooltip group (hidden by default)
    vis.tooltip = vis.chart.append('g')
        .attr('class', 'tooltip')
        .style('display', 'none');

    vis.tooltip.append('circle')
        .attr('r', 4);

    vis.tooltip.append('text');
  }

  /**
   * Prepare the data and scales before we render it.
   */
  updateVis() {
    let vis = this;

    let aggregatedDataMap = d3.rollups(vis.data, v => v.length, d => d[vis.dataCol])
    vis.aggregatedData = Array.from(aggregatedDataMap, ([key, count]) => ({ key, count }))
    // console.log(vis.aggregatedData)
    //d3.timeParse("%Y-%m-%d")(d.date), value : d.value

    vis.aggregatedData = vis.aggregatedData.sort((a, b) => a.key - b.key);
    vis.aggregatedData.forEach(d => {
      d.key = parseTime(d.key);  // Convert string to float
    });

    vis.xValue = d => d.key;
    vis.yValue = d => d.count;

    vis.line = d3.line()
        .x(d => vis.xScale(vis.xValue(d)))
        .y(d => vis.yScale(vis.yValue(d)));

    // Set the scale input domains
    vis.xScale.domain(d3.extent(vis.aggregatedData, vis.xValue));
    vis.yScale.domain(d3.extent(vis.aggregatedData, vis.yValue));

    vis.bisectDate = d3.bisector(vis.xValue).left;

    vis.renderVis();
  }

  /**
   * Bind data to visual elements
   */
  renderVis() {
    let vis = this;

    // Add line path
    vis.chart.selectAll('.chart-line')
        .data([vis.aggregatedData])
      .join('path')
        .style("fill", "none")
        .style("stroke", "#4947D7")
        .attr("stroke-width", "0.2em")
        .attr('class', 'chart-line')
        .attr('d', vis.line);


    vis.trackingArea
        .on('mouseenter', () => {
          vis.tooltip.style('display', 'block');
        })
        .on('mouseleave', () => {
          vis.tooltip.style('display', 'none');
        })
        .on('mousemove', function(event) {
          // Get date that corresponds to current mouse x-coordinate
          const xPos = d3.pointer(event, this)[0]; // First array element is x, second is y
          const date = vis.xScale.invert(xPos);

          // Find nearest data point
          const index = vis.bisectDate(vis.aggregatedData, date, 1);
          //console.log(index)
          const a = vis.aggregatedData[index - 1];
          //console.log(a)
          const b = vis.aggregatedData[index];
          const d = b && (date - a.key > b.key - date) ? b : a; 
          //console.log(index, d)
          // Update tooltip
          vis.tooltip.select('circle')
              .attr('transform', `translate(${vis.xScale(d.key)},${vis.yScale(d.count)})`);
          
          vis.tooltip.select('text')
              .attr('transform', `translate(${vis.xScale(d.key)},${(vis.yScale(d.count) - 15)})`)
              .text(d.key.getFullYear() + ": " + Math.round(d.count));
        });
    
    // Update the axes
    vis.xAxisG.call(vis.xAxis);
    vis.yAxisG.call(vis.yAxis);
  }
}