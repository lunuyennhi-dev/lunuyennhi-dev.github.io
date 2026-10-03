---
title: CRYPTOHACK
description: CryptoHack write-ups and notes
date: 2026-10-03
lastmod: 2026-10-03
cover: "/images/covers/cryptohack.webp"
banner: "/images/covers/cryptohack.webp"
math: true
tags:
  - CryptoHack
  - Cryptography
categories:
  - Learning 
---
![CryptoHack](/images/covers/cryptohack.webp)

## Modular Binomials

### 1. Challenge Description

Rearrange the following equations to recover the primes $p, q$:

$$\begin{aligned} N &= p \cdot q \\ c_1 &\equiv (2p + 3q)^{e_1} \pmod N \\ c_2 &\equiv (5p + 7q)^{e_2} \pmod N \end{aligned}$$

The goal is to recover the factorization of $N$, i.e., $p$ and $q$.

### 2. Analysis

We have:

$$\begin{cases} c_1 \equiv (2p + 3q)^{e_1} \pmod N \\ c_2 \equiv (5p + 7q)^{e_2} \pmod N \end{cases}$$

Raise the first equation to $e_2$ and the second to $e_1$:

$$\begin{cases} c_1^{e_2} \equiv (2p + 3q)^{e_1e_2} \pmod N \\ c_2^{e_1} \equiv (5p + 7q)^{e_1e_2} \pmod N \end{cases}$$

Let $q_1 = c_1^{e_2} \pmod N$ and $q_2 = c_2^{e_1} \pmod N$.

Since $N = p \cdot q$, we can work modulo $q$. Because $q \equiv 0 \pmod q$, we have:

$$2p + 3q \equiv 2p \pmod q \quad \text{and} \quad 5p + 7q \equiv 5p \pmod q$$

Therefore:

$$q_1 \equiv (2p)^{e_1e_2} \pmod q \quad \text{and} \quad q_2 \equiv (5p)^{e_1e_2} \pmod q$$

Multiplying the first equation by $5^{e_1e_2}$ and the second by $2^{e_1e_2}$:

$$\begin{aligned} 5^{e_1e_2}q_1 &\equiv (10p)^{e_1e_2} \pmod q \\ 2^{e_1e_2}q_2 &\equiv (10p)^{e_1e_2} \pmod q \end{aligned}$$

Hence,

$$5^{e_1e_2}q_1 - 2^{e_1e_2}q_2 \equiv 0 \pmod q$$

So the following value is divisible by $q$:

$$D = 5^{e_1e_2}q_1 - 2^{e_1e_2}q_2$$

Since $q \mid D$ and $q \mid N$, we can recover $q$ and $p$ using:

$$q = \gcd(D, N) \quad \Rightarrow \quad p = \frac{N}{q}$$

### 3. Solution

```python
from math import gcd

n = 14905562257842714057932724129575002825405393502650869767115942606408600343380327866258982402447992564988466588305174271674657844352454543958847568190372446723549627752274442789184236490768272313187410077124234699854724907039770193680822495470532218905083459730998003622926152590597710213127952141056029516116785229504645179830037937222022291571738973603920664929150436463632305664687903244972880062028301085749434688159905768052041207513149370212313943117665914802379158613359049957688563885385391972151218676545972118494969247440489763431359679770422939441710783575668679693678435669541781490217731619224470152467768073
e1 = 12886657667389660800780796462970504910193928992888518978200029826975978624718627799215564700096007849924866627154987365059524315097631111242449314835868137
e2 = 12110586673991788415780355139635579057920926864887110308343229256046868242179445444897790171351302575188607117081580121488253540215781625598048021161675697
c1 = 14010729418703228234352465883041270611113735889838753433295478495763409056136734155612156934673988344882629541204985909650433819205298939877837314145082403528055884752079219150739849992921393509593620449489882380176216648401057401569934043087087362272303101549800941212057354903559653373299153430753882035233354304783275982332995766778499425529570008008029401325668301144188970480975565215953953985078281395545902102245755862663621187410077124234699854724907039770193680822495470532218905083459730998003622926152590597710213127952141056029516116785229504645179830037937222022291571738973603920664929150436463632305664687903244972880062028301085749434688159905768052041207513149370212313943117665914802379158613359049957688563885391972151218676545972118494969247440489763431359679770422939441710783575668679693678435669541781490217731619224470152467768073
c2 = 14386997138637978860748278986945098648507142864584111124202580365103793165811666987664851210230009375267398957979494066880296418013345006977654742303441030008490816239306394492168516278328851513359596253775965916326353050138738183351643338294802012193721879700283088378587949921991198231956871429805847767716137817313612304833733918657887480468724409753522369325138502059408241232155633806496752350562284794715321835226991147547651155287812485862794935695241612676255374480132722940682140395725089329445356434489384831036205387293760789976615210310436732813848937666608611803196199865435145094486231635966885932646519

q1 = pow(c1, e2, n)
q2 = pow(c2, e1, n)

d = (pow(5, e1 * e2, n) * q1- pow(2, e1 * e2, n) * q2)

q = gcd(d, n)
p = n // q

assert p * q == n

print(f"p = {p}")
print(f"q = {q}")
```
## Adrien's Signs

