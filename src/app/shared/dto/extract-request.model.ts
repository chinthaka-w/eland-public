import {PaymentDto} from './payment-dto';

export class ExtractRequest {
  public requestId: number;
  public landRegistryId: number;
  public requestType: number;
  public requestTypeDes: string;
  public attestedByNotaryName: string;
  public practicedLocation: string;
  public numberOfTheDeed: string;
  public natureOfTheDeed: string;
  public probablePeriodFrom: string;
  public probablePeriodTo: string;
  public nameOfTheGranter: string;
  public nameOfTheGrantee: string;
  public nameOfTheLand: string;
  public extent: string;
  public paththuId: number;
  public koraleId: number;
  public dsDivisionId: number;
  public gnDivisionId: number;
  public villageId: number;
  public searchReasonId: any;
  public lrDivisionId: any;
  public volume: any;
  public folioNo: any;
  public folioNoStatus: any;
  public folioNoStatusDes: string;
  public noOfYears: any;
  public workflowStageCode: string;
  public date: string;
  public workflowDescription: string;
  public userId: number;
  public userType: string;
  public remark: string;
  public lastUpdatedUser: string;
  public paymentId: number;
  public paymentList: number[];
  public folioList: any[];
  public payment: PaymentDto;
}
