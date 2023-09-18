import type { CurrentRoleAuditRes } from '@/libs/api/schema';
import { Result } from 'antd';
import React, { useMemo } from 'react';
import SubmitApplyButton from './SubmitApplyButton';

export default function HasApplyAudit({
  data,
  refetch,
}: {
  data?: CurrentRoleAuditRes;
  refetch?: () => void;
}) {
  const isRefused = useMemo(() => data?.data?.status === 2, [data]);

  return (
    <Result
      status={isRefused ? 'error' : 'info'}
      title={isRefused ? 'Your apply is refused' : 'Your apply is auditing'}
      subTitle={
        isRefused ? 'You can apply again' : 'Please waiting for auditing'
      }
      extra={
        isRefused && (
          <div>
            <SubmitApplyButton enabled={true} onSuccess={refetch} />
          </div>
        )
      }
    />
  );
}
