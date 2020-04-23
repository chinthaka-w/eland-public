export class FileModel {
  public base64: string;
  public fileName: string;
  public isMandatory: boolean;
  constructor(
    public file: File,
    public fileType: number,
  ) {}
}
