export class SearchRequest {
  public landRegistryId: number;
  public requestType: number;
  public attestedByNotaryName: string;
  public practicedLocation: string;
  public numberOfTheDeed: number;
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
  public searchReasonId: number;
  public workflowStageCode: string;
  public paymentId: number;
  public folioList: any[];
}
