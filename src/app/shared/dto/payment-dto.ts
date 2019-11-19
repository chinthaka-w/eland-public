
export class PaymentDto {
  constructor(
    public paymentMethod: number,
    public  referenceNo: string,
    public  paymentDate: Date,
    public amount: number,
    public  status: string,
    public  lastUpdatedTime: Date,
    public  createdTime: Date,
    public  bankId: number,
    public  bankBranchId: number,
    public  lastUpdatedUser: string,
  ) {}
}
