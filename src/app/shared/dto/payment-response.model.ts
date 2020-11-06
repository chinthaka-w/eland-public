export class PaymentResponse {
  public paymentId: number;
  public deliveryType: number;
  public deliveryFee: any;
  public paymentMethod: number;
  public paymentStatusCode: any;
  public paymentStatusMsg: string;
  public encriptedPaymentResponse: string;
  public clientPaymentRequest: string;
  public applicationAmount: string;
  public serviceFee: string;
  public totalFee: string;
  public ipgName: string;
  public transactionRef: string;
  public deliveryAmount: number;
}
