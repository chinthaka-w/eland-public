import { Component, OnInit, Input } from '@angular/core';
import { UiController } from 'src/app/shared/custom-model/ui-controller.model';
import { TrusterDto } from 'src/app/shared/dto/truster-dto.model';
import { SystemService } from 'src/app/shared/service/system.service';
import { PatternValidation } from 'src/app/shared/enum/pattern-validation.enum';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {SysMethodsService} from '../../../service/sys-methods.service';

@Component({
  selector: 'app-truster',
  templateUrl: './truster.component.html',
  styleUrls: ['./truster.component.css']
})
export class TrusterComponent implements OnInit {

  @Input()
  uiController: UiController;

  @Input()
  trusterDto: TrusterDto;

  @Input()
  trusterList: TrusterDto[];

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
      name: [{value:this.trusterDto.name, disabled: false}, [Validators.required,this.sysMethodsService.noWhitespaceValidator,  Validators.pattern(PatternValidation.PERSON_NAME_PATTERN)]],
      nic: [{value:this.trusterDto.nic, disabled: false}, [Validators.required,this.sysMethodsService.noWhitespaceValidator, Validators.pattern(new RegExp(PatternValidation.NIC_PATTERN))]],
      addressPermanent: [{value:this.trusterDto.addressPermanent, disabled: false}, [Validators.required,this.sysMethodsService.noWhitespaceValidator, Validators.pattern(PatternValidation.ADDRESS_PATTERN)]],
      addressResidential: [{value:this.trusterDto.addressResidential, disabled: false}, [Validators.pattern(PatternValidation.ADDRESS_PATTERN)]],
      telephone: [{value:this.trusterDto.telephone, disabled: false}, [Validators.pattern(new RegExp(PatternValidation.CONTACT_NUMBER_PATTERN))]],
      email: [{value:this.trusterDto.email, disabled: false}, [Validators.pattern(new RegExp(PatternValidation.EMAIL_PATTERN))]],
    });

    if(this.uiController.isReadOnly){
      this.form.disable();
    }
  }

  copyAddress(){
    this.addressResidential.setValue(this.addressPermanent.value);
  }

  addTruster(){

    if(this.form.invalid){
      Object.keys(this.form.controls).forEach(field => {
        const control = this.form.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
    else if(this.form.valid && !this.isEdit){
      this.pushTruster(this.form.value as TrusterDto);
    }
    else if(this.form.valid && this.isEdit){
      this.replaceTruster(this.selectedIndex);
    }
    this.isEdit = false;
  }

  updateTruster(index){
    this.reCallTruster(index);
    this.selectedIndex = index;
    this.isEdit = true;
  }

  pushTruster(truster) {
    this.trusterList.push(truster);
    this.form.reset();
  }

  removeTruster(index) {
    // Swal.fire({
    //   title: this.systemService.getTranslation('ALERT.CONFIRM_MESSAGE.SUBMIT'),
    //   type: 'warning',
    //   showCancelButton: true,
    //   cancelButtonText: this.systemService.getTranslation('BUTTONS.CANCEL_BUTTON'),
    //   confirmButtonText: this.systemService.getTranslation('BUTTONS.CONFIRM'),
    //   showLoaderOnConfirm: true,
    // }).then((result) => {
    //   if (result.value) {
        this.trusterList.splice(index, 1);
    //   }
    // })
  }

  reCallTruster(index) {
    this.name.setValue(this.trusterList[index].name);
    this.nic.setValue(this.trusterList[index].nic);
    this.addressPermanent.setValue(this.trusterList[index].addressPermanent);
    this.addressResidential.setValue(this.trusterList[index].addressResidential);
    this.telephone.setValue(this.trusterList[index].telephone);
    this.email.setValue(this.trusterList[index].email);
  }

  replaceTruster(index) {
    if (this.trusterList[index]) {
      this.trusterList[index] = this.form.value as TrusterDto;
    }
    this.form.reset();
  }


}
