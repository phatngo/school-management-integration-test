import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { CustomWorld } from './world';

function tryParseJSON(str: string) {
  try {
    return JSON.parse(str);
  } catch {
    return undefined;
  }
}

const allowedMethods = ['get','post','put','patch','delete','head','options'];

// Before(function (this: CustomWorld) {
//   // ensure fresh spec for each scenario
//   this.spec = require('pactum').spec();
// });

Given('I make a {string} request to {string}', function (this: CustomWorld, method: string, endpoint: string) {
  const m = method.toLowerCase();
  if (!allowedMethods.includes(m)) throw new Error(`Unsupported HTTP method: ${method}`);
  (this.spec as any)[m](endpoint);
});

Given('I set path param {string} to {string}', function (this: CustomWorld, key: string, value: string) {
  this.spec.withPathParams(key, value);
});

Given('I set query param {string} to {string}', function (this: CustomWorld, key: string, value: string) {
  this.spec.withQueryParams(key, value);
});

Given('I set basic authentication credentials {string} and {string}', function (this: CustomWorld, username: string, password: string) {
  this.spec.withAuth(username, password);
});

Given('I set header {string} to {string}', function (this: CustomWorld, key: string, value: string) {
  this.spec.withHeaders(key, value);
});

Given('I set cookie {string} to {string}', function (this: CustomWorld, key: string, value: string) {
  this.spec.withCookies(key, value);
});

Given('I set body to', function (this: CustomWorld, body: string) {
  const parsed = tryParseJSON(body);
  if (parsed !== undefined) {
    this.spec.withJson(parsed);
  } else {
    this.spec.withBody(body);
  }
});

Given('I upload file at {string}', function (this: CustomWorld, filePath: string) {
  this.spec.withFile(filePath);
});

Given('I set multi-part form param {string} to {string}', function (this: CustomWorld, key: string, value: string) {
  this.spec.withMultiPartFormData(key, value);
});

Given('I set inspection', function (this: CustomWorld) {
  this.spec.inspect();
});

When('I receive a response', async function (this: CustomWorld) {
  await this.spec.toss().then(message => {
  });
});

Then('I expect response to match a json snapshot {string}', async function (this: CustomWorld, name: string) {
  ((this.spec.response()) as any).should.have.jsonSnapshot(name);
});

Then('I expect response should have a status {int}', function (this: CustomWorld, code: number) {
  ((this.spec.response()) as any).should.have.status(code);
});

Then('I expect response header {string} should be {string}', function (this: CustomWorld, key: string, value: string) {
  ((this.spec.response()) as any).should.have.header(key, value);
});

Then('I expect response header {string} should have {string}', function (this: CustomWorld, key: string, value: string) {
  ((this.spec.response()) as any).should.have.headerContains(key, value);
});

Then('I expect response cookie {string} should be {string}', function (this: CustomWorld, key: string, value: string) {
  ((this.spec.response()) as any).should.have.cookies(key, value);
});

Then('I expect response should have a json', function (this: CustomWorld, json: string) {
  ((this.spec.response()) as any).should.have.json(JSON.parse(json));
});

Then('I expect response should have a json at {string}', function (this: CustomWorld, path: string, value: string) {
  ((this.spec.response()) as any).should.have.json(path, JSON.parse(value));
});

Then('I expect response should have a json like', function (this: CustomWorld, json: string) {
  ((this.spec.response()) as any).should.have.jsonLike(JSON.parse(json));
});

Then('I expect response should have a json like at {string}', function (this: CustomWorld, path: string, value: string) {
  ((this.spec.response()) as any).should.have.jsonLike(path, JSON.parse(value));
});

Then('I expect response should have a json schema', function (this: CustomWorld, json: string) {
  ((this.spec.response()) as any).should.have.jsonSchema(JSON.parse(json));
});

Then('I expect response should have a json schema at {string}', function (this: CustomWorld, path: string, value: string) {
  ((this.spec.response()) as any).should.have.jsonSchema(path, JSON.parse(value));
});

Then('I expect response should have a body', function (this: CustomWorld, body: string) {
  ((this.spec.response()) as any).should.have.body(body);
});

Then('I expect response body should contain {string}', function (this: CustomWorld, value: string) {
  ((this.spec.response()) as any).should.have.bodyContains(value);
});

Then('I expect response should have {string}', function (this: CustomWorld, handler: string) {
  ((this.spec.response()) as any).should.have._(handler);
});

Then('I expect response time should be less than {int} ms', function (this: CustomWorld, ms: number) {
  ((this.spec.response()) as any).should.have.responseTimeLessThan(ms);
});

Then('I store response at {string} as {string}', function (this: CustomWorld, path: string, name: string) {
  this.spec.stores(name, path);
});

After(function (this: CustomWorld) {
  this.spec.end();
});
