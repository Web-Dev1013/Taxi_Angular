import {Component, ViewChildren, QueryList, ElementRef, AfterViewInit , OnInit } from '@angular/core';
import adminJson from '../Accessories/helpers/jsonFiles/admin_sidebar.json';
import { Router, NavigationExtras, NavigationEnd } from '@angular/router';
import { NavController } from '@ionic/angular';
import { DatastorageService } from '../Accessories/helpers/services/datastorage.service';
import { StorageService } from '../Accessories/helpers/services/storage.service';
import { ProductService } from '../Accessories/helpers/services/product.service';
import { ModalController } from '@ionic/angular';
import { AddProductTypePage } from './add-product-type/add-product-type.page';
import { Storage } from '@ionic/storage';
import { ProductTypeService } from '../Accessories/helpers/services/product-type.service';
import { LoaderService } from '../Accessories/helpers/services/loader2.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseUrl } from '../../environments/environment';
import { filter } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
import {ToastService} from '../Accessories/helpers/services/toast.service';
@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit, AfterViewInit {
  constructor(
    private storage: Storage,
    private productserv: ProductService,
    private storageserv: StorageService,
    private router: Router,
    private navctrl: NavController,
    private dataserv: DatastorageService,
    public modalController: ModalController,
    private pTypeServ: ProductTypeService,
    public alertController: AlertController,
    private http: HttpClient,
    private ionLoader: LoaderService,
    private toastServ: ToastService
  ) {
    // ////////console.log('products data' , this.productdata);
    this.products = this.productdata.product_types;
    this.ionLoader.isLoading.subscribe((v) => {
      this.loading = v;
    });
  }

  @ViewChildren('productGroups') productTypes: QueryList<ElementRef>;
  token = localStorage.getItem('token');
  allProducts: any;
  allProductsTypes: any;
  productdata = adminJson[1];
  products = [];
  productType: any;
  selected: any;
  isError = false;
  loading: any;
  Error: any;
  getEmptyProductGroups: any;
  NoData: boolean;

  ngOnInit() {
    this.getAllProductTypes();
    this.getAllProducts();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.getAllProducts();
      });
    // this.productserv.getProducts();
  }

  async addProductCategory() {
    const modal = await this.modalController.create({
      component: AddProductTypePage,
      cssClass: 'my-custom-class',
    });

    // to get productType form values from modal page
    modal.onDidDismiss().then((data) => {
      if (data.data !== undefined){
        this.pTypeServ.createProductType(data.data).subscribe(
          (response: any) => {
            ////// //console.log('created product Type',response);
            if (response) {
              //// //console.log('response',response);
              this.getAllProductTypes();
              this.isError = false;
              this.toastServ.presentToast(response.message, 'success');
            }
          },
          (error) => {
            this.isError = true;
            // this.Error = error.error.error.message;
            ////// //console.log(error.error.error.message);
          }
        );

      }


    });

    return await modal.present();

    // this.router.navigateByUrl('/products/' + 'product-type' )
  }

  addProduct(product) {
    ////// //console.log('add products',product._id);

    // put id of selected product here
    this.router.navigate([`/products/create`], {
      queryParams: { productTypeId: product.slug },
    });
  }

  productGroupEmpty(productGroup) {
    return Array.isArray(this.allProducts)
          &&
  ((this.allProducts.filter(product => product.groupId.slug === productGroup.slug).length) === 0);
  }

  deleteGroup(productGroup) {
    //// //console.log(productGroup);
  }

  edit(productType, product) {
    this.selected = product;
    this.router.navigate([`/products/${productType.slug}/edit`], {
      queryParams: { productId: product.slug },
    });
  }

  getAllProductTypes() {
    this.pTypeServ.getAllProductTypes().subscribe(
      (productTypes: any) => {
        if (productTypes) {
          this.allProductsTypes = productTypes.data.groups;

          // console.log('product_types in ngonit', this.allProductsTypes);
          this.isError = false;
        }
      },
      (error) => {

        this.isError = true;
        // this.Error = error.error.error.message;
      }
    );
  }

  async editProductType(productType) {
    const modal = await this.modalController.create({
      component: AddProductTypePage,
      componentProps: {
        title: productType.title,
        icon : productType.icon
      },
    });

    // to get productType form values from modal page
    modal.onDidDismiss().then((data) => {
      if (data.data){
          this.pTypeServ.editProductType(productType.slug, data.data)
          .subscribe(
            (userdetail: any) => {
              if (userdetail) {
                this.getAllProductTypes();
                this.isError = false;
                this.toastServ.presentToast(userdetail.message, 'success');
                //// //console.log('userdetail',userdetail);
              }
              // ////////console.log('userdetail' , userdetail);
            },
            (error) => {
              this.isError = true;
              this.Error = error;
            }
          );
      }
    });

    return await modal.present();
  }
  getAllProducts() {
    // this.ionLoader.showLoader('Loading');
    this.productserv.getAllProducts().subscribe(
      (response: any) => {
        //  ////////console.log('all categories',response.data.products);
        this.allProducts = response.data.products.filter(
          (v) => v.groupId !== null
        );
        this.isError = false;
      },
      (error) => {
        // this.ionLoader.HideLoader();
        this.isError = true;
       // this.Error = error.error.error.message;
        ////// //console.log(error.error.error.message);
      }
    );
  }

  deleteProduct(child) {
    //// //console.log("selected Child", child);
    this.presentAlertConfirm(child.slug);
  }

  async presentAlertConfirm(productId) {

    this.toastServ.confirmationAlert('Are you sure you want to delete this Product?', 'Delete')
    .then(confirm => {
      if (confirm){
        console.log('Deleted');
        this.productserv.deleteProducts(productId).subscribe(
          (res: any) => {
            this.getAllProducts();
          },
          (error) => {
          }
        );
      }
      else
      {
        console.log('Not Deleted====');
      }
    });
  }


  async deleteGroups(productGroupId){


    this.toastServ.confirmationAlert('Are you sure you want to delete this Product Group?', 'Delete')
    .then(confirm => {
      if (confirm){
        console.log('Deleted');
        this.pTypeServ.deleteProductGroups(productGroupId).subscribe(
          (res: any) => {
            //// //console.log("product deleted successfully", res);
            this.isError = false;
            this.getAllProductTypes();
            this.getAllProducts();
            this.toastServ.presentToast(res.message, 'success');
          },
          (error) => {
            this.isError = true;
           // this.Error = error.message
            //// //console.log(error.message);

          }
        );
      }
    });
  }

  ngAfterViewInit(){
    this.productTypes.changes.subscribe(() => {
      if (this.productTypes && this.productTypes.last) {
        this.productTypes.last.nativeElement.scrollIntoViewIfNeeded({behavior: 'smooth'});
      }
    });
  }
  }



