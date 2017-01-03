/*

Asynchronous Iteration Utility Factory (v. 1.0.6)

Copyright (c) 2016-2017 Nicola Fiori (JD342)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.

*/
'use strict';function _asyncToGenerator(fn){return function(){var gen=fn.apply(this,arguments);return new Promise(function(resolve,reject){function step(key,arg){try{var info=gen[key](arg),value=info.value}catch(error){return void reject(error)}return info.done?void resolve(value):Promise.resolve(value).then(function(value){step('next',value)},function(err){step('throw',err)})}return step('next')})}}require('babel-polyfill');var AsyncIteration=function AsyncIteration(a){if('function'!=typeof a)throw TypeError('function expected');var c,d,e,b=!1,f=[],g=function g(h){if(b)throw Error('include function called after conclusion');f.push(h),e(!0)};return _asyncToGenerator(regeneratorRuntime.mark(function _callee(){return regeneratorRuntime.wrap(function _callee$(_context){for(;1;)switch(_context.prev=_context.next){case 0:d=new Promise(function(h){e=h});case 1:return _context.next=3,d;case 3:if(_context.sent){_context.next=0;break}case 4:case'end':return _context.stop();}},_callee,void 0)}))(),_asyncToGenerator(regeneratorRuntime.mark(function _callee2(){return regeneratorRuntime.wrap(function _callee2$(_context2){for(;1;)switch(_context2.prev=_context2.next){case 0:return _context2.prev=0,_context2.next=3,a(g);case 3:_context2.next=8;break;case 5:_context2.prev=5,_context2.t0=_context2['catch'](0),c=_context2.t0;case 8:b=!0,Object.freeze(f),e(!1),e=null;case 9:case'end':return _context2.stop();}},_callee2,void 0,[[0,5]])}))(),Object.freeze({iterate:function iterate(){var j,h=0,k=Promise.resolve(),l=function l(){return k=_asyncToGenerator(regeneratorRuntime.mark(function _callee3(){return regeneratorRuntime.wrap(function _callee3$(_context3){for(;1;)switch(_context3.prev=_context3.next){case 0:return _context3.next=2,k;case 2:if(_context3.t0=h>=f.length,!_context3.t0){_context3.next=7;break}return _context3.next=6,d;case 6:_context3.t0=!_context3.sent;case 7:if(!_context3.t0){_context3.next=11;break}if(j=void 0,!c){_context3.next=10;break}throw c;case 10:return _context3.abrupt('return',!1);case 11:return _context3.abrupt('return',(j=f[h++],!0));case 12:case'end':return _context3.stop();}},_callee3,void 0)}))()};return Object.defineProperty(l,'result',{enumerable:!0,get:function get(){return j}}),l},promise:function(){var _ref4=_asyncToGenerator(regeneratorRuntime.mark(function _callee4(){return regeneratorRuntime.wrap(function _callee4$(_context4){for(;1;)switch(_context4.prev=_context4.next){case 0:return _context4.next=2,d;case 2:if(!_context4.sent){_context4.next=6;break};case 4:_context4.next=0;break;case 6:if(!c){_context4.next=8;break}throw c;case 8:return _context4.abrupt('return',f);case 9:case'end':return _context4.stop();}},_callee4,void 0)}));return function promise(){return _ref4.apply(this,arguments)}}()})};module.exports=AsyncIteration;