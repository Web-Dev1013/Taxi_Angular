import { Component, OnInit , Input , Output , EventEmitter} from '@angular/core';
import {baseUrl} from '../../../../environments/environment';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
})
export class ImageUploadComponent implements OnInit {
  constructor() { }
  @Input() icon: any;
  @Output() emitImageToAddProduct = new EventEmitter<any>();
  @Output() disabled = new EventEmitter<any>();

  showInput = false;

  fileToUpload: any;
  imageUrl: any;

  ngOnInit() {
   console.log('image in component', this.icon);
   if (this.icon){
    this.imageUrl = `${baseUrl}${this.icon}`;
   }
  }


  handleFileInput(file: FileList) {

    this.fileToUpload = file.item(0);

    // Show image preview
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
     // //console.log('url',this.imageUrl);
     // console.log('file on load');
      if (this.fileToUpload.type.split('/')[0] === 'image'){
       // console.log('file is image ');
       const imageData = {
        fileToUpload: this.fileToUpload,
        imageUrl: this.imageUrl
      };
       this.emitImageToAddProduct.emit({...imageData});
       this.disabled.emit(false);
       this.showInput = false;
     }
     else
     {
       this.showInput = true;
       // console.log('Only image file is allowed');
     }

    };

    reader.readAsDataURL(this.fileToUpload);
    //// console.log('resd',reader.readAsDataURL(this.fileToUpload));

  }

  // emitImage(){
  //   //console.log('imageUrl',this.imageUrl);
  // }

}
