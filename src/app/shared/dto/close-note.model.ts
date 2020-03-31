export class CloseNote {
    public note: string;
    public broughtForwardFolios: {
        folioCode: string,
        note: string,
        forNew: boolean,
        crossNoteId: number,
        folioNo: string
    }[];
    public user: string;
    public requestId: number;
    public transactionId: number;
    public folioNo: string;
}
