import { Component, OnInit, OnChanges, AfterContentInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SidebarDataService } from '../Accessories/helpers/services/sidebar-data.service';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ProductGroupsService } from '../Accessories/helpers/services/product-groups.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.page.html',
  styleUrls: ['./pages.page.scss'],
})
export class PagesPage implements OnInit, AfterContentInit {
  public folder: string;
  public data: any;
  title: any;
  productGroupDetails: any;
  slugId: any;

  constructor(
    private groupServ: ProductGroupsService,
    private activatedRoute: ActivatedRoute,
    private dataServ: SidebarDataService,
    public loadingCtrl: LoadingController,
    private storage: Storage) {
    //// console.log('constructor in pages');
    this.slugId = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ionViewWillEnter() {



  }

  ngOnInit() {
  }

  showHideAutoLoader() {

    this.loadingCtrl.create({
      message: 'please wait ...',
      duration: 2000
    }).then((res) => {
      res.present();

      res.onDidDismiss().then((dis) => {
        this.getProductGroupDetails();
        //// console.log('Loading dismissed! after 2 Seconds', dis);
      });
    });

  }

  ionViewDidEnter() {
    this.storage.ready().then(() => {
      this.storage.get('sidebarItem').then((item) => {
      });
    });
  }
  ngAfterContentInit() {

  }

  getProductGroupDetails() {
    this.groupServ.getProductGroupsForUser()
      .subscribe((response: any) => {
        this.productGroupDetails = response.data.groups.find(v => v._id === this.slugId);
        this.title = this.productGroupDetails.title;
      },
        error => {

        });
  }


}
