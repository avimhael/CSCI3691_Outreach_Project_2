import {Component, OnInit, Input, Inject, Output, EventEmitter} from '@angular/core';
import { KanbanCardModel } from './kanban-card.model';
import { faExpandAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import {faWeightHanging} from '@fortawesome/free-solid-svg-icons';
import {faCircle} from '@fortawesome/free-solid-svg-icons';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {AngularFirestore} from "@angular/fire/firestore";

@Component({
  selector: 'app-kanban-card',
  templateUrl: './kanban-card.component.html',
  styleUrls: ['./kanban-card.component.css'],
})

/**
 * @desc Kanban Card Component is resposnsible for the rendering of data associated with a Kanban Card
 * @param props a KanbanCardModel, see kanban-card-model.ts for detailed data types and params.
 * @author Sam Irvine, Liam Brown
 */
export class KanbanCardComponent implements OnInit {
  @Input() db: AngularFirestore;
  @Input() props: KanbanCardModel;
  @Output() deleteCard: EventEmitter<any> = new EventEmitter();


  constructor(public dialog: MatDialog) {}

  // Setting Icons
  faExpandAlt = faExpandAlt;
  faWeightHanding = faWeightHanging;
  faCircle = faCircle;
  faTimes = faTimes;


  openDialog(): void {
    const dialogRef = this.dialog.open(KanbanModal, {
      panelClass: 'white-dialog',
      width: '600px',
      data: this.props,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
  overdue(): number {
    const date: number = Date.now();
    const currDate: Date = new Date(new Date(date).toDateString());
    const dueDate: Date = new Date(new Date(this.props.date).toDateString());
    let due = 0;
    if (currDate > dueDate) {
      due = -1;
    } else if (currDate < dueDate) {
      due = 1;
    }
    return due;
  }
  due(): number{
    const date: number = Date.now();
    const currDate: Date = new Date(new Date(date).toDateString());
    const dueDate: Date = new Date(new Date(this.props.date).toDateString());
    return (+dueDate - +currDate) / 86400000 ;
  }

  expand(): void {
    this.props.type = 'expanded';
  }

  collapse(): void {
    this.props.type = 'collapsed';
  }

  onDeleteClick(): void{
    this.deleteCard.emit(this.props.dbId);
    this.db.collection('KanbanCard').doc(this.props.dbId).delete().then(r => {console.log('Card Deleted'); });
  }

  ngOnInit(): void {}
}

@Component({
  selector: 'kanban-modal',
  templateUrl: './kanban-modal.html',
  styleUrls: ['./kanban-modal.component.css'],
})
export class KanbanModal {
  constructor(
    public dialogRef: MatDialogRef<KanbanModal>,
    @Inject(MAT_DIALOG_DATA) public data: KanbanCardModel
  ) {}
  faWeightHanding = faWeightHanging;
  faCircle = faCircle;
  // Setting class vars
  isEditing = false;
  tags = this.data.tags;

  editCard(): void {
    this.isEditing = true;
  }

  finishEditCard(): void {
    this.isEditing = false;
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  // TODO Add functions for updating card
  overdue(): number {
    const date: number = Date.now();
    const currDate: Date = new Date(new Date(date).toDateString());
    const dueDate: Date = new Date(new Date(this.data.date).toDateString());
    let due = 0;
    if (currDate > dueDate) {
      due = -1;
    } else if (currDate < dueDate) {
      due = 1;
    }
    return due;
  }
  due(): number{
    const date: number = Date.now();
    const currDate: Date = new Date(new Date(date).toDateString());
    const dueDate: Date = new Date(new Date(this.data.date).toDateString());
    return (+dueDate - +currDate) / 86400000 ;
  }
}
