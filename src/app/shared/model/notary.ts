import {NotaryAddressDTO} from './new-notary-address';
import {NewNotaryNameDTO} from './new-notary-name';
import {NewNotaryGnDivisionDTO} from './new-notary-gn-division';

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
     public notaryAddressDTO: NotaryAddressDTO,
     public notaryNameDTO: NewNotaryNameDTO,
     public highCourtZoneId: number,
     public landRegistryId: number,
     public newNotaryGnDivisionDTO: NewNotaryGnDivisionDTO,
     public enrolledDate: Date,
     public subjectPassedDate: Date,
     public subjectMedium: number,
     public status: string,
     public createdTime: Date,
   ) {
   }
}
