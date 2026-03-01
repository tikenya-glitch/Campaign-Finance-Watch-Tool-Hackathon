import React, { useLayoutEffect, useRef } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

interface AmPieChartProps {
    data: any[];
    valueField: string;
    categoryField: string;
    colors?: Record<string, string>;
    extraColorsArray?: string[];
    onSliceClick?: (category: string) => void;
    innerRadius?: number;
}

const AmPieChart: React.FC<AmPieChartProps> = ({
    data,
    valueField,
    categoryField,
    colors,
    extraColorsArray,
    onSliceClick,
    innerRadius = 50
}) => {
    const chartDiv = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
        if (!data || data.length === 0 || !chartDiv.current) return;

        const root = am5.Root.new(chartDiv.current);

        root.setThemes([
            am5themes_Animated.new(root)
        ]);

        const chart = root.container.children.push(
            am5percent.PieChart.new(root, {
                layout: root.horizontalLayout,
                innerRadius: am5.percent(innerRadius)
            })
        );

        const series = chart.series.push(
            am5percent.PieSeries.new(root, {
                valueField: valueField,
                categoryField: categoryField,
                alignLabels: false
            })
        );

        // Set Labels inside for thick slices, hide for small ones
        series.labels.template.setAll({
            textType: "circular",
            centerX: 0,
            centerY: 0,
            radius: 4,
            text: "{valuePercentTotal.formatNumber('0.0')}%",
            fontSize: 12,
            fill: am5.color(0xffffff),
            fontWeight: "bold"
        });

        // Hide labels if slice is too small
        series.labels.template.adapters.add("forceHidden", (forceHidden, target) => {
            // @ts-ignore
            if (target.dataItem && target.dataItem.get("valuePercentTotal") < 5) {
                return true;
            }
            return forceHidden;
        });

        // Hide ticks
        series.ticks.template.setAll({
            forceHidden: true
        });

        // Set Custom Colors if provided
        series.slices.template.adapters.add("fill", (fill, target) => {
            if (target.dataItem) {
                // @ts-ignore
                const name = target.dataItem.dataContext[categoryField] as string;
                if (colors && colors[name]) {
                    return am5.color(colors[name]);
                }
            }
            return fill;
        });

        // Or use Extra Colors Array (for generic clusters)
        if (extraColorsArray && extraColorsArray.length > 0) {
            const amColors = extraColorsArray.map(c => am5.color(c));
            series.get("colors")?.set("colors", amColors);
        }

        // Add Click Interactivity
        series.slices.template.events.on("click", (ev) => {
            if (onSliceClick) {
                // @ts-ignore
                const name = ev.target.dataItem?.dataContext[categoryField] as string;
                if (name) {
                    onSliceClick(name);
                }
            }
        });

        series.slices.template.set("cursorOverStyle", "pointer");

        // Legend
        const legend = chart.children.push(am5.Legend.new(root, {
            centerY: am5.percent(50),
            y: am5.percent(50),
            layout: root.verticalLayout,
            height: am5.percent(100),
            verticalScrollbar: am5.Scrollbar.new(root, {
                orientation: "vertical"
            })
        }));

        legend.labels.template.setAll({
            fontSize: 12,
            fill: am5.color(0x475569)
        });

        legend.valueLabels.template.setAll({
            forceHidden: true
        });

        // Data Set
        series.data.setAll(data);
        legend.data.setAll(series.dataItems);

        // Animate Arrival
        series.appear(1000, 100);

        return () => {
            root.dispose();
        };
    }, [data, valueField, categoryField, colors, extraColorsArray, onSliceClick, innerRadius]);

    return (
        <div ref={chartDiv} style={{ width: "100%", height: "100%" }}></div>
    );
};

export default AmPieChart;
