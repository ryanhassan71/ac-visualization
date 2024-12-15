import { Chart, ArcElement, Tooltip, Legend, registerables } from 'chart.js';
import {  Bar } from 'react-chartjs-2';
Chart.register(...registerables, ArcElement, Tooltip, Legend);

//  LineChart
Chart.defaults.borderColor = "rgba(142, 156, 173,0.1)", Chart.defaults.color = "#8c9097";

export function Chartjsbar({option, data}) {
  return <Bar options={option} data={data} height='300px' />;
}

