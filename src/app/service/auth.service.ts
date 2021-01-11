// auth.service.ts
import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Observable} from 'rxjs';
import * as firebase from 'firebase';
import {AngularFirestore} from '@angular/fire/firestore';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<firebase.User>;
  email: string;

  constructor(private firebaseAuth: AngularFireAuth, private firestoreAdd: AngularFirestore) {
    this.user = this.firebaseAuth.authState;
  }

  signup(email: string, password: string, fullName: string): void {
    this.email = email;
    const userName = fullName;
    this.firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then(newUser => {
        this.firestoreAdd.collection('Users').doc(firebase.auth().currentUser.uid).set({
          FullName: userName,
          Email: this.email
        });
        console.log('User added to database');
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
        alert(err.message);
      })
      .then(value => {
        console.log('Success!', value);
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
        alert(err.message);
      });
  }

  login(email: string, password: string): void {
    this.email = email;
    this.firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Nice, it worked!');
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
        alert(err.message);
      });
  }

  logout(): void {
    this.firebaseAuth.signOut();
  }
}
