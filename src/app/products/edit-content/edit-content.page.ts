import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { ContentService } from '../../Accessories/helpers/services/content.service';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Storage } from '@ionic/storage';
import { baseUrl } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { StorageService } from '../../Accessories/helpers/services/storage.service';
import { ToastController } from '@ionic/angular';
import { find, get, pull } from 'lodash';
import { ErrorsService } from '../../Accessories/helpers/services/errors.service';
import { ProductcategoriesService } from '../../Accessories/helpers/services/productcategories.service';
import { RevisionsService } from '../../Accessories/helpers/services/revisions.service';

@Component({
  selector: 'app-edit-content',
  templateUrl: './edit-content.page.html',
  styleUrls: ['./edit-content.page.scss'],
})
export class EditContentPage implements OnInit {
  @ViewChild('tagInput') tagInputRef: ElementRef;
  touched = false;
  tags: string[] = [];
  lockedContent: any;
  isError = false;
  Error: any;
  contentId: any;
  categoryID: any;
  productTitle: string;
  selectedCategory: any;
  postId: any;
  openEditor = false;
  disabled: boolean;
  data: any;
  token: any;
  fromSubCategory = false;
  fromCategory = false;
  selectedcontent: any;
  subCategoryId: any;
  categoryTitle: any;
  childCategoryId: any;
  serverError: any;
  revisions: [];
  productTypeTitle: string;
  categoryName: string;
  productName: string;

