import { Component, ViewChild, OnInit, NgZone } from '@angular/core';
import { NavController, IonMenu, MenuController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import adminJson from '../Accessories/helpers/jsonFiles/admin_sidebar.json';
import userJson from '../Accessories/helpers/jsonFiles/child.json';
import { SidebarDataService } from '../Accessories/helpers/services/sidebar-data.service';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../Accessories/helpers/services/login.service';
import { StorageService } from '../Accessories/helpers/services/storage.service';
import { ProductTypeService } from '../Accessories/helpers/services/product-type.service';
import { UserSidebarService } from '../Accessories/helpers/services/user-sidebar.service';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseUrl } from '../../environments/environment';
import { Observable, Subscription } from 'rxjs';
import { ProductGroupsService } from '../Accessories/helpers/services/product-groups.service';
import { LoaderService } from '../Accessories/helpers/services/loader.service';
import { mainModule } from 'process';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  // @ViewChild(IonMenu) nav;
  width: number;
  baseurl = baseUrl;
  users: Subscription;
  login: Subscription;
  username = '';
  role: string = localStorage.getItem('role');

  adminPages: any = adminJson;
  userPages: any = userJson.sidebar;
  productGroups = [];
  token: any;
  path: string;
  public selectedIndex = 0;
  selectedMenuItem = 'Dashboard';
  selectedLink = '';
  sideBarInfo: any;
  allSidebarChildren: any;
  public folder: string;
  showAccordion: boolean;
  selectedChild: {};
  activeChild: any;
  userRole: any;
  selectedPath = '';
  dashboardActive: boolean;
  discussionArea: boolean;
  support: boolean;

  sidebarProducts = [];
  categories: any = [];
  selectedAdminLink: any;
  showChild: boolean;
  userProducts: any;
  removeActiveClass: boolean;
  showMenu: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private sideBarService: SidebarDataService,
    private router: Router,
    public loginServ: LoginService,
    public storageServ: StorageService,
    public productTypeServ: ProductTypeService,
    public userSidebarServ: UserSidebarService,
    public storage: Storage,
    private http: HttpClient,
    private groupServ: ProductGroupsService,
    private ionLoader: LoaderService,
    private menuCtrl: MenuController,
    private ngZone: NgZone,
    private platform: Platform
  ) {
    this.token = this.storageServ.get('token');

    platform.ready().then(() => {
      this.width = platform.width();
    });
  }

  ngOnInit() {
    this.getRoleBasedPages(this.role);
  }

  getMenuItem(menuItem) {
    this.selectedLink = menuItem.slug;
    this.storageServ.set('ProductGroupTitle', menuItem.title);
    // used to click a product in sidebar and get the categories based on product Id  from API
    this.dashboardActive = false;
    this.discussionArea = false;
    this.support = false;
    this.showChild = true;
    this.selectedChild = menuItem.title;
    if (menuItem.products.length === 0) {
      this.router.navigate([`/product-groups/${menuItem.slug}`]);
    }
  }

  getChild(child) {
    if (this.width < 1000)
    {
      this.menuCtrl.enable(false);
    }

    localStorage.setItem('contentTitle', child.title);
    this.storage.set('productDetails', child);

    //// //console.log("child Id", child.slug);
    this.activeChild = child.slug;
    this.router.navigate([
      `/product-groups/${this.selectedLink}/${child.slug}`,
    ]);
  }

  logout() {
    this.loginServ.logout();
    setTimeout(() => { }, 5000);
  }

  getAllProducts() // helps to get all products created from admin panel and display them in sidebar
  {
    this.users = this.userSidebarServ.getAllSidebarProducts().subscribe(
      (response: any) => {
        this.sidebarProducts = response.data.products;
      },
      (error) => { }
    );
  }

  pageToDisplay() {
    // this function is used to check
    // whther the path achieved on load is of static menuItems
    // (i.e Dashboard, discussion area or support) or dynamic menu Items.
    // This function basically helps to assign active class
    // to all menu items conditionally

    const slugForProductGroup = this.activatedRoute.snapshot.paramMap.get('product-group');
    const slugForProduct = this.activatedRoute.snapshot.paramMap.get('product');
    const slugForCategory = this.activatedRoute.snapshot.paramMap.get('category');
    const slugForContent = this.activatedRoute.snapshot.paramMap.get('content');
    const slugForSubContent = this.activatedRoute.snapshot.paramMap.get('sub-content');

    const completePath = window.location.pathname;
    const productPath = completePath.split(`/product-groups/${this.selectedLink}`)[1];

    if (productPath !== undefined) {
      this.selectedLink = productPath;

      if (completePath.split('/product-groups/')[1].split('/')[1]) {
        const parentPath = completePath.split('/product-groups/')[1].split('/')[0];
        this.selectedLink = parentPath;
        if (this.selectedLink) {
          const pathToProduct = completePath.split(`/product-groups/${this.selectedLink}`)[1].split('/')[1];
          const showPage = this.productGroups.find(v => v.products.find(p => p.slug === pathToProduct));

          if (showPage === undefined) {
            this.router.navigate([`/404`]);
          } else {
            this.activeChild = pathToProduct;
          }
        }
      }
    }

    else {
      this.path = window.location.pathname;
      switch (this.path) {
        case '/dashboard':
          this.dashboardActive = true;
          break;

        case '/discussion-area':
          this.discussionArea = true;
          break;

        case '/support':
          this.support = true;
          break;

        default:
          break;
      }
    }
  }

  getRoleBasedPages(role) {
    switch (role) {
      case 'admin':
        this.productGroups = this.adminPages;
        const path = window.location.pathname;
        // //console.log('path',path);
        this.selectedAdminLink = path;
        if (path === '/dashboard') {
          this.dashboardActive = true;
          this.path = '/dashboard';
        }
        break;

      case 'user':
        this.getProductGroupsForUsers();
    }
  }

  getAdminMenuItem(item) {
    // this function is used to click the menu items of the admin sidebar
    this.selectedAdminLink = item.link;
    this.dashboardActive = false;
    this.router.navigate([this.selectedAdminLink]);
  }
  clickedMenuItem(item) {
    // this function helps to add or remove active class from static menu items
    switch (item) {
      case 'dashboard':
        this.dashboardActive = true;
        this.support = false;
        this.discussionArea = false;
        this.selectedAdminLink = '/dashboard';
        this.path = '/dashboard';
        // this.selectedLink = "/menu/dashboard"
        break;
      case 'discussion-area':
        this.dashboardActive = false;
        this.support = false;
        this.discussionArea = true;
        this.path = '/discussion-area';
        // this.selectedLink = "/menu/discussion-area"
        break;
      case 'support':
        this.dashboardActive = false;
        this.support = true;
        this.discussionArea = false;
        this.path = '/support';
        // this.selectedLink = "/menu/support"
        break;
    }
  }

  getProductGroupsForUsers() {
    this.ionLoader.showLoader('Loading Products');

    this.groupServ.getProductGroupsForUser().subscribe(
      (response: any) => {
        if (response) {
          this.ionLoader.HideLoader();
        }
        this.productGroups = response.data;

        this.pageToDisplay();
      },
      (error) => {
        this.ionLoader.HideLoader();
      }
    );
  }


  closeMenu(event){
    this.storageServ.set('ionMenu', 'false');
  }
}
