export class DocumentResponseDto {
  constructor(
    public docId: number,
    public docTypeId: number,
    public files: File,
    public status: string
  ){}
}
