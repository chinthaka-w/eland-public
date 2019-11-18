import {NewNotaryPayment} from './new-notary-payment';
import {Bank} from './bank';
import {BankBranch} from './bank-branch';

export class Payment {
  constructor(
    paymentId: number,
    paymentMethod: number,
    referenceNo: string,
    paymentDate: Date,
    amount: number,
    status: string,
    lastUpdatedTime: Date,
    createdTime: Date,
    newNotaryPaymentCollection: NewNotaryPayment[] = [],
    bankId: number,
    bankBranchId: number,
    lastUpdatedUser: string,
  ) {}
}
