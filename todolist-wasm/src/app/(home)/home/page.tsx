'use client';
import React, { useState } from 'react';
import { Banner } from '@/components';

export default function page() {
  const [status, setStatus] = useState(true);

  return (
    <div>
      <button onClick={() => setStatus(!status)}>展开/收起</button>
      <Banner
        width={status ? 800 : 200}
        list={[
          {
            img: 'https://img.zcool.cn/community/017f8558fcc15ba8012160f7004c0e.jpg@1280w_1l_2o_100sh.jpg',
          },
          {
            img: 'https://static.www.tencent.com/uploads/2023/07/07/6571f28bdab072d86875efc57e6786bb.jpg!article.cover',
          },
          {
            img: 'https://static.www.tencent.com/uploads/2023/07/04/1b989467ac7cd1fefc0251873e70b087.jpg!article.cover',
          },
        ]}
      />
    </div>
  );
}
