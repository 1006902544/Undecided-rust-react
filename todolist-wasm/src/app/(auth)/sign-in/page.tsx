'use client';
import React, { useState } from 'react';
import {
  prompt,
  ColorfulBg,
  Form,
  FormItem,
  Input,
  Button,
} from '@/components';
import './page.scss';
import { signIn } from '@/libs/api/admin';
import type { LoginBody } from '@/libs/api/admin/schema';
import { set_token } from '@/libs/utils';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const on_submit = async (v: LoginBody) => {
    setLoading(true);
    try {
      const { data } = await signIn(v);
      set_token(data);
      prompt({
        title: 'Success',
        content: 'sign in successfully',
      });
      router.push('/home');
    } finally {
      setLoading(false);
    }
  };

  const go_sign_up = () => {
    router.push('/sign-up');
  };

  return (
    <Form onSubmit={on_submit}>
      <FormItem
        name="username"
        title="username"
        options={{
          required: 'Username is required',
          minLength: 6,
          maxLength: 18,
        }}
      >
        <Input />
      </FormItem>

      <FormItem
        name="password"
        title="password"
        options={{
          minLength: 6,
          maxLength: 18,
          required: 'Password is required',
        }}
        style={{ marginTop: 20 }}
      >
        <Input />
      </FormItem>

      <div className="mt-[16px] flex justify-end">
        <ColorfulBg className=" rounded-[5px]">
          <Button
            type="button"
            className="w-[200px] bg-[white]"
            loading={loading}
            onClick={go_sign_up}
          >
            Sign Up
          </Button>
        </ColorfulBg>
      </div>

      <div className="mt-[16px] flex justify-end">
        <ColorfulBg className=" rounded-[5px]">
          <Button
            type="submit"
            className="w-[200px] bg-[white]"
            loading={loading}
          >
            Sign In
          </Button>
        </ColorfulBg>
      </div>
    </Form>
  );
}
