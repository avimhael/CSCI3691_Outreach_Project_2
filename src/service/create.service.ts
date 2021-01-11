import { Injectable } from '@angular/core';
import {KanbanCardModel} from "../app/kanban-card/kanban-card.model";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CreateService {

  triggerToUpdate = new Subject<boolean>();
  private cards:  KanbanCardModel[] = [
    new KanbanCardModel('first card title', 'owner of first issue', null,
      'date of first issue', 'details of first issue', 'expanded'),
    new KanbanCardModel('second card title', 'owner of second issue', null,
      'date of second issue', 'details of second issue', 'expanded'),
  ];
  constructor() { }

  addCard(card: KanbanCardModel): void
  {
    const newCard = new KanbanCardModel(card.title, card.owner, card.tags, card.date, card.details, card.type );
    this.cards.push(newCard);
    this.triggerToUpdate.next(true);
  }
}
