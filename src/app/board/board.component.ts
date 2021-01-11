import { Component, OnInit, Inject, Optional } from '@angular/core';
import { ColumnComponent } from './column/column.component';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthService} from '../service/auth.service';
import {ColumnModel} from './column/column.model';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'
import { ActivatedRoute } from '@angular/router';

export interface DialogData {
  colName: string;
}

@Component({
  selector: 'board-dialog',
  templateUrl: './boarddialog.html',
  styleUrls: ['./boarddialog.css']
})
export class BoardDialog {

  constructor(
    public dialogRef: MatDialogRef<BoardDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']

})
export class BoardComponent implements OnInit {
  boardId: string;
  boardName: string;
  description: string;
  columns: Array<string> = [];
  issues: Array<string> = [];
  privateBoard: boolean;
  admins: Array<string> = [];
  users: Array<string> = [];
  user: any;

  cols: Array<ColumnModel> = [];

  db: AngularFirestore;

  @Optional() route: ActivatedRoute;
  routeStr: string;

  constructor(firestore: AngularFirestore, firestoreAuthService: AuthService, public dialog: MatDialog, route?: ActivatedRoute) {
    this.db = firestore;
    this.user = this.getEmail(firestoreAuthService);
    this.route = route;
  }

  // Checks if a route exists on the end of this url
  routeExists(): boolean{
    const routeKey = 'id';
    this.route.params.subscribe( params => (this.routeStr = params[routeKey]));
    return this.routeStr !== undefined;
  }

  // Gets the route on the end of the url
  getRoute(): string{
    if (this.routeExists()){
      const routeKey = 'id';
      this.route.params.subscribe( params => (this.routeStr = params[routeKey]));
      return this.routeStr;
    }
    return null;
  }

  ngOnInit(): void {
    if (this.routeExists()){
      console.log('Route exists');
      this.loadFromDb(this.getRoute());
    }else{
      let boardExists = false; // Updates to true if Board is found in db query
      this.boardName = 'TEST';
      // Retrieve snapshot of Boards collection from Firestore
      const boardArray = this.db.collection('Boards').snapshotChanges();
      boardArray.subscribe(async (docs) => {
        docs.forEach((item) => {
          if (!boardExists){
            const doc = item.payload.doc;
            console.log('loading board: ' + doc.id);
            this.loadFromDb(doc.id);
            boardExists = true;
          }
        });
        // Add new board to firebase if board did not exist
        if (!boardExists) {
          this.boardName = 'DefaultName';
          this.description = 'Test description';
          this.privateBoard = false;
          this.admins.push(this.user);
          this.createDbEntry();
          await this.setupDefaultColumns();
        }
      });
    }
  }

