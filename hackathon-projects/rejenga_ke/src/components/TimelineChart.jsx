/**
 * TimelineChart.jsx
 * D3 bar chart of monthly donation totals for a selected candidate.
 * Anomalous months (z-score > 1.5) are highlighted in red/orange with explanations.
 */
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { formatKES } from '../utils/dataHelpers';
import { explainTimelineAnomaly } from '../utils/explainableAI';
import { AlertTriangle, Info } from 'lucide-react';

// Generate every year-month between two dates (inclusive)
function monthRange(start, end) {
  const months = [];
  let cur = new Date(start + '-01');
  const endDate = new Date(end + '-01');
  while (cur <= endDate) {
    months.push(cur.toISOString().slice(0, 7));
    cur.setMonth(cur.getMonth() + 1);
  }
  return months;
}

const ANOMALY_THRESHOLD = 1.5; // z-score

export default function TimelineChart({ monthlyTotals, candidateName }) {
  const svgRef = useRef(null);
  const [hoveredAnomaly, setHoveredAnomaly] = useState(null);

  const allMonths = monthRange('2025-01', '2027-04');

  // Build full series with zeros for missing months
  const series = allMonths.map((m) => ({ month: m, value: monthlyTotals[m] ?? 0 }));

  // Compute z-scores
  const nonZero = series.filter((d) => d.value > 0).map((d) => d.value);
  const mean = nonZero.length ? nonZero.reduce((s, v) => s + v, 0) / nonZero.length : 0;
  const variance = nonZero.length
    ? nonZero.reduce((s, v) => s + (v - mean) ** 2, 0) / nonZero.length
    : 0;
  const std = Math.sqrt(variance) || 1;

  const enriched = series.map((d) => ({
    ...d,
    zScore: d.value > 0 ? (d.value - mean) / std : 0,
    isAnomaly: d.value > 0 && (d.value - mean) / std > ANOMALY_THRESHOLD,
  }));

  const anomalies = enriched.filter((d) => d.isAnomaly);

  useEffect(() => {
    if (!svgRef.current) return;

    const el = svgRef.current;
    const W  = el.clientWidth  || 600;
    const H  = el.clientHeight || 180;
    const margin = { top: 12, right: 16, bottom: 40, left: 56 };
    const innerW = W - margin.left - margin.right;
    const innerH = H - margin.top  - margin.bottom;

    d3.select(el).selectAll('*').remove();

    const svg = d3.select(el)
      .attr('width',  W)
      .attr('height', H)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleBand()
      .domain(allMonths)
      .range([0, innerW])
      .padding(0.15);

    const maxVal = Math.max(...enriched.map((d) => d.value), 1);
    const yScale = d3.scaleLinear().domain([0, maxVal]).nice().range([innerH, 0]);

    // Y axis
    svg.append('g')
      .call(
        d3.axisLeft(yScale)
          .ticks(4)
          .tickFormat((v) => v >= 1_000_000 ? `${v / 1_000_000}M` : `${v / 1_000}K`)
      )
      .call((g) => {
        g.select('.domain').remove();
        g.selectAll('.tick line')
          .attr('stroke', '#2a2d3e')
          .attr('x2', innerW);
        g.selectAll('.tick text').attr('fill', '#6b7280').attr('font-size', 10);
      });

    // X axis — show every 3rd label to avoid crowding
    svg.append('g')
      .attr('transform', `translate(0,${innerH})`)
      .call(
        d3.axisBottom(xScale)
          .tickValues(allMonths.filter((_, i) => i % 3 === 0))
          .tickFormat((m) => {
            const [y, mo] = m.split('-');
            return `${new Date(Number(y), Number(mo) - 1).toLocaleString('en-KE', { month: 'short' })} ${y.slice(2)}`;
          })
      )
      .call((g) => {
        g.select('.domain').remove();
        g.selectAll('.tick line').remove();
        g.selectAll('.tick text')
          .attr('fill', '#6b7280')
          .attr('font-size', 9)
          .attr('dy', 12);
      });

    // Bars
    svg.selectAll('.bar')
      .data(enriched)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', (d) => xScale(d.month))
      .attr('y', (d) => yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => innerH - yScale(d.value))
      .attr('rx', 2)
      .attr('fill', (d) => {
        if (d.isAnomaly) return '#ef4444';
        if (d.value > 0) return '#4f8ef7';
        return '#2a2d3e';
      })
      .attr('opacity', (d) => (d.value === 0 ? 0.3 : 0.85));

    // Anomaly markers
    svg.selectAll('.anomaly-marker')
      .data(enriched.filter((d) => d.isAnomaly))
      .join('text')
      .attr('class', 'anomaly-marker')
      .attr('x', (d) => xScale(d.month) + xScale.bandwidth() / 2)
      .attr('y', (d) => yScale(d.value) - 6)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .text('⚠');

    // Mean reference line
    if (mean > 0) {
      svg.append('line')
        .attr('x1', 0).attr('x2', innerW)
        .attr('y1', yScale(mean)).attr('y2', yScale(mean))
        .attr('stroke', '#4f8ef7')
        .attr('stroke-dasharray', '4 3')
        .attr('stroke-width', 1)
        .attr('opacity', 0.5);

      svg.append('text')
        .attr('x', innerW + 2)
        .attr('y', yScale(mean) + 4)
        .attr('font-size', 8)
        .attr('fill', '#4f8ef7')
        .text('avg');
    }

    // Election surge label (2027 shading)
    const election2027 = allMonths.find((m) => m === '2027-01');
    if (election2027) {
      const x2027 = xScale(election2027);
      svg.append('rect')
        .attr('x', x2027)
        .attr('y', 0)
        .attr('width', innerW - x2027)
        .attr('height', innerH)
        .attr('fill', '#ef4444')
        .attr('opacity', 0.04);

      svg.append('text')
        .attr('x', x2027 + 4)
        .attr('y', 10)
        .attr('font-size', 8)
        .attr('fill', '#ef444466')
        .text('Election period →');
    }
  }, [monthlyTotals, enriched]);

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Chart */}
      <div className="flex-1 min-h-0">
        <svg ref={svgRef} className="w-full h-full" />
      </div>

      {/* Anomaly explanations */}
      {anomalies.length > 0 && (
        <div className="flex flex-col gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <AlertTriangle size={12} className="text-accent-red" />
            <span className="text-[10px] font-semibold text-accent-red uppercase tracking-wider">
              Anomalies detected
            </span>
          </div>
          {anomalies.map((a) => (
            <div
              key={a.month}
              className="p-3 rounded-lg bg-accent-red/5 border border-accent-red/20 text-[11px] text-gray-400 leading-relaxed"
            >
              <span className="text-accent-red font-semibold">⚠ {a.month}</span>{' '}
              {explainTimelineAnomaly(a.month, a.value, mean, a.zScore)}
            </div>
          ))}
        </div>
      )}

      {anomalies.length === 0 && mean > 0 && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-surface-border/30 border border-surface-border shrink-0">
          <Info size={12} className="text-gray-500 mt-0.5 shrink-0" />
          <p className="text-[11px] text-gray-500">
            No statistical anomalies detected. Campaign finance activity follows a consistent pattern across the observed period.
          </p>
        </div>
      )}
    </div>
  );
}
