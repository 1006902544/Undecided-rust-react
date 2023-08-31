import { PriFile } from '@/components/DraggerUpload';

export interface FormFinish {
  name: string;
  price: number;
  cover: PriFile[];
  issueTime: string;
  companyId?: string;
  typeIds: string[];
  tagIds: string[];
  carousel: PriFile[];
  description?: string;
}
