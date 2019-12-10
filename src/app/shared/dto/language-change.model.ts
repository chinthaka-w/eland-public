import {StatusDTO} from './status-dto';

export class LanguageChange {
  public id: number;
  public title: number;
  public langEng: boolean;
  public langSin: boolean;
  public langTam: boolean;
  public fullNameEng: string;
  public fullNameSin: string;
  public fullNameTam: string;
  public nameWithInitEng: string;
  public nameWithInitSin: string;
  public nameWithInitTam: string;
  public addPermanentEng: string;
  public addPermanentSin: string;
  public addPermanentTam: string;
  public addressEng: string;
  public addressSin: string;
  public addressTam: string;
  public startingDate: string;
  public highCourtCertificateYear: number;
  public lrName: string;
  public returnAttestedStatus: string;
  public unavailableTimePeriod: string;
  public date: string;
  public workflowStage: string;
  public status: StatusDTO;
}
