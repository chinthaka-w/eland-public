import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../shared/service/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import {SnackBarService} from '../../shared/service/snack-bar.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;

  public processing: boolean = false;
  public message: string;
  public users: any[] = [];
  public token;
  public tokenExpired: boolean = false;
  public username;

  constructor( private _formBuilder: FormBuilder,
               private authService: AuthService,
               private route: ActivatedRoute,
               private router: Router,
               private snackBar: SnackBarService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.token = params['token'];
    });

    this.forgotPasswordForm = this._formBuilder.group({
        password: ['', [Validators.required]],
        confirmPassword: [{value: '', disabled: true}]
      }, {validator: this.MatchPassword}
    );

    var decoded = jwt_decode(this.token);
    this.username = decoded.username;

    if (Date.now() >= decoded.exp * 1000) {
      this.tokenExpired = true;
    }

    this.password.valueChanges.subscribe(
      value => {
        this.confirmPassword.setValue("");
      }
    );

  }

  get confirmPassword() {
    return this.forgotPasswordForm.get('confirmPassword');
  }

  get password() {
    return this.forgotPasswordForm.get('password');
  }

  MatchPassword(control: AbstractControl) {
    let password = control.get('password').value;
    let confirmPassword = control.get('confirmPassword').value;
    if (password != confirmPassword) {
      control.get('confirmPassword').setErrors({ ConfirmPassword: true });
    }
    else {
      control.get('confirmPassword').setErrors({ ConfirmPassword: false });
    }
  }

  resetPassword(){
    this.processing = true;
    this.authService.resetPassword({username: this.username, password: this.forgotPasswordForm.get('password').value}).subscribe(
      (response)=>{
        this.processing = false;
        this.snackBar.success( 'Password reset Successfully');
        this.users = [];
        this.router.navigateByUrl('/login');
      },
      error => {
        this.processing = false;
        this.snackBar.success('Password reset failed!');
        this.users = [];
        this.router.navigateByUrl('/forgot-password');
      }
    );
  }

  onStrengthChange(event: number) {
    if (event == 3 || event == 4) {
      this.confirmPassword.enable();
    } else {
      this.confirmPassword.disable();
    }
  }

}
