import React, { useCallback, useMemo, useState } from 'react';
import type { RenderElementProps } from 'slate-react';
import './style.scss';

export default function ImageElement(props: RenderElementProps) {
  const [size, setSize] = useState([100, 100]);

  console.log(props.element.upload);

  const buttonStyle = useMemo(
    () => ({
      backgroundColor: 'rgba(0,0,0,0.3)',
      marginRight: 10,
      height: '100%',
      paddingLeft: 10,
      paddingRight: 10,
      borderRadius: '4px 4px 0 0',
      color: 'white',
    }),
    []
  );

  const changeSize = useCallback((size: [number, number]) => {
    setSize([size[0] <= 0 ? 0 : size[0], size[1] <= 0 ? 0 : size[1]]);
  }, []);

  return (
    <div style={{ display: 'inline-block' }} {...props.attributes}>
      <div
        contentEditable={false}
        style={{
          maxWidth: size[0],
          maxHeight: size[1],
          flexShrink: 0,
          display: 'inline-block',
          position: 'relative',
        }}
        className="editable-image-container"
      >
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              height: 20,
              top: -20,
              display: 'none',
              width: '100%',
            }}
            className="editable-image-handles"
          >
            <button
              className="editable-image-handle-button"
              style={buttonStyle}
              onClick={() => changeSize([size[0] - 20, size[1] - 20])}
            >
              -
            </button>
            <button
              className="editable-image-handle-button"
              style={{ ...buttonStyle, marginRight: 0 }}
              onClick={() => changeSize([size[0] + 20, size[1] + 20])}
            >
              +
            </button>
          </div>
        </div>

        <img
          alt=""
          src={props.element.url}
          style={{ objectFit: 'contain', width: '100%', height: '100%' }}
        />
      </div>
      <span>{props.children}</span>
    </div>
  );
}
