import { Directive, ElementRef, Input, OnInit } from '@angular/core';
/**
 * Allows Styling Scrollbars
 */
@Directive({
  selector: '[appScrollbar]'
})
export class ScrollbarDirective implements OnInit {

  @Input() scrollbar: string;
  @Input() allowAllScreens: boolean | string;
  @Input() directInject: boolean|string = false;

  hostElement: HTMLElement;
  allowedTags: Array<string> = ['ION-CONTENT', 'DIV', 'ION-ITEM', 'ION-LABEL'];

  constructor(public elementRef: ElementRef) { }

  ngOnInit() {
    this.hostElement = this.elementRef.nativeElement;

    if (
      this.hostElement
      && this.hostElement.tagName
      && this.allowedTags.indexOf(this.hostElement.tagName.toUpperCase()) >= 0
    ) {
      const el = document.createElement('style');
      el.innerText = this.scrollbar || this.getCustomStyle();

      if (this.directInject) {
        this.hostElement.appendChild(el);
      } else {
        this.hostElement.shadowRoot.appendChild(el);
      }
    }
  }

  getCustomStyle() {
    const colorThumb = '#c3c3c3';
    const colorThumbHover = '#9a9a9a';
    const colorTrack = '#bdbdbd';
    const scrollBarWidth = '6px';
    const roundnessThumb = '10px';

    // console.log('fetching style');

    const style = `
    .inner-scroll {
      scrollbar-width: thin;
      scrollbar-color: #9a9a9a #c3c3c3;
    }

    ::-webkit-scrollbar {
      width: ${scrollBarWidth};
    }

    ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 8px ${colorTrack};
        -webkit-border-radius: ${roundnessThumb};
        border-radius: ${roundnessThumb};
    }

    ::-webkit-scrollbar-thumb {
        -webkit-border-radius: ${roundnessThumb};
        border-radius: ${roundnessThumb};
        background: ${colorThumb};
    }

    ::-webkit-scrollbar-thumb:hover {
      background: ${colorThumbHover};
    }
    `.replace('<br>', '');

    return (this.allowAllScreens === true || this.allowAllScreens === 'true')
        ? style
        : `@media(pointer: fine) {${style}}`;
  }
}
