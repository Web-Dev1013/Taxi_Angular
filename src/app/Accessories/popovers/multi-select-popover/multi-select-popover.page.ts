import { Component, OnInit } from '@angular/core';
import {TagsService} from '../../helpers/services/tags.service';
import { PopoverController } from '@ionic/angular';
@Component({
  selector: 'app-multi-select-popover',
  templateUrl: './multi-select-popover.page.html',
  styleUrls: ['./multi-select-popover.page.scss'],
})
export class MultiSelectPopoverPage implements OnInit {
  list = [

  ];

  filteredList = [];
  text: string;
  input: string;
  selectedTags = [];
  finalTags = [];
  tags;
  constructor(private tagsServ: TagsService , private popoverCtrl: PopoverController) {
    this.getTags();
  }

  ngOnInit(){

  }

  onInputChange() {
    this.filteredList = this.list.filter((item: any) => {
      return item.name.indexOf(this.input) > -1;
      // The below line is converted to above line because lowerCase was causing issue
     // return item.name.toLowerCase().indexOf(this.input.toLowerCase()) > -1
    });
  }

  onItemClick(item) {
    // this.viewCtrl.dismiss({item: item})
  }

  getTags(){
      this.tagsServ.displayTags().
      subscribe((response: any) => {
        // console.log('response tags',response);
        this.list = response.data.tags;
        // console.log('list',this.list);
        this.filteredList = this.list.slice();
        // console.log('filtered list',this.filteredList)
      },
      error => {
        // console.log(error);

      });


  }
  updateCucumber(item, i){
   // //console.log('tags',this.tags);
    // console.log('selected Item',item);
   this.selectedTags.push(item.name);
   // console.log('selected Tags',this.selectedTags);


  }

  close(){
    this.popoverCtrl.dismiss(this.selectedTags);
  }

  ionPopoverDidDismiss(){

  }


}
