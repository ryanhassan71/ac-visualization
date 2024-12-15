import React from 'react'
import  {  Fragment } from 'react';
import { Chartjsbar } from './chartjsdata';

const Option2 = {

  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
    },
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
};

const Data2 = {
  type: 'bar',
  labels: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
  ],
  datasets: [{
    label: 'My First Dataset',
    data: [65, 59, 80, 81, 56, 55, 40],
    backgroundColor: [
      'rgba(132, 90, 223, 0.2)',
      'rgba(35, 183, 229, 0.2)',
      'rgba(245, 184, 73, 0.2)',
      'rgba(73, 182, 245, 0.2)',
      'rgba(230, 83, 60, 0.2)',
      'rgba(38, 191, 148, 0.2)',
      'rgba(35, 35, 35, 0.2)'
    ],
    borderColor: [
      'rgb(132, 90, 223)',
      'rgb(35, 183, 229)',
      'rgb(245, 184, 73)',
      'rgb(73, 182, 245)',
      'rgb(230, 83, 60)',
      'rgb(38, 191, 148)',
      'rgb(35, 35, 35)'
    ],
    borderWidth: 1
  }]
};
function MonthlyPowerChart() {
  return (
    <Fragment>
    
         <div className="grid grid-cols-12 gap-x-6">
             <div className="xl:col-span-12 col-span-12">
                 <div className="box custom-box">
                     <div className="box-body">
                      <Chartjsbar option={Option2} data={Data2}/>
                     </div>
                 </div>
             </div>






         </div>
</Fragment>
  )
}

export default MonthlyPowerChart