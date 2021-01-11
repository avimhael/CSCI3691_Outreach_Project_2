export class ColumnModel {
  constructor(id: string, title: string, desc: string, issues: Array<string>) {
    this.id = id;
    this.title = title;
    this.description = desc;
    this.issues = issues;
  }

  id: string;
  title: string;
  description: string;
  issues: Array<string>;
}
