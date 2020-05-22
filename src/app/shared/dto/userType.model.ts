export class UserTypeModel {
  public email: string;
  public userType: string;


  constructor(email: string, userType: string) {
    this.email = email;
    this.userType = userType;
  }
}
