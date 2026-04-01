import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import sankey from 'highcharts/modules/sankey';

// Initialize the sankey module
if (typeof Highcharts === 'object') {
    // @ts-ignore
    sankey(Highcharts);
}

interface Node {
    name: string;
    category?: string;
    id?: string;
}

interface Link {
    source: string;
    target: string;
    value: number;
}

interface HighchartsSankeyProps {
    data: {
        nodes: Node[];
        links: Link[];
    };
    partyColors?: Record<string, string>;
    onNodeClick?: (nodeName: string) => void;
    onLinkClick?: (sourceName: string, targetName: string) => void;
}

const HighchartsSankey: React.FC<HighchartsSankeyProps> = ({ data, partyColors, onNodeClick, onLinkClick }) => {

    // Safety check just in case data is empty
    if (!data || !data.links || data.links.length === 0) {
        return <div className="w-full h-[400px] flex items-center justify-center text-slate-400">No connectivity data available for the chosen filters.</div>;
    }

    const formattedData = data.links.map(link => ({
        from: link.source,
        to: link.target,
        weight: link.value
    }));

    const formattedNodes = data.nodes.map(node => ({
        id: node.id || node.name,
        name: node.name,
        color: partyColors && partyColors[node.name] ? partyColors[node.name] : '#94a3b8'
    }));

    const options: Highcharts.Options = {
        chart: {
            backgroundColor: 'transparent',
            height: 400,
            style: {
                fontFamily: 'inherit'
            }
        },
        title: {
            text: ''
        },
        tooltip: {
            headerFormat: '',
            pointFormat: '<b>{point.fromNode.name} \u2192 {point.toNode.name}</b><br/>Amount: Ksh {point.weight:.2f}M',
            // @ts-ignore
            nodeFormat: '<b>{point.name}</b><br/>Total: Ksh {point.sum:.2f}M',
            style: {
                fontSize: '12px'
            }
        },
        plotOptions: {
            sankey: {
                nodePadding: 20,
                nodeWidth: 15,
                colorByPoint: true,
                linkOpacity: 0.25,
                curveFactor: 0.33,
                animation: {
                    duration: 1000
                },
                dataLabels: {
                    enabled: true,
                    style: {
                        color: '#1e293b',
                        fontSize: '11px',
                        textOutline: 'none',
                        fontWeight: '600'
                    }
                },
                point: {
                    events: {
                        click: function (e: any) {
                            if (e.point.isNode && onNodeClick) {
                                onNodeClick(e.point.name);
                            } else if (!e.point.isNode && onLinkClick) {
                                onLinkClick(e.point.from, e.point.to);
                            }
                        }
                    }
                }
            } as any
        },
        series: [{
            keys: ['from', 'to', 'weight'],
            data: formattedData,
            nodes: formattedNodes,
            type: 'sankey',
            name: 'Financial Flows'
        } as any],
        credits: { enabled: false }
    };

    return (
        <div className="w-full">
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
        </div>
    );
};

export default HighchartsSankey;
