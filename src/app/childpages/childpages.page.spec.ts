import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChildpagesPage } from './childpages.page';

describe('ChildpagesPage', () => {
  let component: ChildpagesPage;
  let fixture: ComponentFixture<ChildpagesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChildpagesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChildpagesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
