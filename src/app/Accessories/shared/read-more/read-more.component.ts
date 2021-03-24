import { Component, OnInit, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-read-more',
  templateUrl: './read-more.component.html',
  styleUrls: ['./read-more.component.scss'],
})
export class ReadMoreComponent implements OnInit {

  @Input() content: string;
  // @Input() limit: number;
  @Input() completeWords: boolean;

  limit = 100;
  isContentToggled: boolean;
  nonEditedContent: string;
  show: boolean;

  constructor() { }


  ngOnInit() {
    this.nonEditedContent = this.content;
    this.content = this.formatContent(this.content);
  }

  toggleContent() {
    this.isContentToggled = !this.isContentToggled;
    this.content = this.isContentToggled ? this.nonEditedContent : this.formatContent(this.content);
  }

  formatContent(content: string) {
    if (this.completeWords && content.length > 100) {
      this.show = true;
      return `${content.substr(0, this.limit)}...`;
    }
    else {
      this.show = false;
      return content;
    }

  }

}