  /**
   * Button listener for creating a new column
   */
  newColumn(): void {
    /*
    let name = prompt('What would you like to name this column?');
    while (name.trim().length === 0){
      name = prompt('What would you like to name this column? (Cannot be empty)');
    }
    this.cols.push(new ColumnModel(name, 'description'));
    // this.columnsArray.push(new ColumnComponent());
    this.columnNames.push(name);
    */
    let name = '';
    const dialogRef = this.dialog.open(BoardDialog, {
      width: '300px',
      data: {colName: name}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.trim().length !== 0){
        this.createColumn(result);
      }
    });
  }

  /**
   * Creates a column in the database then updates this board's db entry
   * @param title - title of the column
   */
  createColumn(title: string): void{
    console.log('Creating column with title: ' + title);
    this.db.collection('Columns').add({
      columnTitle: title,
      boardId: this.boardId,
      issues: [],
    }).then(r => {
      console.log('created firestore column: ' + r.id);
      const column = new ColumnModel(r.id, title, title, []);
      this.cols.push(column);
      this.columns.push(r.id);
      this.updateDbEntry(); // Update the database to create the column
    }).catch(err => {
      console.log('failed to store column in database: ' + err.toString());
    });
  }

  /**
   * Loads the specified column from the database
   * @param id - the column id to load
   */
  loadColumn(id: string): void{
    this.db.collection('Columns').doc(id).get().toPromise().then(r => {
      const column = new ColumnModel(id, r.get('columnTitle'), r.get('columnTitle'), r.get('issues'));
      this.cols.push(column);
      console.log('loaded column from DB ' + column.title);
    }).catch(err => {
      console.log('Failed to load column form DB' + err.toString());
    });
  }

  /**
   * Deletes a column from this board and updates the db entry
   * @param columnId - the column id to delete
   */
  deleteCol(columnId: string): void {
    // Update the page by removing column from columns array columns delete themselves in the database
    const index = this.columns.indexOf(columnId);
    this.cols.splice(index, 1);
    this.columns.splice(index, 1);
    this.updateDbEntry(); // Update the database to delete the column
  }

  /**
   * Attempts to setup default columns if the board has none
   */
  setupDefaultColumns(): void {
    console.log(' creating default data if 0. : ' + this.columns.length);
    if (this.columns.length === 0){
      this.createColumn('Todo');
      this.createColumn('Doing');
      this.createColumn('Done');
    }else{
      console.log('not creating default data.');
    }
  }

  /**
   * Loads the columns into the ui
   */
  loadUIColumns(): void{
    console.log('loading the ui columns');
    for (const item in this.columns){
      this.loadColumn(this.columns[item]);
    }
    this.setupDefaultColumns();
  }

  public getEmail(firestoreAuthService: AuthService): string{
    return firestoreAuthService.email;
  }

  cardCreatedListener(cardId: string): void{
    // TODO PUT CARD IN FIRST COLUMN
    console.log('card id is: ' + cardId);
    if (this.columns.length === 0){
      this.createColumn('unassigned');
    }
    this.issues.push(cardId);
    this.addCardToColumn(this.columns[0], cardId);
    this.updateDbEntry();
  }

  /**
   * Creates a new DB entry for this board
   */
  public createDbEntry(): void{
    this.db.collection('Boards').add({
      boardName: this.boardName,
      admins: this.admins,
      users: this.users,
      columns: this.columns,
      issues: this.issues,
      description: this.description,
      privateBoard: this.privateBoard,
    }).then( r => {
      this.boardId = r.id;
      console.log('id: ' + this.boardId);
    }).catch(err => {
      console.log('create entry broke.');
    });
  }

  /**
   * Loads the board with <id> from the database
   * @param id - the id to load
   */
  public loadFromDb(id: string): void{
    this.boardId = id;
    this.db.collection('Boards').doc(id).get().toPromise().then(r => {
        this.boardName = r.get('boardName');
        this.admins = r.get('admins');
        this.users = r.get('users');
        this.columns = r.get('columns');
        this.issues = r.get('issues');
        this.description = r.get('description');
        this.privateBoard = r.get('privateBoard');
        this.loadUIColumns();
    }).catch(err => {
      console.log('Failed to load board from database.');
      alert('Failed to load board from database.');
    });
  }

  /**
   * Updates the DB entry for this board
   */
  updateDbEntry(): void{
    console.log('updating id: ' + this.boardId);
    this.db.collection('Boards').doc(this.boardId).update({
      boardName: this.boardName,
      admins: this.admins,
      users: this.users,
      columns: this.columns,
      issues: this.issues,
      description: this.description,
      privateBoard: this.privateBoard,
    }).then( r => {
      console.log('Db entry update successful');
    }).catch(err => {
      console.log('Update broke.' + err.toString());
    });
  }

  /**
   * Deletes the database entry for this board
   * Deletes the board doc, the columns, and issues
   */
  deleteDbEntry(): void{
    this.db.collection('Boards').doc(this.boardId).delete();
    // Todo: Delete all columns
    for (let i = 0; i < this.columns.length; i++){
      this.db.collection('Columns').doc(this.columns[i]).delete();
    }
    for (let i = 0; i < this.issues.length; i++){
      this.db.collection('KanbanCard').doc(this.issues[i]).delete();
    }
  }

  addCardToColumn(colId: string, cardId: string): void{
    const columnDocument = this.db.collection('Columns').doc(colId);
    let colIssues = [];
    columnDocument.get().toPromise().then(result => {
      colIssues = result.get('issues');
      colIssues.push(cardId);
      columnDocument.update({
        issues: colIssues,
      }).then( r => {
        console.log('Column Db entry update successful');
      }).catch(err => {
        console.log('update of column broke.' + err.toString());
      });
    }).catch(err => {
      console.log('Failed to get column to add too. id:' + colId);
    });
  }

  deleteCard(cardId: string): void {
    const index = this.issues.indexOf(cardId);
    this.issues.splice(index, 1);
    this.updateDbEntry(); // Update the database to delete the column
  }
}
