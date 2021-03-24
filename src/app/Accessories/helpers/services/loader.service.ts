import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

export class LoaderService {

  constructor(public loadingController: LoadingController) { }
  isLoading = false;
  // show Loader

  // showLoader(message) {
  //   this.loadingController.create({
  //     message: message,
  //     spinner : "dots",
  //     cssClass : 'my-Custom-Class'
  //   }).then((res) => {
  //     res.present();
  //     res.onDidDismiss().then((dis) => {
  //       console.log('Loading dismissed! after 2 Seconds');
  //     });
  //   });
  // }

  // hide Loader
  // HideLoader(){
  //   this.loadingController.dismiss().then((res) => {
  //     console.log('Loading dismissed!', res);
  //   }).catch((error) => {
  //     console.log('error', error);
  //   });

  // }

  async showLoader(message) {
    // this.isLoading = true;
    // return await this.loadingController.create({
    //   duration: 5000000,
    //   message: message,
    //   spinner: "bubbles",
    //   cssClass: 'custom-loading'
    // }).then(a => {
    //   a.present().then(() => {
    //     console.log('presented');
    //     if (!this.isLoading) {
    //       a.dismiss().then(() => console.log('abort presenting'));
    //     }
    //   });
    // });
  }

  async HideLoader() {
    // this.isLoading = false;
    // return await this.loadingController.dismiss().then(() => console.log('dismissed')).catch((error) => {
    //   //console.log(error)
    // });
    // return await this.loadingController.getTop().then(a => {
    //        if ( a )
    //         a.dismiss().then(() => console.log('loading dismissed'));
    //     });

  }
}
