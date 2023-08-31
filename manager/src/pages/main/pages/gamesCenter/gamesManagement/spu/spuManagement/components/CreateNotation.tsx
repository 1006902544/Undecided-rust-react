import { ProFormText } from '@ant-design/pro-components';
import React from 'react';

export default function CreateNotation() {
  return (
    <div>
      <ProFormText label="SpuId" name="spuId" readonly />
      <ProFormText label="SpuName" name="spuName" readonly />
    </div>
  );
}
