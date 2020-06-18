export class WorkflowStageDocDto {
  public descriptionSin: string;
  public descriptionTam: string;
  public invalid: boolean;
  public selected: boolean;

  constructor(
    public docId: number,
    public docTypeId: number,
    public description: string,
    public required: boolean,
  ) {}

  }
