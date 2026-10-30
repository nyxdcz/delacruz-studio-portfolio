import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';

const source = await readFile('dist/app.js','utf8');
const start = source.indexOf('function setupContact()');
const end = source.indexOf('function renderSoftware()',start);
assert(start >= 0 && end > start,'Contact handler boundaries missing');
const listeners = {};
const copy = {textContent:'Copy',disabled:false,addEventListener(type,handler){listeners.copy=handler;}};
const copyStatus = {textContent:''};
const formStatus = {textContent:''};
let fields = {};
const drafts = [];
const writes = [];
let rejectClipboard = false;
const form = {
  querySelector(selector){assert.equal(selector,'.form-status');return formStatus;},
  addEventListener(type,handler){assert.equal(type,'submit');listeners.submit=handler;}
};
const contact = {querySelector(selector){return {'.studio-email-bar button':copy,'.studio-copy-status':copyStatus,form}[selector];}};
const document = {
  querySelector(selector){assert.equal(selector,'.studio-contact');return contact;},
  createElement(tag){assert.equal(tag,'a');return {href:'',click(){drafts.push(this.href);}};}
};
runInNewContext(`${source.slice(start,end)}\nsetupContact();`,{
  document,email:'nyxdcz@gmail.com',
  navigator:{clipboard:{async writeText(value){if(rejectClipboard)throw new Error('Clipboard denied');writes.push(value);}}},
  FormData:class{constructor(value){assert.equal(value,form);}get(key){return fields[key];}}
});

await listeners.copy();
assert.deepEqual(writes,['nyxdcz@gmail.com']);
assert.equal(copy.textContent,'Copied');
assert.equal(copy.disabled,false);
assert.equal(copyStatus.textContent,'Email address copied.');
rejectClipboard = true;
await listeners.copy();
assert.equal(copy.textContent,'Copy');
assert.equal(copy.disabled,false);
assert.match(copyStatus.textContent,/copy.*manually/i);

let prevented = false;
const event = {currentTarget:form,preventDefault(){prevented=true;}};
fields = {name:'   ',email:'review@example.com',message:'Project',location:''};
listeners.submit(event);
assert(prevented);
assert.equal(drafts.length,0,'Whitespace-only name must not open a draft');
assert.match(formStatus.textContent,/Please add/);

fields = {name:' Review & test ',email:' review@example.com ',message:' Site planting\nSecond line & details? ',location:' Narra, Palawan '};
listeners.submit(event);
const draft = new URL(drafts.at(-1));
assert.equal(draft.protocol,'mailto:');
assert.equal(draft.pathname,'nyxdcz@gmail.com');
assert.equal(draft.searchParams.get('subject'),'Project inquiry from Review & test');
assert.equal(draft.searchParams.get('body'),'Site planting\nSecond line & details?\n\nProject location: Narra, Palawan\n\nFrom: Review & test\nReply to: review@example.com');
assert.match(formStatus.textContent,/has not sent/);
fields.location = '';
listeners.submit(event);
assert(!new URL(drafts.at(-1)).searchParams.get('body').includes('Project location:'));
console.log('Verified copy success/failure, whitespace validation, and encoded email drafts with optional project location.');
