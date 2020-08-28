import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../shared/service/auth.service';
import {SnackBarService} from '../../shared/service/snack-bar.service';
import {UserTypeModel} from '../../shared/dto/userType.model';
import {UserType} from '../../shared/enum/user-type.enum';
import {AuthorizeRequestService} from '../../shared/service/authorize-request.service';
import {SysMethodsService} from '../../shared/service/sys-methods.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  UserType = UserType;

  public processing = false;
  public message: string;
  public users: any[] = [];
  constructor(private _formBuilder: FormBuilder,
              private authService: AuthService,
              private sysMethodsService: SysMethodsService,
              private authorizeRequestService: AuthorizeRequestService,
              private snackBar: SnackBarService,) { }

  ngOnInit() {
    this.forgotPasswordForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      type: ['', [Validators.required]]
    });
  }

  verifyEmail() {

    this.processing = true;
    this.message = '';

    const model = new UserTypeModel(this.forgotPasswordForm.value.email, this.forgotPasswordForm.value.type);
    this.authorizeRequestService.checkEmailSystemUser(model).subscribe(
      (users: any[]) => {
        this.processing = false;
        this.users = users;
        if (users.length < 1) {
          this.message = 'Email address not found';
        }
        if (users.length == 1) {
          let email = {to: this.forgotPasswordForm.get('email').value, subject: 'e-Land Password Reset', text: '', userName: users[0].username};
          this.sendEmail(email);
        }

      },
      (error) => {
        this.processing = false;
      }
    );
  }

  resetUser() {
    this.users = [];
    this.processing = false;
  }

  sendEmail(email) {
    this.processing = true;
    this.authorizeRequestService.sendPasswordResetEmail(email).subscribe(
      (response) => {
        this.processing = false;
        this.snackBar.success('Email sent Successfully! Check your inbox');
        this.users = [];
      },
      error => {
        this.processing = false;
        this.snackBar.success('Email sending failed!');
        this.users = [];
      }
    );
  }

  selectUser(username) {
    let email = {to: this.forgotPasswordForm.get('email').value, subject: 'e-Land Password Reset', text: '', userName: username};
    this.sendEmail(email);
  }
}
