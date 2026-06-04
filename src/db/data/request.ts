import type { HttpRequest, Method } from "./data-manager-interface";

export class Request implements HttpRequest {
  readonly id: string = crypto.randomUUID();
  collectionId?: string;
  url: string;
  method: Method;
  params: Record<string, string | number>;
  headers: Record<string, string | number>;
  body?: Record<string, unknown>;

  constructor(
    url: string,
    method: Method,
    params: Record<string, string | number> = {},
    headers: Record<string, string | number> = {},
    body?: Record<string, unknown>,
    collectionId?: string,
  ) {
    if (!url.trim()) {
      throw new Error("url cannot be empty");
    }

    this.id = crypto.randomUUID();
    this.collectionId = collectionId;
    this.url = url;
    this.method = method;
    this.params = params;
    this.headers = headers;
    this.body = body;
  }

  setCollectionId(collectionId: string): void {
    if (!collectionId.trim()) {
      throw new Error("collectionId cannot be empty");
    }

    this.collectionId = collectionId;
  }

  setUrl(url: string): void {
    if (!url.trim()) {
      throw new Error("url cannot be empty");
    }

    this.url = url;
  }

  setMethod(method: Method): void {
    if (!method) {
      throw new Error("method is required");
    }

    this.method = method;
  }

  getParam(key: string): string | number {
    if (!key.trim()) {
      throw new Error("param key cannot be empty");
    }

    if (!(key in this.params)) {
      throw new Error(`param "${key}" does not exist`);
    }

    return this.params[key];
  }

  addParam(key: string, value: string | number): void {
    if (!key.trim()) {
      throw new Error("param key cannot be empty");
    }

    if (!(key in this.params)) {
      throw new Error(`param ${key} already exists`);
    }

    this.params[key] = value;
  }

  removeParam(key: string): string | number {
    if (!key.trim()) {
      throw new Error("param key cannot be empty");
    }

    if (!(key in this.params)) {
      throw new Error(`param "${key}" does not exist`);
    }

    const removedValue = this.params[key];
    delete this.params[key];
    return removedValue;
  }

  getHeader(key: string): string | number {
    if (!key.trim()) {
      throw new Error("header key cannot be empty");
    }

    if (!(key in this.headers)) {
      throw new Error(`header "${key}" does not exist`);
    }

    return this.headers[key];
  }

  addHeader(key: string, value: string | number): void {
    if (!key.trim()) {
      throw new Error("header key cannot be empty");
    }

    if (!(key in this.headers)) {
      throw new Error(`header ${key} already exists`);
    }

    this.headers[key] = value;
  }

  removeHeader(key: string): string | number {
    if (!key.trim()) {
      throw new Error("header key cannot be empty");
    }

    if (!(key in this.headers)) {
      throw new Error(`header "${key}" does not exist`);
    }

    const removedValue = this.headers[key];
    delete this.headers[key];
    return removedValue;
  }

  getBody(): Record<string, unknown> {
    if (!this.body) {
      throw new Error("request body does not exist");
    }

    return this.body;
  }

  setBody(body: Record<string, unknown>): void {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new Error("body must be a valid object");
    }

    if (this.method === "GET" || this.method === "HEAD") {
      throw new Error(`cannot set body for ${this.method} request`);
    }

    this.body = body;
  }
}
