import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header as H, Sider as S } from './components';
import { Layout } from 'antd';
const { Header, Content, Sider } = Layout;

export default function Main() {
  return (
    <Layout
      style={{
        width: '100vw',
        height: '100vh',
      }}
    >
      <Sider width={260}>
        <S />
      </Sider>
      <Content style={{ height: '100%' }}>
        <Header style={{ height: 60, background: 'transparent', padding: 0 }}>
          <H />
        </Header>

        <Content style={{ height: 'calc(100% - 60px)', padding: 20 }}>
          <div className="p-[20px] w-full h-full bg-[white] rounded-[8px]">
            <Outlet />
          </div>
        </Content>
      </Content>
    </Layout>
  );
}
