export class WorkflowStageDocDto {
  constructor(
    public docId: number,
    public docTypeId: number,
    public description: string,
    public required: string,
  ) {}

  }
