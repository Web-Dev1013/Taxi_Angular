import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.page.html',
  styleUrls: ['./popover.page.scss'],
})
export class PopoverPage implements OnInit {

  constructor(private popoverCtrl: PopoverController) { }

  ngOnInit() {
  }

  close(){
    this.popoverCtrl.dismiss();
  }

  createSubCategory(){
    this.popoverCtrl.dismiss('subcategory');

  }
  createPost(){
    this.popoverCtrl.dismiss('post');
  }

}
