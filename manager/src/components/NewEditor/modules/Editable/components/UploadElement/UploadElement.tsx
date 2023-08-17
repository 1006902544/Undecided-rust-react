import type { PriFile } from '../../../../index.d';
import axios from 'axios';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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

  const [percent, setPercent] = useState(0);
  const [file, setFile] = useState<PriFile | undefined>(undefined);

  const upload = async (file: PriFile) => {
    const { upload } = props.element;

    if (upload) {
      const params = new FormData();
      params.append('file', file);
      for (const key in upload.data) {
        params.append(key, upload.data[key]);
      }
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...upload.headers,
        },
        onUploadProgress: (progressEvent: any) => {
          const percent =
            ((progressEvent.loaded / progressEvent.total) * 100) | 0;
          setPercent(percent);
        },
      };
      axios.post(upload.url, params, config).then((response) => {
        const result = response.data;
        file.response = result;
        if (props.element.upload?.requests) {
          const res = props.element.upload?.requests(file);
          setFile(res);
        }
      });
    }
  };

  useEffect(() => {
    uploadRef.current?.click();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uploadRef = useRef<null | HTMLInputElement>(null);

  const renderElement = useMemo(() => {
    if (percent === 100 && file) {
      if (props.element.upload?.fileRender) {
        return props.element.upload?.fileRender(file);
      } else {
        return (
          <img
            alt=""
            src={file.url}
            style={{ objectFit: 'contain', width: '100%', height: '100%' }}
          />
        );
      }
    } else {
      <>
        <input
          type="file"
          ref={uploadRef}
          style={{ display: 'none' }}
          onChange={(e) => {
            console.log(e);
            const file = e.target.files?.[0];
            if (file) {
              upload(file);
            }
          }}
        />
        <div
          style={{
            width: `${percent}%`,
            height: 8,
            borderRadius: 8,
            backgroundColor: 'blue',
          }}
        ></div>
      </>;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percent, file]);

  return (
    <div style={{ display: 'inline-block' }} {...props.attributes}>
      <div
        contentEditable={false}
        style={{
          width: size[0],
          height: size[1],
          flexShrink: 0,
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
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'center',
          }}
        >
          <input
            type="file"
            ref={uploadRef}
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                upload(file);
              }
            }}
          />

          {renderElement as any}
        </div>
      </div>

      {props.children}
    </div>
  );
}
