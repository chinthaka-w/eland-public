import {DsGnDivisionDTO} from './gs-gn-model';
import {NewNotaryDsDivisionDTO} from './new-notary-ds-division.model';

export class JudicialChange {
  public judicialZoneId: number;
  public workflowDescription: string;
  public requestId: number;
  public date: string;
  public judicialZoneDescription: string;
  public addressEng: string;
  public addressSin: string;
  public addressTam: string;
  public notarialWorkStartDate: Date;
  public certificateYear: Date;
  public nameOfLr: string;
  public isDuplicateHandedOver: string;
  public landRegistry: number;
  public fromDate: Date;
  public toDate: Date;
  public newNotaryId: number;
  public dsGnList: DsGnDivisionDTO[] = [];
  public paymentId: number;
  public newNotaryDsDivisionDTO: NewNotaryDsDivisionDTO[]=[];
}
