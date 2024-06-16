import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {BehaviorSubject, Observable, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private apiUrl = `${environment.backendHost}`;
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  public username!: string;
  constructor(private http: HttpClient, private router: Router) {
    const currentUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<any>(currentUser ? JSON.parse(currentUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }


  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(tap(response => {
        if (response.accessToken) {
          console.log(response);
          this.storeTokens(response);
          this.currentUserSubject.next(response);
          const decodedToken: any = jwtDecode(response.accessToken); // Decoding the token
          this.username = decodedToken.sub;
          console.log('username : ' + this.username);

        }
      }));
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private storeTokens(tokens: any) {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('expiresIn', tokens.expiresIn);
  }

  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  refreshToken() {
    return this.http.post<any>(`${this.apiUrl}/auth/refresh`, {
      refreshToken: this.getRefreshToken()
    }).pipe(tap(response => {
      this.storeTokens(response);
    }));
  }

  isAuthenticated(): boolean {
    // Check if there is a token in localStorage (or wherever your token is stored)
    return localStorage.getItem('accessToken') !== null;
  }

  getRolesFromToken(): string[] {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return [];
    }

    try {
      const decodedToken: any = jwtDecode(token); // Decoding the token
      // Ensure 'roles' is an array and map it to extract only the authority values
      if (Array.isArray(decodedToken.roles)) {
        return decodedToken.roles.map((role: { authority: string }) => role.authority);
      } else {
        console.error('Invalid roles format in token');
        return [];
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      return [];
    }
  }



}













/*public username : any;
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
 }*/
