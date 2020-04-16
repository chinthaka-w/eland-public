export class RequestSearchDetailDTO {
  public workflowStage: string;
  public id: number;
  constructor(
    public notaryId: number,
    public requestId: number,
    public notaryCode: string,
    public name: string,
    public paymentMethod: string,
    public workflow: string,
    public status: string,
    public statusDescription: string,
    public date: Date,
  ){}
}
