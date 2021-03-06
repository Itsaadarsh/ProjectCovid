// Page 2 JavaScript

// Importing 3rd Party Libraries
import * as d3 from 'd3';
import path from 'path';

// Loading .csv using d3
// stateName is extracted from the localstorage
const countyWise = (stateName) => {
  const h2Tag = document.getElementById('stateText');
  h2Tag.innerHTML = `
    Covid -19 Cases in the Counties of ${stateName}`;
  h2Tag.style.textAlign = 'center';
  d3.csv(path.resolve(__dirname, 'county.csv')).then((data) => {
    data = data.filter((meta) => {
      meta.cases = +meta.cases;
      return meta.state == stateName; // Filtering County Wise
    });
    // Calling Main Function
    render(data);
  });
};

// Main function
const render = (countyData) => {
  // Declaring Variables
  const svg = d3.select('svg');
  const width = +svg.attr('width');
  const height = +svg.attr('height');
  const margin = { top: 22, right: 0, bottom: 0, left: 200 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;
  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
  const div = d3.select('body').append('div').attr('class', 'tooltip').style('opacity', 0);

  // Cases Scale
  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(countyData, (d) => d.cases)])
    .range([0, innerW]);

  // Counties Scale
  const yScale = d3
    .scaleBand()
    .domain(countyData.map((d) => d.county))
    .range([0, innerH])
    .padding(1.9);

  // Axis Values
  g.append('g').call(d3.axisLeft(yScale));
  g.append('g').call(d3.axisBottom(xScale).tickFormat(d3.format('.2s')));

  g.append('text')
    .attr('transform', 'rotate(-900)')
    .attr('y', 3)
    .attr('x', 0 - height / 2.8)
    .attr('dy', '1em')
    .style('font-weight', 'bold')
    .style('font-size', '19px')
    .text('CASES');

  // Bar Rectangles
  g.selectAll('rect')
    .data(countyData)
    .enter()
    .append('rect')
    .attr('y', (d) => yScale(d.county))
    .attr('class', 'rectangle')
    .attr('height', yScale.bandwidth() + 11)
    .attr('width', (d) => xScale(d.cases))
    // Hover Effects
    .on('mouseover', (d) => {
      d3.select(this).transition().duration('50');
      div.transition().duration('50').style('opacity', 1);
      div
        .html(`Cases : ${d.cases}`)
        .style('left', d3.event.pageX + 10 + 'px')
        .style('top', d3.event.pageY - 15 + 'px');
    })
    .on('mouseout', (d) => {
      d3.select(this).transition().duration('50').attr('opacity', '1');
      div.transition().duration('50').style('opacity', 0);
    });
};

// Calling .csv function
countyWise(localOutput);
