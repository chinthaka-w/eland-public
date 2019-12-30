import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SessionService} from '../../../../../shared/service/session.service';
import {SnackBarService} from '../../../../../shared/service/snack-bar.service';
import {NotaryService} from '../../../../../shared/service/notary-service';
import {AccountDetailsDto} from '../../../../../shared/dto/accountDetails.dto';

@Component({
  selector: 'app-notary-clerk',
  templateUrl: './notary-clerk.component.html',
  styleUrls: ['./notary-clerk.component.css']
})
export class NotaryClerkComponent implements OnInit {
  public notaryId: number;
  accountUpdateForm: FormGroup;
  public account = new AccountDetailsDto;
  submitted: boolean = false;
  filedata;
  profilePic: string[] = [];

  constructor(private formBuilder: FormBuilder, private sessionService: SessionService,
              private snackBar: SnackBarService, private notaryService: NotaryService) { }

  ngOnInit() {
    this.accountUpdateForm = this.formBuilder.group({
      username: new FormControl('', Validators.required),
      currentpassword: new FormControl('', Validators.required),
      newpassword: new FormControl('', Validators.required),
      confirmpassword: new FormControl('', Validators.required),
    });
    this.notaryId = this.sessionService.getUser().id;

    this.getProfilePic();
  }

  updateAccount() {
    this.submitted = true;
    if (this.accountUpdateForm.invalid) {
      return;
    }
    if (this.accountUpdateForm.value.newpassword === this.accountUpdateForm.value.confirmpassword) {
     this.account = this.accountUpdateForm.value;
     const formData = new FormData();
     formData.append('data', JSON.stringify(this.account));
     this.notaryService.updateAccountDetails(formData).subscribe(
       (success: string) => {
         this.snackBar.success('Your Password Has Been Reset');
         this.accountUpdateForm.reset();
       },
       error => {
         this.snackBar.error('Failed');
       }
     );
   } else {
     this.snackBar.error('New Password and Confirm Password is mismatch..!');
   }

  }

  get f() {
    return this.accountUpdateForm.controls;
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[i]);
      }
      this.filedata = event.target.files;
     }
  }

  public onUpload(event) {
    let uploadFile: File = this.filedata.item(0);

      this.notaryService.uploadProfilePic(uploadFile, this.notaryId).subscribe(
        (success: string) => {
          this.snackBar.success('profile Picture Uploaded.');
        },
        error => {
          this.snackBar.error('Failed');
        }
      );
  }

  getProfilePic(): void {
    // this.notaryService.loadProfilePic(this.notaryId).subscribe(
    //   (result: string) => {
    //     this.profilePic = result;
    //   }
    // );
  }

}
