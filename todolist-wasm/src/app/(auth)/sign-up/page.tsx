'use client';
import React, { useState } from 'react';
import { Input, FormItem, Form, Button, Modal, prompt } from '@/components';
import { signUp } from '@/libs/api/admin';
import type { SignUpReq } from '@/libs/api/admin/schema';
import { useRouter } from 'next/navigation';
import './page.scss';

export default function SignUp() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const sign_up = async (data: SignUpReq) => {
    setLoading(true);
    try {
      const res = await signUp(data);
      if (res.status === 200) {
        prompt({
          title: 'SignUp Success',
        });
        router.push('/sign-in');
      }
    } catch {
      setLoading(false);
    }
  };

  const back_sign_in = () => {
    router.push('/sign-in');
  };

  return (
    <Form<SignUpReq> onSubmit={sign_up} className="flex flex-col">
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

      <FormItem
        name="name"
        title="name"
        options={{
          minLength: 6,
          maxLength: 18,
          required: 'Name is required',
        }}
        style={{ marginTop: 20 }}
      >
        <Input />
      </FormItem>

      <FormItem
        name="age"
        title="age"
        options={{
          required: 'Age is required',
        }}
        style={{ marginTop: 20 }}
      >
        <Input type="number" max={140} min={0} />
      </FormItem>

      <div className="flex w-full justify-end mt-[16px]" onClick={back_sign_in}>
        <button type="button">back to sign in</button>
      </div>

      <Button type="submit" className="mt-[20px]" loading={loading}>
        submit
      </Button>
    </Form>
  );
}
