import {Injectable} from '@angular/core';
import {PaymentDto} from '../dto/payment-dto';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from "rxjs";
import {SysConfigService} from './sys-config.service';

@Injectable()
export class PaymentService {

  public BASE_URL = SysConfigService.BASE_URL +'payment';

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

  savePayment(payment: PaymentDto): Observable<any> {
    return this.httpClient.post(this.BASE_URL + '/save' , payment, {responseType: 'text', headers: this.headersJson});
  }

}
