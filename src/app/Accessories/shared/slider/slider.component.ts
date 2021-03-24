import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  NgZone
} from '@angular/core';
import { IonSlides, Platform } from '@ionic/angular';
import { Category } from '../../models/category';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnInit {
  @Input() categories: any[];
  @Output() selectedCategory = new EventEmitter<any>();
  @ViewChild('slideWithNav2', { static: false }) slideWithNav2: IonSlides;
  appSlider: any;
  slideOptsTwo = {
    initialSlide: 0,
    slidesPerView: 3
  };
  width: number;

  @Input() category: Category;

  constructor(
    private ngZone: NgZone,
    private platform: Platform
  ) {
    platform.ready().then(() => {
      this.width = platform.width();
      this.showSlides(platform.width());
      // console.log('Width:' + platform.width());
      // console.log('Height: ' + platform.height());
    });

    window.onresize = (e) => {

      this.ngZone.run(() => {
        this.width = window.innerWidth;
        this.showSlides(window.innerWidth);
      });
    };
  }

  ngOnInit() {
    this.appSlider =
    {
      isBeginningSlide: true,
      isEndSlide: false,
      slidesItems: this.categories
    };
    // this.categoryId = this.appSlider.slidesItems[0]._id;
  }
  slideNext(object, slideView) {
    slideView.slideNext(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });
  }
  slidePrev(object, slideView) {
    slideView.slidePrev(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });
  }
  SlideDidChange(object, slideView) {
    this.checkIfNavDisabled(object, slideView);
  }
  checkIfNavDisabled(object, slideView) {
    this.checkisBeginning(object, slideView);
    this.checkisEnd(object, slideView);
  }
  checkisBeginning(object, slideView) {
    slideView.isBeginning().then((istrue) => {
      object.isBeginningSlide = istrue;
    });
  }
  checkisEnd(object, slideView) {
    slideView.isEnd().then((istrue) => {
      object.isEndSlide = istrue;
    });
  }
  clickedCategory(category) {
    this.category = category;
    this.selectedCategory.emit(category);
  }
  showSlides(width) {
    if (width === 320) {
      this.slideOptsTwo.slidesPerView = 2;
    }
    else if (width <= 768) {
      this.slideOptsTwo.slidesPerView = 4;
    }
    else if (width > 768) {
      this.slideOptsTwo.slidesPerView = 6;
    }
  }
}
