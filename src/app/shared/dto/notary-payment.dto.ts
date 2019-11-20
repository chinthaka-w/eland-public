import {PaymentDto} from './payment-dto';
import {Notary} from './notary.model';

export class NotaryPaymentDto {
  constructor(
    public newNotary: Notary,
    public payment: PaymentDto,
  ) {}
}
