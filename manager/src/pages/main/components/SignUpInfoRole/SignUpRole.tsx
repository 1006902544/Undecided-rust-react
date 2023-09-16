import { useGetManagerRoles } from '@/libs/api';
import { Button, Spin } from 'antd';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

export default function SignUpRole() {
  const { data, isLoading } = useGetManagerRoles({
    is_page: 0,
  });

  const [selected, setSelected] = useState<number | undefined>();

  const onSelect = useCallback((id: number) => {
    setSelected(id);
  }, []);

  return (
    <Spin spinning={isLoading}>
      <Container className="min-h-[300px]">
        <h1 className="my-[20px]">Chose your role</h1>
        <div className="flex flex-wrap relative">
          {data?.data.results?.map(({ name, id, icon }) => (
            <div
              className={`flex-shrink-0 px-[10px] bg-[rgba(253,254,255,0.5)] border-[1px] border-[rgba(84,134,209,0.97)] text-[18px] rounded-[3px] cursor-pointer text-[#363636] mb-2 mr-2 flex justify-center items-center ${
                selected === id ? 'selected-item' : ''
              }`}
              key={id}
              onClick={() => onSelect(id)}
            >
              {icon ? (
                <div className="w-[16px] h-[16px] mr-[5px]">
                  <img
                    alt=""
                    src={icon || ''}
                    className="object-contain w-full"
                  />
                </div>
              ) : null}
              {name}
            </div>
          ))}
        </div>

        <div className="mt-[50px] flex justify-center">
          <Button type="primary" className="w-[150px]">
            Apply
          </Button>
        </div>
      </Container>
    </Spin>
  );
}

const Container = styled.div`
  .selected-item {
    background-color: rgba(155, 185, 228, 0.5);
    transition: all 0.2s;
  }
`;
