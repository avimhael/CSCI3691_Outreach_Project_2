import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  Inject, Optional,
} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { KanbanCardModel } from '../../kanban-card/kanban-card.model';
import { AngularFirestore } from '@angular/fire/firestore';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {CdkDragEnter, CdkDragExit} from '@angular/cdk/drag-drop/drag-events';
import {ColumnModel} from './column.model';
import {Board} from '../board.model';


@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.css'],
})
export class ColumnComponent implements OnInit {
  column: ColumnModel;

  public columnId: string;
  public author: string;

  issues: Array<KanbanCardModel> = [];
  faTimes = faTimes;

  @Input() db: AngularFirestore;
  @Input() id: string;
  @Input() title: string;
  @Input() issueList: Array<string>;

  @Input() boardId: string;

  @Output() deleteCalled: EventEmitter<any> = new EventEmitter();
  @Output() cardDeletedEmitter: EventEmitter<any> = new EventEmitter();

  constructor(){}

  ngOnInit(): void {
    this.loadDbEntry();
  }

  // deleteColumn() method - will be attached to a button and delete column on click
  deleteColumn(): void{
    this.deleteCalled.emit(this.id);
    this.db.collection('Columns').doc(this.id).delete().then(r => {console.log('Column Deleted'); });
  }

  updateDbEntry(): void{
    this.db.collection('Columns').doc(this.id).update({
      columnTitle: this.title,
      issues: this.issueList,
      boardId: this.boardId,
    }).then( r => {
      console.log('Column Db entry update successful');
    }).catch(err => {
      console.log('update of column broke.' + err.toString());
    });
  }

  loadDbEntry(): void{
    this.db.collection('Columns').doc(this.id).snapshotChanges().subscribe(r => {
      const doc = r.payload;
      this.title = doc.get('columnTitle');
      this.issueList = doc.get('issues');
      this.boardId = doc.get('boardId');
      console.log('Finished loading column. ' + this.id);
      this.updateUi();
    });
  }

  drop(event: CdkDragDrop<KanbanCardModel[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      moveItemInArray(this.issueList, event.previousIndex, event.currentIndex);
      this.updateDbEntry();
    } else {
      const card = event.previousContainer.data[event.previousIndex];
      console.log('card id: ' + card.dbId);
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      this.issueList.splice(event.currentIndex, 0, card.dbId);
      this.updateDbEntry();
    }
  }

  /**
   * Called when the item is dragged out of this column
   * @param event - the event trigger
   */
  entered(event: CdkDragEnter<KanbanCardModel>): void{
    console.log('entered: ' + event.item.data.dbId);
    const index = this.issueList.indexOf(event.item.data.dbId);
    if (index < 0){
      this.issueList.push(event.item.data.dbId);
      this.updateDbEntry(); // Update the database to delete the issue
    }
  }

  /**
   * Called when the item is dragged out of this column
   * @param event - the event trigger
   */
  exited(event: CdkDragExit<KanbanCardModel>): void{
    console.log('exited: ' + event.item.data.dbId);
    const index = this.issueList.indexOf(event.item.data.dbId);
    this.issueList.splice(index, 1);
    this.updateDbEntry(); // Update the database to delete the issue
  }

  updateUi(): void{
    while (this.issues.length) { this.issues.pop(); }
    for (const index in this.issueList){
      this.db.collection('KanbanCard').doc(this.issueList[index]).get().toPromise().then(r => {
        this.issues.push(
          new KanbanCardModel(this.issueList[index], r.get('title'), r.get('owner'), r.get('tags'),
            r.get('date'), r.get('details'), r.get('weight'), r.get('type')));
      }).catch(err => {
        console.log('Failed to load column form DB' + err.toString());
      });
    }
  }

  cardDeleted(cardId: string): void{
    this.cardDeletedEmitter.emit(cardId);
    const index = this.issueList.indexOf(cardId);
    this.issueList.splice(index, 1);
    this.issues.splice(index, 1);
    this.updateDbEntry(); // Update the database to delete the column
  }
}
