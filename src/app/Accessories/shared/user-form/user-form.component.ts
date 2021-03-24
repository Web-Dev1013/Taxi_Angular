import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import {LoginService} from '../../helpers/services/login.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {

  @Input() userDetails: any;
  @Output() userDetailsToUserForm = new EventEmitter<any>();
  @Output() disabled = new EventEmitter<boolean>();
  public userForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private loginServ: LoginService
    )
    {
    this.userForm = this.formBuilder.group({
      firstName: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.pattern('^[A-Za-z -]+$'),
        ])
      ),
      lastName: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.pattern('^[A-Za-z -]+$'),
        ])
      ),
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')
        ])
      ),
    });
  }
  ngOnInit() {
    this.populateUserDataInForm();
    // Record any changes in form Control
    this.userForm.valueChanges.subscribe(x => {
        if (this.userForm.valid){
          this.disabled.emit(false);
          this.userDetailsToUserForm.emit(x);
        }
        else{
          this.disabled.emit(true);
        }
  });
  }

  get errorControl() {
    return this.userForm.controls;
  }

  populateUserDataInForm(){
    //// console.log('user-form',this.userDetails);
      this.userForm.patchValue({
        firstName: this.userDetails.firstName || this.loginServ.firstName,
        lastName: this.userDetails.lastName || this.loginServ.lastName,
        email: this.userDetails.email || this.loginServ.email,
      });
  }
  // getValue(){
  //   this.userDetailsToUserForm.emit(this.userForm.value)
  // }

  onSubmit(){

  }

}
