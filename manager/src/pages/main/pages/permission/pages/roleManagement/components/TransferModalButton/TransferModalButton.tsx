import { ModalButton } from '@/components';
import React from 'react';
import { PermissionTransfer, MenuTransfer } from '../';
import './TransferModalButton.scss';

interface IProps {
  type: 'menu' | 'permission';
  role_id: number;
}

export default function TransferModalButton({ type, role_id }: IProps) {
  return (
    <ModalButton
      label={type === 'permission' ? 'permissions' : 'menu'}
      type="link"
      modalProps={{
        footer: null,
        title: null,
        closeIcon: null,
        wrapClassName: 'transparent-bg-modal',
        width: 1400,
      }}
    >
      {type === 'permission' ? (
        <PermissionTransfer role_id={role_id} />
      ) : (
        <MenuTransfer role_id={role_id} />
      )}
    </ModalButton>
  );
}
