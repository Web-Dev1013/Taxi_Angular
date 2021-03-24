import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { ProductcategoriesService } from '../../Accessories/helpers/services/productcategories.service';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  FormArray,
} from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { formatDate, Location } from '@angular/common';
import { Storage } from '@ionic/storage';
import { baseUrl } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { StorageService } from '../../Accessories/helpers/services/storage.service';
import {
  ToastController,
  PopoverController,
  ModalController,
  AlertController,
} from '@ionic/angular';
import { find, get, pull } from 'lodash';
import { PopoverPage } from '../../Accessories/popovers/popover/popover.page';
import { AddSubcategoryPage } from '../add-subcategory/add-subcategory.page';
import { EditSubcategoryPage } from '../edit-subcategory/edit-subcategory.page';
import { ProductService } from '../../Accessories/helpers/services/product.service';
import { ContentService } from '../../Accessories/helpers/services/content.service';
import { ChildCategoryService } from '../../Accessories/helpers/services/child-category.service';
import { TagsService } from '../../Accessories/helpers/services/tags.service';
import { debounceTime } from 'rxjs/operators';
import { LoaderService } from '../../Accessories/helpers/services/loader.service';
import { ErrorsService } from '../../Accessories/helpers/services/errors.service';
import { ToastService} from '../../Accessories/helpers/services/toast.service';
@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.page.html',
  styleUrls: ['./edit-category.page.scss'],
})
export class EditCategoryPage implements OnInit, OnDestroy {
  constructor(
    public toastController: ToastController,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private storage: Storage,
    private productCategoryServ: ProductcategoriesService,
    private http: HttpClient,
    private storageServ: StorageService,
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController,
    private productServ: ProductService,
    private contentServ: ContentService,
    private alertCtrl: AlertController,
    private childCategoryServ: ChildCategoryService,
    private tagsServ: TagsService,
    private ionLoader: LoaderService,
    private errorServ: ErrorsService,
    private toastServ: ToastService
  ) {
    this.slug1 = this.route.snapshot.paramMap.get('id1');
    this.slug2 = this.route.snapshot.paramMap.get('id2');
    this.slug = this.route.snapshot.paramMap.get('id');
    this.productTitle = this.route.snapshot.queryParamMap.get('categoryId');

    if (this.route.snapshot.queryParamMap.get('childCategoryId')) {
      //// console.log('childCategoryExists');
      this.childCategoryId = this.route.snapshot.queryParamMap.get(
        'childCategoryId'
      );
    }

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
      tags: new FormControl('', Validators.required),
      formModel: new FormControl('', Validators.required),
      parentCategory: new FormControl(''),
      parentProduct: new FormControl(''),
      searchControl: new FormControl(''),
      checkboxArrayList: new FormControl(''),
    });

    this.token = this.storageServ.get('token');
  }

  get errorControl() {
    return this.productForm.controls;
  }
  @ViewChild('tagInput') tagInputRef: ElementRef;
  @ViewChild('tinyMce') tinyMce;
  tagsList = [];
  tags: string[] = [];
  touched = false;
  selectedProduct: any;
  childCategoryId: any;
  parentProductTitle: any;
  parentCategoryTitle: any;
  productList: any = [];
  subCategoryPosts: any = [];
  categoryName: any;
  nullValue = null;
  slug1: any;
  slug2: any;
  slug: any;
  token: any;
  productTitle: string;
  selectedCategory: any;
  openEditor = false;
  disabled = false;
  data: any;
  hasPost = false;
  isError = false;
  Error;
  serverError: any;
  contents: any;
  lockedContent: any;
  customPopoverOptions: any = {
    showBackdrop: false,
    event: MouseEvent,
  };
  public options: object = {
    placeholder: 'Edit Me',
    events: {
      focus(e, editor) {
        //// console.log(editor.selection.get());
      },
    },
    apiKey:
      '8JF3bA2B5C3D4F-11SLJCKHXOSLMc1YGSGb1ZXHSe1CgB5A4A3D4E3C2A11A19B6C5==',
  };
  openAccorian = false;
  categoryList: any = [];
  showError = false;
  public productForm: FormGroup;

  // getContent(detail){
  //   ////console.log('details content',this.data);

  //   this.storage.set('content',this.data);
  //   this.router.navigate([`products/${this.slug1}/${this.slug}/${this.slug2}/edit-content/${detail.title}`])
  // }
  isChecked: boolean;
  subcategoryId: any;
  getAllTags = [];
  isItemAvailable = false;
  selectedTags: [] = [];
  selecteTag = false;
  tagName: any;

  showTagsList = false;
  ngOnInit() {
    this.getAllProducts();
    this.getCategoriesById();
    this.getTags();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(
        () => {
          //// console.log('category contents');
          this.getAllContent();
          this.ionLoader.HideLoader();
          this.hasPost = false;
        },
        (error) => {
          // this.Error = error.error.error.message
          this.isError = true;
        }
      );
    // this.getSelectedProduct();
    // if(this.childCategoryId){
    //   ////console.log('child category details');
    //   this.getChildCategoryDetails();
    //   this.getChildCategoryContents()
    // }

    //// console.log('parent category details')
    this.getCategoryDetails();
    this.getAllContent();
  }

  onClickSubmit() {
    // if(this.childCategoryId){
    //   this.updateChildCategory();
    // }
    // else{
    this.editCategory();
    // }
  }

  addNewContent() {
    this.router.navigate([
      `/products/${this.slug1}/${this.productTitle}/create`,
    ]);
  }
  getCategoryDetails() {
    this.productCategoryServ.getCategoryDetails(this.productTitle)
      .subscribe(
        (product: any) => {
          //// console.log('selected Product' , product.data.category);
          this.selectedProduct = product.data.category;
          this.isError = false;
          this.categoryName = product.data.category.title;
          if (product.data.category.status === 'locked') {
            this.disabled = false;
            // console.log("tags in this category are", this.selectedProduct.tags);
            // this.tags = this.selectedProduct.tags
            this.lockedContent = this.selectedProduct.lockedPageContent;
            this.productForm.patchValue({
              title: this.selectedProduct.title,
              description: this.selectedProduct.description,
              status: this.selectedProduct.status,
              // formModel : this.selectedProduct.lockedPageContent,
              checkboxArrayList: this.selectedProduct.tags,
              // parentCategory :  this.selectedProduct.parentCategoryId._id || null
            });
            this.tags = this.selectedProduct.tags;

            // this.parentCategoryTitle = this.selectedProduct.parentCategoryId.title || null
            this.openEditor = true;
            // this.disabled = true
          } else {
            this.disabled = false;
            this.productForm.patchValue({
              title: this.selectedProduct.title,
              description: this.selectedProduct.description,
              status: this.selectedProduct.status,
              // parentCategory :  this.selectedProduct.parentCategoryId._id || null
            });
            // this.parentCategoryTitle = this.selectedProduct.parentCategoryId.title || null
          }

          if (this.selectedProduct.parentCategoryId) {
            this.productForm.patchValue({
              // parentCategory :  this.selectedProduct.parentCategoryId._id
            });
            this.parentCategoryTitle = this.selectedProduct.parentCategoryId.title;
          } else {
            this.productForm.patchValue({
              parentCategory: null,
            });
          }
        },
        (error) => {
          this.ionLoader.HideLoader();
          this.isError = true;
          // this.Error = error.error.error.message
          //// console.log(error.error.error.message);
        }
      );
  }

  editCategory() {
    // let tags = ;
    let formData: any;
    //// console.log('parent category id', this.productForm.value.parentCategory);
    // if (this.productForm.value.parentCategory === this.nullValue){
    //   this.productForm.value.parentCategory = null;
    //   ////console.log(this.productForm.value.parentCategory);

    // }

    if (this.productForm.value.status === 'locked') {
      formData = {
        title: this.productForm.value.title,
        productSlug: this.slug1,
        parentCategoryId: null,
        description: this.productForm.value.description,
        status: this.productForm.value.status,
        tags: this.tags,
        lockedPageContent: this.lockedContent,
      };
    } else {
      formData = {
        title: this.productForm.value.title,
        productSlug: this.slug1,
        parentCategoryId: null,
        description: this.productForm.value.description,
        status: this.productForm.value.status,
        tags: [],
        lockedPageContent: '',
      };
    }

    this.productCategoryServ.editCategory(this.productTitle, { ...formData })
      .subscribe(
        (product: any) => {
          this.ionLoader.HideLoader();
          //// console.log('selected Product' , product);
          this.isError = false;
          this.presentAlert(product.message);
          // this.location.back();
        },
        (error) => {
          this.ionLoader.HideLoader();
          this.isError = true;
          // this.Error = error.error.error.info[0].constraints.isNotEmpty || error.error.error.message
          // console.log(error);
        }
      );
  }

  getAllContent() {
    this.contentServ.getContents(this.productTitle)
      .subscribe(
        (product: any) => {
          this.ionLoader.HideLoader();
          this.contents = product.data.contents.filter(
            (v) => v.categoryId.slug === this.productTitle
          );
          this.isError = false;

          //// console.log('contents' , product);

          // this.location.back();
        },
        (error) => {
          this.ionLoader.HideLoader();
          this.isError = true;
          // this.Error = error.error.error.message
          //// console.log(error.error.error.message);
        }
      );
  }

  async getContentDetail(detail) {
    //// console.log('detail',detail);
    if (detail.contentType === 'SubCategory') {
      //// console.log('subcategory clicked');

      const modal = await this.modalCtrl.create({
        component: EditSubcategoryPage,
        cssClass: 'my-custom-class',
        componentProps: {
          slugs: this.slug1,
          detail,
        },
      });

      // to get productType form values from modal page
      modal.onDidDismiss().then((data: any) => {
        //// console.log('subcategory form data',data);
        this.editSubcategory(
          detail.slug,
          detail.categoryId.slug,
          data.data.title,
          data.data.description
        );
      });

      return await modal.present();
    } else if (detail.contentType === 'Post') {
      //// console.log('post clicked');
      if (this.childCategoryId) {
        this.router.navigate(
          [`/products/${this.slug}/${this.slug1}/${this.productTitle}/edit`],
          {
            queryParams: {
              postId: detail.slug,
              childCategoryId: this.childCategoryId,
            },
          }
        );
      } else {
        this.router.navigate(
          [`/products/${this.slug}/${this.slug1}/${this.productTitle}/edit`],
          { queryParams: { postId: detail.slug } }
        );
      }
    }
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
      // this.location.back();
    });
  }

  back() {
    this.location.back();
  }

  async deleteContent(content) {
    this.toastServ.confirmationAlert('Are you sure you want to delete this item?', 'Delete')
    .then(confirm => {
      if (confirm){
        this.contentServ.deleteContents(content.slug)
        .subscribe(
          (product: any) => {
            //// console.log('selected Product' , product);
            this.isError = false;
            if (this.childCategoryId) {
              this.getChildCategoryContents();
            } else {
              this.getAllContent();
            }
            this.showToastOnDelete(product.message);

            // this.location.back();
          }
        );
      }
    });
  }
  onRenderItems(event) {
    //// console.log(`Move item from ${event.detail.from} to ${event.detail.to}`);
    const draggedItem = this.contents.splice(event.detail.from, 1)[0];
    this.contents.splice(event.detail.to, 0, draggedItem);
    event.detail.complete();
  }

  async presentPopover(ev) {
    const popover = await this.popoverCtrl.create({
      component: PopoverPage,
      cssClass: 'popover-custom',
      translucent: true,
      showBackdrop: false,
      event: ev,
    });

    popover.onDidDismiss().then((data: any) => {
      //// console.log('popover data from popover',data);
      if (data.data === 'subcategory') {
        //// console.log('selected',data);
        // this.router.navigate([`/menu/products/${this.slug1}/${this.productTitle}/create-subcategory`])
        this.presentModal();
      } else if (data.data === 'post') {
        //// console.log('else ',data);
        if (this.childCategoryId) {
          this.router.navigate(
            [`/products/${this.slug1}/${this.productTitle}/create-post`],
            { queryParams: { childCategoryId: this.childCategoryId } }
          );
        } else {
          this.router.navigate([
            `/products/${this.slug1}/${this.productTitle}/create-post`,
          ]);
        }
      }
    });
    return await popover.present();
  }

  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: AddSubcategoryPage,
      cssClass: 'my-custom-class',
      componentProps: {
        productId: this.productTitle,
      },
    });

    // to get productType form values from modal page
    modal.onDidDismiss().then((data) => {
      //// console.log('subcategory form data',data);
      let formData: any;
      if (this.childCategoryId) {
        formData = {
          title: data.data.title,
          description: data.data.description,
          categorySlug: this.childCategoryId,
          contentType: 'sub_category',
        };
      } else {
        formData = {
          title: data.data.title || '',
          description: data.data.description,
          categorySlug: this.productTitle,
          contentType: 'sub_category',
        };
      }

      this.ionLoader.showLoader('creating..');
      this.contentServ.createContent({ ...formData }).subscribe(
        (response) => {
          if (response) {
            this.ionLoader.HideLoader();
          }
          //// console.log('create content APi repose',response);
          if (this.childCategoryId) {
            this.getChildCategoryContents();
          } else {
            this.getAllContent();
          }
        },
        (error) => {
          this.ionLoader.HideLoader();
          // this.Error = error.error.error.message;
          this.isError = true;
        }
      );
      // this.getCategories();
      ////// console.log('data in page',data.data.title)
    });

    return await modal.present();
  }

  getCategoriesById() {
    //// console.log('category Id');

    this.productCategoryServ.getCategories().subscribe(
      (response: any) => {
        this.categoryList = response.data.categories.filter(
          (v) => v.productId === this.slug1 && v.slug !== this.productTitle
        );
        //// console.log('categories', this.categoryList);
      },
      (error) => {
        // this.Error= error.error.error.message
        this.isError = true;
      }
    );
  }
  getAllProducts() {
    this.productServ.getAllProducts().subscribe(
      (response: any) => {
        this.productList = response.data.products;
        //// console.log('product List',this.productList);
        const parentProduct = this.productList.find((v) => v.slug === this.slug1);
        this.parentProductTitle = parentProduct.title;
        //// console.log('parent title',this.parentProductTitle);
        this.productForm.patchValue({
          parentProduct: this.parentProductTitle,
        });
      },
      (error) => {
        // this.Error = error.error.error.message
        this.isError = true;
      }
    );
  }

  createPostForSubCategory(item) {
    this.router.navigate(
      [`/products/${this.slug1}/${this.productTitle}/create-post`],
      { queryParams: { subCategoryId: item.slug } }
    );
  }
  openAccordian(detail) {
    // console.log("details", detail);

    this.openAccorian = !this.openAccorian;
    if (this.openAccorian === true) {
      this.contentServ.getSubCategoryPosts(detail.slug)
        .subscribe(
          (posts: any) => {
            //// console.log('sucategory posts' , posts);
            this.isError = false;
            this.subCategoryPosts = posts.data.content.posts;
            if (this.subCategoryPosts.length > 0) {
              this.hasPost = true;
              // this.openAccorian = true
              this.subcategoryId = detail.slug;
            } else {
              this.showToastonPost(
                'Sorry No Post to display . Please add a post to subcategory'
              );
            }
            // this.getAllContent();
            // this.presentAlert(product.message)

            // this.location.back();
          },
          (error) => {
            this.isError = true;
            // this.Error = error.error.error.message
            //// console.log(error.error.error.message);
          }
        );
    }
  }

  getSubCategoryPostsList() { }

  async showToastOnDelete(message) {
    const toast = await this.toastController.create({
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

  async showToastonPost(message) {
    const toast = await this.toastController.create({
      message,
      duration: 1000,
      position: 'top',
      animated: true,
      color: 'danger',
      cssClass: 'my custom class',
    });
    toast.present();

    await toast.onDidDismiss().then(() => { });
  }

  async deletePostForSubCategory(content, post) {

    this.toastServ.confirmationAlert('Are you sure you want to delete this item?', 'Delete')
    .then(confirm => {
      if (confirm){
        this.contentServ.deleteSubcategoryPost(content.slug, post.slug)
        .subscribe(
          (product: any) => {
            //// console.log('selected Product' , product);
            this.isError = false;
            // this.getAllContent();
            this.openAccordian(content);
            this.showToastOnDelete(product.message);

            // this.location.back();
          }
        );
      }
    });
  }
  editPostForSubCategory(detail, post) {
    //// console.log('detail',detail);
    // console.log("post", post);
    this.router.navigate(
      [`/products/${this.slug}/${this.slug1}/${this.productTitle}/edit`],
      { queryParams: { subCategoryId: detail.slug, postId: post.slug } }
    );
    // send to edit post page
  }

  editSubcategory(contentId, categoryId, title, description) {
    let formData: any;
    if (this.childCategoryId) {
      formData = {
        title,
        description,
        categorySlug: this.childCategoryId,
        contentType: 'sub_category',
      };
    } else {
      formData = {
        title,
        description,
        categorySlug: categoryId,
        contentType: 'sub_category',
      };
    }

    this.contentServ.editSubCategory(contentId, { ...formData })
      .subscribe(
        (product: any) => {
          //// console.log('contents' , product);
          // this.contents = product.data.contents.filter(v=>v.categoryId === this.productTitle)
          this.isError = false;
          this.showToastOnDelete(product.message);
          if (this.childCategoryId) {
            this.getChildCategoryContents();
          } else {
            this.getAllContent();
          }

          // this.location.back();
        },
        (error) => {
          this.isError = true;
          // this.Error = error.error.error.message
          //// console.log(error.error.error.message);
        }
      );
  }


  getChildCategoryDetails() {
    //// console.log('category Id');

    this.productCategoryServ.getCategories().subscribe(
      (catgeoy: any) => {
        this.categoryList = catgeoy.data.categories;
        //// console.log('categories', this.categoryList);

        this.childCategoryServ
          .getChildCategoryDetails(this.productTitle, this.childCategoryId)
          .subscribe(
            (response: any) => {
              const details = response.data.childCategory;
              this.tags = details.tags;
              if (details.status === 'locked') {
                this.productForm.patchValue({
                  title: details.title,
                  description: details.description,
                  status: details.status,
                  parentCategory: this.productTitle,
                  formModel: details.lockedPageContent,
                });
              } else {
                this.productForm.patchValue({
                  title: details.title,
                  description: details.description,
                  status: details.status,
                  parentCategory: this.productTitle,
                });
              }

              // this.parentCategoryTitle = this.categoryList
              //// console.log('title',this.parentCategoryTitle);
            },
            (error) => {
              // this.Error = error.error.error.message;
              this.isError = true;
            }
          );
      },
      (error) => {
        // this.Error= error.error.error.message
        this.isError = true;
      }
    );
  }

  updateChildCategory() {
    let formData: any;
    if (this.productForm.value.status === 'locked') {
      formData = {
        title: this.productForm.value.title,
        description: this.productForm.value.description,
        productId: this.slug1,
        status: this.productForm.value.status,
        tags: this.tags,
        lockedPageContent: this.productForm.value.formModel,
      };
    } else {
      formData = {
        title: this.productForm.value.title,
        description: this.productForm.value.description,
        productId: this.slug1,
        status: this.productForm.value.status,
        tags: [],
        lockedPageContent: '',
      };
    }

    this.childCategoryServ
      .updateChildCategory(this.productTitle, this.childCategoryId, {
        ...formData,
      })
      .subscribe(
        (response: any) => {
          //// console.log('response',response);
          this.presentAlert(response.message);
        },
        (error) => {
          // this.Error = error.error.error.message
          this.isError = true;
        }
      );
  }

  getChildCategoryContents() {
    this.childCategoryServ
      .getChildCategoryContents(this.productTitle, this.childCategoryId)
      .subscribe(
        (response: any) => {
          //// console.log('child category contents',response);
          this.contents = response.data.contents;
        },
        (error) => {
          // this.Error = error.error.error.message
          this.isError = true;
        }
      );
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
        // console.log("error", error);
      }
    );
  }
  // getItems(ev: any) {
  //   // Reset items back to all of the items

  //   // set val to the value of the searchbar
  //   const val = ev.target.value;

  //   // if the value is an empty string don't filter the items
  //   if (val && val.trim() !== '') {
  //       this.isItemAvailable = true;
  //       this.tags_Lst = this.tags_Lst.filter((item) => {
  //           return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
  //       })
  //   } else {
  //       this.isItemAvailable = false;
  //       this.tags_Lst= this.getAllTags;
  //   }
  // }

  // getvalueoftags(){
  //   //console.log('value of tags', this.productForm.value.tags);

  // }

  onLoadCheckboxStatus() {
    const checkboxArrayList: FormArray = this.productForm.get(
      'checkboxArrayList'
    ) as FormArray;
    this.tagsList.forEach((o) => {
      this.updateCheckControl(checkboxArrayList, o);
    });
  }

  updateCheckControl(cal, o) {
    if (o.checked) {
      cal.push(new FormControl(o.value));
    } else {
      cal.controls.forEach((item: FormControl, index) => {
        if (item.value === o.value) {
          cal.removeAt(index);
          return;
        }
      });
    }
  }

  onSelectionChange(e, i) {
    // console.log("index", i);
    // console.log("event", e);
    const checkboxArrayList: FormArray = this.productForm.get(
      'checkboxArrayList'
    ) as FormArray;
    this.tagsList[i].checked = e.target.checked;
    this.updateCheckControl(checkboxArrayList, e.target);
    // console.log(this.productForm.value.checkboxArrayList);
  }

  async deleteContentsNew(type, details) {
    // console.log("type", type);
    // console.log("details", details);
    // console.log("details", details.slug);

    const alert = await this.alertCtrl.create({
      cssClass: 'custom-alert-popup',
      message: '<strong>Are you sure you want to delete this item?</strong>',
      buttons: [
        {
          text: 'Delete',
          cssClass: 'delete-button',
          handler: () => {
            //// console.log('Confirm Okay');
            this.ionLoader.showLoader('Deleting....');
            this.contentServ.deleteSubCategory(type, details.slug).subscribe(
              (response) => {
                // console.log("response", response);
                this.getAllContent();
                if (response) {
                  this.ionLoader.HideLoader();
                }
                // this.getAllContent();
              },
              (error) => {
                this.ionLoader.HideLoader();
                // this.Error = error.error.error.message || 'Failure'
                this.isError = true;
                // console.log(error);
              }
            );
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'ghost-button',
          handler: (blah) => {
            //// console.log('Confirm Cancel: blah');
          },
        },
      ],
    });

    await alert.present();
  }
  getValueFromselect(e) {
    // console.log("event", e.detail.value);
    this.selectedTags = e.detail.value;
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
  onSearchTerm(ev: CustomEvent) {
    // console.log("tags_Lst", this.tags_Lst);

    const val = ev.detail.value;

    if (val && val.trim() !== '') {
      this.showTagsList = true;
      this.tagsList = this.tagsList.filter((term) => {
        return term.name.toLowerCase().indexOf(val.trim().toLowerCase()) > -1;
      });
    } else {
      this.tagsList = this.getAllTags;
      this.showTagsList = false;
    }
  }
  searchBarOnFocus(e) {
    this.showTagsList = true;
  }
  checkBlur() {
    this.showTagsList = false;
  }

  clickedTag(tagName) {
    this.addTag(tagName);
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
      this.productForm.controls.tags.setValidators(Validators.required);
      this.productForm.controls.formModel.setValidators(Validators.required);
    } else if (
      e.detail.value === 'locked' &&
      this.selectedProduct.status !== 'locked'
    ) {
      // console.log("case 2");
      this.disabled = true;
      this.openEditor = true;
      this.productForm.controls.tags.setValidators(Validators.required);
      this.productForm.controls.formModel.setValidators(Validators.required);
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

  hideTagList() {
    this.showTagsList = false;
  }

  getEditorValue(data) {
    this.lockedContent = data;
  }

  ngOnDestroy() {
    //   //console.log('tinyMce removed');
    //   this.tinyMce.nativeElement.remove();
  }
}
