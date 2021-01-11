export class KanbanCardModel {
  dbId: string;
  title: string;
  owner: string;
  tags: Array<string>;
  date: Date;
  details: string;
  weight: number;
  type: 'collapsed' | 'expanded';

  constructor(
    dbId: string,
    title: string,
    owner: string,
    tags: Array<string>,
    date: Date,
    details: string,
    weight: number,
    type: 'collapsed' | 'expanded'
  ) {
    this.dbId = dbId;
    this.title = title;
    this.owner = owner;
    this.tags = tags;
    this.date = date;
    this.details = details;
    this.weight = weight;
    this.type = type;
    this.weight = weight;
  }
}
