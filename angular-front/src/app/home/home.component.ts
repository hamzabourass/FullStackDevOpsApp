import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  tiles = [
    { label: 'Students', imgSrc: 'assets/images/students.png', link: '/admin/students' },
    { label: 'Payments', imgSrc: 'images/payments.png', link: '/admin/payments' },
    { label: 'Dashboard', imgSrc: 'images/dashboard.png', link: '/admin/dashboard' },
    { label: 'Profile', imgSrc: 'images/profile.png', link: '/admin/profile' },
  ];
}
