export class UserDetails {
  constructor(
    public username: string,
    public password: string,
    public statusCode: string,
    public userroleCode: string,
    public employeeId: number,
    public employeeFirstName: string,
    public employeeLastName: string,
    public landRegistryId: number,
    public authToken: string
  ) {}

}
