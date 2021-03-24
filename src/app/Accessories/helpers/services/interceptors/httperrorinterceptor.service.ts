import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import {ToastService} from '../toast.service';
import {ErrorsService} from '../errors.service';
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  httpError: any;
  constructor(
    public toastController: ToastService,
    public errorServ: ErrorsService
    ) {}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(request)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            let errorMsg = '';
            if (error.error instanceof ErrorEvent) {
              // console.log('this is client side error');
              errorMsg = `Error: ${error.error.message}`;
            }
            else {
              // console.log('this is server side error');
              this.httpError = error;
              if (error.error.error.info) {
                this.errorServ.onNotify(error.error.error);
                const tempErrorMessages = {};
                error.error.error.info.forEach( propError => {
                  tempErrorMessages[propError.property]
                    = Object.values(propError.constraints).join(' and ');
                  }
                );
                errorMsg = Object.values(tempErrorMessages).join('\n');
              } else {
                errorMsg = error.error.error.message;
              }

            }
            this.toastController.presentToast(errorMsg, 'danger');

            return throwError(errorMsg);
          })
        );
    }
  // async presentToast(message) {
  //   const toast = await this.toastController.create({
  //     message: message,
  //     duration: 2000,
  //     color : 'danger'
  //   });
  //   toast.present();
  // }
}
