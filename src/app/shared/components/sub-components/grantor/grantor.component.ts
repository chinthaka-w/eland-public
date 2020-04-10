import { Component, OnInit, Input } from '@angular/core';
import { UiController } from 'src/app/shared/custom-model/ui-controller.model';
import { GrantorDto } from 'src/app/shared/dto/grantor-dto.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SystemService } from 'src/app/shared/service/system.service';
import { PatternValidation } from 'src/app/shared/enum/pattern-validation.enum';
import { DocumentNatures } from 'src/app/shared/enum/document-nature.enum';


@Component({
  selector: 'app-grantor',
  templateUrl: './grantor.component.html',
  styleUrls: ['./grantor.component.css']
})
export class GrantorComponent implements OnInit {


  @Input()
  uiController: UiController;

  @Input()
  grantorDto: GrantorDto;

  @Input()
  grantorList: GrantorDto[];

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

  get partyInfo(){
    return this.form.get('partyInfo');
  }

  constructor(public formBuilder: FormBuilder,
    private systemService: SystemService
    ){}

  ngOnInit() {

    this.form = this.formBuilder.group({
      name: [{value:this.grantorDto.name, disabled: false}, [Validators.required,  Validators.pattern(PatternValidation.PERSON_NAME_PATTERN)]],
      nic: [{value:this.grantorDto.nic, disabled: false}, [Validators.pattern(new RegExp(PatternValidation.NIC_PATTERN))]],
      addressPermanent: [{value:this.grantorDto.addressPermanent, disabled: false}, [Validators.required, Validators.pattern(PatternValidation.ADDRESS_PATTERN)]],
      addressResidential: [{value:this.grantorDto.addressResidential, disabled: false}, [Validators.pattern(PatternValidation.ADDRESS_PATTERN)]],
      telephone: [{value:this.grantorDto.telephone, disabled: false}, [Validators.pattern(new RegExp(PatternValidation.CONTACT_NUMBER_PATTERN))]],
      email: [{value:this.grantorDto.email, disabled: false}, [Validators.pattern(new RegExp(PatternValidation.EMAIL_PATTERN))]],
      partyInfo: []
    });

    if(this.uiController.isReadOnly){
      this.form.disable();
    }
  }

  copyAddress(){
    this.addressResidential.setValue(this.addressPermanent.value);
  }

  addGrantor(){

    if(this.form.invalid){
      Object.keys(this.form.controls).forEach(field => {
        const control = this.form.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
    else if(this.form.valid && !this.isEdit){
      this.pushGrantor(this.form.value as GrantorDto);
    }
    else if(this.form.valid && this.isEdit){
      this.replaceGrantor(this.selectedIndex);
    }
    this.isEdit = false;
  }

  updateGrantor(index){
    this.reCallGrantor(index);
    this.selectedIndex = index;
    this.isEdit = true;
  }

  pushGrantor(grantor) {
    this.grantorList.push(grantor);
    this.form.reset();
  }

  removeGrantor(index) {
    // Swal.fire({
    //   title: this.systemService.getTranslation('ALERT.CONFIRM_MESSAGE.SUBMIT'),
    //   type: 'warning',
    //   showCancelButton: true,
    //   confirmButtonText: this.systemService.getTranslation('BUTTONS.CONFIRM'),
    //   showLoaderOnConfirm: true,
    // }).then((result) => {
    //   if (result.value) {
        this.grantorList.splice(index, 1);
    //   }
    // })
  }

  reCallGrantor(index) {
    this.name.setValue(this.grantorList[index].name);
    this.nic.setValue(this.grantorList[index].nic);
    this.addressPermanent.setValue(this.grantorList[index].addressPermanent);
    this.addressResidential.setValue(this.grantorList[index].addressResidential);
    this.telephone.setValue(this.grantorList[index].telephone);
    this.email.setValue(this.grantorList[index].email);
    this.partyInfo.setValue(this.grantorList[index].partyInfo);
  }

  replaceGrantor(index) {
    if (this.grantorList[index]) {
      this.grantorList[index] = this.form.value as GrantorDto;
    }
    this.form.reset();
  }

}
