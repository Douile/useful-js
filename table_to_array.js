/*
table_to_array.js
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
    yield array[i];
  }
}

class Head {
  constructor() {
    this.items = null;
    this._listeners = [];
  }
  isSet() {
    return this.items !== null;
  }
  set(head) {
    this.items = head;
    for (var listener of items(this._listeners)) {
      listener();
    }
  }
  listen(callback) {
    this._listeners.push(callback);
  }
}

function tableToArray(domTable) {
  function processRow(row, headData) {
    return new Promise((resolve,reject) => {
      if (headData.isSet()) {
        let data = row.getElementsByTagName('td');
        var rowObject = {};
        for (var i=0;i<data.length;i++) {
          if (i<headData.items.length) {
            rowObject[headData.items[i]] = data[i].innerText.trim().toLowerCase();
          }
        }
        resolve(rowObject);
      } else {
        let heads = row.getElementsByTagName('th');
        if (heads.length > 0) {
          let headsText = [];
          for (var head of items(heads)) {
            headsText.push(head.innerText.trim().toLowerCase());
          }
          headData.set(headsText);
          processRow(row, headData).then(resolve,reject);
        } else {
          headData.listen(() => {
            processRow(row, headData).then(resolve,reject);
          })
        }
      }
    });
  }
  return new Promise((resolve, reject) => {
    if (domTable instanceof HTMLTableElement) {
      var rows = domTable.getElementsByTagName('tr'),
      headData = new Head(),
      content = [],
      done = 0;
      for (var item of items(rows)) {
        processRow(item, headData).then((rowData) => {
          if (Object.keys(rowData).length > 0) {
            content.push(rowData);
          }
          done += 1;
          if (done >= rows.length) {
            resolve(content);
          }
        },(...args) => {
          console.error(...args);
          done += 1;
          if (done >= rows.length) {
            resolve(content);
          }
        });
      }
    }
  });
}
