import {Component} from '@angular/core';
import {KanbanCardModel} from './kanban-card/kanban-card.model';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {AuthService} from './service/auth.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  email: string;
  password: string;
  items: Observable<any[]>;

  constructor(firestore: AngularFirestore, public authService: AuthService, public fireAuth: AngularFireAuth, private router: Router) {
    this.items = firestore.collection('items').valueChanges();
  }
  title = 'kanban-app';
}





