import {NotaryAddressDTO} from '../dto/new-notary-address-dto';
import {NewNotaryNameDTO} from '../dto/new-notary-name';
import {NewNotaryGnDivisionDTO} from '../dto/new-notary-gn-division';

export class Notary {
   constructor(
     public newNotaryId: number,
     public newNotaryRegistrationRequestId: number,
     public newNotaryCode: string,
     public nic: string,
     public email: string,
     public dateOfBirth: Date,
     public mobile: string,
     public contactNo: string,
     public permanentAddressEng: string,
     public currantAddressEng: string,
     public permanentAddressSin: string,
     public currantAddressSin: string,
     public permanentAddressTam: string,
     public currantAddressTam: string,
     public fullNameEng: string,
     public fullNameSin: string,
     public fullNameTam: string,
     public nameWithInitialEng: string,
     public nameWithInitialSin: string,
     public nameWithInitialTam: string,
     public titleEng: string,
     public titleSin: string,
     public titleTam: string,
     public judicialZoneId: number,
     public landRegistryId: number,
     public newNotaryGnDivisionDTO: NewNotaryGnDivisionDTO [] = [],
     public language: number,
     public enrolledDate: Date,
     public subjectPassedDate: Date,
     public subjectMedium: number,
     public status: string,
     public createdTime: Date,
     public lastUpdatedUser: string,
     public userName: string,
   ) {
   }
}
