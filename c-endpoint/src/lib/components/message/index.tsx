import { createPortal } from 'react-dom';
import { componentPrefixClassName } from '..';
import type {
  CreateComponentFnProps,
  CreateRootFnProps,
  MessageProps,
} from './index.d';
import Message from './Message';
import { Root, createRoot } from 'react-dom/client';

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
    root.className = className;
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

const unmount = (
  ele: HTMLDivElement,
  root: Root,
  container: HTMLDivElement
) => {
  root.unmount();
  ele.removeChild(container);
};

const createComponent = ({
  content,
  status,
  ele,
  timeout,
}: CreateComponentFnProps) => {
  const container = document.createElement('div');
  ele.appendChild(container);
  const root = createRoot(container);

  const remove = () => unmount(ele, root, container);

  root.render(
    createPortal(
      <Message
        status={status}
        content={content}
        timeout={timeout}
        remove={remove}
      />,
      container
    )
  );
};

export default message;
