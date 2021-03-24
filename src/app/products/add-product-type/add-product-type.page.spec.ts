import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddProductTypePage } from './add-product-type.page';

describe('AddProductTypePage', () => {
  let component: AddProductTypePage;
  let fixture: ComponentFixture<AddProductTypePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProductTypePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddProductTypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
