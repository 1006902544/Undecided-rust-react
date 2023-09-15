import { useGetManagerRoles } from '@/libs/api';
import React from 'react';

export default function SignUpRole() {
  const { data, isLoading } = useGetManagerRoles({
    is_page: 0,
  });

  return <div>SignUpRole</div>;
}
