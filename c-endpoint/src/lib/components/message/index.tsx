import { createPortal } from 'react-dom';
import { componentPrefixClassName } from '..';
import type {
  CreateComponentFnProps,
  CreateRootFnProps,
  MessageProps,
} from './index.d';
import Message from './Message';

const message: MessageProps = {
  success(content, conf) {
    messageFn({
      timeout: conf?.timeout,
      status: 'success',
      content,
    });
  },
  failed(content, conf) {
    messageFn({
      timeout: conf?.timeout,
      status: 'failed',
      content,
    });
  },
  default(content, conf) {
    messageFn({
      timeout: conf?.timeout,
      status: 'default',
      content,
    });
  },
  info(content, conf) {
    messageFn({
      timeout: conf?.timeout,
      status: 'info',
      content,
    });
  },
};

const messageFn = ({ content, timeout, status }: CreateRootFnProps) => {
  const className = `${componentPrefixClassName}-message-root`;

  let ele: HTMLDivElement | null = document.querySelector(`.${className}`);
  if (!ele) {
    const root = document.createElement('div');
    root.className = `.${className}`;
    document.body.appendChild(root);
    ele = root;
  }

  createComponent({
    ele: ele as HTMLDivElement,
    content,
    timeout,
    status,
  });
};

const createComponent = ({
  content,
  status,
  ele,
  timeout,
}: CreateComponentFnProps) => {
  createPortal(
    <Message status={status} content={content} timeout={timeout} />,
    ele
  );
};

export default message;
