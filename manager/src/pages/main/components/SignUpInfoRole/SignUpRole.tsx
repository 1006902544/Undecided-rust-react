import { useGetCurrentRoleAudit } from '@/libs/api';
import { Spin } from 'antd';
import styled from 'styled-components';
import HasApplyAudit from './HasApplyAudit';
import SubmitApplyButton from './SubmitApplyButton';

export default function SignUpRole() {
  const {
    data: auditInfo,
    isLoading: auditInfoLoading,
    refetch,
  } = useGetCurrentRoleAudit();

  return (
    <Spin spinning={auditInfoLoading}>
      {auditInfo?.data ? (
        <HasApplyAudit data={auditInfo} refetch={refetch} />
      ) : (
        <Container className="min-h-[300px]">
          <h1 className="my-[20px] text-center">Chose your role</h1>

          <SubmitApplyButton enabled={!auditInfo?.data} onSuccess={refetch} />
        </Container>
      )}
    </Spin>
  );
}

const Container = styled.div``;
