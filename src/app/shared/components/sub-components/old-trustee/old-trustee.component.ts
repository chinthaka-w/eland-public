import { Component, OnInit, Input } from '@angular/core';
import { UiController } from 'src/app/shared/custom-model/ui-controller.model';
import { OldTrusteeDto } from 'src/app/shared/dto/old-trustee-dto.model';
import { SystemService } from 'src/app/shared/service/system.service';
import { PatternValidation } from 'src/app/shared/enum/pattern-validation.enum';
import { DocumentNatures } from 'src/app/shared/enum/document-nature.enum';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-old-trustee',
  templateUrl: './old-trustee.component.html',
  styleUrls: ['./old-trustee.component.css']
})
export class OldTrusteeComponent implements OnInit {

  @Input()
  uiController: UiController;

  @Input()
  oldTrusteeDto: OldTrusteeDto;

  @Input()
  oldTrusteeList: OldTrusteeDto[];


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
    private systemService: SystemService){}

  ngOnInit() {

    this.form = this.formBuilder.group({
      name: [{value:this.oldTrusteeDto.name, disabled: false}, [Validators.required,  Validators.pattern(PatternValidation.PERSON_NAME_PATTERN)]],
      nic: [{value:this.oldTrusteeDto.nic, disabled: false}, [Validators.required, Validators.pattern(new RegExp(PatternValidation.NIC_PATTERN))]],
      addressPermanent: [{value:this.oldTrusteeDto.addressPermanent, disabled: false}, [Validators.required, Validators.pattern(PatternValidation.ADDRESS_PATTERN)]],
      addressResidential: [{value:this.oldTrusteeDto.addressResidential, disabled: false}, [Validators.pattern(PatternValidation.ADDRESS_PATTERN)]],
      telephone: [{value:this.oldTrusteeDto.telephone, disabled: false}, [Validators.pattern(new RegExp(PatternValidation.CONTACT_NUMBER_PATTERN))]],
      email: [{value:this.oldTrusteeDto.email, disabled: false}, [Validators.pattern(new RegExp(PatternValidation.EMAIL_PATTERN))]],
    });

    if(this.uiController.isReadOnly){
      this.form.disable();
    }
  }

  copyAddress(){
    this.addressResidential.setValue(this.addressPermanent.value);
  }

  addOldTrustee(){
    
    if(this.form.invalid){
      Object.keys(this.form.controls).forEach(field => {
        const control = this.form.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
    else if(this.form.valid && !this.isEdit){
      this.pushOldTrustee(this.form.value as OldTrusteeDto);
    }
    else if(this.form.valid && this.isEdit){
      this.replaceOldTrustee(this.selectedIndex);
    }
    this.isEdit = false;
  }

  updateOldTrustee(index){
    this.reCallOldTrustee(index);
    this.selectedIndex = index;
    this.isEdit = true;
  }

  pushOldTrustee(oldTrustee) {
    this.oldTrusteeList.push(oldTrustee);
    this.form.reset();
  }

  removeOldTrustee(index) {
    // Swal.fire({
    //   title: this.systemService.getTranslation('ALERT.CONFIRM_MESSAGE.SUBMIT'),
    //   type: 'warning',
    //   showCancelButton: true,
    //   confirmButtonText: this.systemService.getTranslation('BUTTONS.CONFIRM'),
    //   showLoaderOnConfirm: true,
    // }).then((result) => {
    //   if (result.value) {
        this.oldTrusteeList.splice(index, 1);
    //   }
    // })
  }

  reCallOldTrustee(index) {
    this.name.setValue(this.oldTrusteeList[index].name);
    this.nic.setValue(this.oldTrusteeList[index].nic);
    this.addressPermanent.setValue(this.oldTrusteeList[index].addressPermanent);
    this.addressResidential.setValue(this.oldTrusteeList[index].addressResidential);
    this.telephone.setValue(this.oldTrusteeList[index].telephone);
    this.email.setValue(this.oldTrusteeList[index].email);
  }

  replaceOldTrustee(index) {
    if (this.oldTrusteeList[index]) {
      this.oldTrusteeList[index] = this.form.value as OldTrusteeDto;
    }
    this.form.reset();
  }

}
