import {Injectable} from '@angular/core';
import {Payment} from '../model/payment';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class PaymentService {
  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  public payment: Payment;
  public paymentMthod: number;

  public constructor(private httpClient: HttpClient) {}

  setPaymentMethod(paymentMethod: number){
    this.paymentMthod = paymentMethod;
  }

  getPaymentMethod(){
    return this.paymentMthod;
  }

}
