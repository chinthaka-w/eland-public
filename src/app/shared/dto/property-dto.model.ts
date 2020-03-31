export class PropertyDto {

    public isLand: number;
    public remark: string;
    public name: string;
    public landName: string;
    public village: number;
    public street: string;
    public pattu: number;
    public korale: number;
    public lotNo: string;
    public landNo: string;
    public asstNo: string;
    public planNo: string;
    public titlePlanNo: string;
    public planDate: string;
    public nameOfSurveyor: string;
    public value: number;
    public registrationPlanNo: number;
    public nameOfInserted: string;
    public statementOfClaimNo: number;
    public allotmentNo: number;
    public surveyedAndPartitionedDate: string;
    public partitionedDate: string;
    public crossNoteList: {
        folio: string,
        crossNote: string
    }[];
    public surveyPlanNo: number;
    public surveyPlanDate: string;
    public numberOfStoreys: number;
    public numberOfBasements: number;
    public nameOfScheme: string;
    public numberOfBlock: number;
    public dateOfGrant: string;
    public grantNo: string;
    public nameOfArchitect: string;
    public grantDate: string;
}
