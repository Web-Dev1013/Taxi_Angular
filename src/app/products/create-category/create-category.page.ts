import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ProductcategoriesService } from '../../Accessories/helpers/services/productcategories.service';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { find, get, pull } from 'lodash';
import { ProductTypeService } from '../../Accessories/helpers/services/product-type.service';
import { ProductService } from '../../Accessories/helpers/services/product.service';
import { ChildCategoryService } from '../../Accessories/helpers/services/child-category.service';
import { TagsService } from '../../Accessories/helpers/services/tags.service';
import { LoaderService } from '../../Accessories/helpers/services/loader.service';
import { ErrorsService } from '../../Accessories/helpers/services/errors.service';
// import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.page.html',
  styleUrls: ['./create-category.page.scss'],
})
export class CreateCategoryPage implements OnInit {


  @ViewChild('tagInput') tagInputRef: ElementRef;
  tagsList = [];
  tags: string[] = [];
  categoryList: any = [];
  slug: any;
  nullValue = null;
  productId: any;
  public productForm: FormGroup;
  disabled = true;
  openEditor = false;
  data: any;
  error: any;
  isError = false;
  lockedContent: any;
  customPopoverOptions: any = {
    showBackdrop: false
  };
  serverError: any;
  title: any;
  productGroups = [];
  productGroupId: any;
  touched = false;
  setValidation = false;
  getAllTags: any = [];
  selecteTag = false;
  tagName: any;
  showTagsList = false;
  constructor(
    public productServ: ProductService,
    public toastController: ToastController,
    private alertController: AlertController,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public ionLoader: LoaderService,
    private categoryServ: ProductcategoriesService,
    private childCategoryServ: ChildCategoryService,
    private tagsServ: TagsService, private eref: ElementRef,
    private errorServ: ErrorsService) {
    this.errorServ.notify.subscribe((result) => {
      // console.log('result', result.info[0])
      this.serverError = {};
      result.info.forEach(prop => {
        if (this.productForm.contains(prop.property)) {
          this.productForm.controls[prop.property]
            .setErrors({ serverError: Object.values(prop.constraints) });
          this.serverError[prop.property] = Object.values(prop.constraints).join('\n');
        }
      });
    });

    this.slug = this.route.snapshot.paramMap.get('id1');
    this.productForm = this.formBuilder.group(
      {
        title: new FormControl('',
          Validators.compose(
            [
              Validators.required,
              Validators.maxLength(50)
            ])),
        description: new FormControl('',
          Validators.compose(
            [
              Validators.required,
              Validators.maxLength(2000)
            ]
          )),
        tags: new FormControl(''),
        formModel: new FormControl(''),
        productType: new FormControl(''),
        status: new FormControl('draft',
          Validators.compose(
            [
              Validators.required
            ])),
        parentCategory: new FormControl(''),
      }
    );
  }
  get errorControl() {
    return this.productForm.controls;
  }

  ngOnInit() {
    console.log('parentCategory: this.nullValue', this.nullValue);

    this.productForm.patchValue({
      parentCategory: this.nullValue
    });

    this.getProductGroups();
    this.getProductCategories();
    this.getTags();
  }
  onClickSubmit() {
    this.ionLoader.showLoader('Creating');
    let formData: any;
    if (this.productForm.value.status === 'locked') {
      this.setValidation = true;
      formData = {
        title: this.productForm.value.title,
        productSlug: this.productId || this.slug,
        description: this.productForm.value.description,
        status: this.productForm.value.status,
        tags: this.tags || [],
        lockedPageContent: this.lockedContent || ''

      };
    }
    else {
      formData = {
        title: this.productForm.value.title,
        productSlug: this.productId || this.slug,
        description: this.productForm.value.description,
        status: this.productForm.value.status,
        tags: [],
        lockedPageContent: ''
      };
    }
    this.categoryServ.createCategory({ ...formData })
      .subscribe((response: any) => {
        if (response) {
          this.presentAlert(response.message);
         // this.ionLoader.HideLoader();
          this.isError = false;
        }
        else {
          this.ionLoader.HideLoader();
        }
      },
        error => {
          this.ionLoader.HideLoader();
          this.isError = true;
        });
  }

  changeStateCallback(e) {
    ////// console.log('open',e);
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
    //  this.productForm.reset();

      // this.productForm.patchValue({
      //     status: 'draft',
      //     productType: this.title
      //   });

       this.location.back();
    });
  }
  back() {
    this.location.back();
  }
  getProductGroups() {
    this.productServ.getAllProducts()
      .subscribe((response: any) => {
        //// console.log('response',response.data.products);
        this.productGroups = response.data.products;
        this.productGroupId = this.productGroups.find(v => v.slug === this.slug);
        this.title = this.productGroupId.title;
        this.productForm.patchValue({
          status: 'draft',
          productType: this.title
        });
      },
        error => {
          this.isError = true;
        });
  }
  getProductCategories() {
    this.categoryServ.getCategories()
      .subscribe((response: any) => {
        this.categoryList = response.data.categories.filter(v => v.productId === this.slug);
      },
        error => {
          this.isError = true;
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
          this.isError = true;
        });
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
        if (this.tags.length > 0) {
          this.disabled = false;
        }
        this.selecteTag = true;
        this.tagName = tag;

      }
    }
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

    const val = ev.detail.value;

    if (val && val.trim() !== '') {
      this.showTagsList = true;
      this.tagsList = this.tagsList.filter(term => {
        return term.name.toLowerCase().indexOf(val.trim().toLowerCase()) > -1;
      });
    }
    else {
      this.tagsList = this.getAllTags;
      this.showTagsList = false;
    }
  }

  clickedTag(tagName) {
    this.addTag(tagName);
  }
  searchBarOnFocus(e) {
    this.showTagsList = true;
  }
  checkBlur() {
    this.showTagsList = false;
  }

  onClick(event) {
    if (!this.eref.nativeElement.contains(event.target)) { // or some similar check
      this.showTagsList = false;
    }
  }

  hideTagList() {
    this.showTagsList = false;
  }

  getEditorValue(data) {
    this.lockedContent = data;
  }

}
