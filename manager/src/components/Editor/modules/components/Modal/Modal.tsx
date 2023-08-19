import './Modal.scss';
import type { ModalProps } from './Modal.d';
import { createPortal } from 'react-dom';

export default function Modal({
  open,
  onCancel,
  wrapperOpacity = 0.3,
  title,
  footer,
  children,
}: ModalProps) {
  return open
    ? createPortal(
        <div
          className="editor-modal-wrapper w-[100vw] h-[100vh] flex justify-center fixed left-0 top-0 z-[1000] items-center"
          style={{ backgroundColor: `rgba(0,0,0,${wrapperOpacity})` }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onCancel?.();
          }}
        >
          <div
            className="editor-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col bg-[white] min-h-0 p-[20px] rounded-[8px]">
              {title}
              <br />
              {children}
              <br />
              {footer}
            </div>
          </div>
        </div>,
        document.body
      )
    : null;
}
