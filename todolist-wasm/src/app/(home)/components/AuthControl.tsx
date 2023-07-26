import { Button, Popover } from '@/components';
import type { AdminInfo } from '@/libs/api/admin/schema';
import React from 'react';
import { remove_token } from '@/libs/utils';
import type { SetAuth } from '@/libs/store';
import globalStyle from '@/app/globals.module.scss';

interface IProps {
  auth_info: AdminInfo;
  set_auth: SetAuth;
}

export default function AuthControl({ auth_info, set_auth }: IProps) {
  const sign_out = () => {
    set_auth(undefined);
    remove_token();
  };

  return (
    <Popover
      className="w-[220px]"
      type="click"
      content={
        <div className=" relative">
          <div
            className="text-[18px] bg-clip-text text-transparent"
            style={{
              background: `linear-gradient(to top , ${globalStyle.color1}, ${globalStyle.color2})`,
              WebkitBackgroundClip: 'text',
            }}
          >
            Info
          </div>
          <ul className="text-[12px]">
            <li>username: {auth_info.username}</li>
            <li>age: {auth_info.age}</li>
            <li>
              gender:{' '}
              {auth_info.gender === 1
                ? 'Males'
                : auth_info.gender === 2
                ? 'Females'
                : 'Walmart Bag'}
            </li>
            <li>create_time: {auth_info.create_time}</li>
          </ul>
          <div className="flex justify-around mt-[10px]">
            <button className="border-b-[1px] border-[#ccc] px-[5px]">
              SETTING
            </button>
            <button
              className="border-b-[1px] border-[#ccc] px-[5px]"
              onClick={sign_out}
            >
              SIGN OUT
            </button>
          </div>
        </div>
      }
    >
      <button className="px-[20px] text-[20px] bg-[white]">
        {auth_info?.name}
        &nbsp;
        <span className="text-[14px] text-[gray]"># {auth_info?.id}</span>
      </button>
    </Popover>
  );
}
