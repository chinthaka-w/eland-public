import { CorrectionDetail } from 'src/app/shared/dto/correction-detail.model';
export class CorrectionRequest {
    public id: number;
    public userId: number;
    public workflowStageCode: string;
    userType: string;
    public correctionDetails: CorrectionDetail[];
}
