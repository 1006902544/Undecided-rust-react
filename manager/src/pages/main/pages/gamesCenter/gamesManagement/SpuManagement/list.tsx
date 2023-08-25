import React, { useCallback } from 'react';
import { List, Table } from '@/components';
import { name as resource } from './';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';

export default function ListContainer() {
  const navigate = useNavigate();

  const goUpdate = useCallback(() => {
    navigate('create');
  }, []);

  return (
    <List
      resource={resource}
      actions={
        <Button type="primary" onClick={goUpdate}>
          Create
        </Button>
      }
    >
      <Table />
    </List>
  );
}
