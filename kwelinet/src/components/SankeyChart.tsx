import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, sankeyCenter } from 'd3-sankey';

interface Node {
    name: string;
    category?: string;
    id?: number;
}

interface Link {
    source: number | Node;
    target: number | Node;
    value: number;
}

interface SankeyChartProps {
    data: {
        nodes: Node[];
        links: Link[];
    };
    onNodeClick?: (node: Record<string, unknown>) => void;
}

const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

const SankeyChart: React.FC<SankeyChartProps> = ({ data, onNodeClick }) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current || !data || data.nodes.length === 0) return;

        // Clear previous render
        d3.select(svgRef.current).selectAll('*').remove();

        const margin = { top: 20, right: 20, bottom: 20, left: 20 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3
            .select(svgRef.current)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Set up Sankey generator
        const sankeyGenerator = sankey<Node, Link>()
            .nodeWidth(20)
            .nodePadding(40)
            .extent([[0, 0], [width, height]])
            .nodeAlign(sankeyCenter);

        // Deep copy data to prevent D3 from mutating React props directly in a way that causes issues on re-render
        const graph = sankeyGenerator({
            nodes: data.nodes.map(d => Object.assign({}, d)),
            links: data.links.map(d => Object.assign({}, d))
        });

        // Draw links
        svg
            .append('g')
            .selectAll('path')
            .data(graph.links)
            .enter()
            .append('path')
            .attr('d', sankeyLinkHorizontal())
            .attr('fill', 'none')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .attr('stroke', (d: any) => colorScale(d.source.name))
            .attr('stroke-opacity', 0.2)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .attr('stroke-width', (d: any) => Math.max(1, d.width || 1))
            .style('transition', 'stroke-opacity 0.2s')
            .on('mouseover', function () { d3.select(this).attr('stroke-opacity', 0.5); })
            .on('mouseout', function () { d3.select(this).attr('stroke-opacity', 0.2); });

        // Draw nodes
        const node = svg
            .append('g')
            .selectAll('g')
            .data(graph.nodes)
            .enter()
            .append('g')
            .style('cursor', onNodeClick ? 'pointer' : 'default')
            .on('click', (event, d) => {
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
            .attr('fill', (d: any) => colorScale(d.name))
            .attr('stroke', '#fff')
            .attr('stroke-width', 2);

        // Node labels
        node
            .append('text')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .attr('x', (d: any) => (d.x0 || 0) < width / 2 ? (d.x1 || 0) + 6 : (d.x0 || 0) - 6)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .attr('y', (d: any) => ((d.y1 || 0) + (d.y0 || 0)) / 2)
            .attr('dy', '0.35em')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .attr('text-anchor', (d: any) => (d.x0 || 0) < width / 2 ? 'start' : 'end')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .text((d: any) => `${d.name} (${d.value}M)`)
            .attr('font-size', '12px')
            .attr('fill', '#1e293b')
            .attr('font-weight', '500');

    }, [data, onNodeClick]);

    return (
        <div className="w-full h-full overflow-x-auto bg-white flex justify-center">
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default SankeyChart;
