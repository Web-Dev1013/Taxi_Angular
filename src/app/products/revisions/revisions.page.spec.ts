import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RevisionsPage } from './revisions.page';

describe('RevisionsPage', () => {
  let component: RevisionsPage;
  let fixture: ComponentFixture<RevisionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevisionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RevisionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
