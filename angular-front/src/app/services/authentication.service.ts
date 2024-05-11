import { Injectable } from '@angular/core';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public username : any;
  public roles : any;
  public  authenticated : boolean = false;
  public users : any = {
    admin : ['STUDENT','ADMIN'],
    user1 : ['STUDENT'],
  }

  constructor(private router : Router) { }
  public login(username: string, password: string){
    if(this.users[username] && password == "1234"){
      this.username = username;
      this.roles = this.users[username];
      console.log(this.roles);
      this.authenticated = true;
      return true;
    }
    else return false;
  }

  logout() {
    this.username = undefined;
    this.authenticated = false;
    this.roles = undefined;
    this.router.navigateByUrl('/login').then(value => console.log("logged out"));
  }
}
