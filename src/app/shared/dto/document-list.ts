export class DocumentDto {
  public status: string;
  constructor(
    public files: File,
    public fileType: number,
  ) {
  }
}
