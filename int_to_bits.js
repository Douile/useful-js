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