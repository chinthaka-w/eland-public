import {PaymentDto} from "./payment-dto";

export class CitizenDTO {
  id: number;
  landRegistry: number;
  userType: number;
  identificationNoType: number;
  notaryId: string;
  bankUserType: number;
  identificationNo: string;
  passportNo: string;
  drivingLicenceNo: string;
  nameEng: string;
  nameTam: string;
  nameSin: string;
  addressSin: string;
  addressEng: string;
  addressTam: string;
  residentialTelephone: string;
  mobileNo: string;
  email: string;
  reason: string;
  workFlowStageCode: string;
  status: string;
  remark: string;
  username: string;
  paymentType: number;
  amount: number;
  paymentDate: string;
  bankReceiptNo: string;
  bankId: number;
  bankBranchId: number;
  user: string;
  dateOfBirth: string;
  lawFirmName: string;
  stateInstituteName: string;
  otherInstituteName: string;
  officerDesignation: string;
  paymentDTO: PaymentDto;
}
