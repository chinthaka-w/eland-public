import {GnDivisionDTO} from './gn-division.dto';

export class NewNotaryDsDivisionDTO {
  public dsDivisionDescriptionSin: string;
  public dsDivisionDescriptionTam: string;
  constructor(
    public dsDivisionId: number,
    public dsDivisionDescription: string,
    public gnDivisions: GnDivisionDTO [] = [],
  ) {}
}
