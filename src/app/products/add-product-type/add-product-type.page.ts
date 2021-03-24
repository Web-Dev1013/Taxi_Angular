import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { MultiFileUploadComponent } from '../../components/multi-file-upload/multi-file-upload.component';
import { ValueAccessor } from '@ionic/angular/directives/control-value-accessors/value-accessor';
import { baseUrl } from 'src/environments/environment';

@Component({
  selector: 'app-add-product-type',
  templateUrl: './add-product-type.page.html',
  styleUrls: ['./add-product-type.page.scss'],
})
export class AddProductTypePage implements OnInit {
  @ViewChild(MultiFileUploadComponent) fileField: MultiFileUploadComponent;
  title;
  icon;
  image: any;
  formTitle;
  showEditForm = false;
  touched = false;
  public productTypeForm: FormGroup;
  formData = new FormData();
  ImageUrl: any;
  disabled = false;

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    public modalController: ModalController,
    private nav: NavParams) {
    this.productTypeForm = this.formBuilder.group(
      {
        title: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(50)]))
      }
    );

    this.title = nav.get('title');
    this.icon = nav.get('icon');
    if (this.icon) {
      this.ImageUrl = `${baseUrl}${this.icon}`;
    }
    // this.image = nav.get('icon');

    // console.log('title in const',this.icon);

  }
  get errorControl() {
    return this.productTypeForm.controls;
  }
  ngOnInit() {
    //// console.log('title',`${this.title}`)
    if (this.title) {
      this.productTypeForm.patchValue({
        title: this.title,
        // imageUpload : this.image
      });
      this.formTitle = 'Edit Category';
      this.showEditForm = true;
    }
  }

  getImage(event) {
    this.ImageUrl = event.fileToUpload;
    // console.log('imageUrl',this.ImageUrl);
  }

  onClickSubmit() {
    // console.log('image url submit',this.ImageUrl);
    const formdata = new FormData();
    formdata.append('title', this.productTypeForm.value.title);
    formdata.append('icon', this.ImageUrl);
    // console.log('form data',formdata);
    this.modalController.dismiss(formdata);
  }
  close() {
    this.modalController.dismiss();
  }

}
