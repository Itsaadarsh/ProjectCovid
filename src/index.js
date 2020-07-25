import * as d3 from 'd3';
import path from 'path';

const svg = d3.select('svg');
const width = +svg.attr('width');
const height = +svg.attr('height');

var metaData = [];
d3.csv(path.resolve(__dirname, 'states.csv')).then((data) => {
  data.forEach((caseChange) => {
    caseChange.cases = +caseChange.cases;
  });
  render(data);
});

const render = (stateData) => {
  const margin = { top: 20, right: 20, bottom: 20, left: 200 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(stateData, (d) => d.cases)])
    .range([0, innerW]);

  const yScale = d3
    .scaleBand()
    .domain(stateData.map((d) => d.states))
    .range([0, innerH])
    .padding(0.5);

  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  g.append('g').call(d3.axisLeft(yScale));
  g.append('g').call(d3.axisBottom(xScale));

  g.selectAll('rect')
    .data(stateData)
    .enter()
    .append('rect')
    .attr('y', (d) => yScale(d.states))
    .attr('height', yScale.bandwidth())
    .attr('width', (d) => xScale(d.cases));
};
