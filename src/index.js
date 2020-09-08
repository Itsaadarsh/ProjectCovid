// Page 1 JavaScript

// Importing 3rd Party Libraries
import * as d3 from 'd3';
import path from 'path';

// Loading .csv using d3
d3.csv(path.resolve(__dirname, 'states.csv')).then(data => {
  data.forEach(caseChange => {
    caseChange.cases = +caseChange.cases;
  });
  // Calling Main Function
  render(data);
});

// Main function
const render = stateData => {
  // Declaring Variables
  const svg = d3.select('svg');
  const width = +svg.attr('width');
  const height = +svg.attr('height');
  const margin = { top: 22, right: 10, bottom: 10, left: 200 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;
  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
  const div = d3.select('body').append('div').attr('class', 'tooltip').style('opacity', 0);

  // Cases Scale
  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(stateData, d => d.cases)])
    .range([0, innerW]);

  // States Scale
  const yScale = d3
    .scaleBand()
    .domain(stateData.map(d => d.states))
    .range([0, innerH])
    .padding(1.5);

  // Axis Values
  g.append('g').call(d3.axisLeft(yScale));
  g.append('g').call(d3.axisBottom(xScale).tickFormat(d3.format('.2s')));

  g.append('text')
    .attr('transform', 'rotate(-900)')
    .attr('y', 5)
    .attr('x', 0 - height / 3)
    .attr('dy', '1em')
    .style('font-weight', 'bold')
    .style('font-size', '17px')
    .text('CASES');

  // Bar Rectangles
  g.selectAll('rect')
    .data(stateData)
    .enter()
    .append('a') // Anchor Tag (<a> <a/>)
    .attr('id', d => d.states)
    .attr('href', 'county.html')
    .attr('onclick', 'gettingStateName(this)')
    // Hover Effects
    .on('mouseover', d => {
      d3.select(this).transition().duration('50');
      div.transition().duration('50').style('opacity', 1);
      div
        .html(`Cases : ${d.cases}`)
        .style('left', d3.event.pageX + 10 + 'px')
        .style('top', d3.event.pageY - 15 + 'px');
    })
    .on('mouseout', d => {
      d3.select(this).transition().duration('50').attr('opacity', '1');
      div.transition().duration('50').style('opacity', 0);
    })
    .append('rect')
    .attr('y', d => yScale(d.states))
    .attr('class', 'rectangle')
    .attr('height', yScale.bandwidth() + 15)
    .attr('width', d => xScale(d.cases));
};
