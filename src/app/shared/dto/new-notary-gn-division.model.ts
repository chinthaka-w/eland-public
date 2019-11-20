import { GnDivision} from './gn-division.model';
import {GnDivisionDTO} from './gn-division-dto';

export class NewNotaryGnDivisionDTO {
  constructor(
    public dsDivisionId: number,
    public dsDivisionDescription: string,
    public gnDivisions: GnDivisionDTO [] = [],
  ) {}
}
