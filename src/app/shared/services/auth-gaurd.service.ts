import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGaurd implements CanActivate {

  constructor(private auth:AuthService, private router: Router){}

  canActivate(route, state:RouterStateSnapshot): Observable<boolean>{

    // we going to transform this observable from a user object into a observable of boolean
    // and angular will internally subscribe to this observable and then
    // remove the subscription later

    return this.auth.appUser$.pipe(map((result)=>{
      if(result){
        return true
      }else{
        this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}})
      }
      return false;
    })
    )
  }
}
