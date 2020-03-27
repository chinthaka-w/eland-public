export class FileModel {
  public base64: string;
  public fileName: string;
  constructor(
    public file: File,
    public fileType: number,
  ) {}
}
