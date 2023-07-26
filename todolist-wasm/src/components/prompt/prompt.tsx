'use client';
import React, { useEffect, useRef, useState } from 'react';
import type { PromptConf, PromptProps, PromptStatus } from './';
import { createRoot } from 'react-dom/client';
import './prompt.scss';

const animationTime = 300;

export const prompt = (conf: PromptConf) => {
  const { node, ...rest } = conf;

  let wrap: Element | DocumentFragment;

  if (node) {
    wrap = node;
  } else {
    const curWrap = document.body.querySelector('.nazabanma-prompt-wrap');
    if (!curWrap) {
      wrap = document.body.appendChild(document.createElement('div'));
      wrap.className = 'nazabanma-prompt-wrap';
    } else {
      wrap = curWrap;
    }
  }

  const wrapContainer = wrap.appendChild(document.createElement('div'));

  const root = createRoot(wrapContainer);
  const unmount = () => {
    root.unmount();
    wrap.removeChild(wrapContainer);
  };

  root.render(<Prompt unmount={unmount} {...rest} />);
};

const Prompt = ({
  appearTime = 4000,
  content,
  title,
  unmount,
}: PromptProps) => {
  const [status, setStatus] = useState<PromptStatus>('appearing');

  const appearingTimeRef = useRef<number>();
  const appearedTimeRef = useRef<number>();
  const disappearTimeRef = useRef<number>();

  useEffect(() => {
    appearingTimeRef.current = window.setTimeout(() => {
      setStatus('appeared');
      appearedTimeRef.current = window.setTimeout(() => {
        setStatus('disappearing');
        disappearTimeRef.current = window.setTimeout(() => {
          unmount();
        }, animationTime);
      }, appearTime);
    }, animationTime);

    return beforeUnmount;
  }, []);

  const beforeUnmount = () => {
    document.body.querySelector('.nazabanma-prompt-wrap');

    if (appearingTimeRef.current) {
      clearTimeout(appearingTimeRef.current);
    }
    if (appearedTimeRef.current) {
      clearTimeout(appearedTimeRef.current);
    }
    if (disappearTimeRef.current) {
      clearTimeout(appearedTimeRef.current);
    }
  };

  return (
    <div
      className={
        'nazabanma-prompt-option-container mt-[20px] z-[2] relative text-[white]' +
        ' nazabanma-prompt-option-container-' +
        status
      }
    >
      <div className="nazabanma-prompt-option-bg absolute  rounded-[3px]">
        <div></div>
      </div>

      <div className="w-full h-full py-[10px] px-[20px] bg-[rgba(0,0,0,0)] rounded-[3px]">
        <div>
          {title ? (
            <div className="nazabanma-prompt-option-title truncate font-semibold text-[18px] ">
              {title}
            </div>
          ) : null}

          <div className="nazabanma-prompt-option-content max-w-[300px] min-w-[200px] whitespace-pre-wrap">
            <span className=" whitespace-break-spaces break-words">
              {content}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
