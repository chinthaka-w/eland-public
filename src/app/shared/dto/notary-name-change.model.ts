import {DsGnDivisionDTO} from "./gs-gn-model";
import {NewNotaryDsDivisionDTO} from "./new-notary-ds-division.model";
import {PaymentDto} from "./payment-dto";

export class NotaryNameChangeModel {
  public notaryNameChangeRequestId: number;
  public judicialZoneId: number;
  public workflowDescription: string;
  public requestId: number;
  public title: string;
  public date: string;
  public newFullNameSin: string;
  public newFullNameTam: string;
  public newFullNameEng: string;
  public newInitialNameSin: string;
  public newInitialNameTam: string;
  public newInitialNameEng: string;
  public notarialWorkStartDate: Date;
  public certificateYear: Date;
  public nameOfLr: string;
  public landRegistry: number;
  public fromDate: Date;
  public toDate: Date;
  public newNotaryId: number;
  public dsGnList: DsGnDivisionDTO[] = [];
  public paymentId: number;
  public newNotaryDsDivisionDTO: NewNotaryDsDivisionDTO[]=[];
  public lastUpdatedUser: string;
  public juducialZoneDescription: string;
  public workflowStageCode: string;
  public  payment: PaymentDto;
}
