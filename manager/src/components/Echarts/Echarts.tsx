import ReactECharts from 'echarts-for-react';
import React from 'react';
interface IProps {}

export default function Echarts({}: IProps) {
  return (
    <ReactECharts
      option={{
        title: {
          text: '成车库龄占比图',
        },
        series: [
          {
            type: 'pie',
            label: {
              normal: {
                show: true,
                position: 'inner',
              },
            },
            data: [
              {
                value: 32,
                name: '7-12年内库龄',
                color: 'red',
              },
              {
                value: 48,
                name: '半年内库龄',
              },
              {
                value: 16,
                name: '12-24月库龄',
              },
              {
                value: 4,
                name: '24月以上库龄',
              },
            ],
          },
        ],
      }}
      notMerge={true}
      lazyUpdate={true}
      theme={'theme_name'}
      style={{ height: '300px', width: '500px' }}
      onChartReady={(ins) => {
        console.log(ins);
      }}
      opts={{}}
    />
  );
}
