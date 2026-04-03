/**
 * NetworkGraph.jsx
 * Enhanced D3 force-directed graph with distinct node shapes for each entity type:
 *  • Donors    → circle
 *  • Candidates → diamond (rotated square)
 *  • Parties   → hexagon
 *
 * Clicking a node shows a summary tooltip; edges carry donation amounts.
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { formatKES } from '../utils/dataHelpers';

// Draw a hexagonal path string centred at (0,0) with given radius
function hexPath(r) {
  const points = d3.range(6).map((i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    return [r * Math.cos(angle), r * Math.sin(angle)];
  });
  return d3.line()(points) + 'Z';
}

// Draw a diamond path
function diamondPath(r) {
  return `M0,${-r} L${r},0 L0,${r} L${-r},0 Z`;
}

export default function NetworkGraph({ data }) {
  const svgRef  = useRef(null);
  const [nodeTooltip, setNodeTooltip] = useState(null);

  const buildGraph = useCallback(() => {
    if (!data || data.nodes.length === 0 || !svgRef.current) return;

    const el     = svgRef.current;
    const width  = el.clientWidth  || 300;
    const height = el.clientHeight || 300;

    d3.select(el).selectAll('*').remove();

    const svg = d3.select(el).attr('width', width).attr('height', height);

    // Arrow marker
    svg.append('defs').append('marker')
      .attr('id', 'ng-arrow')
      .attr('viewBox', '0 -4 8 8')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('markerWidth', 5)
      .attr('markerHeight', 5)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-4L8,0L0,4')
      .attr('fill', '#4f8ef788');

    const container = svg.append('g');

    // Zoom
    svg.call(
      d3.zoom()
        .scaleExtent([0.3, 4])
        .on('zoom', (e) => container.attr('transform', e.transform))
    );

    const nodes = data.nodes.map((n) => ({ ...n }));
    const links = data.links.map((l) => ({ ...l }));

    const simulation = d3.forceSimulation(nodes)
      .force('link',   d3.forceLink(links).id((d) => d.id).distance((l) => (l.amount > 0 ? 100 : 60)).strength(0.5))
      .force('charge', d3.forceManyBody().strength(-220))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide(30));

    // Links
    const link = container.append('g')
      .selectAll('line').data(links).join('line')
      .attr('stroke', (d) => d.amount > 0 ? '#4f8ef755' : '#2a2d3e')
      .attr('stroke-width', (d) => d.amount > 0 ? 1.5 : 1)
      .attr('stroke-dasharray', (d) => d.amount === 0 ? '4 3' : null)
      .attr('marker-end', (d) => d.amount > 0 ? 'url(#ng-arrow)' : null);

    // Edge amount labels
    const edgeLabel = container.append('g')
      .selectAll('text').data(links.filter((l) => l.amount > 0)).join('text')
      .attr('text-anchor', 'middle')
      .attr('font-size', 8)
      .attr('fill', '#4f8ef7aa')
      .attr('dy', -4)
      .text((d) => d.label);

    // Node groups
    const nodeR = (d) => d.type === 'party' ? 18 : d.type === 'donor' ? 14 : 12;

    const node = container.append('g')
      .selectAll('g').data(nodes).join('g')
      .attr('cursor', 'pointer')
      .on('click', (event, d) => {
        const rect = svgRef.current.getBoundingClientRect();
        setNodeTooltip({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          node: d,
        });
        event.stopPropagation();
      })
      .call(
        d3.drag()
          .on('start', (event, d) => { if (!event.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
          .on('drag',  (event, d) => { d.fx = event.x; d.fy = event.y; })
          .on('end',   (event, d) => { if (!event.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; })
      );

    // Shape per node type
    node.each(function (d) {
      const g = d3.select(this);
      const r = nodeR(d);

      if (d.type === 'donor') {
        g.append('circle')
          .attr('r', r)
          .attr('fill', d.color + '30')
          .attr('stroke', d.color)
          .attr('stroke-width', 2);
      } else if (d.type === 'candidate') {
        g.append('path')
          .attr('d', diamondPath(r))
          .attr('fill', d.color + '30')
          .attr('stroke', d.color)
          .attr('stroke-width', 2);
      } else if (d.type === 'party') {
        g.append('path')
          .attr('d', hexPath(r))
          .attr('fill', d.color + '30')
          .attr('stroke', d.color)
          .attr('stroke-width', 2);
      }
    });

    // Initial letter
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', (d) => d.type === 'party' ? 10 : 8)
      .attr('font-weight', '600')
      .attr('fill', (d) => d.color)
      .attr('pointer-events', 'none')
      .text((d) => d.label[0]);

    // Label below
    node.append('text')
      .attr('y', (d) => nodeR(d) + 11)
      .attr('text-anchor', 'middle')
      .attr('font-size', 8)
      .attr('fill', '#9ca3af')
      .attr('pointer-events', 'none')
      .text((d) => d.label.length > 16 ? d.label.slice(0, 14) + '…' : d.label);

    // Simulation tick
    simulation.on('tick', () => {
      link.attr('x1', (d) => d.source.x).attr('y1', (d) => d.source.y)
          .attr('x2', (d) => d.target.x).attr('y2', (d) => d.target.y);
      edgeLabel.attr('x', (d) => (d.source.x + d.target.x) / 2)
               .attr('y', (d) => (d.source.y + d.target.y) / 2);
      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    // Click outside → close tooltip
    svg.on('click', () => setNodeTooltip(null));

    return () => simulation.stop();
  }, [data]);

  useEffect(() => {
    const cleanup = buildGraph();
    return cleanup;
  }, [buildGraph]);

  if (!data || data.nodes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-600 text-xs text-center p-4">
        Click a donor or candidate to explore the influence network
      </div>
    );
  }

  return (
    <div className="relative w-full flex-1 overflow-hidden">
      <svg ref={svgRef} className="w-full h-full" />

      {/* Node shape legend */}
      <div className="absolute bottom-2 left-2 flex flex-col gap-1 pointer-events-none">
        {[
          { shape: '●', label: 'Donor',     color: '#4f8ef7' },
          { shape: '◆', label: 'Candidate', color: '#f97316' },
          { shape: '⬡', label: 'Party',     color: '#a855f7' },
        ].map(({ shape, label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span style={{ color, fontSize: 10 }}>{shape}</span>
            <span className="text-[9px] text-gray-600">{label}</span>
          </div>
        ))}
      </div>

      {/* Node click tooltip */}
      {nodeTooltip && (
        <NodeTooltip
          node={nodeTooltip.node}
          x={nodeTooltip.x}
          y={nodeTooltip.y}
          onClose={() => setNodeTooltip(null)}
        />
      )}
    </div>
  );
}

function NodeTooltip({ node, x, y, onClose }) {
  return (
    <div
      className="absolute z-10 bg-surface-card border border-surface-border rounded-xl p-3 shadow-xl pointer-events-auto"
      style={{
        left: Math.min(x + 12, window.innerWidth - 220),
        top:  Math.min(y + 12, window.innerHeight - 140),
        maxWidth: 200,
      }}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-semibold text-white">{node.label}</span>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-300 text-sm leading-none">×</button>
      </div>
      <div className="flex flex-col gap-1">
        <Row label="Type" value={node.type} color={node.color} />
        {node.subtype && <Row label="Category" value={node.subtype} />}
        {node.party   && <Row label="Party"    value={node.party}   color={node.color} />}
      </div>
    </div>
  );
}

function Row({ label, value, color }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-[10px] text-gray-600">{label}</span>
      <span className="text-[10px] font-medium capitalize" style={color ? { color } : { color: '#d1d5db' }}>
        {value}
      </span>
    </div>
  );
}
