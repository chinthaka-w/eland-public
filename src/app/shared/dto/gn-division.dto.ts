export class GnDivisionDTO {
  public descriptionSinhala: string;
  public descriptionTamil: string;
  constructor(
    public gnDivisionId: number,
    public dsDivision: string,
    public gnDivisionCode: string,
    public description: string,
    public descriptionSin: string,
    public descriptionTam: string,
    public dsDivisionId: number,
    public state: string,
    public lastUpdatedUser: string,
  ) {}
}
