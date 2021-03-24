import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditContentPage } from './edit-content.page';

describe('EditContentPage', () => {
  let component: EditContentPage;
  let fixture: ComponentFixture<EditContentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditContentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditContentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
