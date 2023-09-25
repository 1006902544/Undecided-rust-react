import { ProForm, QueryFilter } from '@ant-design/pro-components';
import { useListContext } from '../';
import type { QueryFilterProps } from '@ant-design/pro-components';
import { Button } from 'antd';

export default function Filter<
  Req extends Record<string, any> = any,
  Res = any
>({ children, ...props }: QueryFilterProps) {
  const [form] = ProForm.useForm<Req>();
  const context = useListContext<Req, Res>();

  if (!context) {
    return <div>Filter Must Build In List Context</div>;
  }

  const onFinish = async (values: Record<string, any>) => {
    context.setFilterValues(values);
    context.setPagination(({ limit }) => ({ page: 1, limit }));
  };

  const onReset = (value: Record<string, any>) => {
    context.setFilterValues(value);
    context.setPagination(({ limit }) => ({ page: 1, limit }));
  };

  return (
    <QueryFilter
      form={form as any}
      onFinish={onFinish}
      onReset={onReset}
      submitter={{
        render(props, dom) {
          return [
            <Button onClick={props.reset} key={dom[0].key}>
              Reset
            </Button>,
            <Button onClick={props.submit} key={dom[1].key} type="primary">
              Search
            </Button>,
          ];
        },
      }}
      {...props}
    >
      {children}
    </QueryFilter>
  );
}
