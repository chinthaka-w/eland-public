import { Component, OnInit, Input } from '@angular/core';
import { UiController } from 'src/app/shared/custom-model/ui-controller.model';
import { BeneficialDto } from 'src/app/shared/dto/beneficial-dto.model';
import { SystemService } from 'src/app/shared/service/system.service';
import { PatternValidation } from 'src/app/shared/enum/pattern-validation.enum';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {SysMethodsService} from '../../../service/sys-methods.service';

@Component({
  selector: 'app-beneficial',
  templateUrl: './beneficial.component.html',
  styleUrls: ['./beneficial.component.css']
})
export class BeneficialComponent implements OnInit {

  @Input()
  uiController: UiController;

  @Input()
  beneficialDto: BeneficialDto;

  @Input()
  beneficialList: BeneficialDto[];


  public isEdit: boolean = false;

  public selectedIndex = -1;

  public form: FormGroup;

  placements: string[] = ['top', 'left', 'right', 'bottom'];
  popoverTitle: string = 'Are you sure?';
  popoverMessage: string = 'Are you really <b>sure</b> you want to do this?';
  confirmText: string = 'Yes <i class="glyphicon glyphicon-ok"></i>';
  cancelText: string = 'No <i class="glyphicon glyphicon-remove"></i>';
  confirmClicked: boolean = false;
  cancelClicked: boolean = false;

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
      name: [{value:this.beneficialDto.name, disabled: false}, [Validators.required,this.sysMethodsService.noWhitespaceValidator,  Validators.pattern(PatternValidation.PERSON_NAME_PATTERN)]],
      nic: [{value:this.beneficialDto.nic, disabled: false}, [Validators.required,this.sysMethodsService.noWhitespaceValidator, Validators.pattern(new RegExp(PatternValidation.NIC_PATTERN))]],
      addressPermanent: [{value:this.beneficialDto.addressPermanent, disabled: false}, [Validators.required,this.sysMethodsService.noWhitespaceValidator, Validators.pattern(PatternValidation.ADDRESS_PATTERN)]],
      addressResidential: [{value:this.beneficialDto.addressResidential, disabled: false}, [Validators.pattern(PatternValidation.ADDRESS_PATTERN)]],
      telephone: [{value:this.beneficialDto.telephone, disabled: false}, [Validators.pattern(new RegExp(PatternValidation.CONTACT_NUMBER_PATTERN))]],
      email: [{value:this.beneficialDto.email, disabled: false}, [Validators.pattern(new RegExp(PatternValidation.EMAIL_PATTERN))]],
    });

    if(this.uiController.isReadOnly){
      this.form.disable();
    }
  }

  copyAddress(){
    this.addressResidential.setValue(this.addressPermanent.value);
  }

  addBeneficial(){

    if(this.form.invalid){
      Object.keys(this.form.controls).forEach(field => {
        const control = this.form.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
    else if(this.form.valid && !this.isEdit){
      this.pushBeneficial(this.form.value as BeneficialDto);
    }
    else if(this.form.valid && this.isEdit){
      this.replaceBeneficial(this.selectedIndex);
    }
    this.isEdit = false;
  }

  updateBeneficial(index){
    this.reCallBeneficial(index);
    this.selectedIndex = index;
    this.isEdit = true;
  }

  pushBeneficial(beneficial) {
    this.beneficialList.push(beneficial);
    this.form.reset();
  }

  removeBeneficial(index) {
    // Swal.fire({
    //   title: this.systemService.getTranslation('ALERT.CONFIRM_MESSAGE.SUBMIT'),
    //   type: 'warning',
    //   showCancelButton: true,
    //   confirmButtonText: this.systemService.getTranslation('BUTTONS.CONFIRM'),
    //   showLoaderOnConfirm: true,
    // }).then((result) => {
    //   if (result.value) {
        this.beneficialList.splice(index, 1);
    //   }
    // })
  }

  reCallBeneficial(index) {
    this.name.setValue(this.beneficialList[index].name);
    this.nic.setValue(this.beneficialList[index].nic);
    this.addressPermanent.setValue(this.beneficialList[index].addressPermanent);
    this.addressResidential.setValue(this.beneficialList[index].addressResidential);
    this.telephone.setValue(this.beneficialList[index].telephone);
    this.email.setValue(this.beneficialList[index].email);
  }

  replaceBeneficial(index) {
    if (this.beneficialList[index]) {
      this.beneficialList[index] = this.form.value as BeneficialDto;
    }
    this.form.reset();
  }


}
