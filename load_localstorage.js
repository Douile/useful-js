/*
load_localstorage.js
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
function loadStorage() {
	'use strict';
	let text = prompt('Paste your save file',''),
	input = JSON.parse(text);
	if (input.type === 'STORAGE MAP' && input.ms_ver === 1) {
		if (input.document === window.location.href) {
			for (var key in input.localStorage) {
				localStorage.setItem(key,input.localStorage[key]);
			}
			console.log('Localstorage restored, refreshing page...');
			window.location.href = window.location.href;
		} else {
			console.log(`Please navigate to ${input.document} and run script again`);
		}
	} else {
		console.log('Invalid save');
	}
};
