/*
save_localstorage.js
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
function saveStorage() {
	'use strict';
	let map = {};
	for (var key in localStorage) {
		let data = localStorage.getItem(key);
		if (data !== null && data !== undefined) {map[key] = data}
	};
	let output = {'type':'STORAGE MAP','ms_ver':1,'document':window.location.href,'localStorage':map};
	let json = JSON.stringify(output);let blob = new Blob([json],{'type':'application/json'});
	let d = document.createElement('a');
	d.href = URL.createObjectURL(blob);
	d.target = '_blank';
	d.download = encodeURI(document.title)+'.save';
	document.body.appendChild(d);
	d.click();
	d.remove();
}
