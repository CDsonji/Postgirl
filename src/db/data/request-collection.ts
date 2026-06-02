import type { Collection } from "./data-manager-interface";

export class RequestCollection implements Collection {
  readonly id: string = crypto.randomUUID();
  title: string;

  constructor(title: string) {
    if (!title.trim()) {
      throw new Error("Collection title cannot be empty");
    }

    this.title = title;
  }
}