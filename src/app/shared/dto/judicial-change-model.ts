import {DsGnDivisionDTO} from './gs-gn-model';

export class JudicialChange {
  public judicialZoneId: number;
  public workflowDescription: string;
  public notaryRequestID: number;
  public date: string;
  public judicialZoneDescription: string;
  public addressEng: string;
  public addressSin: string;
  public addressTam: string;
  public notarialWorkStartDate: string;
  public certificateYear: string;
  public nameOfLr: string;
  public isDuplicateHandedOver: string;
  public landRegistry: number;
  public fromDate: string;
  public toDate: string;
  public newNotaryId: number;
  public dsGnList: DsGnDivisionDTO[] = [];
  public paymentId: number;
}
