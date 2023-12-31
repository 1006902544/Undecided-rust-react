import { Menu, MenuProps } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MenuContext } from '@/components';

export default function Sider() {
  const navigate = useNavigate();
  const { pathname: curPathname } = useLocation();
  const { data: res, routesTree: items } = useContext(MenuContext) ?? {};

  const [selectedKey, setSelectedKey] = useState<string[]>([]);

  const onSelect: MenuProps['onSelect'] = ({ key }) => {
    const selected = res?.data?.find((item) => item.key === key);

    if (selected) {
      const pathname = selected?.path;
      if (pathname !== curPathname) {
        navigate(pathname);
      }
    }
  };

  useEffect(() => {
    const keys = res?.data
      ?.filter((item) => item.path === curPathname)
      ?.map((item) => item.key!);
    if (keys) {
      setSelectedKey(keys);
    }
  }, [curPathname, res?.data]);

  return (
    <aside className="h-full w-[260px]">
      <Menu
        className="h-full"
        style={{ width: '100%' }}
        mode="inline"
        items={items as any}
        onSelect={onSelect}
        selectedKeys={selectedKey}
      />
    </aside>
  );
}
