import { useCallback, useMemo, useRef, useState } from 'react';
import { ToolbarItem } from '../index.d';
import { Modal } from '../modules/components';
import { useEditorContext } from './useEditorContext';
import { useBaseToggle } from './useBaseToggle';

export const useBaseItems = () => {
  const baseItems: ToolbarItem[] = [
    {
      key: 'bold',
      children: <span className="px-[8px] font-bold">B</span>,
      toggle(editor, { handleBold }) {
        handleBold(editor);
      },
    },
    {
      key: 'italic',
      children: <span className="px-[8px] pr-[10px] font-bold italic">I</span>,
      toggle(editor, { handleItalic }) {
        handleItalic(editor);
      },
    },
    {
      key: 'upload',
      type: 'option',
      children: <span className="px-[8px] font-bold">Upload</span>,
      options: [
        {
          key: 'image',
          children: <InsertImageModalButton />,
        },
      ],
    },
    {
      key: 'fontSize',
      type: 'option',
      children: <span className="px-[8px] font-bold">Size</span>,
      options: new Array(13).fill(0).map((_, i) => ({
        key: `size-${i + 12}`,
        children: `${i + 12}px`,
        toggle(editor, { setFontSize }) {
          setFontSize(editor, i + 12);
        },
      })),
    },
    {
      key: 'title',
      type: 'option',
      children: <span className="px-[8px] font-bold">Title</span>,
      options: new Array(7).fill(0).map((_, i) => {
        let children;
        switch (i) {
          case 1:
            children = <h1>H1</h1>;
            break;
          case 2:
            children = <h2>H2</h2>;
            break;
          case 3:
            children = <h3>H3</h3>;
            break;
          case 4:
            children = <h4>H4</h4>;
            break;
          case 5:
            children = <h5>H5</h5>;
            break;
          case 6:
            children = <h6>H6</h6>;
            break;
          default:
            children = <span>text</span>;
            break;
        }

        return {
          key: `title-${i}`,
          children,
          toggle(editor, { setTitle }) {
            setTitle(editor, i);
          },
        };
      }),
    },
    {
      key: 'list',
      children: <span className="px-[8px] font-bold">List</span>,
      toggle(editor, { toggleList }) {
        toggleList(editor);
      },
    },
  ];

  // eslint-disable-next-line
  return useMemo(() => baseItems, []);
};

const InsertImageModalButton = () => {
  const { editor } = useEditorContext();
  const baseToggle = useBaseToggle();

  const [open, setOpen] = useState(false);
  const onOpen = useCallback(() => {
    setOpen(true);
  }, []);
  const onCancel = useCallback(() => {
    setOpen(false);
  }, []);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const onOk = () => {
    if (editor && inputRef.current?.value) {
      baseToggle.insertImage(editor, inputRef.current?.value);
      onCancel();
    }
  };

  return (
    <span>
      <Modal
        open={open}
        onCancel={onCancel}
        footer={
          <div className="flex justify-end">
            <button className=" border-1" type="button" onClick={onOk}>
              ok
            </button>
          </div>
        }
      >
        <div className="flex w-[300px]">
          <label className="block w-[90px]">Image URL</label>
          <input
            ref={inputRef}
            className="flex-1 rounded-[4px] outline-none border-[1px] px-[10px]"
          />
        </div>
      </Modal>
      <span onClick={onOpen}>insert image</span>
    </span>
  );
};
