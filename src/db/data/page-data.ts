import type { Collection, Data, HttpRequest } from "./data-manager-interface";

export class PageData implements Data {
  requests: Record<string, HttpRequest>;
  collections: Record<string, Collection>;
  history: Record<number, HttpRequest>;

  constructor(
    requests: Record<string, HttpRequest> = {},
    collections: Record<string, Collection> = {},
    history: Record<number, HttpRequest> = {}
  ) {
    this.requests = requests ?? {};
    this.collections = collections ?? {};
    this.history = history ?? {};
  }
}
