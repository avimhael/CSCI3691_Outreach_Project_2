import {Component, OnInit} from '@angular/core';
import {LoginComponent} from '../login/login.component';
import {AuthService} from '../service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public authService: AuthService) {
  }

  // Logout function to end user session through firebase authentication
  public logout(): void {
    this.authService.logout();
  }

  ngOnInit(): void {
  }

}
