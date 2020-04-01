import { TrustDto } from "./trust-dto.model";
import { TrusteeDto } from "./trustee-dto.model";
import { BeneficiaryDto } from "./beneficiary-dto.model";
import { BeneficialDto } from "./beneficial-dto.model";
import { CoTrusteeDto } from "./co-trustee-dto.model";
import { BoundaryDto } from "./boundary-dto.model";
import { RemarkDto } from "./remark-dto.model";
import { ExtentDto } from "./extent-dto.model";
import { GrantorDto } from "./grantor-dto.model";
import { GranteeDto } from "./grantee-dto.model";
import { OldTrusteeDto } from "./old-trustee-dto.model";
import { PropertyDto } from "./property-dto.model";
import { TrusterDto } from "./truster-dto.model";

export class TransactionDto {
    
    public transactionId: number;
    public trustAuthors: TrustDto[];
    public trustees: TrusteeDto[];
    public trusters: TrusterDto[];
    public coTrustees: CoTrusteeDto[];
    public oldTrustees: OldTrusteeDto[];
    public beneficiary: BeneficiaryDto[];
    public beneficialOwner: BeneficialDto[];
    public grantors: GrantorDto[];
    public grantees: GranteeDto[];
    public boundary: BoundaryDto;
    public particulars: string;
    public remarks: RemarkDto;
    public extent: ExtentDto;
    public user: string;
    public folioNo: string;
    public completeStatus: string;
    public requestId: number;
    public propertyDetail: PropertyDto;
    public remark: string;
    public broughtForwardFolios: {
        folioCode: string,
        note: string,
        forNew: boolean,
        crossNoteId: number,
        folioNo: string        
    }[];
    public notificationFolioNo: string;
    public notificationTransactionId: number;
    public scheduleType: string;
}
