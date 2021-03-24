import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  HostListener
} from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { DatastorageService } from '../../Accessories/helpers/services/datastorage.service';
import { StorageService } from '../../Accessories/helpers/services/storage.service';
import { ErrorsService } from '../../Accessories/helpers/services/errors.service';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ProductService } from '../../Accessories/helpers/services/product.service';
import { Storage } from '@ionic/storage';
import { baseUrl } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController, AlertController } from '@ionic/angular';
import { find, get, pull } from 'lodash';
import { ModalController, PopoverController } from '@ionic/angular';
// import {CreateCategoryPage} from '../create-category/create-category.page';
import { IonSelect } from '@ionic/angular';
import { PopoverPage } from '../../Accessories/popovers/popover/popover.page';
import { MultiSelectPopoverPage } from '../../Accessories/popovers/multi-select-popover/multi-select-popover.page';
import { ProductTypeService } from '../../Accessories/helpers/services/product-type.service';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  merge,
} from 'rxjs/operators';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { TagsService } from '../../Accessories/helpers/services/tags.service';
import { ProductcategoriesService } from '../../Accessories/helpers/services/productcategories.service';
import { LoaderService } from '../../Accessories/helpers/services/loader.service';
import { ToastService} from '../../Accessories/helpers/services/toast.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.page.html',
  styleUrls: ['./edit-product.page.scss'],
})
export class EditProductPage implements OnInit, OnDestroy {
  constructor(
    public toastController: ToastController,
    private productService: ProductService,
    private storagesrv: StorageService,
    private dataserv: DatastorageService,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private storage: Storage,
    private http: HttpClient,
    private modalController: ModalController,
    private popoverCtrl: PopoverController,
    private pTypeServ: ProductTypeService,
    private tagsServ: TagsService,
    private categoryServ: ProductcategoriesService,
    public alertController: AlertController,
    private ionLoader: LoaderService,
    private errorServ: ErrorsService,
    private elementRef: ElementRef,
    private toastServ: ToastService
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
    // get id of activated route
    this.slug1 = this.route.snapshot.paramMap.get('id');
    // this.slug = this.route.snapshot.paramMap.get('id1')
    this.productTitle = this.route.snapshot.queryParamMap.get('productId');
    //// console.log(this.productTitle,"product title");

    this.slug = this.route.snapshot.queryParamMap.get('productId');
    //// console.log(this.productTitle,"product title");

    // token
    this.token = this.storagesrv.get('token');
    //// console.log('token',this.token);

    // form
    this.productForm = this.formBuilder.group({
      title: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.maxLength(50)])
      ),
      description: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.maxLength(2000)])
      ),
      status: new FormControl(''),
      tags: new FormControl(''),
      formModel: new FormControl(''),
      productType: new FormControl(''),
      tinyMCE: new FormControl(''),
    });
  }

  get errorControl() {
    return this.productForm.controls;
  }
  @ViewChild('tagInput') tagInputRef: ElementRef;
  @ViewChild('createCategory') create: IonSelect;
  @ViewChild('instance') instance: NgbTypeahead;
  @ViewChild('content') con: ElementRef;
  @ViewChild('tinyMce') tinyMce: ElementRef;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  tags: string[] = [];
  sub;
  productTypes: any;
  selectedType: any;
  data: any;
  productName: any;
  slug1: any;
  slug: any;
  openEditor = false;
  disabled = false;
  token: any;
  public productForm: FormGroup;
  productTitle: string;
  productCategories: any;
  selectedProduct: any;
  isError = false;
  Error: any;
  categories: any;
  serverError: any;
  isItemAvailable = false;
  touched = false;
  items = ['hello', 'hey', 'heeeee'];
  customPopoverOptions: any = {
    showBackdrop: false,
  };
  public options: object = {
    placeholder: 'Edit Me',
    events: {
      focus(e, editor) {
        //// console.log(editor.selection.get());
      },
    },
    emoticonsUseImage: true,
    emoticonsStep: 10,

    apiKey:
      '8JF3bA2B5C3D4F-11SLJCKHXOSLMc1YGSGb1ZXHSe1CgB5A4A3D4E3C2A11A19B6C5==',
  };

  tagsList = [];
  showSelect = false;
  showList = false;

  lockedContent: any;
  childCategories: any;
  selectedId: any;
  openAccordian = false;
  getAllTags: any = [];
  selecteTag = false;
  tagName: any;

  showTagsList = false;
  dataFromChild: any;
  async ngOnInit() {
    // this.getSelectedProduct();
    this.getSingleProduct();
    this.getCategories();
    // this.getAllContent();
    await this.getAllProductTypes();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.getCategories();
        this.openAccordian = false;
      });
    this.getTags();
  }

  onClickSubmit() {
    this.editProduct();
  }

  addNewCategory() {
    this.router.navigate([`/products/${this.slug}/create`]);
  }

  changeStateCallback(e) {
    // console.log("ion change", e);

    if (
      e.detail.value === 'locked' &&
      this.selectedProduct.status === 'locked'
    ) {
      // console.log("case 1");
      this.disabled = false;
      this.openEditor = true;
      // this.productForm.controls["tags"].setValidators(Validators.required);
      // this.productForm.controls["formModel"].setValidators(Validators.required);
    } else if (
      e.detail.value === 'locked' &&
      this.selectedProduct.status !== 'locked'
    ) {
      // console.log("case 2");
      this.disabled = true;
      this.openEditor = true;
      // this.productForm.controls["tags"].setValidators(Validators.required);
      // this.productForm.controls["formModel"].setValidators(Validators.required);
    } else if (
      e.detail.value === 'published' ||
      this.selectedProduct.status === 'published' ||
      e.detail.value === 'draft' ||
      this.selectedProduct.status === 'draft'
    ) {
      // console.log("case 3");
      this.openEditor = false;
      this.disabled = false;
    }
  }
  getSingleProduct() {
    this.productService.getProductDetails(this.slug)
      .subscribe(
        (product: any) => {
          //// console.log('selected Product' , product.data.product);
          this.selectedProduct = product.data.product;
          this.isError = false;
          this.productName = product.data.product.title;
          this.tags = this.selectedProduct.tags;
          if (product.data.product.status === 'locked') {
            this.lockedContent = this.selectedProduct.lockedPageContent;
            this.productForm.patchValue({
              title: this.selectedProduct.title,
              description: this.selectedProduct.description,
              status: this.selectedProduct.status,
              formModel: this.selectedProduct.lockedPageContent,
              // added on 18 nov,2020
            });
            this.openEditor = true;
            // this.disabled = true
          } else {
            this.productForm.patchValue({
              title: this.selectedProduct.title,
              description: this.selectedProduct.description,
              status: this.selectedProduct.status,
            });
          }
        },
        (error) => {
          this.isError = true;
          // this.Error = error.error.error.message
          //// console.log(error.error.error.message);
        }
      );
  }
  editProduct() {
    let formData: any;
    if (this.productForm.value.status === 'locked') {
      formData = {
        title: this.productForm.value.title,
        groupSlug: this.productForm.value.productType || this.slug1,
        description: this.productForm.value.description,
        status: this.productForm.value.status,
        // tags: this.tags,
        tags: this.tags,
        // lockedPageContent: this.productForm.value.formModel
        lockedPageContent: this.dataFromChild,
      };
    } else {
      formData = {
        title: this.productForm.value.title,
        groupSlug: this.productForm.value.productType || this.slug1,
        description: this.productForm.value.description,
        status: this.productForm.value.status,
        tags: [],
        lockedPageContent: '',
      };
    }
    this.ionLoader.showLoader('updating');
    this.productService.editProduct(this.productTitle, { ...formData })
      .subscribe(
        (product: any) => {
          //// console.log('selected Product' , product.data.product);
          if (product) {
            // console.log("using Loader");
            this.ionLoader.HideLoader();
          }
          this.selectedProduct = product.data.product;
          this.isError = false;
          this.presentAlert(product.data.message);
        },
        (error) => {
          this.isError = true;
          this.ionLoader.HideLoader();
          // this.Error = error.error.error.info[0].constraints.isNotEmpty || error.error.error.messages
          //// console.log(error.error.error.message);
        }
      );
  }

  getCategories() {
    this.categoryServ.getCategories()
      .subscribe(
        (category: any) => {
          // console.log("categoried Gained", category);

          this.categories = category.data.categories.filter((cat) => {
            return cat.productId !== null && cat.productId.slug === this.slug;
          });
          this.isError = false;
          //// console.log('selected categories' , category);
        },
        (error) => {
          this.ionLoader.HideLoader();
          this.isError = true;
          // this.Error = error.error.error.message
          //// console.log(error.error.error.message);
        }
      );
  }

  getCategoryDetail(detail) {
    //// console.log('details',detail)
    // this.storage.set('category',this.data);
    this.elementRef.nativeElement.remove();
    this.router.navigate([`/products/${this.slug1}/edit/${this.slug}`], {
      queryParams: { categoryId: detail.slug },
    });

  }

  back() {
    this.location.back();
  }

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
      // this.location.back();
    });
  }

  getValueFromCreate(e) {
    //// console.log('event',e.detail.value);
    if (e.detail.value === 'subcategory') {
    } else {
    }
  }

  onReorderItems(event) {
    // //console.log(`Move item from ${event.detail.from} to ${event.detail.to}`);
    const draggedItem = this.categories.splice(event.detail.from, 1)[0];
    this.categories.splice(event.detail.to, 0, draggedItem);

    const sortedCategoriesRequest = {
      categories: this.categories.map(({ slug }, order) => {
        return { categorySlug: slug, sortOrder: order + 1 };
      }),
    };
    this.categoryServ.sortCategories(sortedCategoriesRequest).subscribe(
      (response: any) => {
        event.detail.complete();
      },
      (error) => {
        event.detail.complete();
      }
    );
  }

  getAllProductTypes() {
    this.pTypeServ.getAllProductTypes().subscribe(
      (response: any) => {
        //// console.log('response product types',response.data.groups);
        this.productTypes = response.data.groups;
        this.isError = false;
        const value: any = this.productTypes.find((v) => v.slug === this.slug1);
        this.productForm.patchValue({
          productType: value.slug,
        });
        // console.log("value", this.productForm.value.productType);

        this.selectedType = value.title;
        //// console.log('selected value totle',value);
        this.openAccordian = false;
        ////// console.log('selected value totle',value.title);
      },
      (error) => {
        this.isError = true;
        // this.Error = error.error.error.message
      }
    );
  }

  initializeItems() {
    this.items = ['Ram', 'gopi', 'dravid'];
  }

  getItems(ev: any) {
    this.showList = true;
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() !== '') {
      this.isItemAvailable = true;
      this.items = this.items.filter((item) => {
        return item.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    } else {
      this.isItemAvailable = false;
    }
  }

  addCategory() {
    this.router.navigate([`/products/${this.productTitle}/create`]);
  }
  getChildCategories(parentCategory) {
    //// console.log('parentCategory',parentCategory);
    this.openAccordian = true;
    this.selectedId = parentCategory.slug;
    this.childCategories = parentCategory.children;
  }

  getChildCategoryDetail(parentCategory, detail) {
    //// console.log('detail', detail);
    this.router.navigate([`/products/${this.slug1}/edit/${this.slug}`], {
      queryParams: {
        categoryId: parentCategory.slug,
        childCategoryId: detail.slug,
      },
    });
  }
  getTags() {
    this.tagsServ.displayTags().subscribe(
      (response: any) => {
        // console.log("response tags", response);
        this.tagsList = response.data.tags;
        this.getAllTags = this.tagsList;
      },
      (error) => {
        // this.Error = error.error.error.message
        this.isError = true;
      }
    );
  }

  async showMultiSelectTags(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: MultiSelectPopoverPage,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
      showBackdrop: false,
    });
    popover.onDidDismiss().then((data: any) => {
      // console.log(data.data);
    });
    return await popover.present();
  }

  deleteCategory(category) {
    // console.log("category", category);
    this.presentAlertConfirm(category.slug);
  }

  async presentAlertConfirm(id) {

    this.toastServ.confirmationAlert('Are you sure you want to delete this item?', 'Delete')
    .then(confirm => {
      if (confirm){
        this.categoryServ.deleteCategory(id).subscribe(
          (response: any) => {
            if (response) {
              // console.log("response", response);
              this.getCategories();
            }
          }
        );
      }
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
      if (
        event.code === 'Comma' ||
        event.code === 'Space' ||
        event.code === 'Enter'
      ) {
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
    // console.log("findTag", findTag);
    if (findTag) {
      // console.log("tag exists");
      tag = null;
    } else {
      if (tag[tag.length - 1] === ',' || tag[tag.length - 1] === ' ') {
        tag = tag.slice(0, -1);
      }
      if (tag.length > 0 && !find(this.tags, tag)) {
        this.tags.push(tag);
        // this.productForm.value.tags = this.tags;
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

  searchBarOnFocus(e) {
    this.showTagsList = true;
  }
  checkBlur() {
    this.showTagsList = false;
  }

  onSearchTerm(ev: CustomEvent) {
    // console.log("event", ev);

    // console.log("tagsList", this.tagsList);

    const val = ev.detail.value;

    if (val && val.trim() !== '') {
      this.showTagsList = true;
      this.tagsList = this.tagsList.filter((term) => {
        return term.name.toLowerCase().indexOf(val.trim().toLowerCase()) > -1;
      });
    } else {
      this.showTagsList = false;
      this.tagsList = this.getAllTags;
    }
  }

  clickedTag(tagName) {
    this.addTag(tagName);
  }

  hideTagList() {
    this.showTagsList = false;
  }
  getEditorValue(data) {
    this.dataFromChild = data;
    // console.log("data from child", data);
  }

  @HostListener('unloaded') ngOnDestroy() {
    this.elementRef.nativeElement.remove();
    console.log('edit-product on destroy');
  }
}
