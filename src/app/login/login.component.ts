import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../service/auth.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string;
  password: string;

  constructor(public authService: AuthService, private router: Router) {
  }

  // Login function for existing user for firebase authentication
  public login(): void {
    this.authService.login(this.email, this.password);
    this.email = this.password = '';
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnInit(): void {
  }

}


