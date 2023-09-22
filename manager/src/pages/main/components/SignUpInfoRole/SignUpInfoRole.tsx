import { useAuthStore } from '@/libs/store';
import { Button, Modal } from 'antd';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import Info from './SignUpInfo';
import Role from './SignUpRole';
import { removeToken } from '@/utils';
import { useNavigate } from 'react-router-dom';

export default function SignUpInfoRoleModal() {
  const navigate = useNavigate();

  const { auth, clear_auth } = useAuthStore((s) => ({
    auth: s.auth,
    clear_auth: s.clear_auth,
  }));

  const backSignIn = useCallback(() => {
    clear_auth();
    removeToken();
    navigate('/signIn');
  }, [clear_auth, navigate]);

  return (
    <Container
      open={!auth?.name || !auth?.role_id}
      closeIcon={false}
      footer={null}
      title="Please input your info"
      width={600}
      destroyOnClose
    >
      <Button className="w-full" type="primary" onClick={backSignIn}>
        Back to sign in
      </Button>
      {!auth?.name ? <Info /> : <Role />}
    </Container>
  );
}

const Container = styled(Modal)``;
