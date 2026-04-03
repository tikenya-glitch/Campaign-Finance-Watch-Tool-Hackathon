import React, { useLayoutEffect, useRef } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5flow from "@amcharts/amcharts5/flow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

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

interface AmSankeyChartProps {
    data: {
        nodes: Node[];
        links: Link[];
    };
    partyColors?: Record<string, string>;
    onNodeClick?: (nodeName: string) => void;
    onLinkClick?: (sourceName: string, targetName: string) => void;
}

const AmSankeyChart: React.FC<AmSankeyChartProps> = ({ data, partyColors, onNodeClick, onLinkClick }) => {
    const chartDiv = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
        if (!data || data.links.length === 0 || !chartDiv.current) return;

        const root = am5.Root.new(chartDiv.current);

        root.setThemes([
            am5themes_Animated.new(root)
        ]);

        const series = root.container.children.push(
            am5flow.Sankey.new(root, {
                sourceIdField: "source",
                targetIdField: "target",
                valueField: "value",
                paddingRight: 100,
                nodePadding: 25,
                nodeWidth: 15,
                nodeAlign: "left"
            })
        );

        // Customize links to show values inside them, if big enough
        series.links.template.setAll({
            fillStyle: "solid",
            fillOpacity: 0.2,
            strokeOpacity: 0,
            cursorOverStyle: "pointer",
        });

        series.links.template.events.on("click", function (ev) {
            if (onLinkClick) {
                // @ts-ignore
                const dataContext = ev.target.dataItem?.dataContext as any;
                if (dataContext) {
                    onLinkClick(dataContext.source, dataContext.target);
                }
            }
        });

        // Add hovering styles to links
        series.links.template.states.create("hover", {
            fillOpacity: 1
        });

        // Set colors dynamically based on Party Colors
        // @ts-ignore
        series.nodes.template.setAll({
            nameField: "id",
            cursorOverStyle: "pointer"
        });

        // @ts-ignore
        series.nodes.template.events.on("click", function (ev) {
            if (onNodeClick) {
                // @ts-ignore
                const nodeName = ev.target.dataItem?.dataContext?.id || ev.target.dataItem?.dataContext?.name;
                if (nodeName) {
                    onNodeClick(nodeName);
                }
            }
        });

        // Map colors to nodes
        series.nodes.get("colors")?.set("colors", [
            am5.color(0x94a3b8) // default color (slate gray) for donors
        ]);

        // @ts-ignore
        series.nodes.template.adapters.add("fill", function (fill, target) {
            if (target.dataItem) {
                // @ts-ignore
                const name = (target.dataItem.dataContext?.id || target.dataItem.dataContext?.name) as string;
                if (partyColors && partyColors[name]) {
                    return am5.color(partyColors[name]);
                }
            }
            return fill;
        });

        // Customize labels to prevent cutting off
        // @ts-ignore
        series.nodes.labels.template.setAll({
            fontSize: 12,
            fill: am5.color(0x1e293b),
            fontWeight: "600",
            oversizedBehavior: "wrap",
            maxWidth: 150
        });

        // Set Data
        series.data.setAll(data.links);

        // Make nodes animate in
        series.appear(1000, 100);



        return () => {
            root.dispose();
        };
    }, [data, partyColors, onNodeClick, onLinkClick]);

    return (
        <div ref={chartDiv} style={{ width: "100%", height: "400px" }}></div>
    );
};

export default AmSankeyChart;
