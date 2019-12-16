import {Doc} from "./doc.model";

export class FolioCorrectionModel {
 constructor(
    public  landRegId: string,
    public  deedNo: string,
    public  attestedDate: Date,
    public  notaryName: string,
    public  folioNumbers: string[],
    public  natureOfTheCorrection: string,
    public  requestedCorrection: string,
    public  judicialZoneId: number,
    public  judicialName: string,
    public  citizenId: number,
    public  citizenName: string,
    public  newNotaryId: number,
    public  workflowStageCode: string,
    public  remark: string,
    public  status: string,
    public  lastUpdatedTime: Date,
    public  lastUpdatedUser: string,
    public  createdTime: Date,
){}
}
