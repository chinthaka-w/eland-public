export class NewNotaryPaymentDto {
  public transactionRef: string;
  public applicationAmount: string;
  public paymentMethod: number;
  constructor(
   public requestId: number,
   public paymentId: number,
  ){}
}
