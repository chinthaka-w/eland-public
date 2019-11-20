export class NewNotaryGnDivisionDTO {
  constructor(
    public newNotaryGnDivisionId: number,
    public status: string,
    public createdTime: Date,
    public dsDivisionId: number,
    public gnDivisionId: number,
    public newNotaryId: number,
  ) {}
}
