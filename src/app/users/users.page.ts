import {
  Component,
  OnInit,
  ContentChildren,
  QueryList,
  ViewChild,
  AfterContentInit,
  AfterViewInit,
} from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataTableColumnDirective } from '@swimlane/ngx-datatable';
import { UsersService } from '../Accessories/helpers/services/users.service';
import { baseUrl } from '../../environments/environment';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { ToastController, AlertController } from '@ionic/angular';
import * as moment from 'moment';
import { StorageService } from '../Accessories/helpers/services/storage.service';
import { LoaderService } from '../Accessories/helpers/services/loader.service';
import { Page } from './page';
import { EmailTest } from './email-test';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UsersPage implements OnInit, AfterContentInit {
  @ViewChild('myTable', { static: true }) table: any;
  @ViewChild('search', { static: false }) search: any;
  @ContentChildren(DataTableColumnDirective)
  columnDirectives: QueryList<DataTableColumnDirective>;
  page = new Page();
  offset: number;
  columns = [
    { name: 'First Name' },
    { name: 'Last Name' },
    { name: 'Email' },
    { name: 'Role' },
    { name: 'Created At' },
  ];
  selectedUserId: any;
  public rows: any;
  userRole: any;
  public temp: Array<object> = [];
  token;
  showUpdateForm = false;
  dateFormat: any;
  public userForm: FormGroup;
  isError = false;
  errorMessage: any;
  loading: any;

  constructor(
    public storageserv: StorageService,
    public alertController: AlertController,
    private http: HttpClient,
    private userServ: UsersService,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private ionLoader: LoaderService
  ) {

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
      infusionSoftId: new FormControl(''),
      userRole: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
    });
    this.token = this.storageserv.get('token');
  }
  ngAfterContentInit() { }
  get errorControl() {
    return this.userForm.controls;
  }
  ngOnInit() {
    this.getusers({ offset: 0 });
    // this.getusers();
  }

  getusers(pageInfo) {
    // get all users list
    // console.log("event", pageInfo);
    this.page.offset = pageInfo.offset;
    this.userServ.getUsers(this.page.offset + 1).subscribe(
      (usersdata: any) => {
        // this.page.offset = pageInfo.offset;
        // console.log("Users Data", usersdata);
        this.page = {
          offset: parseInt(usersdata.meta.page, 10) - 1, // (ServerPageNumber - 1) is ClientOffset used for PageNumbers
          size: usersdata.meta.perPage,
          totalElements: usersdata.meta.total,
          totalPages: usersdata.meta.pages
        };
        // console.log("page", this.page);
        this.temp = usersdata.data.users;
        this.rows = usersdata.data.users;
        // console.log("rows", this.rows);

        this.rows.forEach((v) => {
          const newDate = moment(v.createdAt).format('DD/MM/YYYY');
          v.createdAt = newDate;
        });
        //
      },
      (error) => {
        this.ionLoader.HideLoader();
      }
    );
  }

  getSelectedRow(selected) {
    // get selected row and show details of single user
    if (selected.type === 'click') {
      // //console.log('on click evevnt',selected.row);
      this.selectedUserId = selected.row._id;
      this.userRole = selected.row.role;
      this.userServ.getSelectedUserDetails(selected.row._id)
        .subscribe(
          (userdetail: any) => {
            // //console.log('userdetail' , userdetail);
            this.showUpdateForm = true;
            this.userForm.patchValue({
              firstName: selected.row.firstName,
              lastName: selected.row.lastName,
              email: selected.row.email,
              userRole: selected.row.role,
              infusionSoftId: selected.row.infusionSoftId,
            });
          },
          (error) => {
            // //console.log(error);
            this.isError = true;
            // this.errorMessage=error.error.error.message
          }
        );
    }
  }
  async deleteUser() {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert-popup',
      message: '<strong>Are you sure you want to delete this user?</strong>',
      buttons: [
        {
          text: 'Delete',
          cssClass: 'delete-button',
          handler: () => {
            //  //console.log('Confirm Okay');
            this.ionLoader.showLoader('Deleting User..');
            this.userServ.deleteUser(this.selectedUserId)
              .subscribe(
                (userdetail: any) => {
                  //   //console.log('userdetail' , userdetail);
                  if (userdetail) {
                    this.ionLoader.HideLoader();
                  }
                  // this.getusers();
                  this.showUpdateForm = false;
                },
                (error) => {
                  // //console.log(error);
                  this.ionLoader.HideLoader();
                  this.isError = true;
                  // this.errorMessage=error.error.error.message
                }
              );
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'ghost-button',
          handler: (blah) => {
            //  //console.log('Confirm Cancel: blah');
          },
        },
      ],
    });

    await alert.present();
  }

  async resetPassword() {
    //  //console.log('token in reset',this.token);

    const alert = await this.alertController.create({
      cssClass: 'custom-alert-popup',
      message: '<strong>Are you sure you want to reset password?</strong>',
      buttons: [{
        text: 'Reset',
        cssClass: 'solid-button',
        handler: () => {
          this.ionLoader.showLoader('Reseting Password');
          this.userServ.resetUsers(this.selectedUserId).subscribe(
            (response: any) => {
              if (response) {
                this.ionLoader.HideLoader();
                // console.log("response", response);
                this.presentAlert(response.data.message);
              }
            },
            (error) => {
              this.ionLoader.HideLoader();
              this.isError = true;
              // this.errorMessage=error.error.error.message
            }
          );
        },
      },
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'ghost-button',
        handler: (blah) => {
          //   //console.log('Confirm Cancel: blah');
        },
      },

      ],
    });

    await alert.present();
  }

  updateUser() {
    this.ionLoader.showLoader('Updating User..');
    const data = {
      firstName: this.userForm.value.firstName,
      lastName: this.userForm.value.lastName,
      role: this.userForm.value.userRole,
    };
    this.userServ.updateUser(this.selectedUserId, { ...data })
      .subscribe(
        (userdetail: any) => {
          if (userdetail) {
            this.ionLoader.HideLoader();
          }
          //   //console.log('userdetail' , userdetail);
          // this.getusers();
          this.showUpdateForm = false;
        },
        (error) => {
          //  //console.log(error);
          this.ionLoader.HideLoader();
          this.isError = true;
          // this.errorMessage=error.error.error.message
        }
      );
  }

  async presentAlert(message) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 700,
      position: 'top',
      animated: true,
      color: 'primary',
      cssClass: 'my custom class',
    });
    toast.present();

    await toast.onDidDismiss().then(() => { });
  }

  onSearchTerm(ev: CustomEvent) {
    const email = new EmailTest();
    const expression: RegExp = email.regularExpression;
    const a = expression.test(String(ev.detail.value).toLowerCase());
    // console.log('aaaaa',a);
    if (a) {
      // console.log('a is true');
      this.userServ.getUsers(this.page.offset + 1, null, ev.detail.value)
        .subscribe((usersdata: any) => {
          this.rows = usersdata.data.users;
          this.page = {
            offset: parseInt(usersdata.meta.page, 10) - 1, // (ServerPageNumber - 1) is ClientOffset used for PageNumbers
            size: usersdata.meta.perPage,
            totalElements: usersdata.meta.total,
            totalPages: usersdata.meta.pages
          };
        },
          (error) => {

          }
        );
    } else {
      this.userServ.getUsers(this.page.offset + 1, ev.detail.value)
        .subscribe((usersdata: any) => {
          this.rows = usersdata.data.users;
          this.page = {
            offset: parseInt(usersdata.meta.page, 10) - 1, // (ServerPageNumber - 1) is ClientOffset used for PageNumbers
            size: usersdata.meta.perPage,
            totalElements: usersdata.meta.total,
            totalPages: usersdata.meta.pages
          };
        },
          (error) => {

          }
        );
    }


    //// console.log("rows", this.rows);

    // const val = ev.detail.value;

    // if (val && val.trim() !== "") {
    //   this.rows = this.rows.filter((term) => {
    //     return (
    //       term.firstName.toLowerCase().indexOf(val.trim().toLowerCase()) > -1
    //     );
    //   });
    // } else {
    //   this.rows = this.temp;
    // }
  }

  // searchUser(event){
  //   //console.log('enter',event);

  //   if (event.code === "Enter") {
  //     //console.log('enter pressed');
  //   }
  // }

  setPage(pageInfo) {
    this.page.offset = pageInfo.offset;
    // this.serverResultsService.getResults(this.page).subscribe(pagedData => {
    //   this.page = pagedData.page;
    //   this.rows = pagedData.data;
    // });
  }
}
