export class WorkflowStageDocDto {

  constructor(
    public docTypeId: number,
    public description: string,
    public required: boolean,
  ) {}

}
