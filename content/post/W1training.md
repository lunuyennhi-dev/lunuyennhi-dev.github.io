---
title: WannaWin Training - Cryptography
description: ESB and RSA
date: 2026-10-12
lastmod: 2026-10-12
cover: "/images/covers/cryptohack.webp"
banner: "/images/covers/cryptohack.webp"
math: true
tags:
  - Cryptography
categories:
  - Learning 
---
## ECB
### 1. Source code
```python
# Install dependencies: pip install pycryptodome
# Hint: https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#Electronic_codebook_(ECB)

import secrets

from Crypto.Cipher import AES

with open("flag.txt", "rb") as f:
    FLAG = f.read().strip()

assert len(FLAG) == 32

def main() -> None:
    key_int = secrets.randbelow(1_000_001) 
    key = key_int.to_bytes(16, "big")

    ct = AES.new(key, AES.MODE_ECB).encrypt(FLAG)
    with open("output.txt", "w") as f:
        f.write(ct.hex())


if __name__ == "__main__":
    main()
```
Output:
```text
# ct: a58fd383d77105ed4cec2ff0eb3e483dea0d8bf2d963ce6e61a7c875a8b4edea
```
### 2. Phân tích bài
Đây là một bài giải mã AES_ECB với khóa key được tạo ngẫu nhiên từ hàm **secrets.randbelow(1_000_001)**
Ta cần giải mã **ciphertext** nhiều lần với key tạo ngẫu nhiên đến khi thu được flag có dạng **W1{}**
Flag được mã hóa như sau:
```python
ct = AES.new(key, AES.MODE_ECB).encrypt(FLAG)
```
Để mã hóa ct với khóa là **key** ta dùng:
``` python
decrypted = AES.new(key, AES.MODE_ECB).decrypt(ciphertext)
```
Bây giờ chỉ cần viết chương trình python tìm key để **decrypted** bắt đầu với **W1{** là xong.
### 3. Script
```python
import secrets
from Crypto.Cipher import AES
ciphertext = bytes.fromhex('a58fd383d77105ed4cec2ff0eb3e483dea0d8bf2d963ce6e61a7c875a8b4edea')
flag=True
while flag:
    key_int = secrets.randbelow(1_000_001) 
    key = key_int.to_bytes(16, "big")
    decrypted = AES.new(key, AES.MODE_ECB).decrypt(ciphertext)
    if decrypted.startswith(b'W1{'):
        print("plaintext", decrypted)
        print("password_hash", key.hex())
        flag=False
```
Output:
```text
plaintext b'W1{AES_1z_s0_3z_3z_3z_r1ght????}'
password_hash 000000000000000000000000000dc927
```
## RSA
### 1. Source code
```python
#!/usr/bin/env python3

from Crypto.Util.number import bytes_to_long, getPrime
from secret import messages


def RSA_encrypt(message):
    m = bytes_to_long(message)
    p = getPrime(1024)
    q = getPrime(1024)
    N = p * q
    e = 3
    c = pow(m, e, N)
    return N, e, c


for m in messages:
    N, e, c = RSA_encrypt(m)
    print(f"n = {N}")
    print(f"e = {e}")
    print(f"c = {c}")
```
output:
```text

```
### 2. Phân tích đề bài 
Ta chú ý điểm đặc biệt của bài này là số mũ $e = 3$ rất nhỏ. Nếu $m^3 < n$, ta có thể khôi phục $m$ bằng cách lấy trực tiếp căn bậc 3 của $c$:

Ta kiểm tra các giá trị căn bậc ba của $c$ bằng hàm `iroot` trong thư viện `gmpy2`:

```python
for c in C:
    print(iroot(c, 3))
```

Tất cả kết quả trả về đều có cờ `False` (dạng `(k, False)`), chứng tỏ $m^3 > n_i$ nên phép lấy căn bậc 3 trực tiếp trên từng bản mã riêng lẻ không thành công.

Ta áp dụng phương pháp **Håstad's Broadcast Attack**:

> **Håstad's Broadcast Attack**
>
> Suppose Alice sends an unpadded message $M$ to $k$ people $P_1, P_2, \dots, P_k$ each using the same small public key exponent $e$ and different moduli $N_i$ for the $i$-th individual, with the public key $(N_i, e)$. The attack states that as soon as $k \ge e$, the message $M$ is no longer secure and we can recover it easily using the Chinese Remainder Theorem (CRT).
>
> Let us understand this attack using an example: Alice sends a message $M$ to 3 different people using the same public key exponent $e = 3$. Let the ciphertext received by the $i$-th receiver be $C_i$ where $C_i \equiv M^3 \pmod{N_i}$[cite: 2]. We assume that $\gcd(N_i, N_j) = 1$ where $i \neq j$.
>
> *Quick Question: What if $\gcd(N_i, N_j) \neq 1$?*  
> Then the moduli pair $(N_i, N_j)$ is vulnerable to a Common Factor Attack.
>
> We can now write:
> $$> \begin{aligned}  > M^3 &\equiv C_1 \pmod{N_1} \\  > M^3 &\equiv C_2 \pmod{N_2} \\  > M^3 &\equiv C_3 \pmod{N_3}  > \end{aligned} >$$[cite: 2]
>
> Thus we can get the following by solving using the Chinese Remainder Theorem:
> $$ > M^3 = \sum_{i=1}^3 C_i b_i b'_i \pmod N > $$[cite: 2]
>
> where $b_i = \frac{N}{N_i}$, $b'_i \equiv b_i^{-1} \pmod{N_i}$ and $N = N_1 \cdot N_2 \cdot N_3$[cite: 2]. Since we know that $M < N_i$ for all $i \in \{1, 2, 3\}$, it follows that $M^3 < N_1 N_2 N_3 = N$.  
> Because $M^3 < N$, the modulo operation is eliminated on the integers:
> $$> M^3 \pmod N = M^3 >$$
> We can easily calculate $M$ now by directly taking the integer cube root of $M^3$.

Với cùng một message được mã hóa RSA nhiều lần bằng các bộ $p, q$ khác nhau, ta lập hệ quan hệ đồng dư:

$$\begin{aligned}  m^3 &\equiv c_1 \pmod{n_1} \\  m^3 &\equiv c_2 \pmod{n_2} \\  m^3 &\equiv c_3 \pmod{n_3}  \end{aligned}$$


Dùng Định lý thặng dư Trung Hoa (CRT), ta tìm được giá trị $m^3$[cite: 2]:

$$m^3 = \sum_{i=1}^3 c_i b_i b'_i \pmod N$$

Ta trích xuất toàn bộ dữ liệu từ `output.txt`, lấy lần lượt các tổ hợp 3 bộ $(n_i, c_i)$ từ 7 bộ có sẵn, tính $m^3$ theo CRT và kiểm tra bằng hàm `iroot(m3, 3)` cho đến khi tìm được căn bậc 3 nguyên.
### 3. Script
```python
from itertools import combinations
from math import prod
from gmpy2 import iroot
def crt(remainders, moduli):
    N_total = prod(moduli)
    total = 0
    for c_i, n_i in zip(remainders, moduli):
        m_i = N_total // n_i
        y_i = pow(m_i, -1, n_i)  
        total = (total + c_i * m_i * y_i) % N_total
    return total
N, C = [], []

with open("output_0ef6d6343784e59e2f44f61d2d29896f.txt") as f:
    for line in f:
        if line.startswith("n ="):
            N.append(int(line.split("=")[1]))
        elif line.startswith("c ="):
            C.append(int(line.split("=")[1]))
e=3
for combo in combinations(range(len(N)), 3):
    sub_c = [C[i] for i in combo]
    sub_n = [N[i] for i in combo]

    C_crt = crt(sub_c, sub_n)
    m, is_exact = iroot(C_crt,e)

    if is_exact:
        flag_bytes = m.to_bytes((m.bit_length() + 7) // 8)
        flag_text = flag_bytes.decode()
        print(f"Flag (Text): {flag_text}")
        break

```
Output:
```text
Johan Hastad
Professor in Computer Science in the Theoretical Computer Science
Group at the School of Computer Science and Communication at KTH Royal Institute of Technology in Stockholm, Sweden.

crypto{1f_y0u_d0nt_p4d_y0u_4r3_Vuln3rabl3}
```

