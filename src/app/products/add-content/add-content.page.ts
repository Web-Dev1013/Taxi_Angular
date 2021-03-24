import { Component, OnInit, ViewChild, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ContentService } from '../../Accessories/helpers/services/content.service';
import { AlertController, ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { find, get, pull } from 'lodash';
import { ProductcategoriesService } from '../../Accessories/helpers/services/productcategories.service';
import { baseUrl } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from '../../Accessories/helpers/services/storage.service';
import { ErrorsService } from '../../Accessories/helpers/services/errors.service';
@Component({
  selector: 'app-add-content',
  templateUrl: './add-content.page.html',
  styleUrls: ['./add-content.page.scss'],
})
export class AddContentPage implements OnInit, AfterViewInit {


  constructor(
    public toastController: ToastController,
    public alertController: AlertController,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    private ContentServ: ContentService,
    private categoryServ: ProductcategoriesService,
    private modalCtrl: ModalController,
    private http: HttpClient,
    private storageServ: StorageService,
    private errorServ: ErrorsService,
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
    this.token = this.storageServ.get('token');
    if (this.route.snapshot.queryParamMap.get('childCategoryId')) {
      this.childCategoryId = this.route.snapshot.queryParamMap.get('childCategoryId');
    }
    if (this.route.snapshot.queryParamMap.get('subCategoryId')) {
      this.subCategoryId = this.route.snapshot.queryParamMap.get('subCategoryId');
      //// console.log('id exists');
      this.fromSubCategory = true;
    }
    else {
      //// console.log('id doesnot exist');
      this.fromCategory = true;
    }
    this.slug = this.route.snapshot.paramMap.get('id1');
    // form
    this.productForm = this.formBuilder.group(
      {
        title: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100)])),
        description: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(2000)])),
        // formModel :new FormControl('',Validators.required),
        productType: new FormControl(''),
        visibility: new FormControl('', Validators.compose([Validators.required])),
        commentDisabled: new FormControl(''),
        parentCategory: new FormControl(''),
      }
    );
  }
  get errorControl() {
    return this.productForm.controls;
  }

  touched = false;
  @ViewChild('tagInput') tagInputRef: ElementRef;
  tags: string[] = [];
  type: any;
  public options: object = {
    placeholder: 'Edit Me',
    events: {
      focus(e, editor) {
        //// console.log(editor.selection.get());
      },
    },
    apiKey: '8JF3bA2B5C3D4F-11SLJCKHXOSLMc1YGSGb1ZXHSe1CgB5A4A3D4E3C2A11A19B6C5==',
  };
  slug: any;
  lockedContent: any = null;
  token: any;
  subCategoryId: any;
  public productForm: FormGroup;
  disabled = true;
  openEditor = false;
  data: any;
  isError = false;
  Error: any;
  title: string;
  serverError: any;
  fromCategory = false;
  fromSubCategory = false;
  childCategoryId: any;
  contentBody = false;
  emptyEditor = false;

  ngOnInit() {
    this.productForm.patchValue({
      visibility: 'draft',
      commentDisabled: 'false'
    });
    if (this.fromCategory) {
      this.getallCategories();
    }
    else if (this.fromSubCategory) {
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.contentBody = true;
    }, 100);
  }


  onClickSubmit() {
    if (this.fromCategory) {
      this.createContent();
    } else if (this.fromSubCategory) {
      this.createPostFromSubcategory();
    }
    else if (this.fromSubCategory) {
      this.createPostFromSubcategory();
    }
  }
  changeStateCallback(e) {
    if (e.detail.value === 'locked') {
      this.openEditor = true;
      this.disabled = true;
    }
    else {
      this.openEditor = false;
    }
  }

  createContent() {
    const categoryId = this.slug;
    const formData: any = {
      title: this.productForm.value.title,
      categorySlug: categoryId,
      description: this.productForm.value.description,
      status: this.productForm.value.visibility,
      // body: this.productForm.value.formModel,
      body: this.lockedContent,
      contentType: 'post',
      commentDisabled: this.productForm.value.commentDisabled === 'true' ? true : false
    };
    this.ContentServ.createContent({ ...formData })
      .subscribe((response: any) => {
        this.presentAlert(response.message);
        this.isError = false;
      });
  }
  async presentAlert(message) {
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
      // this.productForm.reset();
      // this.contentBody= true;
      // this.emptyEditor= true;
      // this.productForm.patchValue({
      //   visibility: 'draft',
      //   commentDisabled: 'false',
      //   parentCategory: this.title
      // })
      this.location.back();
    });
  }

  back() {
    this.location.back();
  }

  getallCategories() {
    this.categoryServ.getCategories()
      .subscribe((response: any) => {
        this.title = response.data.categories.find(v => v.slug === this.slug).title;
        this.productForm.patchValue({
          parentCategory: this.title
        });
      });
  }

  createPostFromSubcategory() {
    const formData = {
      title: this.productForm.value.title,
      description: this.productForm.value.description,
      // body: this.productForm.value.formModel,
      body: this.lockedContent,
      status: this.productForm.value.visibility,
      commentDisabled: this.productForm.value.commentDisabled === 'true' ? true : false
    };
    this.ContentServ.createSubcategoryPost(this.subCategoryId, { ...formData })
      .subscribe((product: any) => {
        this.presentAlert(product.message);
      },
        error => {
          this.isError = true;
        });
  }
  getEditorValue(data) {
    if (data) {
      this.lockedContent = data;
    }
    else {
      this.lockedContent = null;
    }

  }



}
