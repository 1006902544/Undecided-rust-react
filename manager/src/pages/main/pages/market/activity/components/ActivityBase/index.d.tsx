import { ActivityBaseDetail } from '@/libs/api/schema';

export interface ActivityBaseFormItem extends ActivityBaseDetail {
  cover: Array<{
    name: string;
    url: string;
    response: {
      data: {
        fileName: string;
        url: string;
      };
    };
  }>;
}
