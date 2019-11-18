import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { SnackBarService } from "src/app/shared/service/snack-bar.service";
import { AuthService } from "src/app/shared/service/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
import { SysConfigService } from "src/app/shared/service/sys-config.service";
import { AppConfig } from "src/app/shared/model/app-config.model";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  @Input()
  public appConfig: AppConfig;

  public loginForm: FormGroup;

  get username() {
    return this.loginForm.get("username");
  }

  get password() {
    return this.loginForm.get("password");
  }

  public formError = "";

  constructor(
    private snackBar: SnackBarService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    public sysConfigService: SysConfigService
  ) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required])
    });
  }

  login() {
    this.authService.login(this.loginForm.value).subscribe(
      response => {
        this.snackBar.success("Login Successful");
        //setSession
        //setPermission
        this.sysConfigService.getConfig.emit({
          color: "red",
          user: true,
          header: true,
          footer: true
        });
        this.router.navigate([`/dashboard`], { relativeTo: this.route });
      },
      error => {
        if (error.error.status === 500) {
          this.formError = "Internal server error";
          this.loginForm.setErrors({ serverError: true });
        } else {
          this.formError = "Invalid Credentials";
          this.loginForm.setErrors({ invalidLogin: true });
        }

        this.snackBar.error("Login Failed");
      }
    );
  }
}
