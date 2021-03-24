import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {ProductcategoriesService} from '../../Accessories/helpers/services/productcategories.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {LoadingController, ModalController} from '@ionic/angular';
import {Router , ActivatedRoute , NavigationEnd} from '@angular/router';
import { Location } from '@angular/common';
import {Storage} from '@ionic/storage';
import {baseUrl} from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import {StorageService} from '../../Accessories/helpers/services/storage.service';
import { ToastController } from '@ionic/angular';
import { find, get, pull } from 'lodash';
import {TagsService} from '../../Accessories/helpers/services/tags.service';
import {NavParams} from '@ionic/angular';


@Component({
  selector: 'app-edit-subcategory',
  templateUrl: './edit-subcategory.page.html',
  styleUrls: ['./edit-subcategory.page.scss'],
})
export class EditSubcategoryPage implements OnInit {
  detail: any;
  slug: any;
  public productForm: FormGroup;
  tagsList: any;
  touched = false;

  constructor(
    public toastController: ToastController,
    private router: Router ,
    private location: Location ,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController ,
    private storage: Storage ,
    private productCategoryServ: ProductcategoriesService ,
    private http: HttpClient , private storageServ: StorageService ,
    private modalCtrl: ModalController , private nav: NavParams ,
    private tagsServ: TagsService) {

    this.detail = this.nav.get('detail');
    this.slug = this.nav.get('slugs');
    // console.log('descritp in edit ', this.detail);


    // form
    this.productForm = this.formBuilder.group(
      {
      title: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(50)])),
      description : new FormControl('', Validators.compose([Validators.required, Validators.maxLength(2000)])),
      visibility : new FormControl(''),
      tags : new FormControl(''),
      formModel : new FormControl('')
      }
      );
   }


  get errorControl() {
    return this.productForm.controls;
  }
  ngOnInit() {
   this.productForm.patchValue({
     title : this.detail.title,
     description : this.detail.description
   });
   this.getTags();
  }

  onClickSubmit(){

    this.modalCtrl.dismiss(this.productForm.value);
  }

  loaderOnOperations(){
    this.loadingCtrl.create({
      message: 'please wait ...',
      duration: 1000
    }).then((res) => {
      res.present();

      res.onDidDismiss().then((dis) => {
        // console.log('Loading dismissed! after 2 Seconds', dis);
      });
    });
  }



// onRenderItems(event) {
//   //console.log(`Move item from ${event.detail.from} to ${event.detail.to}`);
//    const draggedItem = this.contents.splice(event.detail.from, 1)[0];
//   this.contents.splice(event.detail.to, 0, draggedItem);
//   event.detail.complete();
// }

close(){
  this.modalCtrl.dismiss();
}
creatPost(){
  const type = 'modal';
  this.modalCtrl.dismiss(type).then(() => {
    this.router.navigate([`/products/${this.slug}/${this.detail._id}/create-post`]);
  });

}
getTags(){
  this.tagsServ.displayTags().
  subscribe((response: any) => {
    // console.log('response tags',response);
    this.tagsList = response.data.tags;
  });
}


}
