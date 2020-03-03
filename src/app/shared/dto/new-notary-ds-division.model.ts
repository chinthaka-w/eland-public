import {GnDivisionDTO} from './gn-division.dto';

export class NewNotaryDsDivisionDTO {
  constructor(
    public dsDivisionId: number,
    public dsDivisionDescription: string,
    public gnDivisions: GnDivisionDTO [] = [],
  ) {}
}
