export class RequestSearchDetailDTO {
  constructor(
    public notaryId: number,
    public id: number,
    public name: string,
    public paymentMethod: string,
    public status: string,
    public date: Date,
  ){}
}
