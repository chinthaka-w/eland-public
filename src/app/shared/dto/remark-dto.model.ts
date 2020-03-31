export class RemarkDto {
    public remark: string;
    public referenceList: {
        folio: string,
        description: string
    }[]
}
