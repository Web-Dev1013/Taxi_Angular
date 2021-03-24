import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap, NavigationEnd } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { baseUrl } from '../../../environments/environment';
import { StorageService } from '../../Accessories/helpers/services/storage.service';
import { ProductService } from '../../Accessories/helpers/services/product.service';
import { ProductTypeService } from '../../Accessories/helpers/services/product-type.service';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { find, get, pull } from 'lodash';
import { TagsService } from '../../Accessories/helpers/services/tags.service';
import { LoaderService } from '../../Accessories/helpers/services/loader.service';
import { HttpErrorInterceptor } from '../../Accessories/helpers/services/interceptors/httperrorinterceptor.service';
import { ErrorsService } from '../../Accessories/helpers/services/errors.service';
@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.page.html',
  styleUrls: ['./add-products.page.scss'],
})

export class AddProductsPage implements OnInit {

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoaderService,
    private activeRoute: ActivatedRoute,
    private http: HttpClient,
    private storageserv: StorageService,
    private productServ: ProductService,
    public router: Router,
    private pTypeServ: ProductTypeService,
    private alertController: AlertController,
    public toastController: ToastController,
    private tagsServ: TagsService,
    private httpInterServ: HttpErrorInterceptor,
    private errorServ: ErrorsService
  ) {

    this.errorServ.notify.subscribe((result) => {
      // console.log('result', result.info[0])
      this.serverError = {};
      result.info.forEach(prop => {
        if (this.productForm.contains(prop.property)) {
          // console.log('property',prop.property);
          // console.log('property',prop.constraints);
          this.productForm.controls[prop.property]
            .setErrors({ serverError: Object.values(prop.constraints) });
          // console.log('prop const', Object.values(prop.constraints));
          this.serverError[prop.property] = Object.values(prop.constraints).join('\n');
          // console.log('error===',this.serverError );
        }
      });
    });
    this.token = this.storageserv.get('token');
    this.productTypeId = this.activeRoute.snapshot.queryParamMap.get('productTypeId');
    this.productForm = this.formBuilder.group(
      {
        title: new FormControl('', Validators.compose(
          [
            Validators.required,
            Validators.maxLength(50)
          ]
        )),
        description: new FormControl('', Validators.compose(
          [
            Validators.required,
            Validators.maxLength(2000)
          ]
        )),
        tags: new FormControl(''),
        formModel: new FormControl(''),
        productType: new FormControl(''),
        status: new FormControl('draft', Validators.compose(
          [
            Validators.required
          ]
        )),
      }
    );
  }
  get errorControl() {
    return this.productForm.controls;
  }


  @ViewChild('tagInput') tagInputRef: ElementRef;
  tags: string[] = [];
  touched = false;
  token: any;
  public productForm: FormGroup;
  productTypes: any;
  isError = false;
  disabled = true;
  Error: any;
  openEditor = false; // to open editor or not
  productTypeId: string;
  customPopoverOptions: any = {
    showBackdrop: false
  };
  lockedContent: any;
  serverError: any;
  tagsList = [];
  selectedValue: any;
  getAllTags: any = [];

  selecteTag = false;
  tagName: any;

  showTagsList = false;
  ngOnInit() {
    this.getAllProductTypes();
    this.productForm.patchValue(
      {
        productType: this.productTypeId,
        status: 'draft'
      }
    );
    this.getTags();
  }

  back() {
    this.location.back();
  }
  onClickSubmit() {
    let formData: any;
    if (this.productForm.value.status === 'locked') {
      formData = {
        title: this.productForm.value.title,
        groupSlug: this.productForm.value.productType,
        description: this.productForm.value.description,
        status: this.productForm.value.status,
        // tags: this.tags,
        tags: this.tags || [],
        lockedPageContent: this.lockedContent || ''
      };
    }
    else {
      formData = {
        title: this.productForm.value.title,
        groupSlug: this.productForm.value.productType,
        description: this.productForm.value.description,
        status: this.productForm.value.status,
        // tags: this.tags,
        tags: [],
        lockedPageContent: ''
      };
    }

    this.productServ.addNewProduct({...formData})
      .subscribe((userdetail: any) => {
        //// console.log('userdetail' , userdetail);
        this.presentToastWithOptions(userdetail.message);

        this.isError = false;
      },
        error => {

          // this.Error = error;
          //// console.log('error',this.httpInterServ.httpError);


          // this.Error = error.error.error.info[0].constraints.isNotEmpty || error.error.error.message
          //// console.log(error);
        });



  }


  getValue(e) {
    //// console.log('open editor',e);

  }
  changeStateCallback(e) {
    if (e.detail.value === 'locked') {
      this.disabled = true;
      this.openEditor = true;
      this.productForm.controls.tags.setValidators(Validators.required);
      this.productForm.controls.formModel.setValidators(Validators.required);
    }
    else {
      this.openEditor = false;
      this.disabled = false;
    }
  }
  getAllProductTypes() {
    this.pTypeServ.getAllProductTypes()
      .subscribe((response: any) => {
        //// console.log('response',response.data.groups);
        this.productTypes = response.data.groups;
        this.isError = false;
        const value: any = this.productTypes.find(v => v.slug === this.productTypeId);
        this.selectedValue = value.title;
        //// console.log('selected value totle',value);
        //// console.log('selected value totle',value.title);

      },
        error => {
          this.isError = true;
          // this.Error = error.error.error.message
        });
  }



  async presentToastWithOptions(message) {
    const toast = await this.toastController.create({
      message,
      duration: 700,
      position: 'top',
      animated: true,
      color: 'primary',
      cssClass: 'my custom class'
    });
    toast.present();

    await toast.onDidDismiss().then(() => {
      this.location.back();
      // this.productForm.reset();
      // this.productForm.patchValue(
      //   {
      //     productType: this.productTypeId,
      //     status: 'draft'
      //   }
      // );

    });
  }
  getTags() {
    this.tagsServ.displayTags().
      subscribe((response: any) => {
        // console.log('response tags',response);
        this.tagsList = response.data.tags;
        this.getAllTags = this.tagsList;
      },
        error => {
          // this.Error = error.error.error.message
          this.isError = true;
        }
      );
  }
  focusTagInput(): void {
    this.tagInputRef.nativeElement.focus();
  }

  onKeyUp(event: KeyboardEvent): void {
    const inputValue: string = this.productForm.controls.tags.value;
    if (event.code === 'Backspace' && !inputValue) {
      this.removeTag();
      return;
    } else {
      if (event.code === 'Comma' || event.code === 'Space' || event.code === 'Enter') {
        this.addTag(inputValue);
        this.productForm.controls.tags.setValue('');
        //// console.log('input value', inputValue)
        //// console.log('this.tags',this.tags);


      }
    }
  }

  addTag(tag: string): void {
    // if tag already exists
    const findTag = this.tags.find((v) => v === tag);
    // console.log('findTag',findTag);
    if (findTag) {
      // console.log('tag exists');
      tag = null;
    }
    else {
      if (tag[tag.length - 1] === ',' || tag[tag.length - 1] === ' ') {
        tag = tag.slice(0, -1);
      }
      if (tag.length > 0 && !find(this.tags, tag)) {
        this.tags.push(tag);
        this.productForm.value.tags = this.tags;
        // //console.log('tags value',this.productForm.value.tags);
        // this.productForm.value.tags.updateValueAndValidity();
        if (this.tags.length > 0) {
          this.disabled = false;
        }
        this.selecteTag = true;
        this.tagName = tag;

      }
    }



    // if tag doesnot exist

  }

  removeTag(tag?: string): void {
    if (!!tag) {
      pull(this.tags, tag);
      if (this.tags.length === 0) {
        this.disabled = true;
      }

    } else {
      this.tags.splice(-1);
      if (this.tags.length === 0) {
        this.disabled = true;
      }
    }
  }

  onSearchTerm(ev: CustomEvent) {

    // console.log('tagsList',this.tagsList);

    const val = ev.detail.value;

    if (val && val.trim() !== '') {
      this.showTagsList = true;
      this.tagsList = this.tagsList.filter(term => {
        return term.name.toLowerCase().indexOf(val.trim().toLowerCase()) > -1;
      });
    }
    else {
      this.showTagsList = false;
      this.tagsList = this.getAllTags;
    }
  }

  clickedTag(tagName) {
    // console.log('tag Name',tagName);
    this.addTag(tagName);
  }
  searchBarOnFocus(e) {
    this.showTagsList = true;
  }
  checkBlur() {
    this.showTagsList = false;
  }
  hideTagList() {
    this.showTagsList = false;
  }

  getEditorValue(data) {
    this.lockedContent = data;
  }







}
