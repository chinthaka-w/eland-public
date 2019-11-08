export class NameTitleDTO {
  constructor(
    public nameTitleId: number,
    public titleEng: string,
    public titleSin: string,
    public titleTam: string,
    public status: string,
    public createdTime: Date,
    public lastUpdatedUser: string,
  ) {}
}
