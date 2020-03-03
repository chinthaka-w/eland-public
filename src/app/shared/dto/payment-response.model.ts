export class PaymentResponse {
  public paymentId: number;
  public deliveryType: number;
  public paymentMethod: number;
  public paymentStatusCode: number;
  public paymentStatusMsg: string;
  public encriptedPaymentResponse: string;
  public clientPaymentRequest: string;
  public applicationAmount: string;
  public serviceFee: string;
  public totalFee: string;
  public ipgName: string;
  public transactionRef: string;
}
