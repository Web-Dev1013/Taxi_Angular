import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CommonComponent} from './common/common.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GravatarModule } from 'ngx-gravatar';


@NgModule({
  declarations: [CommonComponent],
  imports: [
    CommonModule,
    NgbModule,
    GravatarModule
  ],
  exports: [CommonComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class CommonHeaderModule { }
