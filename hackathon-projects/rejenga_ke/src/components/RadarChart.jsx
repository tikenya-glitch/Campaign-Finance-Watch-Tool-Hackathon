/**
 * RadarChart.jsx
 * D3-powered spider/radar chart for the five risk sub-scores.
 * Renders a filled polygon on concentric guide circles.
 */
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const AXES = [
  { key: 'donorConcentration', label: 'Donor\nConcentration' },
  { key: 'corporateInfluence', label: 'Corporate\nInfluence'  },
  { key: 'crossParty',         label: 'Cross-Party\nFunding'  },
  { key: 'spendingSpike',      label: 'Spending\nSpike'       },
  { key: 'geographicSpread',   label: 'Geographic\nSpread'    },
];

const LEVELS = 5; // concentric guide circles

export default function RadarChart({ subScores, color = '#ef4444', label }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!subScores || !svgRef.current) return;

    const el     = svgRef.current;
    const w      = el.clientWidth  || 260;
    const h      = el.clientHeight || 260;
    const size   = Math.min(w, h);
    const margin = 52;
    const radius = (size - margin * 2) / 2;
    const cx     = size / 2;
    const cy     = size / 2;
    const n      = AXES.length;

    d3.select(el).selectAll('*').remove();

    const svg = d3.select(el)
      .attr('width',  size)
      .attr('height', size);

    const g = svg.append('g').attr('transform', `translate(${cx},${cy})`);

    const angleSlice = (Math.PI * 2) / n;
    const rScale = d3.scaleLinear().domain([0, 100]).range([0, radius]);

    // Concentric guide circles
    for (let i = 1; i <= LEVELS; i++) {
      g.append('circle')
        .attr('r', (radius / LEVELS) * i)
        .attr('fill', 'none')
        .attr('stroke', '#2a2d3e')
        .attr('stroke-width', 0.8);

      // Level label (20, 40, 60, 80, 100)
      g.append('text')
        .attr('x', 4)
        .attr('y', -(radius / LEVELS) * i + 3)
        .attr('fill', '#4b5563')
        .attr('font-size', 8)
        .text((100 / LEVELS) * i);
    }

    // Axis spokes + labels
    AXES.forEach((axis, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const xEnd  = radius * Math.cos(angle);
      const yEnd  = radius * Math.sin(angle);

      g.append('line')
        .attr('x1', 0).attr('y1', 0)
        .attr('x2', xEnd).attr('y2', yEnd)
        .attr('stroke', '#2a2d3e')
        .attr('stroke-width', 1);

      // Label positioning — offset outward from the polygon edge
      const labelR  = radius + 20;
      const labelX  = labelR * Math.cos(angle);
      const labelY  = labelR * Math.sin(angle);
      const lines   = axis.label.split('\n');
      const anchor  = Math.abs(Math.cos(angle)) < 0.1 ? 'middle' : Math.cos(angle) > 0 ? 'start' : 'end';

      lines.forEach((line, li) => {
        g.append('text')
          .attr('x', labelX)
          .attr('y', labelY + li * 11 - (lines.length - 1) * 5.5)
          .attr('text-anchor', anchor)
          .attr('dominant-baseline', 'central')
          .attr('fill', '#9ca3af')
          .attr('font-size', 9)
          .text(line);
      });
    });

    // Radar polygon
    const values = AXES.map((a) => subScores[a.key] ?? 0);
    const points = values.map((v, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const r     = rScale(v);
      return [r * Math.cos(angle), r * Math.sin(angle)];
    });

    const lineGen = d3.line().curve(d3.curveLinearClosed);

    // Shadow fill
    g.append('path')
      .datum(points)
      .attr('d', lineGen)
      .attr('fill', color + '28')
      .attr('stroke', 'none');

    // Main stroke
    g.append('path')
      .datum(points)
      .attr('d', lineGen)
      .attr('fill', color + '18')
      .attr('stroke', color)
      .attr('stroke-width', 2)
      .attr('stroke-linejoin', 'round');

    // Vertex dots
    points.forEach(([x, y], i) => {
      g.append('circle')
        .attr('cx', x).attr('cy', y)
        .attr('r', 4)
        .attr('fill', color)
        .attr('stroke', '#0f1117')
        .attr('stroke-width', 1.5);

      // Score label near vertex
      const score = values[i];
      if (score > 0) {
        const labelOffset = 12;
        const angle = angleSlice * i - Math.PI / 2;
        g.append('text')
          .attr('x', (rScale(score) + labelOffset) * Math.cos(angle))
          .attr('y', (rScale(score) + labelOffset) * Math.sin(angle))
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .attr('fill', color)
          .attr('font-size', 9)
          .attr('font-weight', '600')
          .text(score);
      }
    });
  }, [subScores, color]);

  return <svg ref={svgRef} className="w-full h-full" />;
}
