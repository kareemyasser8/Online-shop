import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { signInWithRedirect, UserInfo } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth, getAuth, GoogleAuthProvider } from 'firebase/auth';
import { BehaviorSubject, Observable, of, Subject, switchMap } from 'rxjs';

import { AppUser } from '../models/app-user';
import { UserService } from './user.service';

const provider = new GoogleAuthProvider();
let signUpGoogle
let debugRedirectResult
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  afAuth: Auth;
  appUser: AppUser
  fireBaseUser$ = new BehaviorSubject<UserInfo>(null)  //Firebase User

  constructor(private userService: UserService,
    private afApp: FirebaseApp,
    private router: Router,
    private route: ActivatedRoute) {

    this.afAuth = getAuth(this.afApp);

    this.afAuth.onAuthStateChanged((x) => {
      this.fireBaseUser$.next(x);
    }, (err) => {
      console.log(err);
    })
  }

  login() {
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/'
    localStorage.setItem('returnUrl', returnUrl)
    signInWithRedirect(this.afAuth, provider)
  }

  logout() {
    this.afAuth.signOut().then(() => {
      this.router.navigate([''])
    });
  }


  get appUser$(): Observable<AppUser> {

    return this.fireBaseUser$.asObservable()
      .pipe(switchMap((user) => {
        if (user) {
          return this.userService.get(user.uid).valueChanges()
        }
        else return of(null)
      }
      ))
  }
}
