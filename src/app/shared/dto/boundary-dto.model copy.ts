import { BoundarySubCategoryDto } from "./boundary-sub-category-dto.model";

export class BoundaryDto {

    public boundaryType: number;
    
    public boundaryList: BoundarySubCategoryDto;

    public optionalList: {
        key: string,
        value: string
    }[]
}
