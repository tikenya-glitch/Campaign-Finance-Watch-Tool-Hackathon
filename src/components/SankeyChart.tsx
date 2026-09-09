import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, type SankeyNode, type SankeyLink } from 'd3-sankey';

interface CustomNodeExtra {
    name: string;
    category?: string;
    id?: string | number;
}

interface CustomLinkExtra {
    value: number;
}

export type SankeyCustomNode = SankeyNode<CustomNodeExtra, CustomLinkExtra>;
export type SankeyCustomLink = SankeyLink<CustomNodeExtra, CustomLinkExtra>;

interface SankeyChartProps {
    data: {
        nodes: CustomNodeExtra[];
        links: {
            source: string | number | CustomNodeExtra;
            target: string | number | CustomNodeExtra;
            value: number;
        }[];
    };
    onNodeClick?: (node: { name: string }) => void;
    onLinkClick?: (source: { name: string }, target: { name: string }) => void;
    partyColors?: Record<string, string>;
    highlightNode?: string | null;
}

const SankeyChart: React.FC<SankeyChartProps> = ({ data, onNodeClick, onLinkClick, partyColors, highlightNode }) => {
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

        const sankeyGenerator = sankey<CustomNodeExtra, CustomLinkExtra>()
            .nodeId((d) => (d.id !== undefined ? d.id : d.name))
            .nodeWidth(15)
            .nodePadding(30)
            .extent([[0, 0], [width, height]]);

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
                const source = d.source as SankeyCustomNode;
                const target = d.target as SankeyCustomNode;
                if (onLinkClick) onLinkClick({ name: source.name }, { name: target.name });
            });

        linkGroup.append('path')
            .attr('d', sankeyLinkHorizontal())
            .attr('fill', 'none')
            .attr('stroke', '#cbd5e1')
            .attr('stroke-opacity', (d) => {
                const source = d.source as SankeyCustomNode;
                const target = d.target as SankeyCustomNode;
                if (highlightNode && source.name !== highlightNode && target.name !== highlightNode) return 0.05;
                return 0.4;
            })
            .attr('stroke-width', (d) => Math.max(1, d.width || 1))
            .style('transition', 'stroke-opacity 0.2s, stroke 0.2s')
            .on('mouseover', function (_event, d) {
                const source = d.source as SankeyCustomNode;
                const target = d.target as SankeyCustomNode;
                if (highlightNode && source.name !== highlightNode && target.name !== highlightNode) return;
                d3.select(this)
                    .attr('stroke-opacity', 0.8)
                    .attr('stroke', partyColors ? partyColors[target.name] || '#3b82f6' : '#3b82f6');
            })
            .on('mouseout', function (_event, d) {
                const source = d.source as SankeyCustomNode;
                const target = d.target as SankeyCustomNode;
                if (highlightNode && source.name !== highlightNode && target.name !== highlightNode) return;
                d3.select(this)
                    .attr('stroke-opacity', 0.4)
                    .attr('stroke', '#cbd5e1');
            })
            .append('title')
            .text((d) => {
                const source = d.source as SankeyCustomNode;
                const target = d.target as SankeyCustomNode;
                return `${source.name} -> ${target.name}\nAmount: ${d.value}M`;
            });

        linkGroup.append('text')
            .filter((d) => (d.width || 0) > 12)
            .attr('x', (d) => {
                const source = d.source as SankeyCustomNode;
                const target = d.target as SankeyCustomNode;
                return ((source.x1 || 0) + (target.x0 || 0)) / 2;
            })
            .attr('y', (d) => d.y0 || 0)
            .attr('dy', '0.35em')
            .attr('text-anchor', 'middle')
            .attr('font-size', '10px')
            .attr('font-weight', '600')
            .attr('fill', (d) => {
                const source = d.source as SankeyCustomNode;
                const target = d.target as SankeyCustomNode;
                if (highlightNode && source.name !== highlightNode && target.name !== highlightNode) return 'transparent';
                return '#475569';
            })
            .style('transition', 'fill 0.2s')
            .text((d) => `${d.value}M`);

        // Draw nodes
        const node = svg
            .append('g')
            .selectAll('g')
            .data(graph.nodes)
            .enter()
            .append('g')
            .style('cursor', onNodeClick ? 'pointer' : 'default')
            .on('click', (_event, d) => {
                if (onNodeClick) onNodeClick({ name: d.name });
            })
            .style('opacity', (d) => {
                if (highlightNode && d.name !== highlightNode) return 0.2;
                return 1;
            })
            .style('transition', 'opacity 0.2s');

        node
            .append('rect')
            .attr('x', (d) => d.x0 || 0)
            .attr('y', (d) => d.y0 || 0)
            .attr('height', (d) => Math.max(1, (d.y1 || 0) - (d.y0 || 0)))
            .attr('width', sankeyGenerator.nodeWidth())
            .attr('fill', (d) => {
                if (partyColors && partyColors[d.name]) return partyColors[d.name];
                return '#94a3b8';
            })
            .attr('stroke', '#fff')
            .attr('stroke-width', 1);

        node
            .append('text')
            .attr('x', (d) => (d.x0 || 0) < width / 2 ? (d.x1 || 0) + 10 : (d.x0 || 0) - 10)
            .attr('y', (d) => ((d.y1 || 0) + (d.y0 || 0)) / 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', (d) => (d.x0 || 0) < width / 2 ? 'start' : 'end')
            .text((d) => `${d.name} (${Math.round(d.value || 0)}M)`)
            .attr('font-size', '11px')
            .attr('fill', '#1e293b')
            .attr('font-weight', '600');

    }, [data, onNodeClick, onLinkClick, partyColors, highlightNode]);

    return (
        <div className="w-full h-full overflow-x-auto bg-white flex justify-center">
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default SankeyChart;
