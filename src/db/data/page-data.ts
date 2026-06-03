import { Theme, type Collection, type Data, type HttpRequest } from "./data-manager-interface";

export class PageData implements Data {
  requests: Record<string, HttpRequest>;
  collections: Record<string, Collection>;
  history: Record<number, HttpRequest>;
  theme: Theme;

  constructor(
    requests: Record<string, HttpRequest> = {},
    collections: Record<string, Collection> = {},
    history: Record<number, HttpRequest> = {},
    theme: Theme = Theme.DARK
  ) {
    this.requests = requests ?? {};
    this.collections = collections ?? {};
    this.history = history ?? {};
    this.theme=theme;
  }
}
