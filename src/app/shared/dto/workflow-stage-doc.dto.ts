export class WorkflowStageDocDto {
  public descriptionSin: string;
  public descriptionTam: string;
  constructor(
    public docId: number,
    public docTypeId: number,
    public description: string,
    public required: boolean,
  ) {}

  }
