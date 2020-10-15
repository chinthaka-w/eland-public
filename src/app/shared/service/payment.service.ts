import { RequestResponse } from './../dto/request-response.model';
import { PaymentResponse } from './../dto/payment-response.model';
import { Injectable, EventEmitter } from '@angular/core';
import {PaymentDto} from '../dto/payment-dto';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SysConfigService} from './sys-config.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  public BASE_URL = SysConfigService.BASE_URL + 'payment';

  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  private headersMultipart = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});

  public payment: PaymentDto;
  public paymentMethod: number;

  public constructor(private httpClient: HttpClient) {
  }

  getPaymentDocuments(paymentId: number): Observable<RequestResponse> {
    return this.httpClient.get<RequestResponse>(this.BASE_URL + '/viewPaymentDoc/' + paymentId);
  }

  setPaymentMethod(paymentMethod: number) {
    this.paymentMethod = paymentMethod;
  }

  getPaymentMethod() {
    return this.paymentMethod;
  }

  savePayment(formData: FormData): Observable<any> {
    return this.httpClient.post(this.BASE_URL + '/saveFileAndModel', formData);
  }

  savePayment2(paymentDto: PaymentDto): Observable<any> {
    return this.httpClient.post(this.BASE_URL + '/saveModel', paymentDto);
  }

  confirmOnlinePayment(paymentDto: PaymentDto): Observable<PaymentResponse> {
    return this.httpClient.post<PaymentResponse>(this.BASE_URL + '/payOnline', paymentDto);
  }

  redirectOnlinePayment(formData: FormData): Observable<any> {
    return this.httpClient.post<any>(this.BASE_URL + '/redirect', formData);
  }

  getOnlinePaymentResult(id: number): Observable<PaymentResponse> {
    return this.httpClient.get<PaymentResponse>(this.BASE_URL + '/onlinePaymentResult/' + id);
  }

  // generateEmail(paymentData: PaymentDto)
  generateMail(mailData: PaymentDto): Observable<RequestResponse> {
    return this.httpClient.post<RequestResponse>(this.BASE_URL + '/sendMail', mailData);
  }

}
