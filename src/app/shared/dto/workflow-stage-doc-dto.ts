export class WorkflowStageDocDto {
  public invalid: boolean;
  public selected: boolean;
  public error: boolean;
  public errorMsg: any;
  public file: any;
  public docId: number;

  constructor(
    public docTypeId: number,
    public description: string,
    public descriptionSin: string,
    public descriptionTam: string,
    public required: boolean,
  ) {}

}
