import { PropertyDto } from './property-dto.model';
import { TransactionDto } from './transaction-dto.model';
import { ExtentDto } from './extent-dto.model';
import { BoundaryDto } from './boundary-dto.model';

export class FolioDto {

    public scheduleType: string;
    public folioNo: string;
    public folioCode: string;
    public folioVolume: string;
    public folioProvince: string;
    public folioDistrict: string;
    public folioLandRegistry: number;
    public folioDsDivision: number;
    public folioGnDivision: number;
    public folioProvincialCouncil: number;
    public name: string;
    public address: string;
    public purpose: string;
    public requestId: number;
    public user: string;
    public remark: string;
    public completeStatus: string;
    public transactions: TransactionDto[];
    public folioLrDivision: number;
    public broughtForwardFolios: {
        folioCode: string,
        note: string,
        forNew: boolean,
        crossNoteId: number,
        folioNo: string
    }[];
    public propertyDetail: PropertyDto;
    public extent: ExtentDto;
    public boundary: BoundaryDto;
    public numberOfStoreys: number;
    public numberOfBasements: number;
    public nameOfScheme: string;
    public numberOfBlock: number;
    public units: {
        unitNoOrSymbol: string,
        floorArea: string
    }[];
    public isCollapsed: boolean;
    public isAvailable: boolean;
    public wardName: string;
    public wardNumber: number;
    public folioTypeId: number;
}
