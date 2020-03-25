import { FileMeta } from './file-meta.model';
export class CorrectionDetail {
    landRegId: number;
    folioNo: string;
    dayBookNo: string;
    deedNo: string;
    notaryName: string;
    attestedDate: string;
    correctionNature: string;
    requestedCorrection: string;
    recaptcha: string;
    filesMeta: FileMeta[];
    userRoleCode: string;
    userId: number;
}
