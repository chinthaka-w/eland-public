import { Component, OnInit, Input } from '@angular/core';
import { UiController } from 'src/app/shared/custom-model/ui-controller.model';
import { GranteeDto } from 'src/app/shared/dto/grantee-dto.model';
import { SystemService } from 'src/app/shared/service/system.service';
import { PatternValidation } from 'src/app/shared/enum/pattern-validation.enum';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DocumentNatures } from 'src/app/shared/enum/document-nature.enum';
import { FolioDto } from 'src/app/shared/dto/folio-dto.model';

@Component({
  selector: 'app-grantee',
  templateUrl: './grantee.component.html',
  styleUrls: ['./grantee.component.css']
})
export class GranteeComponent implements OnInit {

  @Input()
  uiController: UiController;

  @Input()
  granteeDto: GranteeDto;

  @Input()
  granteeList: GranteeDto[];

  @Input()
  folioDto: FolioDto;

  public isEdit: boolean = false;

  public selectedIndex = -1;

  public form: FormGroup;

  public documentNature = DocumentNatures;

  get name(){
    return this.form.get('name');
  }

  get nic(){
    return this.form.get('nic');
  }

  get addressPermanent(){
    return this.form.get('addressPermanent');
  }

  get addressResidential(){
    return this.form.get('addressResidential');
  }

  get telephone(){
    return this.form.get('telephone');
  }

  get email(){
    return this.form.get('email');
  }

  get partyInfo(){
    return this.form.get('partyInfo');
  }

  constructor(public formBuilder: FormBuilder,
    private systemService: SystemService){}

  ngOnInit() {

    this.form = this.formBuilder.group({
      name: [{value:this.granteeDto.name, disabled: false}, [Validators.required,  Validators.pattern(PatternValidation.PERSON_NAME_PATTERN)]],
      nic: [{value:this.granteeDto.nic, disabled: false}, [Validators.pattern(new RegExp(PatternValidation.NIC_PATTERN))]],
      addressPermanent: [{value:this.granteeDto.addressPermanent, disabled: false}, [Validators.required, Validators.pattern(PatternValidation.ADDRESS_PATTERN)]],
      addressResidential: [{value:this.granteeDto.addressResidential, disabled: false}, [Validators.pattern(PatternValidation.ADDRESS_PATTERN)]],
      telephone: [{value:this.granteeDto.telephone, disabled: false}, [Validators.pattern(new RegExp(PatternValidation.CONTACT_NUMBER_PATTERN))]],
      email: [{value:this.granteeDto.email, disabled: false}, [Validators.pattern(new RegExp(PatternValidation.EMAIL_PATTERN))]],
      partyInfo: []
    });

    if(this.uiController.isReadOnly){
      this.form.disable();
    }
  }

  copyAddress(){
    this.addressResidential.setValue(this.addressPermanent.value);
  }

  addGrantee(){

    if(this.form.invalid){
      Object.keys(this.form.controls).forEach(field => {
        const control = this.form.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
    else if(this.form.valid && !this.isEdit){
      this.pushGrantee(this.form.value as GranteeDto);
    }
    else if(this.form.valid && this.isEdit){
      this.replaceGrantee(this.selectedIndex);
    }
    this.isEdit = false;
  }

  updateGrantee(index){
    this.reCallGrantee(index);
    this.selectedIndex = index;
    this.isEdit = true;
  }

  pushGrantee(grantee) {
    this.granteeList.push(grantee);
    this.form.reset();
  }

  removeGrantee(index) {
    // Swal.fire({
    //   title: this.systemService.getTranslation('ALERT.CONFIRM_MESSAGE.SUBMIT'),
    //   type: 'warning',
    //   showCancelButton: true,
    //   confirmButtonText: this.systemService.getTranslation('BUTTONS.CONFIRM'),
    //   showLoaderOnConfirm: true,
    // }).then((result) => {
    //   if (result.value) {
        this.granteeList.splice(index, 1);
    //   }
    // })
  }

  reCallGrantee(index) {
    this.name.setValue(this.granteeList[index].name);
    this.nic.setValue(this.granteeList[index].nic);
    this.addressPermanent.setValue(this.granteeList[index].addressPermanent);
    this.addressResidential.setValue(this.granteeList[index].addressResidential);
    this.telephone.setValue(this.granteeList[index].telephone);
    this.email.setValue(this.granteeList[index].email);
    this.partyInfo.setValue(this.granteeList[index].partyInfo);
  }

  replaceGrantee(index) {
    if (this.granteeList[index]) {
      this.granteeList[index] = this.form.value as GranteeDto;
    }
    this.form.reset();
  }

}
