export class GnDivisionDTO{
  constructor(
    public gnDivisionId: number,
    public dsDivision: string,
    public gnDivisionCode: string,
    public description: string,
    public descriptionSinhala: string,
    public descriptionTamil: string,
    public dsDivisionId: number,
    public state: string,
    public lastUpdatedUser: string,
  ) {}
}
