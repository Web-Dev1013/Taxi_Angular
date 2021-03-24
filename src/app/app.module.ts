import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import {IonicStorageModule} from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HttpErrorInterceptor } from './Accessories/helpers/services/interceptors/httperrorinterceptor.service';
import { LoaderService } from './Accessories/helpers/services/loader2.service';
import { LoaderInterceptor } from './Accessories/helpers/services/interceptors/loader-interceptor.service';
import { CommonLoaderComponent } from './Accessories/shared/common-loader/common-loader.component';
import { GravatarModule } from 'ngx-gravatar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditorModule } from '@tinymce/tinymce-angular';
import { NgxTextDiffModule } from 'ngx-text-diff';
import { TitleOutputPipe } from './pipes/title-output/title-output.pipe';
import { PipesModule } from './pipes/pipes/pipes.module';

@NgModule({
  declarations: [AppComponent , CommonLoaderComponent],
  entryComponents: [],
  imports:
  [
    BrowserModule,
    IonicModule.forRoot({animated: false}),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxDatatableModule,
    BrowserAnimationsModule,
    GravatarModule,
    EditorModule,
    // PipesModule,
    NgxTextDiffModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    Title
  ],
  bootstrap: [AppComponent],
  schemas : [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
