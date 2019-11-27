import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PublicUserType } from 'src/app/shared/enum/public-user-type.enum';

@Component({
  selector: "app-add-public-user",
  templateUrl: "./add-public-user.component.html",
  styleUrls: ["./add-public-user.component.css"]
})
export class AddPublicUserComponent implements OnInit {
  public publicUserForm: FormGroup;
  public PublicUserType = PublicUserType;
  fileList = {};

  get publicUserType() {
    return this.publicUserForm.get('type');
  }

  constructor() {}

  ngOnInit() {
    this.publicUserForm = new FormGroup({
      nearestLr: new FormControl("", [Validators.required]),
      type: new FormControl("", [Validators.required]),
      name: new FormControl("", [Validators.required]),
      address1: new FormControl("", [Validators.required]),
      address2: new FormControl("", [Validators.required]),
      address3: new FormControl("", [Validators.required]),
      nic: new FormControl("", [Validators.required]),
      primaryContact: new FormControl("", [Validators.required]),
      secondaryContact: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required]),
      reason: new FormControl("", [Validators.required]),
      renewalCertificate: new FormControl("", [Validators.required]),
      nicCopy: new FormControl("", [Validators.required]),
      signatureAndSeal: new FormControl("", [Validators.required]),
      recaptcha: new FormControl(null, Validators.required)
    });
  }

  setFiles(files, key){
    console.log('files: ', files);
    this.fileList[key] = files;
    console.log('file list: ', this.fileList);
  }
}
