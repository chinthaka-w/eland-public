export class DocumentDto {
  constructor(
    public files: File[] = [],
    public fileType: number,
  ) {
  }
}
