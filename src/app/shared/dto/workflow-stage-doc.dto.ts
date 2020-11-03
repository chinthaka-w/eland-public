export class WorkflowStageDocDto {
  public descriptionSin: string;
  public descriptionTam: string;
  public invalid: boolean;
  public selected: boolean;
  public error: boolean;
  public errorMsg: any;
  public file: any;
  public fileBase64:any;
  public fileFormats:string;
  public fileName:string;

  constructor(
    public docId: number,
    public docTypeId: number,
    public description: string,
    public required: boolean,
  ) {}

  }
