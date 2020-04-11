export class PaymentDto {
  public paymentId: number;
  public paymentMethod: number;
  public paymentMethodDes: string;
  public bankId: number;
  public bankBranchId: number;
  public referenceNo: string;
  public paymentDate: Date;
  public applicationAmount: number;
  public deliveryType: number;
  public deliveryAmount: number;
  public totalAmount: number;
  public files:File[];
  public status: string;
  public lastUpdatedTime: Date;
  public lastUpdatedUser: string;
  public createdTime: Date;
  public transactionRef: number;
  public serviceCode: string;
  public returnUrl: string;
  public workflowStageCode: string;
  public userId: string;
  public userType: string;
}
