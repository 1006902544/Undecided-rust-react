import { createRoleAudit, useGetManagerRoles } from '@/libs/api';
import type { ManagerRole } from '@/libs/api/schema';
import { useMutation } from '@tanstack/react-query';
import { Button, Modal, Spin, message } from 'antd';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

export default function Roles() {
  const { data: roleData, isLoading } = useGetManagerRoles({ is_page: 0 });
  const [selected, setSelected] = useState<undefined | ManagerRole>();

  const onClick = useCallback((data: ManagerRole) => {
    setSelected((pre) => (pre?.id === data.id ? undefined : data));
  }, []);

  const { mutate: submitMutate, isLoading: submitLoading } = useMutation({
    mutationFn: createRoleAudit,
    onSuccess() {
      setSelected(undefined);
      message.success(
        'Your application has been submitted,please waiting for audit'
      );
    },
  });

  const submit = useCallback(() => {
    if (selected) {
      Modal.confirm({
        title: 'Apply',
        content: `Are you going to become ${selected.name} ?`,
        okText: 'Ok',
        cancelText: 'Cancel',
        onOk: () => submitMutate({ role_id: selected.id }),
      });
    } else {
      message.warning('Please chose which role you want to be first');
    }
  }, [selected, submitMutate]);

  return (
    <Spin spinning={isLoading}>
      <Container className="flex flex-wrap  min-h-[200px] content-start p-[20px]">
        {roleData?.data.results?.map(({ id, name, icon, remark }) => (
          <div
            key={id}
            className={`${
              selected?.id === id ? 'role-item-selected' : ''
            } flex p-[5px] mr-[5px] mb-[5px] flex-shrink-0  border-[1px] border-[#ccc] cursor-pointer transition-all rounded-[3px] select-none`}
            onClick={() => onClick({ id, name, icon, remark })}
          >
            {icon && <img className="mr-[5px] h-[20px]" src={icon} alt="" />}
            {name}
          </div>
        ))}
      </Container>

      <div className="flex justify-end p-[20px]">
        <Button type="primary" loading={submitLoading} onClick={submit}>
          Submit
        </Button>
      </div>
    </Spin>
  );
}

const Container = styled.div`
  .role-item-selected {
    border-color: #1677ff;
    box-shadow: 0 0 3px 0 #1677ff;
  }
`;
