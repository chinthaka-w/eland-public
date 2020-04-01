import { Component, OnInit, Input } from '@angular/core';
import { UiController } from 'src/app/shared/custom-model/ui-controller.model';
import { TrusteeDto } from 'src/app/shared/dto/trustee-dto.model';
import { SystemService } from 'src/app/shared/service/system.service';
import { PatternValidation } from 'src/app/shared/enum/pattern-validation.enum';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DocumentNatures } from 'src/app/shared/enum/document-nature.enum';

@Component({
  selector: 'app-trustee',
  templateUrl: './trustee.component.html',
  styleUrls: ['./trustee.component.css']
})
export class TrusteeComponent implements OnInit {

  @Input()
  uiController: UiController;

  @Input()
  trusteeDto: TrusteeDto;

  @Input()
  trusteeList: TrusteeDto[];

  
  @Input()
  expressTrustRequestCustomModel;

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

  constructor(public formBuilder: FormBuilder,
    private systemService: SystemService){}

  ngOnInit() {

    this.form = this.formBuilder.group({
      name: [{value:this.trusteeDto.name, disabled: false}, [Validators.required,  Validators.pattern(PatternValidation.PERSON_NAME_PATTERN)]],
      nic: [{value:this.trusteeDto.nic, disabled: false}, [Validators.required, Validators.pattern(new RegExp(PatternValidation.NIC_PATTERN))]],
      addressPermanent: [{value:this.trusteeDto.addressPermanent, disabled: false}, [Validators.required, Validators.pattern(PatternValidation.ADDRESS_PATTERN)]],
      addressResidential: [{value:this.trusteeDto.addressResidential, disabled: false}, [Validators.pattern(PatternValidation.ADDRESS_PATTERN)]],
      telephone: [{value:this.trusteeDto.telephone, disabled: false}, [Validators.pattern(new RegExp(PatternValidation.CONTACT_NUMBER_PATTERN))]],
      email: [{value:this.trusteeDto.email, disabled: false}, [Validators.pattern(new RegExp(PatternValidation.EMAIL_PATTERN))]],
    });

    if(this.uiController.isReadOnly){
      this.form.disable();
    }
  }

  copyAddress(){
    this.addressResidential.setValue(this.addressPermanent.value);
  }

  addTrustee(){
    
    if(this.form.invalid){
      Object.keys(this.form.controls).forEach(field => {
        const control = this.form.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
    else if(this.form.valid && !this.isEdit){
      this.pushTrustee(this.form.value as TrusteeDto);
    }
    else if(this.form.valid && this.isEdit){
      this.replaceTrustee(this.selectedIndex);
    }
    this.isEdit = false;
  }

  updateTrustee(index){
    this.reCallTrustee(index);
    this.selectedIndex = index;
    this.isEdit = true;
  }

  pushTrustee(trustee) {
    this.trusteeList.push(trustee);
    this.form.reset();
  }

  removeTrustee(index) {
    // Swal.fire({
    //   title: this.systemService.getTranslation('ALERT.CONFIRM_MESSAGE.SUBMIT'),
    //   type: 'warning',
    //   showCancelButton: true,
    //   confirmButtonText: this.systemService.getTranslation('BUTTONS.CONFIRM'),
    //   showLoaderOnConfirm: true,
    // }).then((result) => {
    //   if (result.value) {
        this.trusteeList.splice(index, 1);
    //   }
    // })
  }

  reCallTrustee(index) {
    this.name.setValue(this.trusteeList[index].name);
    this.nic.setValue(this.trusteeList[index].nic);
    this.addressPermanent.setValue(this.trusteeList[index].addressPermanent);
    this.addressResidential.setValue(this.trusteeList[index].addressResidential);
    this.telephone.setValue(this.trusteeList[index].telephone);
    this.email.setValue(this.trusteeList[index].email);
  }

  replaceTrustee(index) {
    if (this.trusteeList[index]) {
      this.trusteeList[index] = this.form.value as TrusteeDto;
    }
    this.form.reset();
  }


}
