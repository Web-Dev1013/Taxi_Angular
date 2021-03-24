import { Injectable } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    public toastController: ToastController,
    public alertCtrl: AlertController) { }

  async presentToast(message, color) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'top',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
           // console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }


    async confirmationAlert(message: string, buttonText: string): Promise<boolean> {
    let resolveFunction: (confirm: boolean) => void;
    const promise = new Promise<boolean>(resolve => {
      resolveFunction = resolve;
    });
    const alert = await this.alertCtrl.create({
      message: `<strong>${message}</strong>`,
      cssClass: 'custom-alert-popup',
      buttons: [
        {
          text: `${buttonText}`,
          cssClass: 'delete-button',
          handler: () => resolveFunction(true)
        },
        {
        text: 'Cancel',
        cssClass: 'ghost-button',
        handler: () => resolveFunction(false)
      }
    ]
    });
    await alert.present();
    return promise;
  }



}
