/*
form_to_array.js
Copyright (C) 2019 Douile

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

function* items(array) {
  for (var i=0;i<array.length;i++) {
    yield [i,array[i]];
  }
}

class FormCapture {
  constructor(form) {
    if (!(form instanceof HTMLFormElement)) {
      throw Error('form must be an instanceof HTMLFormElement');
    }
    this.form = form;
  }
  queryStrings() {
    return new Promise((resolve,reject) => {
      var queries = [];
      queries.push(new Query(this.form,'input'));
      if (this.form.id !== undefined) {
        queries.push(new Query(document,`input[for=${this.form.id}]`));
      }
      resolve(queries);
    })
  }
  collectNodes(queries) {
    return new Promise((resolve,reject) => {
      var nodes = [];
      for (var [i,query] of items(queries)) {
        nodes = Array.concat(nodes,query.call());
      }
      resolve(nodes);
    })
  }
  parseNodes(nodes) {
    return new Promise((resolve,reject) => {
      var capture = new FormCaptureData();
      for (var [i,item] of items(nodes)) {
        capture.parseNode(item);
      }
      resolve(capture);
    })
  }
}

class Query {
  constructor(node,queryString) {
    this.context = node;
    this.queryString = queryString;
  }
  call() {
    return Array.from(this.context.querySelectorAll(this.queryString));
  }
}

class FormCaptureData extends Map {
  parseNode(node) {
    var nodeData = new FormCaptureNode(node),
    data = [];
    if (this.has(nodeData.type)) {
      data = this.get(nodeData.type);
    }

    data.push(nodeData);
    this.set(nodeData.type,nodeData);
  }
}

class FormCaptureNode {
  constructor(node) {
    if (node.tagName !== 'INPUT') {
      throw Error('Node provided is not an input');
    }
    this.node = node;
    this.type = node.getAttribute('type');
    this.name = node.getAttribute('name');
    this.value = node.value;
  }
}
