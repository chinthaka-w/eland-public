import { Component, OnInit, Input } from '@angular/core';
import { UiController } from 'src/app/shared/custom-model/ui-controller.model';
import { BeneficiaryDto } from 'src/app/shared/dto/beneficiary-dto.model';
import { SystemService } from 'src/app/shared/service/system.service';
import { PatternValidation } from 'src/app/shared/enum/pattern-validation.enum';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {SysMethodsService} from '../../../service/sys-methods.service';

@Component({
  selector: 'app-beneficiary',
  templateUrl: './beneficiary.component.html',
  styleUrls: ['./beneficiary.component.css']
})

export class BeneficiaryComponent implements OnInit {

  @Input()
  uiController: UiController;

  @Input()
  beneficiaryDto: BeneficiaryDto;

  @Input()
  beneficiaryList: BeneficiaryDto[];


  public isEdit: boolean = false;

  public selectedIndex = -1;

  public form: FormGroup;

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

  constructor(public formBuilder: FormBuilder,
              private sysMethodsService: SysMethodsService,
    private systemService: SystemService){}

  ngOnInit() {

    this.form = this.formBuilder.group({
      name: [{value:this.beneficiaryDto.name, disabled: false}, [Validators.required,this.sysMethodsService.noWhitespaceValidator,  Validators.pattern(PatternValidation.PERSON_NAME_PATTERN)]],
      nic: [{value:this.beneficiaryDto.nic, disabled: false}, [Validators.required,this.sysMethodsService.noWhitespaceValidator, Validators.pattern(new RegExp(PatternValidation.NIC_PATTERN))]],
      addressPermanent: [{value:this.beneficiaryDto.addressPermanent, disabled: false}, [Validators.required,this.sysMethodsService.noWhitespaceValidator, Validators.pattern(PatternValidation.ADDRESS_PATTERN)]],
      addressResidential: [{value:this.beneficiaryDto.addressResidential, disabled: false}, [Validators.pattern(PatternValidation.ADDRESS_PATTERN)]],
      telephone: [{value:this.beneficiaryDto.telephone, disabled: false}, [Validators.pattern(new RegExp(PatternValidation.CONTACT_NUMBER_PATTERN))]],
      email: [{value:this.beneficiaryDto.email, disabled: false}, [Validators.pattern(new RegExp(PatternValidation.EMAIL_PATTERN))]],
    });

    if(this.uiController.isReadOnly){
      this.form.disable();
    }
  }

  copyAddress(){
    this.addressResidential.setValue(this.addressPermanent.value);
  }

  addBeneficiary(){

    if(this.form.invalid){
      Object.keys(this.form.controls).forEach(field => {
        const control = this.form.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
    else if(this.form.valid && !this.isEdit){
      this.pushBeneficiary(this.form.value as BeneficiaryDto);
    }
    else if(this.form.valid && this.isEdit){
      this.replaceBeneficiary(this.selectedIndex);
    }
    this.isEdit = false;
  }

  updateBeneficiary(index){
    this.reCallBeneficiary(index);
    this.selectedIndex = index;
    this.isEdit = true;
  }

  pushBeneficiary(beneficiary) {
    this.beneficiaryList.push(beneficiary);
    this.form.reset();
  }

  removeBeneficiary(index) {
    // Swal.fire({
    //   title: this.systemService.getTranslation('ALERT.CONFIRM_MESSAGE.SUBMIT'),
    //   type: 'warning',
    //   showCancelButton: true,
    //   confirmButtonText: this.systemService.getTranslation('BUTTONS.CONFIRM'),
    //   showLoaderOnConfirm: true,
    // }).then((result) => {
    //   if (result.value) {
        this.beneficiaryList.splice(index, 1);
    //   }
    // })
  }

  reCallBeneficiary(index) {
    this.name.setValue(this.beneficiaryList[index].name);
    this.nic.setValue(this.beneficiaryList[index].nic);
    this.addressPermanent.setValue(this.beneficiaryList[index].addressPermanent);
    this.addressResidential.setValue(this.beneficiaryList[index].addressResidential);
    this.telephone.setValue(this.beneficiaryList[index].telephone);
    this.email.setValue(this.beneficiaryList[index].email);
  }

  replaceBeneficiary(index) {
    if (this.beneficiaryList[index]) {
      this.beneficiaryList[index] = this.form.value as BeneficiaryDto;
    }
    this.form.reset();
  }


}
