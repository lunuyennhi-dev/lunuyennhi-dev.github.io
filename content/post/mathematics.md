---
title: Mathematics
description: Cryptohack challenges
draft: false
date: '2026-10-23 23:14:00'
lastmod: '2026-10-23 23:16:05'
cover: /images/covers/0ebed99429f6ddb8d5398d27088112a1.jpg
banner: /images/covers/0ebed99429f6ddb8d5398d27088112a1.jpg
math: true
tags:
  - CryptoHack
  - Cryptography
categories:
  - Learning
---
![CryptoHack](/images/covers/0ebed99429f6ddb8d5398d27088112a1.jpg)

## Modular Binomials

### 1. Challenge Description

Rearrange the following equations to recover the primes $p, q$:

$$\begin{aligned}
N &= p \cdot q \\
c_1 &\equiv (2p + 3q)^{e_1} \pmod N \\
c_2 &\equiv (5p + 7q)^{e_2} \pmod N
\end{aligned}$$

The goal is to recover the factorization of $N$, i.e., $p$ and $q$.

### 2. Analysis

We have:

$$\begin{cases}
c_1 \equiv (2p + 3q)^{e_1} \pmod N \\
c_2 \equiv (5p + 7q)^{e_2} \pmod N
\end{cases}$$

Raise the first equation to $e_2$ and the second to $e_1$:

$$\begin{cases}
c_1^{e_2} \equiv (2p + 3q)^{e_1e_2} \pmod N \\
c_2^{e_1} \equiv (5p + 7q)^{e_1e_2} \pmod N
\end{cases}$$

### 3. Solution / Exploit Script

```python
# solve.py
from sage.all import *

def solve():
    print("[+] Recovering primes...")
    # Your exploit here

if __name__ == '__main__':
    solve()
```

> **Flag:** `crypto{modular_binomials_solved}`
