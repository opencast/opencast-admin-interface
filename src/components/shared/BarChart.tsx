import React from "react";
import { Bar } from "react-chartjs-2";
import type { ChartDataset, ChartOptions } from 'chart.js';

/**
 * This component provides a bar chart for visualising (statistics) data
 */
const BarChart = ({
	values,
	axisLabels,
	options
}: {
	values: ChartDataset<'bar'>,
	axisLabels: string[],
	options: ChartOptions<'bar'>,
}) => {
	const data = {
		labels: axisLabels,
		datasets: [
			{
				backgroundColor: "rgba(58,105,147,0.1)",
				borderColor: "rgba(58,105,147,0.5)",
				borderWidth: 2,
				hoverBackgroundColor: "rgba(58,105,147,0.25)",
				hoverBorderColor: "rgba(58,105,147,0.7)",
				data: values,
			},
		],
	};

	return <Bar data={data} width={undefined} height={undefined} options={options} />;
};

export default BarChart;
