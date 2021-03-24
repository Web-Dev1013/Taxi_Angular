import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
})
export class MultiSelectComponent implements OnInit {
  list = [
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5',
    'Item 6',
    'Item 7',
    'Item 8',
    'Item 9',
  ];

  filteredList = [];
  text: string;
  input: string;

  constructor() {
    this.filteredList = this.list.slice();
  }

  ngOnInit(){

  }

  onInputChange() {
    this.filteredList = this.list.filter((item: string) => {
      return item.toLowerCase().indexOf(this.input.toLowerCase()) > -1;
    });
  }

  onItemClick(item) {
    // this.viewCtrl.dismiss({item: item})
  }

}
