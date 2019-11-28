export class PaymentDto {
  public paymentId: number;
  public paymentMethod: number;
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
}
