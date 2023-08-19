export interface ModalProps {
  open?: boolean;
  onCancel?: () => void;
  title?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  wrapperOpacity?: number;
}
