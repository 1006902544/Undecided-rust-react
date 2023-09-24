import { useMenuContext } from '@/components';
import { useAuthStore } from '@/libs/store';
import { removeToken } from '@/utils';
import { LeftOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import React, { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar } from '.';

export default function Header() {
  const { auth, clear_auth } = useAuthStore(({ auth, clear_auth }) => ({
    auth,
    clear_auth,
  }));
  const navigate = useNavigate();

  const sign_out = () => {
    removeToken();
    clear_auth();
    navigate('/signIn');
  };

  const goSelf = useCallback(() => {
    navigate('/settings/self');
  }, [navigate]);

  const { pathname } = useLocation();
  const menuContext = useMenuContext();
  const currentLabel = useMemo(() => {
    return menuContext?.data?.data.find((item) => item.path === pathname)
      ?.label;
  }, [menuContext, pathname]);

  const goPrev = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <header className="px-[100px] w-full h-[60px] flex justify-between border-b-[1px] border-[#e5e7eb] bg-[white] flex-shrink-0">
      <div className="space-x-4">
        <Button onClick={goPrev}>
          <LeftOutlined />
        </Button>
        <span>{currentLabel}</span>
      </div>

      <div className=" h-full min-w-[100px] px-[20px] flex justify-start items-center">
        <Dropdown
          menu={{
            items: [
              {
                key: 'self',
                label: <button onClick={goSelf}>self</button>,
              },
              {
                key: 'sign_out',
                label: <button onClick={sign_out}>sign out</button>,
              },
            ],
          }}
          placement="bottomLeft"
        >
          <span className="text-[18px] leading-[18px] flex items-end">
            <Avatar auth={auth} />
            <span className="ml-[10px]">
              {auth?.name}
              <span className="text-[12px] text-[gray] ml-[10px]">
                #{auth?.id}
              </span>
            </span>
          </span>
        </Dropdown>
      </div>
    </header>
  );
}
