import { Component, OnInit, Inject } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthService} from '../service/auth.service';
import {Board} from '../board/board.model';
import {User} from '../service/user.model';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'

export interface DialogData {
  name: string;
  description: string;
  isPrivate: boolean;
}

@Component({
  selector: 'board-view-dialog',
  templateUrl: './boardviewdialog.html',
  styleUrls: ['./boardviewdialog.css']
})
export class BoardsViewDialog {

  constructor(
    public dialogRef: MatDialogRef<BoardsViewDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'app-boardview',
  templateUrl: './boardview.component.html',
  styleUrls: ['./boardview.component.css']
})
export class BoardviewComponent implements OnInit {
  boards: Array<Board> = [];
  currentUser: string;

  db: AngularFirestore;

  constructor(firestore: AngularFirestore, firestoreAuthService: AuthService, public dialog: MatDialog) {
    this.db = firestore;
    this.currentUser = firestoreAuthService.email;
  }

  ngOnInit(): void {
    this.updateBoardList();
  }

  updateBoardList(): void{
    this.db.collection('Boards').snapshotChanges().subscribe((docs) => {
      while (this.boards.length) { this.boards.pop(); }
      docs.forEach(item => {
        const doc = item.payload.doc;
        this.boards.push(
        new Board(doc.id,
        doc.get('boardName'),
        doc.get('admins'),
        doc.get('users'),
        doc.get('columns'),
        doc.get('issues'),
        doc.get('description'),
        doc.get('privateBoard')));
      });
    });
  }

  getBoardName(): string {
    let name = prompt('What would you like to name this Board?');
    while (name.trim().length === 0){
      name = prompt('What would you like to name this Board? (Cannot be empty)');
    }
    return name;
  }

  getBoardDescription(): string {
    const description = prompt('Please enter a short description for this Board.');
    return description;
  }

  getBoardPrivate(): boolean {
    const boardPrivate = prompt('Should this Board be private? (Y/N) (Default (Y)).');
    return (boardPrivate !== 'N');
  }

  public createNewDbEntry(): void{
    let name = '';
    let desc = '';
    let isPrivate = false;
    const dialogRef = this.dialog.open(BoardsViewDialog, {
      width: '300px',
      data: {name: name, description: desc, isPrivate: isPrivate}
    })
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result.name !== '' && result.description !== ''){
        name = result.name;
        desc = result.description;
        isPrivate = result.isPrivate;

        const boardNameVar = name;
        const adminsVar = [];
        if (this.currentUser !== undefined){
          adminsVar.push(this.currentUser);
        }
        const usersVar = [];
        const columnsVar = [];
        const issuesVar = [];
        const descriptionVar = desc;
        const privateBoardVar = isPrivate;
        this.db.collection('Boards').add({
          boardName: boardNameVar,
          admins: adminsVar,
          users: usersVar,
          columns: columnsVar,
          issues: issuesVar,
          description: descriptionVar,
          privateBoard: privateBoardVar,
        }).then(r => {
          this.updateBoardList();
        }).catch(err => {
          console.log('Failed to create an DB entry for the board.');
        });
      } else {
        console.log('Failed to create an DB entry for the board.');
      }
    })
  }

}
