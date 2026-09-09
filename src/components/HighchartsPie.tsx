import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface HighchartsPieProps {
    data: Record<string, string | number>[];
    valueField: string;
    categoryField: string;
    colors?: Record<string, string>;
    extraColorsArray?: string[];
    onSliceClick?: (category: string) => void;
    innerRadius?: number; // percentage
}

const HighchartsPie: React.FC<HighchartsPieProps> = ({
    data,
    valueField,
    categoryField,
    colors,
    extraColorsArray,
    onSliceClick,
    innerRadius = 50
}) => {

    if (!data || data.length === 0) {
        return <div className="w-full min-h-[300px] flex items-center justify-center text-slate-400">No data available</div>;
    }

    let defaultColorIndex = 0;
    const formattedData: Highcharts.PointOptionsObject[] = data.map(item => {
        const category = String(item[categoryField] || '');
        const val = Number(item[valueField] || 0);
        let color = '#ccc';
        if (colors && colors[category]) {
            color = colors[category];
        } else if (extraColorsArray && extraColorsArray.length > 0) {
            color = extraColorsArray[defaultColorIndex % extraColorsArray.length];
            defaultColorIndex++;
        }

        return {
            name: category,
            y: val,
            color: color
        };
    });

    const options: Highcharts.Options = {
        chart: {
            type: 'pie',
            backgroundColor: 'transparent',
            height: 350,
            style: {
                fontFamily: 'inherit'
            }
        },
        title: {
            text: ''
        },
        tooltip: {
            pointFormat: '<b>{point.percentage:.1f}%</b> (Ksh {point.y:,.2f}M)',
            style: {
                fontSize: '12px'
            }
        },
        plotOptions: {
            pie: {
                innerSize: `${innerRadius}%`,
                allowPointSelect: true,
                cursor: 'pointer',
                borderWidth: 1,
                borderColor: '#ffffff',
                dataLabels: {
                    enabled: true,
                    format: '{point.percentage:.1f} %',
                    distance: -30,
                    filter: {
                        property: 'percentage',
                        operator: '>',
                        value: 4
                    },
                    style: {
                        fontSize: '11px',
                        textOutline: 'none',
                        color: '#ffffff',
                        fontWeight: 'bold'
                    }
                },
                showInLegend: true,
                animation: {
                    duration: 1000
                },
                point: {
                    events: {
                        click: function () {
                            if (onSliceClick && this.name) {
                                onSliceClick(this.name);
                            }
                        }
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'Share',
            data: formattedData
        }],
        legend: {
            enabled: true,
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            itemMarginTop: 4,
            itemMarginBottom: 4,
            itemStyle: {
                fontSize: '11px',
                fontWeight: '500',
                color: '#475569'
            }
        },
        credits: { enabled: false }
    };

    return (
        <div className="w-full min-h-[350px]">
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
        </div>
    );
};

export default HighchartsPie;
