import { Component, OnInit, Input } from '@angular/core';
import { UiController } from 'src/app/shared/custom-model/ui-controller.model';
import { ParticularDto } from 'src/app/shared/dto/particular-dto';
import { CaveatorDto } from 'src/app/shared/dto/caveator-dto.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { PatternValidation } from 'src/app/shared/enum/pattern-validation.enum';
import { Particular } from 'src/app/shared/enum/particular.enum';
import {SysMethodsService} from '../../../service/sys-methods.service';

@Component({
  selector: 'app-particular',
  templateUrl: './particular.component.html',
  styleUrls: ['./particular.component.css']
})
export class ParticularComponent implements OnInit {

  @Input()
  uiController: UiController;

  @Input()
  particularDto: ParticularDto;

  @Input()
  folioNo;

  @Input()
  caveatorList: CaveatorDto[];

  public form: FormGroup;

  public isEdit: boolean = false;

  public selectedIndex = -1;

  get name(){
    return this.form.get('name');
  }

  get address(){
    return this.form.get('address');
  }

  get phone(){
    return this.form.get('phone');
  }

  get email(){
    return this.form.get('email');
  }

  get noticePersonName(){
    return this.form.get('noticePersonName');
  }

  get noticePersonAddress(){
    return this.form.get('noticePersonAddress');
  }

  get noticePersonPhone(){
    return this.form.get('noticePersonPhone');
  }

  get noticePersonEmail(){
    return this.form.get('noticePersonEmail');
  }

  get toDate(){
    return this.form.get('toDate');
  }

  today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

  constructor(
    private datePipe: DatePipe,
    private sysMethodsService: SysMethodsService,
    public formBuilder: FormBuilder){
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: [{ value: '', disabled: false }, [Validators.required,this.sysMethodsService.noWhitespaceValidator]],
      address: [{ value: '', disabled: false }, [Validators.required,this.sysMethodsService.noWhitespaceValidator, Validators.pattern(PatternValidation.ADDRESS_PATTERN)]],
      phone: [{ value: '', disabled: false }, [Validators.pattern(new RegExp(PatternValidation.CONTACT_NUMBER_PATTERN))]],
      email: [{ value: '', disabled: false }, [Validators.pattern(new RegExp(PatternValidation.EMAIL_PATTERN))]],
      fromDate: [{ value: this.today, disabled: false }],
      toDate: [{ value: this.today, disabled: false }],
      noticePersonName: [{ value: '', disabled: false }, [Validators.required,this.sysMethodsService.noWhitespaceValidator]],
      noticePersonAddress: [{ value: '', disabled: false }, [Validators.required,this.sysMethodsService.noWhitespaceValidator, Validators.pattern(PatternValidation.ADDRESS_PATTERN)]],
      noticePersonPhone: [{ value: '', disabled: false }, [Validators.pattern(new RegExp(PatternValidation.CONTACT_NUMBER_PATTERN))]],
      noticePersonEmail:  [{ value: '', disabled: false }, [Validators.pattern(new RegExp(PatternValidation.EMAIL_PATTERN))]],
    });

    if(this.uiController.isCaveator && !this.particularDto.remark){

      var tmp = Particular.CAVEATOR
                .replace('{address}', '..........')
                .replace('{name}','..........')
                .replace('{fromDate}','..........')
                .replace('{toDate}','..........')
                .replace('{years}','...')
                .replace('{toAddress}','..........')
      this.particularDto.remark = tmp;
    }
  }

  addCaveator(){
    if(this.form.invalid){
      Object.keys(this.form.controls).forEach(field => {
        const control = this.form.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
    else if(!this.isEdit){
      this.pushCaveator(this.form.value as CaveatorDto);
    }
    else if(this.isEdit){
      this.replaceCaveator(this.selectedIndex);
    }
    else{
      this.isEdit = false;
    }
  }

  updateCaveator(index){
    this.reCallCaveator(index);
    this.selectedIndex = index;
    this.isEdit = true;
    // this.generateParticular();
  }

  pushCaveator(caveator) {
    this.caveatorList.push(caveator);
    this.form.reset();
    this.form.get('toDate').setValue(this.today);
    // this.generateParticular();
  }

  removeCaveator(index) {
    this.caveatorList.splice(index, 1);
    // this.generateParticular();
  }

  reCallCaveator(index) {
    this.name.setValue(this.caveatorList[index].name);
    this.address.setValue(this.caveatorList[index].address);
    this.phone.setValue(this.caveatorList[index].phone);
    this.email.setValue(this.caveatorList[index].email);
    this.noticePersonName.setValue(this.caveatorList[index].noticePersonName);
    this.noticePersonAddress.setValue(this.caveatorList[index].noticePersonAddress);
    this.noticePersonPhone.setValue(this.caveatorList[index].noticePersonPhone);
    this.noticePersonEmail.setValue(this.caveatorList[index].noticePersonEmail);
  }

  replaceCaveator(index) {
    if (this.caveatorList[index]) {
      this.caveatorList[index] = this.form.value as CaveatorDto;
    }
    this.form.reset();
    this.form.get('toDate').setValue(this.today);
  }

  generateParticular(){

    var address = '';
    var name = '';
    var fromDate = '';
    var toDate = this.datePipe.transform(new Date(this.toDate.value), 'yyyy-MM-dd');
    var years = '';
    var noticePersonName = '';
    var noticePersonAddress = '';

    this.caveatorList.forEach((caveator, i) =>{
      address += `${i+1}). ${caveator.address} `;
      name += `${i+1}). ${caveator.name} `;
      // noticePersonName += `${i}). ${caveator.noticePersonName}, `;
      noticePersonAddress += `${i+1}).  ${caveator.noticePersonName}, ${caveator.noticePersonAddress} `;
    });

    var diff =(new Date(this.today).getTime() - new Date(toDate).getTime()) / 1000;
    diff /= (60 * 60 * 24);

    var tmp = Particular.CAVEATOR
                .replace('{address}', address)
                .replace('{name}', name)
                .replace('{fromDate}',this.today)
                .replace('{toDate}',toDate)
                .replace('{years}', Math.abs(Math.round(diff/365.25)).toString())
                .replace('{toAddress}', noticePersonAddress)
      this.particularDto.remark = tmp;
  }


}
