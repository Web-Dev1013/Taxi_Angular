import { Component , Input, OnInit} from '@angular/core';
import { FileUploader, FileLikeObject } from 'ng2-file-upload';

@Component({
  selector: 'app-multi-file-upload',
  templateUrl: './multi-file-upload.component.html',
  styleUrls: ['./multi-file-upload.component.scss']
})
export class MultiFileUploadComponent implements OnInit {
  @Input() image: any;

  public uploader: FileUploader = new FileUploader({
  });
  public hasBaseDropZoneOver = false;

  constructor() {

  }
  show = true;

  ngOnInit(){
    // console.log('image',this.image)
    if (this.image){
      this.uploader.addToQueue(this.image);
    }
  }

  getFiles(): FileLikeObject[] {
    return this.uploader.queue.map((fileItem) => {
      return fileItem.file;
    });
  }

  lk() {
    this.uploader.clearQueue();
  }

  fileOverBase(ev): void {
    this.hasBaseDropZoneOver = ev;
  }

  reorderFiles(reorderEvent: CustomEvent): void {
    const element = this.uploader.queue.splice(reorderEvent.detail.from, 1)[0];
    this.uploader.queue.splice(reorderEvent.detail.to, 0, element);
  }

}
