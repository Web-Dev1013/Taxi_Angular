import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DoesnotExistPage } from './doesnot-exist.page';

describe('DoesnotExistPage', () => {
  let component: DoesnotExistPage;
  let fixture: ComponentFixture<DoesnotExistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoesnotExistPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DoesnotExistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
