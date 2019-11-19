import {Injectable} from '@angular/core';
import {PaymentDto} from '../model/payment-dto';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class PaymentService {
  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  public payment: PaymentDto;
  public paymentMethod: number;

  public constructor(private httpClient: HttpClient) {}

  setPaymentMethod(paymentMethod: number){
    this.paymentMethod = paymentMethod;
  }

  getPaymentMethod() {
    return this.paymentMethod;
  }

}
