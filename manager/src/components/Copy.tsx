import { CheckOutlined } from '@ant-design/icons';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { CSSProperties } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

interface IProps {
  text: string;
  children?: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}

export default function Copy({
  text,
  children: childrenProp,
  className,
  style,
}: IProps) {
  const [copied, setCopied] = useState(false);

  const copyFnRef = useRef(0);

  const onCopy = useCallback(() => {
    if (copied) return;
    setCopied(true);
    copyFnRef.current = window.setTimeout(() => {
      setCopied(false);
    }, 1000);
  }, [copied]);

  const children = useMemo(() => {
    if (copied) {
      return (
        <span style={style} className={className}>
          <span className="text-[#006eff]">
            <CheckOutlined /> copied
          </span>
        </span>
      );
    } else {
      return childrenProp;
    }
  }, [copied, className, style, childrenProp]);

  useEffect(() => {
    return () => {
      if (copyFnRef.current) {
        clearTimeout(copyFnRef.current);
      }
    };
  }, []);

  return (
    <CopyToClipboard onCopy={onCopy} text={text}>
      {children}
    </CopyToClipboard>
  );
}
