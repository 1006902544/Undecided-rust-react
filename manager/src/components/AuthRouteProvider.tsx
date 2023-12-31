import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getToken } from '../utils';
import { useAuthStore } from '@/libs/store';
import { useGetAdminInfo } from '@/libs/api';
import { message } from 'antd';

interface IProps {
  children: React.ReactElement;
  unless?: Array<string>;
}

export default function AuthRouteProvider({ children, unless }: IProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const set_auth = useAuthStore(({ set_auth }) => set_auth);

  useGetAdminInfo({
    query: {
      enabled: !!getToken(),
      onSuccess({ data }) {
        set_auth(data);
        message.success(`welcome ${data.name}!`);
      },
    },
  });

  useEffect(() => {
    const isUnless = unless?.includes(pathname);
    if (!isUnless && !getToken()) {
      navigate('/signIn');
    }
  }, [pathname, unless, navigate]);

  return children;
}
