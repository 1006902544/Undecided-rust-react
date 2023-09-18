import { useAuthStore } from '@/libs/store';
import { Modal } from 'antd';
import React from 'react';
import styled from 'styled-components';
import Info from './SignUpInfo';
import Role from './SignUpRole';

export default function SignUpInfoRoleModal() {
  const auth = useAuthStore((s) => s.auth);

  return (
    <Container
      open={!auth?.name || !auth?.role_id}
      closeIcon={false}
      footer={null}
      title="Please input your info"
      width={600}
      destroyOnClose
    >
      {!auth?.name ? <Info /> : <Role />}
    </Container>
  );
}

const Container = styled(Modal)``;
