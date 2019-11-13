import {NameTitleDTO} from './name-title';


export class NewNotaryNameDTO {
  constructor(
    public newNotaryNameId: number,
    public fullName: string,
    public nameWithInitial: string,
    public  language: number,
    public status: string,
    public nameTitleDTO: NameTitleDTO,
    public newNotaryId: number,
  ) {}
}
