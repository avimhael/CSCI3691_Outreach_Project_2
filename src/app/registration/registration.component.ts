import {Component, OnInit} from '@angular/core';
import {AuthService} from '../service/auth.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  email: string;
  password: string;
  fullName: string;

  constructor(public authService: AuthService, private firestore: AngularFirestore) {
  }

  // Signup function for firebase authentication
  public signup(): void {
    console.log(this.email, this.password);
    this.authService.signup(this.email, this.password, this.fullName);
    // Wipes email and password
    this.email = this.password = '';
  }

  ngOnInit(): void {
  }

}
