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


