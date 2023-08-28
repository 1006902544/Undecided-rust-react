import { PriFile } from '@/components/DraggerUpload';

export interface FormFinish {
  name: string;
  price: number;
  cover: PriFile[];
  issueTime: string;
  companyId?: number;
  typeIds: number[];
  tagIds: number[];
  carousel: PriFile[];
  description?: string;
}
