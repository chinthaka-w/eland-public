export class RequestSearchDetailDTO {
  constructor(
    public notaryId: number,
    public requestId: number,
    public notaryCode: string,
    public name: string,
    public paymentMethod: string,
    public workflow: string,
    public status: string,
    public date: Date,
  ){}
}
