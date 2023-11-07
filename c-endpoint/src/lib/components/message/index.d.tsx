export type Status = 'success' | 'failed' | 'default' | 'info';

export interface MessageComponentProps {
  timeout?: number;
  content: React.ReactNode;
  status: Status;
}

export interface CreateRootFnProps {
  timeout?: number;
  content: React.ReactNode;
  status: Status;
}

export interface Config {
  timeout?: number;
}

export type MessageFnProps = (content: React.ReactNode, conf?: Config) => void;

export interface MessageProps {
  success: MessageFnProps;
  failed: MessageFnProps;
  default: MessageFnProps;
  info: MessageFnProps;
}

export interface CreateComponentFnProps {
  ele: HTMLDivElement;
  content: React.ReactNode;
  status: Status;
  timeout?: number;
}
