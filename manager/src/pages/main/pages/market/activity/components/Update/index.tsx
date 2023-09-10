import { Button, Spin, Steps } from 'antd';
import type { StepProps } from 'antd';
import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { UpdateContext, useUpdateContext } from '..';
import ActivityBase from '../ActivityBase';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import ActivityInfo from '../ActivityInfo';
import ActivityGoods from '../ActivityGoods';

export default function Update() {
  return (
    <UpdateContext>
      <Container className="w-full h-full p-[20px] flex">
        <Content />
      </Container>
    </UpdateContext>
  );
}

const Content = () => {
  const { isLoading, isEdit, step, setStep, stepIncludes } = useUpdateContext();

  const next = useCallback(() => {
    setStep(step + 1);
  }, [setStep, step]);

  const prev = useCallback(() => {
    setStep(step - 1);
  }, [setStep, step]);

  const stepButtonContainer = useMemo(
    () => (
      <div className="flex pt-[20px] items-center justify-center space-x-4">
        <Button
          type="primary"
          disabled={!stepIncludes.includes(step - 1)}
          onClick={prev}
        >
          <LeftOutlined />
          Previous
        </Button>
        <Button
          type="primary"
          disabled={!stepIncludes.includes(step + 1)}
          onClick={next}
        >
          Next
          <RightOutlined />
        </Button>
      </div>
    ),
    [stepIncludes, step, prev, next]
  );

  //--items
  const items = useMemo<(StepProps & { content?: React.ReactNode })[]>(
    () => [
      {
        title: 'Basic',
        description: 'Activity basic',
        content: <ActivityBase />,
      },
      {
        title: 'Info',
        description: 'Activity info',
        content: <ActivityInfo />,
      },
      {
        title: 'Goods',
        description: 'Activity goods',
        content: <ActivityGoods />,
      },
    ],
    []
  );

  const content = useMemo(() => items[step]?.content, [items, step]);

  return (
    <Spin spinning={isLoading && isEdit}>
      <div className="h-[150px] flex-shrink-0 flex flex-col justify-center items-center px-[100px]">
        <Steps className="flex" current={step} items={items} />
        {stepButtonContainer}
      </div>

      <div className="update-content flex-1 overflow-y-scroll">{content}</div>
    </Spin>
  );
};

const Container = styled.div`
  .ant-spin-container {
    display: flex;
    flex-direction: column;
  }

  .update-content {
    margin-top: 10px;
    box-shadow: 0px -7px 7px -7px #ccc;
    border-radius: 8px;

    &::-webkit-scrollbar {
      width: 5px;
    }

    &::-webkit-scrollbar-thumb {
      width: 5px;
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 5px;
    }
  }
`;
