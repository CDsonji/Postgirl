import { Theme, type Collection, type Data } from "./data-manager-interface";
import type { HttpRequest } from "./http-request";
import type { RequestCollection } from "./request-collection";

export class PageData implements Data {
  requests: Record<string, Request>;
  collections: Record<string, >;
  history: Record<number, HttpRequest>;
  theme: Theme;

  constructor(
    requests: Record<string, Request> = {},
    collections: Record<string, Collection> = {},
    history: Record<number, Request> = {},
    theme: Theme = Theme.DARK
  ) {
    this.requests = requests ?? {};
    this.collections = collections ?? {};
    this.history = history ?? {};
    this.theme = theme;
  }
}
