export class DocumentDto {
  public status: string;
  public fileName:string;
  public fileBase64:any;
  public fileFormats:string;
  constructor(
    public files: File,
    public fileType: number,
  ) {
  }
}
