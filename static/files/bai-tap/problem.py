from Crypto.Util.number import *
from functools import reduce
from operator import mul

flag = ?
target = bytes_to_long(flag)

def oracle(t):
    return t[0](t[1], t[2], t[3])

def shadow(v, m):
    return v % m

def lift(v):
    return v - 1

def gate(e, p):
    return inverse(e, lift(p))

def fold(arr):
    return reduce(mul, arr, 1)

g = [
    126256,
    222182477,
    5
]

h = [
    2707559,
    391208159,
    18060998312408658853
]

sink = 7363377006095743807

u = ?
v = ?
w = ?

chain = [
    (pow, g[0], u, h[0], v),
    (pow, g[1], v, h[1], w),
    (pow, g[2], w, h[2], sink)
]

for box in chain:
    lhs = oracle(box[:4])
    rhs = box[4]

    if box[3] != h[2]:
        assert lhs == shadow(rhs, box[3])
    else:
        assert lhs == rhs

assert fold([gate(u, h[0]), gate(v, h[1]), gate(w, h[2])]) == target

#hint = YsOgaSB24buhIGzDsm5nLCBj4bqnbiBjaMOzIGfDrCBoaW50LiBkbHAuLi4= 