export class NotaryAddressDTO {
  constructor(
    public newNotaryAddressId: number,
    public permanentAddress: string,
    public currantAddress: string,
    public language: number,
    public status: string,
    public newNotaryId: number,
  ) {}
}
