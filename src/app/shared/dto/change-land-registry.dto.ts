import {PaymentDto} from './payment-dto';

export class ChangeLandRegistryDto {

  public requestId: number;
  public reasonForChange: string;
  public landRegistryId: number;
  public notaryRequestId: number;
  public status: string;
  public user: string;
  public workflowDescription: string;
  public date: string;
  payment: PaymentDto;

}
