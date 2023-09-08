import { ActivityUpdateStepTwoReq } from '@/libs/api/schema';

export interface ActivityInfoFormItem extends ActivityUpdateStepTwoReq {
  time: [string, string];
}