  public productForm: FormGroup;
  constructor(
    public toastController: ToastController,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    private storage: Storage,
    private contentServ: ContentService,
    private storageServ: StorageService,
    private http: HttpClient,
    private productCategoryServ: ProductcategoriesService,
    private errorServ: ErrorsService,
    private revisionServ: RevisionsService
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
    this.productName = this.route.snapshot.paramMap.get('id');
    // this.categoryName = this.route.snapshot.paramMap.get('id2');
    this.categoryName = this.route.snapshot.paramMap.get('id1');
    this.postId = this.route.snapshot.queryParamMap.get('postId');
    if (this.route.snapshot.queryParamMap.get('childCategoryId')) {
      this.childCategoryId = this.route.snapshot.queryParamMap.get(
        'childCategoryId'
      );
    }
    if (this.route.snapshot.queryParamMap.get('subCategoryId')) {
      ////// console.log('true');
      this.fromSubCategory = true;
      this.subCategoryId = this.route.snapshot.queryParamMap.get(
        'subCategoryId'
      );
      this.postId = this.route.snapshot.queryParamMap.get('postId');
      ////// console.log('subCategoryId');
    } else {
      ////// console.log('false');
      this.fromCategory = true;
    }
    this.token = this.storageServ.get('token');
    // this.contentId = this.route.snapshot.queryParamMap.get('contentId');
    this.categoryID = this.route.snapshot.paramMap.get('id2');
    //////// console.log('content id',this.contentId);
    ////// console.log('category Id ', this.categoryID);

    // form
    this.productForm = this.formBuilder.group({
      title: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.maxLength(100)])
      ),
      description: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.maxLength(2000)])
      ),
      visibility: new FormControl(''),
      formModel: new FormControl(''),
      productCategory: new FormControl(''),
      commentDisabled: new FormControl(''),
    });
  }

  get errorControl() {
    return this.productForm.controls;
  }

  async ngOnInit() {
    // this.getSelectedProduct();
    await this.getRevisionsForPost();
    if (this.fromSubCategory) {
      await this.getPostDetailFromSubCategory();
    } else if (this.fromCategory) {
      await this.getSelectedContent();
      this.getAllCategories();
    }
  }

  // onClickSubmit(){
  //   this.updateContent();
  // }

  changeStateCallback(e) {
    if (e.detail.value === 'locked') {
      this.openEditor = true;
      this.disabled = true;
      // this.productForm.get('tags').setValidators(Validators.required)
      // this.productForm.get('formModel').setValidators(Validators.required)
    } else {
      this.openEditor = false;
      this.disabled = false;
    }
  }

  getSelectedContent() {
    this.contentServ.getContentDetails(this.postId)
      .subscribe(
        (content: any) => {
          this.storageServ.set(
            'recentVersion',
            JSON.stringify(content.data.content)
          );
          this.selectedcontent = content.data.content;
          ////// console.log('selected Content', this.selectedcontent);

          this.lockedContent = this.selectedcontent.body;
          this.productForm.patchValue({
            title: this.selectedcontent.title,
            description: this.selectedcontent.description,
            visibility: this.selectedcontent.status,
            commentDisabled: this.selectedcontent.commentDisabled
              ? this.selectedcontent.commentDisabled.toString()
              : 'false',
          });
          this.openEditor = true;
          this.disabled = true;
        },
        (error) => {
          this.isError = true;
          // this.Error = error.error.error.message
          ////// console.log(error.error.error.message);
        }
      );
  }

  updateContent() {
    let formData: any;
    formData = {
      title: this.productForm.value.title,
      categorySlug: this.categoryID,
      description: this.productForm.value.description,
      status: this.productForm.value.visibility,
      body: this.lockedContent,
      contentType: 'post',
      commentDisabled: this.productForm.value.commentDisabled === 'true' ? true : false
    };

    this.contentServ.updateSimplePost(this.postId, { ...formData })
      .subscribe(
        (product: any) => {
          ////// console.log('selected Product' , product);
          this.isError = false;
          this.presentAlert(product.message);
          // this.location.back();
        },
        (error) => {
          this.isError = true;
          // this.Error = error.error.error.message
          ////// console.log(error.error.error.message);
        }
      );
  }

  // async presentAlert(message) {
  //   const alert = await this.alertController.create({
  //     cssClass: 'my-custom-class',
  //     message: message,
  //     buttons: ['OK']
  //   });

  //   await alert.present();
  //   await alert.onDidDismiss().then(()=>{
  //     this.location.back();
  //     this.loaderOnOperations();
  //   });
  // }

  async presentAlert(message) {
    const toast = await this.toastController.create({
      message,
      duration: 700,
      position: 'top',
      animated: true,
      color: 'primary',
      cssClass: 'my custom class',
    });
    toast.present();

    await toast.onDidDismiss().then(() => {
      this.location.back();
    });
  }

  back() {
    this.location.back();
  }

  getPostDetailFromSubCategory() {
    this.contentServ.getSubCategoryPostDetail(this.subCategoryId, this.postId)
      .subscribe(
        (product: any) => {
          this.storageServ.set('recentVersion', JSON.stringify(product.data.post));
          ////// console.log('post from subcategory ' , product);
          this.isError = false;
          this.lockedContent = product.data.post.body;

          this.productForm.patchValue({
            title: product.data.post.title,
            description: product.data.post.description,
            visibility: product.data.post.status,
            commentDisabled: product.data.post.commentDisabled
              ? product.data.post.commentDisabled.toString()
              : 'false',
          });
        },
        (error) => {
          this.isError = true;
          // this.Error = error.error.error.message
          ////// console.log(error.error.error.message);
        }
      );
  }

  editSubCategoryPost() {
    const formData = {
      title: this.productForm.value.title,
      body: this.lockedContent,
      description: this.productForm.value.description,
      status: this.productForm.value.visibility,
      commentDisabled:
        this.productForm.value.commentDisabled === 'true' ? true : false,
    };
    ////// console.log('ids' , this.subCategoryId , this.postId);
    this.contentServ.editSubactegoryPost(this.subCategoryId, this.postId, { ...formData })
      .subscribe(
        (product: any) => {
          ////// console.log('post from subcategory ' , product);
          this.isError = false;
          this.presentAlert(product.message);
        },
        (error) => {
          this.isError = true;
          // this.Error = error.error.error.message
          ////// console.log(error.error.error.message);
        }
      );
  }

  onClickSubmit() {
    if (this.fromSubCategory) {
      this.editSubCategoryPost();
    } else if (this.fromCategory) {
      this.updateContent();
    }
  }

  getAllCategories() {
    this.productCategoryServ.getCategories().subscribe((data: any) => {
      this.categoryTitle = data.data.categories.find(
        (v) => v.slug === this.categoryID
      ).title;
      this.productForm.patchValue({
        productCategory: this.categoryTitle,
      });
    });
  }

  getEditorValue(data) {
    //// console.log('data',data);
    if (data) {
      //// console.log('data true',data);
      this.lockedContent = data;
    } else {
      this.lockedContent = ' ';
      //// console.log('locked content',this.lockedContent);
    }

    console.log('locked---', this.lockedContent);

  }

  getrevisions(editorData) { // function to get revision from editor component and Hit update API
    console.log('editor data', editorData);

    if (this.fromSubCategory) {
      const formData = {
        title: this.productForm.value.title,
        body: this.lockedContent,
        description: this.productForm.value.description,
        status: this.productForm.value.visibility,
      };
      console.log('sub category editorData', editorData);
      this.revisionServ.subCategoryPostRevisions(
        this.subCategoryId, this.postId, { ...formData })
        .subscribe((response: any) => {
          console.log(response.message);
        });
    }
    else {
      const postData = {
        title: this.productForm.value.title,
        categorySlug: this.categoryID,
        description: this.productForm.value.description,
        status: this.productForm.value.visibility,
        body: this.lockedContent,
        contentType: 'post',
      };
      this.revisionServ.postRevisions(this.postId, { ...postData })
        .subscribe((response: any) => {
          this.revisions = response.data;
          console.log(response.message);
        });
    }
  }

  getRevisionsForPost() { // function to get all revisions from  backend
    if (this.fromSubCategory) {
      this.revisionServ
        .getSubCategoryPostRevision(this.subCategoryId, this.postId)
        .subscribe((response: any) => {
          console.log('subcategoryPostrevision', response);
          this.revisions = response.data;
          this.storageServ.set('revisions', JSON.stringify(this.revisions));
        });
    }
    else {
      this.revisionServ.getPostRevision(this.postId)
        .subscribe((response: any) => {
          console.log('post Revisions', response);
          this.revisions = response.data;
          this.storageServ.set('revisions', JSON.stringify(this.revisions));
        });
    }
  }

  goToRevisions() {
    if (this.fromSubCategory) {
      this.router.navigate(
        [`/products/${this.productName}/${this.categoryName}/${this.subCategoryId}/${this.postId}/revisions`]
      );
    }
    else {
      this.router.navigate(
        [`/products/${this.productName}/${this.categoryName}/${this.postId}/revisions`]
      );
    }
  }
}


