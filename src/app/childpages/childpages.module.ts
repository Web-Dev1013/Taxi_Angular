import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChildpagesPageRoutingModule } from './childpages-routing.module';

import { ChildpagesPage } from './childpages.page';
import {CommonHeaderModule} from '../Accessories/shared/common-header.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EscapeHtmlPipe } from '../Accessories/shared/pipes/keep-html.pipe';
import {IonCustomScrollbarModule} from '../lib/ion-custom-scrollbar.module';
import {SliderModule} from '../Accessories/shared/slider/slider.module';
import { GravatarModule } from 'ngx-gravatar';
import { InArrayPipe } from '../Accessories/shared/pipes/in-arrayPipe';
import { MomentPipe } from '../Accessories/shared/pipes/moment.pipe';
import {ReadMoreModule} from '../Accessories/shared/read-more/read-more.module';
import { PipesModule } from '../pipes/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChildpagesPageRoutingModule,
    CommonHeaderModule,
    TabsModule.forRoot(),
    GravatarModule,
    NgbModule,
    IonCustomScrollbarModule,
    SliderModule,
    PipesModule,
    ReadMoreModule
  ],
  declarations: [
    ChildpagesPage,
    EscapeHtmlPipe,
    MomentPipe,
    InArrayPipe
  ]
})
export class ChildpagesPageModule {}
