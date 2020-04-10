import { Component, OnInit, Input } from '@angular/core';
import { UiController } from 'src/app/shared/custom-model/ui-controller.model';
import { CoTrusteeDto } from 'src/app/shared/dto/co-trustee-dto.model';
import { SystemService } from 'src/app/shared/service/system.service';
import { PatternValidation } from 'src/app/shared/enum/pattern-validation.enum';
import { DocumentNatures } from 'src/app/shared/enum/document-nature.enum';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FolioDto } from 'src/app/shared/dto/folio-dto.model';

@Component({
  selector: 'app-co-trustee',
  templateUrl: './co-trustee.component.html',
  styleUrls: ['./co-trustee.component.css']
})
export class CoTrusteeComponent implements OnInit {

  @Input()
  uiController: UiController;

  @Input()
  coTrusteeDto: CoTrusteeDto;

  @Input()
  coTrusteeList: CoTrusteeDto[];

  @Input()
  folioDto: FolioDto;

  public documentNature = DocumentNatures;

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
      name: [{value:this.coTrusteeDto.name, disabled: false}, [Validators.required,  Validators.pattern(PatternValidation.PERSON_NAME_PATTERN)]],
      nic: [{value:this.coTrusteeDto.nic, disabled: false}, [Validators.required, Validators.pattern(new RegExp(PatternValidation.NIC_PATTERN))]],
      addressPermanent: [{value:this.coTrusteeDto.addressPermanent, disabled: false}, [Validators.required, Validators.pattern(PatternValidation.ADDRESS_PATTERN)]],
      addressResidential: [{value:this.coTrusteeDto.addressResidential, disabled: false}, [Validators.pattern(PatternValidation.ADDRESS_PATTERN)]],
      telephone: [{value:this.coTrusteeDto.telephone, disabled: false}, [Validators.pattern(new RegExp(PatternValidation.CONTACT_NUMBER_PATTERN))]],
      email: [{value:this.coTrusteeDto.email, disabled: false}, [Validators.pattern(new RegExp(PatternValidation.EMAIL_PATTERN))]],
    });

    if(this.uiController.isReadOnly){
      this.form.disable();
    }
  }

  copyAddress(){
    this.addressResidential.setValue(this.addressPermanent.value);
  }

  addCoTrustee(){
    
    if(this.form.invalid){
      Object.keys(this.form.controls).forEach(field => {
        const control = this.form.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
    else if(this.form.valid && !this.isEdit){
      this.pushCoTrustee(this.form.value as CoTrusteeDto);
    }
    else if(this.form.valid && this.isEdit){
      this.replaceCoTrustee(this.selectedIndex);
    }
    this.isEdit = false;
  }

  updateCoTrustee(index){
    this.reCallCoTrustee(index);
    this.selectedIndex = index;
    this.isEdit = true;
  }

  pushCoTrustee(coTrustee) {
    this.coTrusteeList.push(coTrustee);
    this.form.reset();
  }

  removeCoTrustee(index) {
    // Swal.fire({
    //   title: this.systemService.getTranslation('ALERT.CONFIRM_MESSAGE.SUBMIT'),
    //   type: 'warning',
    //   showCancelButton: true,
    //   confirmButtonText: this.systemService.getTranslation('BUTTONS.CONFIRM'),
    //   showLoaderOnConfirm: true,
    // }).then((result) => {
    //   if (result.value) {
        this.coTrusteeList.splice(index, 1);
    //   }
    // })
  }

  reCallCoTrustee(index) {
    this.name.setValue(this.coTrusteeList[index].name);
    this.nic.setValue(this.coTrusteeList[index].nic);
    this.addressPermanent.setValue(this.coTrusteeList[index].addressPermanent);
    this.addressResidential.setValue(this.coTrusteeList[index].addressResidential);
    this.telephone.setValue(this.coTrusteeList[index].telephone);
    this.email.setValue(this.coTrusteeList[index].email);
  }

  replaceCoTrustee(index) {
    if (this.coTrusteeList[index]) {
      this.coTrusteeList[index] = this.form.value as CoTrusteeDto;
    }
    this.form.reset();
  }

}
