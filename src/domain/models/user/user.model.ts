import { StatusEnum } from '@transaction-service/domain/enums';

export interface UserModel {
  id: string;
  clientId: string;
  bankAccount: string;
  digit: string;
  status: StatusEnum;
  createdAt: Date;
}
