import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { RouterModule, Routes } from '@angular/router';

import { NavbarComponent } from './navbar/navbar.component';
import { AppComponent } from './app.component';
import { BoardComponent, BoardDialog } from './board/board.component';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ColumnComponent } from './board/column/column.component';
import { KanbanCardComponent, KanbanModal } from './kanban-card/kanban-card.component';
import { environment } from '../environments/environment';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field'
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from './service/auth.service';
import { LayoutModule } from '@angular/cdk/layout';

import { CreateComponent, CreateModal } from "./create/create.component";

import { BurndownComponent } from './burndown/burndown.component';
import { AppRoutingModule } from './app-routing.module';
import {MatIconModule} from "@angular/material/icon";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {RegistrationComponent} from './registration/registration.component';
import {AngularFireAuthGuard} from '@angular/fire/auth-guard';
import {BoardviewComponent, BoardsViewDialog} from './boardview/boardview.component';

const myroutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'board', component: BoardComponent },
  { path: 'board/:id', component: BoardComponent },
  { path: 'list', component: BoardviewComponent },
  { path: 'registration', component: RegistrationComponent},
  { path: 'burndown', component: BurndownComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    BoardDialog,
    BoardviewComponent,
    BoardsViewDialog,
    HeaderComponent,
    ColumnComponent,
    CreateComponent,
    KanbanCardComponent,
    BurndownComponent,
    LoginComponent,
    NavbarComponent,
    RegistrationComponent,
    KanbanModal,
    CreateModal,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    LayoutModule,
    BrowserAnimationsModule,
    DragDropModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
    FontAwesomeModule,
    MatDialogModule,
    MatFormFieldModule,
    AppRoutingModule,
    FormsModule,
    MatFormFieldModule,
    MatDialogModule,
    RouterModule.forRoot(myroutes),
    MatIconModule,
    MatDatepickerModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
