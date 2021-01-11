export class Board {
  /**
   * Board definition matching the contents of the database
   * <columns> - holds the firebase document ids for the columns
   * <issues> -  holds the firebase document ids for the issues for that board
   */
  id: string;
  name: string;
  admin: Array<string>;
  users: Array<string>;
  columns: Array<string>;
  issues: Array<string>;
  description: string;
  privateBoard: boolean;

  /**
   * Simple Constructor for the board object.
   * @param id - The document id in firebase of this board.
   * @param name - the board name.
   * @param admin - the damin list.
   * @param users - the users list only matters if the board is provate.
   * @param columns - A list of column firebase ids.
   * @param issues - A list of issue firebase ids.
   * @param description - description of the board set on creation.
   * @param privateBoard - boolean if the board is private.
   */
  constructor(id: string, name: string, admin: Array<string>, users: Array<string>,
              columns: Array<string>, issues: Array<string>, description: string, privateBoard: boolean) {
    this.id = id;
    this.name = name;
    this.admin = admin;
    this.users = users;
    this.columns = columns;
    this.issues = issues;
    this.description = description;
    this.privateBoard = privateBoard;
  }
}
