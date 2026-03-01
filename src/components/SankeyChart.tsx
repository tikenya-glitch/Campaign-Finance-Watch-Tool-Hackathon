import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';

interface Node {
    name: string;
    category?: string;
    id?: string | number;
}

interface Link {
    source: string | number | Node;
    target: string | number | Node;
    value: number;
}

interface SankeyChartProps {
    data: {
        nodes: Node[];
        links: Link[];
    };
    onNodeClick?: (node: Record<string, unknown>) => void;
    onLinkClick?: (source: Record<string, unknown>, target: Record<string, unknown>) => void;
    partyColors?: Record<string, string>;
}

const SankeyChart: React.FC<SankeyChartProps> = ({ data, onNodeClick, onLinkClick, partyColors }) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current || !data || data.nodes.length === 0) return;

        // Clear previous render
        d3.select(svgRef.current).selectAll('*').remove();

        const margin = { top: 20, right: 180, bottom: 20, left: 180 };
        const width = 1000 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const svg = d3
            .select(svgRef.current)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Set up Sankey generator
        const sankeyGenerator = sankey<Node, Link>()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .nodeId((d: any) => d.id)
            .nodeWidth(15)
            .nodePadding(30)
            .extent([[0, 0], [width, height]]);

        // Deep copy data to prevent D3 from mutating React props directly in a way that causes issues on re-render
        const graph = sankeyGenerator({
            nodes: data.nodes.map(d => Object.assign({}, d)),
            links: data.links.map(d => Object.assign({}, d))
        });

        // Draw links
        const linkGroup = svg
            .append('g')
            .selectAll('g')
            .data(graph.links)
            .enter()
            .append('g')
            .style('cursor', onLinkClick ? 'pointer' : 'default')
            .on('click', (_event, d) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (onLinkClick) onLinkClick((d.source as any), (d.target as any));
            });

        linkGroup.append('path')
            .attr('d', sankeyLinkHorizontal())
            .attr('fill', 'none')
            .attr('stroke', '#cbd5e1')
            .attr('stroke-opacity', 0.4)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .attr('stroke-width', (d: any) => Math.max(1, d.width || 1))
            .style('transition', 'stroke-opacity 0.2s, stroke 0.2s')
            .on('mouseover', function () {
                d3.select(this)
                    .attr('stroke-opacity', 0.8)
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .attr('stroke', (d: any) => partyColors ? partyColors[d.target.name] || '#3b82f6' : '#3b82f6');
            })
            .on('mouseout', function () {
                d3.select(this)
                    .attr('stroke-opacity', 0.4)
                    .attr('stroke', '#cbd5e1');
            })
            .append('title')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .text((d: any) => `${d.source.name} -> ${d.target.name}\nAmount: ${d.value}M`);

        // Add amount text inside the thicker flows
        linkGroup.append('text')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter((d: any) => (d.width || 0) > 12) // Only show text on thick enough flows
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .attr('x', (d: any) => (d.source.x1 + d.target.x0) / 2) // Centered in the middle of the flow
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .attr('y', (d: any) => d.y0)
            .attr('dy', '0.35em')
            .attr('text-anchor', 'middle')
            .attr('font-size', '10px')
            .attr('font-weight', '600')
            .attr('fill', '#475569')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .text((d: any) => `${d.value}M`);

        // Draw nodes
        const node = svg
            .append('g')
            .selectAll('g')
            .data(graph.nodes)
            .enter()
            .append('g')
            .style('cursor', onNodeClick ? 'pointer' : 'default')
            .on('click', (_event, d) => {
                if (onNodeClick) onNodeClick((d as unknown) as Record<string, unknown>);
            });

        node
            .append('rect')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .attr('x', (d: any) => d.x0 || 0)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .attr('y', (d: any) => d.y0 || 0)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .attr('height', (d: any) => Math.max(1, (d.y1 || 0) - (d.y0 || 0)))
            .attr('width', sankeyGenerator.nodeWidth())
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .attr('fill', (d: any) => {
                if (partyColors && partyColors[d.name]) return partyColors[d.name];
                return '#94a3b8'; // Default slate gray for donors
            })
            .attr('stroke', '#fff')
            .attr('stroke-width', 1);

        // Node labels
        node
            .append('text')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .attr('x', (d: any) => (d.x0 || 0) < width / 2 ? (d.x1 || 0) + 10 : (d.x0 || 0) - 10)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .attr('y', (d: any) => ((d.y1 || 0) + (d.y0 || 0)) / 2)
            .attr('dy', '0.35em')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .attr('text-anchor', (d: any) => (d.x0 || 0) < width / 2 ? 'start' : 'end')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .text((d: any) => `${d.name} (${d.value}M)`)
            .attr('font-size', '11px')
            .attr('fill', '#1e293b')
            .attr('font-weight', '600');

    }, [data, onNodeClick, onLinkClick, partyColors]);

    return (
        <div className="w-full h-full overflow-x-auto bg-white flex justify-center">
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default SankeyChart;