### 1. Challenge Source Code

The challenge description states that Adrien has been looking at ways to encrypt his messages with the help of symbols and minus signs. Below is the provided `source.py` code:

```python
from random import randint

a = 288260533169915
p = 1007621497415251

FLAG = b'crypto{????????????????????}'

def encrypt_flag(flag):
    ciphertext = []
    plaintext = ''.join([bin(i)[2:].zfill(8) for i in flag])
    for b in plaintext:
        e = randint(1, p)
        n = pow(a, e, p)
        if b == '1':
            ciphertext.append(n)
        else:
            n = -n % p
            ciphertext.append(n)
    return ciphertext

print(encrypt_flag(FLAG))
```
### 2. Analysis
> <span style="color: #ff9800;">**1. Mathematical Prerequisites**</span>
> 
> **Quadratic Residue (QR):**
> For an odd prime $p$ and an integer $x$ where $\gcd(x, p) = 1$:
> * $x$ is a quadratic residue modulo $p$ ($x \in \text{QR}_p$) if there exists an integer $y$ such that: $y^2 \equiv x \pmod p$.
> * Otherwise, $x$ is a quadratic non-residue ($x \in \text{QNR}_p$).
> 
> **Legendre Symbol & Euler's Criterion:**
> The Legendre symbol $\left(\frac{x}{p}\right)$ quickly determines if $x$ is a QR modulo $p$:
> $$  \left(\frac{x}{p}\right) \equiv x^{\frac{p-1}{2}} \equiv \begin{cases} 1 & \text{if } x \in \text{QR}_p \\ -1 & \text{if } x \in \text{QNR}_p \end{cases} \pmod p  $$
> 
> **Multiplicative Property:**
> The Legendre symbol is multiplicative:
> $$\left(\frac{a \cdot b}{p}\right) = \left(\frac{a}{p}\right) \cdot \left(\frac{b}{p}\right) $$
> Specifically, when $p \equiv 3 \pmod 4$, $-1$ is always a quadratic non-residue: $\left(\frac{-1}{p}\right) = -1$.

---






The script converts the flag into a binary string and encrypts each bit $b$ using a random exponent $e$:
* If $b = 1$, the ciphertext is $c \equiv a^e \pmod p$.
* If $b = 0$, the ciphertext is $c \equiv -a^e \pmod p$.

By evaluating the provided parameters $p$ and $a$, we observe two mathematical properties:
1. $p \equiv 3 \pmod 4$, which means the Legendre symbol of $-1$ is $\left(\frac{-1}{p}\right) = -1$.
2. $\left(\frac{a}{p}\right) = 1$, meaning $a$ is a Quadratic Residue (QR) modulo $p$.

Since $a \in \text{QR}_p$, any power $a^e$ will always remain a QR, meaning $\left(\frac{a^e}{p}\right) = 1$. However, for $b = 0$, the ciphertext is negated, which flips its Legendre symbol:

$$\begin{aligned} b = 1 &\implies \left(\frac{c}{p}\right) = \left(\frac{a^e}{p}\right) = 1 \\ b = 0 &\implies \left(\frac{c}{p}\right) = \left(\frac{-a^e}{p}\right) = \left(\frac{-1}{p}\right) \cdot \left(\frac{a^e}{p}\right) = -1 \end{aligned}$$

> **Key Insight:** The sign flip directly alters the quadratic residue property. We can distinguish between bits `1` and `0` simply by computing the Legendre symbol using Euler's Criterion, bypassing the Discrete Logarithm Problem (DLP) completely.

---

### 3. Solution 

```python
from Crypto.Util.number import long_to_bytes

a = 288260533169915
p = 1007621497415251
# ciphertext = [...] 

bits = ""
for c in ciphertext:
    # Compute Legendre symbol using Euler's Criterion
    legendre = pow(c, (p - 1) // 2, p)
    
    if legendre == 1:
        bits += "1"
    else:
        # legendre will be p-1 (which is equivalent to -1 mod p)
        bits += "0"

# Convert binary string back to bytes
flag = int(bits, 2).to_bytes(len(bits) // 8, byteorder="big")
print(f"[*] Flag: {flag.decode()}")
