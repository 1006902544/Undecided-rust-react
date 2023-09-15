import { sendManagerEmail } from '@/libs/api';
import type { SendManagerEmailRes } from '@/libs/api/schema';
import { ProFormText } from '@ant-design/pro-components';
import type { ProFormItemProps } from '@ant-design/pro-components';
import { useMutation } from '@tanstack/react-query';
import { Button } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import type { ButtonProps } from 'antd/lib';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

interface IProps extends ProFormItemProps {
  emailName?: string;
  buttonProps?: ButtonProps;
  onSuccess?: (data: SendManagerEmailRes) => void;
}

export default function CaptchaWithButtonFormItem({
  emailName = 'email',
  buttonProps,
  ...props
}: IProps) {
  const email = useWatch(emailName);
  const baseSeconds = useMemo(() => 60, []);
  const [seconds, setSeconds] = useState(baseSeconds);

  const intervalRef = useRef<number | null>(null);

  const { mutate, isLoading } = useMutation({
    mutationFn: sendManagerEmail,
    onSuccess({ data }) {
      props.onSuccess?.(data);
      window.clearInterval(intervalRef.current || undefined);
      setSeconds((s) => s - 1);
      intervalRef.current = window.setInterval(() => {
        setSeconds((s) => {
          if (s === 0) {
            window.clearInterval(intervalRef.current || undefined);
            return baseSeconds;
          } else {
            return s - 1;
          }
        });
      }, 1000);
    },
  });

  const send = useCallback(() => {
    if (!email) return;
    mutate({ email });
  }, [email, mutate]);

  useEffect(() => {
    return () => {
      window.clearInterval(intervalRef.current || undefined);
    };
  }, []);

  const couldSendEmail = useMemo(() => {
    const regexp = new RegExp(
      /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    );
    return regexp.test(email) && seconds === baseSeconds;
  }, [email, seconds, baseSeconds]);

  return (
    <div className="flex items-end justify-between">
      <ProFormText
        className="mb-[0px]"
        rules={[
          {
            required: true,
            message: 'Please enter the 6-digit captcha',
            len: 6,
          },
        ]}
        {...props}
      />
      <Button
        disabled={!couldSendEmail}
        className="mb-[32px] w-[120px]"
        onClick={send}
        loading={isLoading}
        {...buttonProps}
      >
        {seconds === baseSeconds ? 'Send Captcha' : seconds}
      </Button>
    </div>
  );
}
