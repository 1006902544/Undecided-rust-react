import { Menu, MenuProps } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MenuContext } from '@/components';
import styled from 'styled-components';

export default function Sider() {
  const navigate = useNavigate();
  const { pathname: curPathname } = useLocation();
  const { data: res, routesTree: items } = useContext(MenuContext) ?? {};

  const [selectedKey, setSelectedKey] = useState<string[]>([]);

  const onSelect: MenuProps['onSelect'] = ({ key }) => {
    const selected = res?.data?.find((item) => item.key === Number(key));
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
      ?.map((item) => item.key!.toString());
    if (keys) {
      setSelectedKey(keys);
    }
  }, [curPathname, res?.data]);

  return (
    <Container className="h-full w-[260px]">
      <Menu
        className="h-full overflow-y-scroll"
        style={{ width: '100%' }}
        mode="inline"
        items={items as any}
        onSelect={onSelect}
        selectedKeys={selectedKey}
      />
    </Container>
  );
}

const Container = styled.aside`
  .ant-menu {
    &::-webkit-scrollbar {
      background-color: rgba(0, 0, 0, 0);
      width: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: rgba(25, 28, 214, 0.3);
      border-radius: 5px;
    }
  }
`;
