import {
  ProForm,
  ProFormSelect,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Image } from 'antd';

export default function Audit() {
  return (
    <div className="mt-[20px]">
      <ProForm.Item name="avatar" hidden />

      <ProForm.Item shouldUpdate>
        {({ getFieldValue }) => (
          <div className="flex justify-center">
            <Image height={100} src={getFieldValue('avatar')} />
          </div>
        )}
      </ProForm.Item>

      <ProFormSelect
        name="status"
        label="Status"
        rules={[
          {
            required: true,
            message: 'Please chose status',
          },
        ]}
        options={[
          {
            label: 'Pass',
            value: 1,
          },
          {
            label: 'Refuse',
            value: 2,
          },
        ]}
      />

      <ProFormTextArea
        name="reason"
        label="Reason"
        fieldProps={{
          maxLength: 200,
          showCount: true,
        }}
      />
    </div>
  );
}
