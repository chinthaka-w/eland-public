import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SnackBarService } from 'src/app/shared/service/snack-bar.service';
import { AuthService } from 'src/app/shared/service/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import {AppConfig} from '../../shared/dto/app-config.model';
import {SysConfigService} from "../../shared/service/sys-config.service";
import {SessionService} from "../../shared/service/session.service";
import {PaymentResponse} from "../../shared/dto/payment-response.model";
import {DocumentResponseDto} from "../../shared/dto/document-response.dto";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Input()
  public appConfig: AppConfig;
  public loginForm: FormGroup;
  public userId: number;

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  public formError = '';

  constructor(
    private snackBar: SnackBarService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private sysConfigService: SysConfigService,
    private sessionService: SessionService,
  ) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  login() {
    this.authService.login(this.loginForm.value).subscribe(
      response => {
        if(response['success']){
          this.snackBar.success("Login Successful");
          this.userId = response['user'].id;
          this.setRequestId(this.userId);
          console.log(this.userId);
          this.sessionService.setUser(response['user']);
          this.sysConfigService.getConfig.emit({
            color: "red",
            user: true,
            header: true,
            footer: true
          });
          //setPermission
          this.router.navigate([`/dashboard`], { relativeTo: this.route });
        }
        else{
          this.formError = "Invalid Credentials";
          this.loginForm.setErrors({ invalidLogin: true });
        }
      },
      error => {
        if (error.error.status === 500) {
          this.formError = 'Internal server error';
          this.loginForm.setErrors({ serverError: true });
        } else {
          this.formError = 'Invalid Credentials';
          this.loginForm.setErrors({ invalidLogin: true });
        }

        this.snackBar.error('Login Failed');
      }
    );
  }

  setRequestId(requestId: number){
    this.userId = requestId;
  }

  getRequestId(){
    return this.userId;
  }
}
