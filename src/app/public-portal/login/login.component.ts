import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { SnackBarService } from "src/app/shared/service/snack-bar.service";
import { AuthService } from "src/app/shared/service/auth.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
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
    private route: ActivatedRoute
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
