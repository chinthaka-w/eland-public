import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SnackBarService} from 'src/app/shared/service/snack-bar.service';
import {AuthService} from 'src/app/shared/auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AppConfig} from '../../shared/dto/app-config.model';
import {SysConfigService} from '../../shared/service/sys-config.service';
import {SessionService} from '../../shared/service/session.service';
import {TokenStorageService} from '../../shared/auth/token-storage.service';
import {SysMethodsService} from '../../shared/service/sys-methods.service';
import {SystemService} from '../../shared/service/system.service';


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

  returnUrl: string;

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
    private sysMethodsService: SysMethodsService,
    private systemService: SystemService,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required,this.sysMethodsService.noWhitespaceValidator]),
      password: new FormControl('', [Validators.required])
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  login() {
    this.authService.attemptAuth(this.loginForm.value.username,this.loginForm.value.password).subscribe(
      response => {

        if (response) this.getUserDetails(this.loginForm.value.username);

        // if(response['success']){
        //   this.snackBar.success("Login Successful");
        //   this.userId = response['user'].id;
        //   this.setRequestId(this.userId);
        //   this.sessionService.setUser(response['user']);
        //   this.sysConfigService.appConfig.emit({
        //     user: true,
        //     header: true,
        //     footer: true
        //   });
        //   //setPermission
        //   this.router.navigate([`/dashboard`], { relativeTo: this.route });
        // }
        // else{
        //   this.formError = "Invalid Credentials";
        //   this.loginForm.setErrors({ invalidLogin: true });
        // }
      },
      (error) => {
        console.log('Error', error);
          this.formError = this.systemService.getTranslation('LOGIN.PASSWORD_INCORRECT');
          this.loginForm.setErrors({ serverError: true });
      }
    );
  }

  getUserDetails(username: any) {
    this.authService.getUserDetails(username).subscribe(
      (data: any) => {
        if (data) {
        this.tokenStorageService.saveUserObjectToken(data);
          this.userId = data.id;
            this.setRequestId(this.userId);
        }
      }, (error) => {
        console.log(error);
      },()=>{
        this.snackBar.success("Login Successful");
        this.router.navigate([this.returnUrl]);
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
