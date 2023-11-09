'use client';
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export default function Home() {
  const { push } = useRouter();

  const moveToMarket = useCallback(() => {
    push('market');
  }, [push]);

  return (
    <div className="w-full h-full flex justify-center">
      <div className="mt-[250px] flex flex-col items-center">
        <h1>Welcome to C Endpoint</h1>

        <Button color="secondary" className="mt-[30px]" onClick={moveToMarket}>
          Move to Market now
        </Button>
      </div>
    </div>
  );
}
