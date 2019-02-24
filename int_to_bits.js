/*
int_to_bits.js
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
function bits(n) {
    var o = '';
    var x = 0;
    while (true) {
        o = ((n & (1 << x)) > 0 ? '1' : '0') + o;
        x++;
        if (n - 2**x < 0) break;
    }
    return o;
}
