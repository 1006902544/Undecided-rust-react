import React, { useCallback, useEffect, useRef, useState } from 'react';
import { init as eInit, type EChartsType } from 'echarts';

export default function Main() {
  const eleRef = useRef<HTMLDivElement>(null);

  const [myChart, setMyChart] = useState<EChartsType>();

  const init = useCallback(() => {
    if (eleRef.current) {
      setMyChart(eInit(eleRef.current, null, { width: 600, height: 400 }));
    }
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (myChart) {
      myChart.setOption({
        title: {
          text: 'ECharts 入门示例',
        },
        tooltip: {},
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'line',
            data: [5, 20, 36, 10, 10, 20],
          },
        ],
      });
    }
  }, [myChart]);

  return (
    <div>
      <div ref={eleRef}></div>
    </div>
  );
}
