import { Component, OnInit, Input } from '@angular/core';
import { UiController } from '../../custom-model/ui-controller.model';
import { TrustDto } from 'src/app/shared/dto/trust-dto.model';
import { TrusteeDto } from 'src/app/shared/dto/trustee-dto.model';
import { TrusterDto } from 'src/app/shared/dto/truster-dto.model';
import { CoTrusteeDto } from 'src/app/shared/dto/co-trustee-dto.model';
import { OldTrusteeDto } from 'src/app/shared/dto/old-trustee-dto.model';
import { BeneficialDto } from 'src/app/shared/dto/beneficial-dto.model';
import { BeneficiaryDto } from 'src/app/shared/dto/beneficiary-dto.model';
import { PropertyDto } from 'src/app/shared/dto/property-dto.model';
import { BoundaryDto } from 'src/app/shared/dto/boundary-dto.model';
import { ExtentDto } from 'src/app/shared/dto/extent-dto.model';
import { TransactionDto } from 'src/app/shared/dto/transaction-dto.model';
import { RemarkDto } from 'src/app/shared/dto/remark-dto.model';
import { ParticularDto } from 'src/app/shared/dto/particular-dto';
import { GrantorDto } from 'src/app/shared/dto/grantor-dto.model';
import { GranteeDto } from 'src/app/shared/dto/grantee-dto.model';
import { UnitDto } from 'src/app/shared/dto/unit-dto.model';
import { CloseNote } from 'src/app/shared/dto/close-note.model';
import { FolioDto } from '../../dto/folio-dto.model';
import { DocumentType } from 'src/app/shared/enum/document-type.enum';
import { DocumentNatures } from 'src/app/shared/enum/document-nature.enum';

@Component({
  selector: 'app-transaction-view',
  templateUrl: './transaction-view.component.html',
  styleUrls: ['./transaction-view.component.css']
})


export class TransactionViewComponent implements OnInit {

  @Input()
  uiController: UiController;

  @Input()
  transactionDto: FolioDto;

  public trustDto = new TrustDto;
  public trustList: TrustDto[] = [];
  public trusteeDto = new TrusteeDto;
  public trusteeList: TrusteeDto[] = [];
  public trusterDto = new TrusterDto;
  public trusterList: TrusterDto[] = [];
  public coTrusteeDto = new CoTrusteeDto;
  public coTrusteeList: CoTrusteeDto[] = [];
  public oldTrusteeDto = new OldTrusteeDto;
  public oldTrusteeList: OldTrusteeDto[] = [];
  public beneficialDto = new BeneficialDto;
  public beneficialList: BeneficialDto[] = [];
  public beneficiaryDto = new BeneficiaryDto;
  public beneficiaryList: BeneficiaryDto[] = [];
  public propertyDto = new PropertyDto;
  public boundaryDto = new BoundaryDto;
  public extentDto = new ExtentDto;
  public transaction = new TransactionDto;
  public remark = new RemarkDto;
  public particular = new ParticularDto;
  public grantorDto = new GrantorDto;
  public grantorList: GrantorDto[] = [];
  public granteeDto = new GranteeDto;
  public granteeList: GranteeDto[] = [];
  public closeNote = new CloseNote;
  public unitDto = new UnitDto;

  documentType = DocumentType;
  documentNature = DocumentNatures;

  constructor() { }

  ngOnInit() {
  }

}
