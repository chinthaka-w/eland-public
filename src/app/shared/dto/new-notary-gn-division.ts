import { GnDivision} from '../model/gn-division';

export class NewNotaryGnDivisionDTO {
  constructor(
    public dsDivisionId: number,
    public dsDivisionDescription: string,
    public gnDivisions: GnDivision [] = [],
  ) {}
}
