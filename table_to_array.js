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
