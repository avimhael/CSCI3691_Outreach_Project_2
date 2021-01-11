import {Component, OnInit, Input, Inject, EventEmitter, Output} from '@angular/core';
import { KanbanCardModel } from "../kanban-card/kanban-card.model";
import { faPlusCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { MatDialog,  MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { AngularFirestore } from "@angular/fire/firestore";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  @Input() card: KanbanCardModel;
  @Input() db: AngularFirestore;

  @Output() createdFinished: EventEmitter<any> = new EventEmitter();

  constructor(public dialog: MatDialog) {};

  faTimes = faTimes;
  // dueDate = new Date(2020, 11, 19);

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateModal, {
      panelClass: 'white-dialog',
      width: '600px',
      data: this.card,
    });
    dialogRef.componentInstance.db = this.db;
    dialogRef.componentInstance.emitService.subscribe(id => {
      this.createdFinished.emit(id);
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });

    dialogRef.backdropClick().subscribe()

  }

  ngOnInit(): void {
  }
}

@Component({
  selector: 'create-modal',
  templateUrl: './create-modal.html',
  styleUrls: ['./create-modal.component.css'],
})
export class CreateModal {
  @Input() db: AngularFirestore;
  // dueDate = new Date(2020, 11, 19);
  @Output() emitService = new EventEmitter();
  @Input() sTag: Array<string>;
  @Input() stag: string;


  constructor(
    public dialogRef: MatDialogRef<CreateModal>,
    @Inject(MAT_DIALOG_DATA) public data: KanbanCardModel
      = new KanbanCardModel('','', '', [''], new Date('23/11/2020'), '', null, null),
  ) {}

  // TODO: create card functionality. Work with team A to integrate board.
  onAddClick(): void {

    this.db.collection('KanbanCard').add({
      title: this.data.title,
      owner: this.data.owner,
      details: this.data.details,
      tags: this.data.tags,
      type: this.data.type,
      date: this.data.date,
      completed: this.data.date,
      weight: this.data.weight,
    }).then(r => {
      this.data.dbId = r.id;
      this.emitService.emit(r.id);
      console.log('Document successfully updated!');
    });
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }



}

