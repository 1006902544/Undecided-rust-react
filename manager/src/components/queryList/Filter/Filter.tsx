import { ProForm, QueryFilter } from '@ant-design/pro-components';
import { useListContext } from '../';
import type { QueryFilterProps } from '@ant-design/pro-components';

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
  };

  const onReset = () => {
    context.setFilterValues({});
  };

  return (
    <QueryFilter
      form={form as any}
      onFinish={onFinish}
      onReset={onReset}
      {...props}
    >
      {children}
    </QueryFilter>
  );
}
