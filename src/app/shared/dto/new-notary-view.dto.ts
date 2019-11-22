import {NewNotaryGnDivisionDTO} from "./new-notary-gn-division.model";
import {LanguageDescriptionDto} from "./language-description.dto";

export class NewNotaryViewDto {
 constructor(
   public newNotaryId: number,
  public newNotaryRegistrationRequestId: number,
  public newNotaryCode: string,
  public notaryType: string,
  public nic: string,
  public email: string,
  public dateOfBirth: Date,
  public mobile: string,
  public contactNo: string,
  public permanentAddress: LanguageDescriptionDto,
  public currantAddress: LanguageDescriptionDto,
  public fullName: LanguageDescriptionDto,
  public nameWithInitial: LanguageDescriptionDto,
  public nametitle: LanguageDescriptionDto,
  public judicialZoneId: number,
  public judicialZone: string,
  public landRegistryId: number,
  public landRegistry: string,
  public newNotaryDsDivisionDTO: NewNotaryGnDivisionDTO[]=[],
  public language: string,
  public enrolledDate: Date,
  public subjectPassedDate: Date,
  public subjectMedium: string,
  public status: string,
  public createdTime: Date,
  public lastUpdatedUser: string,
  public workflowStageCode: string,
 ){}
}
