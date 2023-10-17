declare global {
  interface LayoutBase {
    children?: React.ReactNode;
  }

  interface PageBase {
    params?: Record<string, string>;
  }
}

export {};
