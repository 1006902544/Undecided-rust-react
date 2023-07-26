'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { BannerProps } from './Banner.d';
import { cloneDeep } from 'lodash';
const baseClassName = process.env.NAME;
import './Banner.scss';

export default function Banner({ list: listProp, width = 400 }: BannerProps) {
  const list = useMemo(() => {
    const first = listProp[0];
    if (first) {
      listProp.push(cloneDeep(first));
      return listProp;
    }
    return listProp;
  }, [listProp]);

  //移动
  const max_count = useMemo(() => list.length, [listProp]);
  const step_width = useMemo(() => {
    return 1 / max_count;
  }, [max_count]);
  const move_time_ref = useRef<number | null>(null);
  const [translate_left, set_translate_left] = useState(0);

  const move = (point: 'left' | 'right') => {
    if (move_time_ref.current) return;
    if (point === 'right') {
      go_right();
    } else {
      go_left();
    }
  };

  const go_right = () => {
    let pre_left = translate_left;
    const is_last =
      Math.abs(pre_left).toFixed(2) ===
      (step_width * (max_count - 1)).toFixed(2);

    if (is_last) {
      set_translate_left(0);
      pre_left = 0;
    }

    move_time_ref.current = window.setInterval(() => {
      set_translate_left((left) => {
        if (
          Math.abs(pre_left - left).toFixed(2) === step_width.toFixed(2) &&
          move_time_ref.current
        ) {
          window.clearInterval(move_time_ref.current);
          move_time_ref.current = null;
          return Number(left.toFixed(2));
        }
        return Number((left - step_width / 20).toFixed(2));
      });
    }, 6);
  };

  const go_left = () => {
    let pre_left = translate_left;

    const is_last = Math.abs(pre_left).toFixed(2) === '0.00';

    if (is_last) {
      const to_left = -(max_count - 1) * step_width;
      set_translate_left(to_left);
      pre_left = to_left;
    }

    move_time_ref.current = window.setInterval(() => {
      set_translate_left((left) => {
        if (
          Math.abs(pre_left - left).toFixed(2) === step_width.toFixed(2) &&
          move_time_ref.current
        ) {
          window.clearInterval(move_time_ref.current);
          move_time_ref.current = null;
          return Number(left.toFixed(2));
        }
        return Number((left + step_width / 20).toFixed(2));
      });
    }, 6);
  };

  return (
    <div
      className={`${baseClassName}-banner-container relative flex overflow-hidden rounded-[6px]`}
      style={{
        width,
        height: width / 2,
      }}
    >
      <div
        className={`${baseClassName}-banner-button left-[0px] rounded-r-[5px]`}
        style={{ width: width / 15, height: width / 5 }}
        onClick={() => move('left')}
      ></div>

      <ul
        className="flex flex-1"
        style={{
          width: list.length * width,
          transform: `translateX(${translate_left * 100}%)`,
        }}
      >
        {list.map(({ img, url }, i) => (
          <li
            key={i}
            className={`h-full`}
            style={{
              width,
            }}
          >
            <img alt="" src={img} className="w-full h-full" />
          </li>
        ))}
      </ul>

      <div
        className={`${baseClassName}-banner-button right-[0px] rounded-l-[5px]`}
        style={{ width: width / 15, height: width / 5 }}
        onClick={() => move('right')}
      ></div>
    </div>
  );
}
