export class WorkflowStageDocDto {

  constructor(
    public docTypeId: number,
    public description: string,
    public descriptionSin: string,
    public descriptionTam: string,
    public required: boolean,
  ) {}

}
