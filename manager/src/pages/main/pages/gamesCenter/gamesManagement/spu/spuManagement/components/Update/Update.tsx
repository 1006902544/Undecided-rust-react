import {
  ProFormDraggerUpload,
  ProFormEditor,
  ProFormSelectList,
  ProFormTextNumber,
  Toolbar,
} from '@/components';
import {
  ProForm,
  ProFormDateTimePicker,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Col, Modal, Row, Spin, message } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useMutation } from '@tanstack/react-query';
import { useGetSpuDetail, updateSpu } from '@/libs/api';
import type { SpuUpdateRes, UpdateSpuReq } from '@/libs/api/schema';
import type { FormFinish } from './Update.d';
import { useLocation, useNavigate } from 'react-router-dom';
import qs from 'query-string';
import { UpdateRecordModal } from './components';

export default function Update() {
  const [form] = ProForm.useForm<FormFinish>();
  const navigate = useNavigate();
  const { search } = useLocation();
  const { id }: { id?: string } = qs.parse(search);

  const back = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  //init
  const { data: initial, isLoading: initialLoading } = useGetSpuDetail(
    { id: id as string },
    { query: { enabled: !!id } }
  );

  const initialValues = useMemo(() => {
    if (!initial || !id) {
      return {};
    }
    const { data } = initial;

    const res = {
      ...data,
      companyId: data.company_id?.toString(),
      cover: [
        {
          url: data.cover.url,
          name: data.cover.name,
          status: 'done',
          uid: data.cover.name + data.id,
          response: {
            data: {
              url: data.cover.url,
              fileName: data.cover.name,
            },
          },
        },
      ],
      carousel: data.carousel.map(({ url, name }) => ({
        url,
        name,
        uid: name + data.id,
        response: { data: { url, fileName: name } },
        status: 'done',
      })),
      typeIds: data.type_ids,
      tagIds: data.tag_ids,
      issueTime: data.issue_time,
    };
    return res;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial, id]);

  useEffect(() => {
    form.resetFields();
  }, [initial, id, form]);

  //update
  const { mutate, isLoading } = useMutation({
    mutationFn: (data: UpdateSpuReq) => {
      return updateSpu(data);
    },
    onSuccess(res) {
      message.success(res.message);
      if (id) {
        setEditRes(res.data);
        Modal.confirm({
          onOk() {
            setOpen(true);
          },
          onCancel() {
            back();
          },
          okText: 'Ok',
          cancelText: 'Cancel',
          title: 'UpdateRecord',
          content: 'Do you what to create an UpdateRecord ?',
        });
      } else {
        back();
      }
    },
  });

  const onFinish = useCallback(
    async (formData: FormFinish) => {
      const cover = {
        name: formData.cover[0].response?.data.fileName!,
        url: formData.cover[0].response?.data.url!,
      };
      const curParams: UpdateSpuReq = {
        id,
        name: formData.name,
        price: formData.price,
        cover,
        issue_time: formData.issueTime,
        company_id: formData.companyId?.toString(),
        type_ids: formData.typeIds,
        tag_ids: formData.tagIds,
        carousel: formData.carousel.map((item) => ({
          name: item.response?.data.fileName!,
          url: item.response?.data.url!,
        })),
        description: formData.description,
      };
      mutate(curParams);
    },
    [id, mutate]
  );

  //after update
  const [open, setOpen] = useState(false);
  const [editRes, setEditRes] = useState<SpuUpdateRes>({});

  return (
    <Container
      form={form}
      initialValues={initialValues}
      onFinish={onFinish as any}
      layout="horizontal"
      labelCol={{ flex: '120px' }}
      submitter={{
        render() {
          return (
            <div className="border-t-[1px] border-t-[#f0f0f0] flex justify-end pt-[20px] space-x-[32px]">
              <Button loading={isLoading} onClick={back}>
                Cancel
              </Button>
              <Button htmlType="reset" loading={isLoading}>
                Reset
              </Button>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                Submit
              </Button>
            </div>
          );
        },
      }}
    >
      <Spin spinning={initialLoading && !!id} size="large">
        <Row>
          <Col span={24}>
            <h1 className="mb-[40px] text-center">Update SPU</h1>
          </Col>

          <Col span={8}>
            <ProFormText
              label="Name"
              name="name"
              fieldProps={{ showCount: true, minLength: 1, maxLength: 50 }}
              rules={[
                {
                  required: true,
                  message: 'please input name',
                },
              ]}
            />
          </Col>
          <Col span={16} />

          <Col span={8}>
            <ProFormTextNumber
              label="Price"
              name="price"
              fieldProps={{
                addonAfter: '$',
                precision: 2,
                max: 99999,
                min: 0,
              }}
            />
          </Col>
          <Col span={16} />

          <Col span={8}>
            <ProFormDraggerUpload
              required
              name="cover"
              label="Cover"
              fieldProps={{ maxCount: 1 }}
            />
          </Col>
          <Col span={16} />

          <Col span={8}>
            <ProFormDateTimePicker
              label="IssueTime"
              name="issueTime"
              rules={[
                {
                  required: true,
                  message: 'please chose issueTime',
                },
              ]}
            />
          </Col>
          <Col span={16} />

          <Col span={8}>
            <ProFormSelectList
              keyCode="company"
              name="companyId"
              label="Company/Studio"
            />
          </Col>
          <Col span={16} />

          <Col span={8}>
            <ProFormSelectList
              keyCode="type"
              name="typeIds"
              label="Types"
              mode="multiple"
              rules={[
                {
                  required: true,
                  message: 'please chose types for spu',
                },
              ]}
            />
          </Col>

          <Col span={8}>
            <ProFormSelectList
              keyCode="tag"
              name="tagIds"
              label="Tags"
              mode="multiple"
              rules={[
                {
                  required: true,
                  message: 'please chose tags for spu',
                },
              ]}
            />
          </Col>
          <Col span={8} />

          <Col span={8}>
            <ProFormDraggerUpload
              required
              name="carousel"
              label="Carousel"
              fieldProps={{ maxCount: 9 }}
            />
          </Col>
          <Col span={16} />

          <Col span={16}>
            <ProFormEditor
              name="description"
              label="Description"
              fieldProps={{
                children: <Toolbar />,
              }}
            />
          </Col>
        </Row>
      </Spin>

      <UpdateRecordModal
        open={open}
        setOpen={setOpen}
        spuId={editRes.id!}
        spuName={editRes.name!}
        onCancel={back}
        onOk={back}
      />
    </Container>
  );
}

const Container = styled(ProForm)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .ant-spin-nested-loading {
    flex: 1 1 0%;
    height: 0;
    overflow-y: scroll;
  }

  > .ant-row {
    flex: 1 1 0%;
    height: 0;
    overflow-y: scroll;
  }

  .ant-picker {
    width: 100%;
  }

  .ant-form-item {
    margin-bottom: 40px;
  }

  .ant-input-number {
    width: 100%;
  }

  .ant-input-number-group-wrapper {
    width: 100%;
  }
`;
