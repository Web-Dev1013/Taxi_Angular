import { Injectable } from '@angular/core';
import {
    CanActivate,
    CanActivateChild,
    CanDeactivate,
    CanLoad,
    Route,
    UrlSegment,
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot,
    UrlTree
} from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { Storage } from '@ionic/storage';

@Injectable({
    providedIn: 'root'
})
export class LoginGuard implements CanActivate {

    constructor(private router: Router, private storage: Storage) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        if (!(localStorage.getItem('token'))) {
          return true;
        }
        else{
            // console.log('can open ');
            this.router.navigate(['/dashboard']);
            return false;
        }

      }
}
