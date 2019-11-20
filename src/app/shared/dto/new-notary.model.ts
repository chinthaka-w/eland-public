export class NewNotary {
  constructor(
    public newNotaryId: number,
    public newNotaryRegistrationRequestId: number,
    public newNotaryCode: string,
    public nic: string,
    public email: string,
    public dateOfBirth: Date,
    public mobile: string,
    public contactNo: string,
    public highCourtZoneId: number,
    public landRegistryId: number,
    public dsDivisionId: number,
    public gnDivisionId: number,
    public enrolledDate: Date,
    public subjectPassedDate: Date,
    public subjectMedium: number,
    public status: string,
    public createdTime: Date,
  ) {}
}
