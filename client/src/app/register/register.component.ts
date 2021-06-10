import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { UserRegister } from '../_models/user-register';
import { AccountService } from '../_services/account.service';
import { CustomValidators } from '../_validators/custom-validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {
  @Output() signUp = new EventEmitter();

  private valueChanges: Subscription;
  readonly maxDate = new Date();
  readonly bsConfig: Partial<BsDatepickerConfig> = {
    containerClass: 'theme-default',
    isAnimated: true,
    dateInputFormat: 'DD MMMM YYYY',
    adaptivePosition: true
  }

  registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private toast: ToastrService, private accountService: AccountService) { }

  ngOnInit(): void {
    this.initForm();
  }

  async submit() {
    const user: UserRegister = {
      knownAs: this.registerForm.value.knownAs,
      dateOfBirth: this.registerForm.value.dateOfBirth,
      username: this.registerForm.value.username,
      password: this.registerForm.value.password
    };
    await this.accountService.register(user).toPromise();

    this.toast.success('Você receberá um email assim que seu cadastro for aprovado.');
    this.signUp.emit();
  }

  private initForm(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email], [CustomValidators.usernameExistsAsync(this.accountService)]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [this.matchValues('password')]],
      knownAs: ['', [Validators.required]],      
      dateOfBirth: ['', Validators.required]
    });

    this.valueChanges = this.registerForm.controls.password.valueChanges.subscribe(() => this.registerForm.controls.confirmPassword.updateValueAndValidity());
  }

  private matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => (control?.value === control?.parent?.controls[matchTo].value ? null : { isntMatching: true });
  } 
  ngOnDestroy() {
    this.valueChanges.unsubscribe();
  }

}
