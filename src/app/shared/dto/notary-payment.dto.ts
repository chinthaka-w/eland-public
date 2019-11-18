import {PaymentDto} from './payment-dto';
import {Notary} from '../model/notary';

export class NotaryPaymentDto {
  constructor(
    public newNotary: Notary,
    public payment: PaymentDto,
  ) {}
}
