import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { RenderElementProps } from 'slate-react';

export default function UploadElement(props: RenderElementProps) {
  const [size, setSize] = useState([100, 100]);

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

  const upload = async () => {
    const { upload } = props.element;
    if (upload) {
      const params = new FormData();
      params.append('file', upload.file);
      for (const key in upload.data) {
        params.append(key, upload.data[key]);
      }
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...upload.headers,
        },
        onUploadProgress: (progressEvent: any) => {
          const persent =
            ((progressEvent.loaded / progressEvent.total) * 100) | 0;
          console.log(persent);
        },
      };
      axios.post(upload.url, params, config).then((response) => {
        var result = response.data;
        if (result.status === 0) {
          console.log(result);
        }
      });
    }
  };

  useEffect(() => {
    upload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div {...props.attributes}>
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

        <div
          style={{
            width: '100%',
            height: '100%',
          }}
        ></div>
      </div>
      <span>{props.children}</span>
    </div>
  );
}
