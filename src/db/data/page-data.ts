import type { Collection, Data, HttpRequest } from "./data-manager-interface";

export class PageData implements Data {
  requests: Record<string, HttpRequest>;
  collections: Record<string, Collection>;

  constructor(
    requests: Record<string, HttpRequest> = {},
    collections: Record<string, Collection> = {}
  ) {
    this.requests = requests ?? {};
    this.collections = collections ?? {};
  }
}