import type { Collection } from "./data-manager-interface";

export class RequestCollection implements Collection {
  readonly id: string = crypto.randomUUID();
  title: string;
  isOpen: boolean;

  constructor(title: string, isOpen: boolean) {
    if (!title.trim()) {
      throw new Error("Collection title cannot be empty");
    }

    this.isOpen = isOpen;
    this.title = title;
  }
  setTitle(title: string): void {
    this.title = title;
  }
  setOpen(state: boolean): void {
    this.isOpen = state;
  }
}
