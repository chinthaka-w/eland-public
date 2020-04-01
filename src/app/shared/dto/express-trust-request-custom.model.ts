export class ExpressTrustRequestCustomModel {
  public categorySin: string;
  public subCategorySin: string;
  public documentTypeSin: string;
  public documentNatureSin: string;
  public documentSubNatureSin: string;
  public deedLanguageSin: string;
  public remark: string;

  constructor(
    public requestId: number,
    public serviceNo: number,
    public applicantName: string,
    public applicantNic: string,
    public applicantTelephone: string,
    public applicantEmail: string,
    public applicantPaymentMode: string,
    public applicantTotalAmount: string,
    public category: string,
    public subCategory: string,
    public documentType: string,
    public documentTypeId: number,
    public documentNature: string,
    public documentSubNature: string,
    public attestedDate: string,
    public deedNo: string,
    public deedLanguage: string,
    public value: string,
    public stampFee: string,
    public duplicateStampFee: string,
    public provinceCode: string,
    public province: string,
    public districtCode: string,
    public district: string,
    public dsDivisionId: number,
    public dsDivision: string,
    public landRegistryId: number,
    public landRegistry: string,
    public landRegistryDivisionId: number,
    public landRegistryDivision: string,
    public gnDivisionId: number,
    public gnDivisionCode: number,
    public gnDivision: string,
    public provincialCouncilId: number,
    public provincialCouncilCode: string,
    public provincialCouncil: string,
    public landRegistryDivisionDes: string,
    public particular: string,
    public registrationTypeCode: string,
    public documentNatureId: number
  ) {
  }
}
