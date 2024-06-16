import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    // Retrieve authorized roles for the route from route data
    const authorizedRoles: string[] = route.data['roles'];
    console.log('roles on route: ' + authorizedRoles)

    // Retrieve roles of the authenticated user from AuthenticationService
    const roles: string[] = this.authService.getRolesFromToken();

    // Check if any of the user's roles match the authorized roles for the route
    const isAuthorized: boolean = authorizedRoles.some(role => roles.includes(role));

    if (isAuthorized) {
      return true;  // User is authorized to access the route
    } else {
      // Redirect to unauthorized page or handle unauthorized access
      this.router.navigate(['/unauthorized']);
      return false;
    }
  }
}
