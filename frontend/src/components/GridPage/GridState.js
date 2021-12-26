class GridState {
  static Editing = new GridState("editing");
  static Saved = new GridState("saved");
  static Waiting = new GridState("waiting");
  static Completed = new GridState("completed");

  constructor(name) {
    this.name = name;
  }
}

export default GridState;
