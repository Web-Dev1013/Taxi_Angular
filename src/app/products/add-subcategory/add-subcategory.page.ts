import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {LoadingController , NavParams} from '@ionic/angular';
import {Router , ActivatedRoute} from '@angular/router';
import { Location } from '@angular/common';
import {ProductcategoriesService} from '../../Accessories/helpers/services/productcategories.service';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { find, get, pull } from 'lodash';
import { ModalController } from '@ionic/angular';
import {TagsService} from '../../Accessories/helpers/services/tags.service';

@Component({
  selector: 'app-add-subcategory',
  templateUrl: './add-subcategory.page.html',
  styleUrls: ['./add-subcategory.page.scss'],
})
export class AddSubcategoryPage implements OnInit {
  @ViewChild('tagInput') tagInputRef: ElementRef;
  tags: string[] = [];
  slug: any ;
  productId: any;
  public productForm: FormGroup;
  disabled = true;
  openEditor = false ;
  data: any;
  Error: any;
  tagsList = [];
  isError = false;
  touched = false;
  constructor(
    public modalCtrl: ModalController,
    public toastController: ToastController,
    private alertController: AlertController,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    private categoryServ: ProductcategoriesService,
    private nav: NavParams,
    private tagsServ: TagsService) {

    this.slug = this.route.snapshot.paramMap.get('id1');
    // create Category form
    this.productId = this.nav.get('productId');
    this.productForm = this.formBuilder.group(
      {
      title: new FormControl('',
       Validators.compose(
         [
           Validators.required,
           Validators.maxLength(50)
         ])),
      description : new FormControl('',
        Validators.compose(
          [
            Validators.required,
            Validators.maxLength(2000)
          ])),
      tags : new FormControl(''),
      formModel : new FormControl(''),
      productType : new FormControl (''),
      visibility : new FormControl ('',
        Validators.compose(
          [
            Validators.required
          ])),
      }
      );
   }
   get errorControl() {
    return this.productForm.controls;
  }
  ngOnInit() {

    this.productForm.patchValue({
      visibility : 'draft'
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
         //// console.log('Loading dismissed! after 2 Seconds', dis);
      });
    });
  }
  changeStateCallback(e){
    // ////console.log('open',e);
    if (e.detail.value === 'locked'){
      this.openEditor = true;
      this.disabled = true;
      // this.productForm.get('tags').setValidators(Validators.required)
      // this.productForm.get('formModel').setValidators(Validators.required)
    }
    else{
      this.openEditor = false;
    }
  }




  async presentAlert(message) {
    const toast = await this.toastController.create({
      message,
      duration: 700,
      position: 'top',
      animated : true,
      color : 'primary',
      cssClass : 'my custom class'
    });
    toast.present();

    await toast.onDidDismiss().then(() => {
    this.location.back();
   // this.loaderOnOperations();
  });
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
  if (tag[tag.length - 1] === ',' || tag[tag.length - 1] === ' ') {
    tag = tag.slice(0, -1);
  }
  if (tag.length > 0 && !find(this.tags, tag)) {
    this.tags.push(tag);
  }
}

removeTag(tag?: string): void {
  if (!!tag) {
    pull(this.tags, tag);
  } else {
    this.tags.splice(-1);
  }
}

back(){
  this.location.back();
}
close(){
  this.modalCtrl.dismiss();
}
getTags(){
  this.tagsServ.displayTags().
  subscribe((response: any) => {
    // console.log('response tags',response);
    this.tagsList = response.data.tags;
  });
}


}
