---
title: Symmetric Ciphers
description: Cryptohack challenges
draft: false
date: '2026-10-21'
lastmod: '2026-10-28 17:50:11'
cover: /images/covers/cryptohack.webp
banner: /images/covers/cryptohack.webp
math: true
tags:
  - CryptoHack
  - Cryptography
categories:
  - Learning
---
![CryptoHack](/images/covers/cryptohack.webp)
## Bringing It All Together

### 1. Đề bài
![Structure2](/images/post/cryptohack/image-1792546459907.png)
We've provided the key expansion code, and ciphertext that's been properly encrypted by AES-128. Copy in all the building blocks you've coded so far, and complete the decrypt function that implements the steps shown in the diagram. The decrypted plaintext is the flag.

### 2. Phân tích 

Bài này yêu cầu ta xây dựng 1 cấu trúc giải mã AES-128 ($N_{rounds} = 10$) từ các kiến thức đã học được từ các bài trước.  
Cụ thể ta cần giải mã ngược dựa theo cấu trúc mã hóa:
- Dùng hàm `expand_key` để biến `master_key` từ dãy 16 bytes thành $N_{rounds}+1 = 11$ `round_key`để áp dụng vào mỗi round.
- Các hàm `AddRoundKey`,`InvShiftRows`, `InvSubBytes`, `InvMixColumns` lần lượt được áp dụng theo đúng thứ tự nghịch đảo của mô hình cấu trúc AES.
- Quá trình giải mã xuất phát từ round cuối (Round 10): Cho ciphertext đi qua hàm `AddRoundKey` đầu tiên (với round_keys[10]), sau đó trải qua $N_{rounds}-1 = 9$ round biến đổi lặp lại theo thứ tự:`InvShiftRows` $\rightarrow$ `InvSubBytes` $\rightarrow$ `AddRoundKey` $\rightarrow$ `InvMixColumns`
- Ở round cuối cùng (Round 0), ta thực hiện tương tự nhưng bỏ qua hàm `InvMixColumns`.  
Bài này giúp ta hiểu rõ hơn cấu trúc của một hàm mã hóa cũng như giải mã AES cơ bản.  
Trong thực tế hoặc các bài toán chuẩn, ta có thể dùng trực tiếp thư viện `Crypto.Cipher` để giải mã ngắn gọn:
```python
from Crypto.Cipher import AES
plaintext = AES.new(key, AES.MODE_ECB).decrypt(ciphertext)
print(plaintext)
```
### 3. Lời giải

```python
N_ROUNDS = 10

key = b'\xc3,\\\xa6\xb5\x80^\x0c\xdb\x8d\xa5z*\xb6\xfe\\'
ciphertext = b'\xd1O\x14j\xa4+O\xb6\xa1\xc4\x08B)\x8f\x12\xdd'

S_BOX = (
    0x63, 0x7C, 0x77, 0x7B, 0xF2, 0x6B, 0x6F, 0xC5, 0x30, 0x01, 0x67, 0x2B, 0xFE, 0xD7, 0xAB, 0x76,
    0xCA, 0x82, 0xC9, 0x7D, 0xFA, 0x59, 0x47, 0xF0, 0xAD, 0xD4, 0xA2, 0xAF, 0x9C, 0xA4, 0x72, 0xC0,
    0xB7, 0xFD, 0x93, 0x26, 0x36, 0x3F, 0xF7, 0xCC, 0x34, 0xA5, 0xE5, 0xF1, 0x71, 0xD8, 0x31, 0x15,
    0x04, 0xC7, 0x23, 0xC3, 0x18, 0x96, 0x05, 0x9A, 0x07, 0x12, 0x80, 0xE2, 0xEB, 0x27, 0xB2, 0x75,
    0x09, 0x83, 0x2C, 0x1A, 0x1B, 0x6E, 0x5A, 0xA0, 0x52, 0x3B, 0xD6, 0xB3, 0x29, 0xE3, 0x2F, 0x84,
    0x53, 0xD1, 0x00, 0xED, 0x20, 0xFC, 0xB1, 0x5B, 0x6A, 0xCB, 0xBE, 0x39, 0x4A, 0x4C, 0x58, 0xCF,
    0xD0, 0xEF, 0xAA, 0xFB, 0x43, 0x4D, 0x33, 0x85, 0x45, 0xF9, 0x02, 0x7F, 0x50, 0x3C, 0x9F, 0xA8,
    0x51, 0xA3, 0x40, 0x8F, 0x92, 0x9D, 0x38, 0xF5, 0xBC, 0xB6, 0xDA, 0x21, 0x10, 0xFF, 0xF3, 0xD2,
    0xCD, 0x0C, 0x13, 0xEC, 0x5F, 0x97, 0x44, 0x17, 0xC4, 0xA7, 0x7E, 0x3D, 0x64, 0x5D, 0x19, 0x73,
    0x60, 0x81, 0x4F, 0xDC, 0x22, 0x2A, 0x90, 0x88, 0x46, 0xEE, 0xB8, 0x14, 0xDE, 0x5E, 0x0B, 0xDB,
    0xE0, 0x32, 0x3A, 0x0A, 0x49, 0x06, 0x24, 0x5C, 0xC2, 0xD3, 0xAC, 0x62, 0x91, 0x95, 0xE4, 0x79,
    0xE7, 0xC8, 0x37, 0x6D, 0x8D, 0xD5, 0x4E, 0xA9, 0x6C, 0x56, 0xF4, 0xEA, 0x65, 0x7A, 0xAE, 0x08,
    0xBA, 0x78, 0x25, 0x2E, 0x1C, 0xA6, 0xB4, 0xC6, 0xE8, 0xDD, 0x74, 0x1F, 0x4B, 0xBD, 0x8B, 0x8A,
    0x70, 0x3E, 0xB5, 0x66, 0x48, 0x03, 0xF6, 0x0E, 0x61, 0x35, 0x57, 0xB9, 0x86, 0xC1, 0x1D, 0x9E,
    0xE1, 0xF8, 0x98, 0x11, 0x69, 0xD9, 0x8E, 0x94, 0x9B, 0x1E, 0x87, 0xE9, 0xCE, 0x55, 0x28, 0xDF,
    0x8C, 0xA1, 0x89, 0x0D, 0xBF, 0xE6, 0x42, 0x68, 0x41, 0x99, 0x2D, 0x0F, 0xB0, 0x54, 0xBB, 0x16,
)

INV_S_BOX = (
    0x52, 0x09, 0x6A, 0xD5, 0x30, 0x36, 0xA5, 0x38, 0xBF, 0x40, 0xA3, 0x9E, 0x81, 0xF3, 0xD7, 0xFB,
    0x7C, 0xE3, 0x39, 0x82, 0x9B, 0x2F, 0xFF, 0x87, 0x34, 0x8E, 0x43, 0x44, 0xC4, 0xDE, 0xE9, 0xCB,
    0x54, 0x7B, 0x94, 0x32, 0xA6, 0xC2, 0x23, 0x3D, 0xEE, 0x4C, 0x95, 0x0B, 0x42, 0xFA, 0xC3, 0x4E,
    0x08, 0x2E, 0xA1, 0x66, 0x28, 0xD9, 0x24, 0xB2, 0x76, 0x5B, 0xA2, 0x49, 0x6D, 0x8B, 0xD1, 0x25,
    0x72, 0xF8, 0xF6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xD4, 0xA4, 0x5C, 0xCC, 0x5D, 0x65, 0xB6, 0x92,
    0x6C, 0x70, 0x48, 0x50, 0xFD, 0xED, 0xB9, 0xDA, 0x5E, 0x15, 0x46, 0x57, 0xA7, 0x8D, 0x9D, 0x84,
    0x90, 0xD8, 0xAB, 0x00, 0x8C, 0xBC, 0xD3, 0x0A, 0xF7, 0xE4, 0x58, 0x05, 0xB8, 0xB3, 0x45, 0x06,
    0xD0, 0x2C, 0x1E, 0x8F, 0xCA, 0x3F, 0x0F, 0x02, 0xC1, 0xAF, 0xBD, 0x03, 0x01, 0x13, 0x8A, 0x6B,
    0x3A, 0x91, 0x11, 0x41, 0x4F, 0x67, 0xDC, 0xEA, 0x97, 0xF2, 0xCF, 0xCE, 0xF0, 0xB4, 0xE6, 0x73,
    0x96, 0xAC, 0x74, 0x22, 0xE7, 0xAD, 0x35, 0x85, 0xE2, 0xF9, 0x37, 0xE8, 0x1C, 0x75, 0xDF, 0x6E,
    0x47, 0xF1, 0x1A, 0x71, 0x1D, 0x29, 0xC5, 0x89, 0x6F, 0xB7, 0x62, 0x0E, 0xAA, 0x18, 0xBE, 0x1B,
    0xFC, 0x56, 0x3E, 0x4B, 0xC6, 0xD2, 0x79, 0x20, 0x9A, 0xDB, 0xC0, 0xFE, 0x78, 0xCD, 0x5A, 0xF4,
    0x1F, 0xDD, 0xA8, 0x33, 0x88, 0x07, 0xC7, 0x31, 0xB1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xEC, 0x5F,
    0x60, 0x51, 0x7F, 0xA9, 0x19, 0xB5, 0x4A, 0x0D, 0x2D, 0xE5, 0x7A, 0x9F, 0x93, 0xC9, 0x9C, 0xEF,
    0xA0, 0xE0, 0x3B, 0x4D, 0xAE, 0x2A, 0xF5, 0xB0, 0xC8, 0xEB, 0xBB, 0x3C, 0x83, 0x53, 0x99, 0x61,
    0x17, 0x2B, 0x04, 0x7E, 0xBA, 0x77, 0xD6, 0x26, 0xE1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0C, 0x7D,
)

R_CON = (
    0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40,
    0x80, 0x1B, 0x36, 0x6C, 0xD8, 0xAB, 0x4D, 0x9A,
    0x2F, 0x5E, 0xBC, 0x63, 0xC6, 0x97, 0x35, 0x6A,
    0xD4, 0xB3, 0x7D, 0xFA, 0xEF, 0xC5, 0x91, 0x39,
)

def bytes2matrix(text):
    return [list(text[i:i+4]) for i in range(0, len(text), 4)]

def matrix2bytes(matrix):
    return bytes(sum(matrix, []))

def xtime(a):
    return (((a << 1) ^ 0x1B) & 0xFF) if (a & 0x80) else (a << 1)

def add_round_key(s, k):
    for row in range(4):
        for col in range(4):
            s[row][col] ^= k[row][col]
    return s

def inv_sub_bytes(s):
    for row in range(4):
        for col in range(4):
            s[row][col] = INV_S_BOX[s[row][col]]
    return s

def inv_shift_rows(s):
    s[0][1], s[1][1], s[2][1], s[3][1] = s[3][1], s[0][1], s[1][1], s[2][1]
    s[0][2], s[1][2], s[2][2], s[3][2] = s[2][2], s[3][2], s[0][2], s[1][2]
    s[0][3], s[1][3], s[2][3], s[3][3] = s[1][3], s[2][3], s[3][3], s[0][3]
    return s

def mix_columns(s):
    for col in range(4):
        a = s[col]
        t = a[0] ^ a[1] ^ a[2] ^ a[3]
        u = a[0]
        a[0] ^= t ^ xtime(a[0] ^ a[1])
        a[1] ^= t ^ xtime(a[1] ^ a[2])
        a[2] ^= t ^ xtime(a[2] ^ a[3])
        a[3] ^= t ^ xtime(a[3] ^ u)
    return s

def inv_mix_columns(s):
    for col in range(4):
        u = xtime(xtime(s[col][0] ^ s[col][2]))
        v = xtime(xtime(s[col][1] ^ s[col][3]))
        s[col][0] ^= u
        s[col][1] ^= v
        s[col][2] ^= u
        s[col][3] ^= v
    return mix_columns(s)
def expand_key(master_key):
    key_columns = bytes2matrix(master_key)
    iteration_size = len(master_key) // 4

    rcon_idx = 1
    while len(key_columns) < (N_ROUNDS + 1) * 4:
        word = list(key_columns[-1])

        if len(key_columns) % iteration_size == 0:
            word.append(word.pop(0))
            word = [S_BOX[b] for b in word]
            word[0] ^= R_CON[rcon_idx]
            rcon_idx += 1
        elif len(master_key) == 32 and len(key_columns) % iteration_size == 4:
            word = [S_BOX[b] for b in word]

        word = bytes(b1 ^ b2 for b1, b2 in zip(word, key_columns[-iteration_size]))
        key_columns.append(word)

    return [key_columns[4*i : 4*(i+1)] for i in range(len(key_columns) // 4)]

def decrypt(key, ciphertext):
    round_keys = expand_key(key)
    s = bytes2matrix(ciphertext)

    s = add_round_key(s, round_keys[N_ROUNDS])

    for i in range(N_ROUNDS - 1, 0, -1):
        s = inv_shift_rows(s)
        s = inv_sub_bytes(s)
        s = add_round_key(s, round_keys[i])
        s = inv_mix_columns(s)

    s = inv_shift_rows(s)
    s = inv_sub_bytes(s)
    s = add_round_key(s, round_keys[0])

    return matrix2bytes(s)

if __name__ == "__main__":
    plaintext = decrypt(key, ciphertext)
    print(plaintext)
```

> **Flag:** crypto{MYAES128}
## Modes of Operation Starter
### 1. Đề bài 
The previous set of challenges showed how AES performs a keyed permutation on a block of data. In practice, we need to encrypt messages much longer than a single block. A mode of operation describes how to use a cipher like AES on longer messages.

All modes have serious weaknesses when used incorrectly. The challenges in this category take you to a different section of the website where you can interact with APIs and exploit those weaknesses. Get yourself acquainted with the interface and use it to take your next flag!
Play at https://aes.cryptohack.org/block_cipher_starter
### 2. Phân tích
Truy cập đường link ta thấy được hình ảnh mô tả thuật mã hóa và source code của nó 

``` python 
from Crypto.Cipher import AES


KEY = ?
FLAG = ?


@chal.route('/block_cipher_starter/decrypt/<ciphertext>/')
def decrypt(ciphertext):
    ciphertext = bytes.fromhex(ciphertext)

    cipher = AES.new(KEY, AES.MODE_ECB)
    try:
        decrypted = cipher.decrypt(ciphertext)
    except ValueError as e:
        return {"error": str(e)}

    return {"plaintext": decrypted.hex()}


@chal.route('/block_cipher_starter/encrypt_flag/')
def encrypt_flag():
    cipher = AES.new(KEY, AES.MODE_ECB)
    encrypted = cipher.encrypt(FLAG.encode())

    return {"ciphertext": encrypted.hex()}

```
![](/images/post/cryptohack/image-1792592244701.png)
   
>**Chế độ ECB (Electronic Codebook)**
>- Ở chế độ này, `plaintext` được chia thành các khối 16 bytes độc lập và mỗi khối đều dùng chung một `Key` để mã hóa ra các khối `Ciphertext` riêng biệt. 

Mục đích chính của bài là giới thiệu mode ECB và giúp ta làm quen với giao diện tương tác API của CryptoHack.
### 3. Lời giải
Trên giao diện web, có thể lấy được flag qua các bước sau:
- Nhấn nút SUBMIT ở mục ENCRYPT_FLAG() -> nhận về JSON chứa `ciphertext`.

- Copy chuỗi `ciphertext` đó dán vào ô ciphertext của mục DECRYPT(...) ngay bên dưới rồi bấm SUBMIT.

- Nhận về chuỗi Hex `plaintext`, decode ở mục Hex Encoder/Decoder để lấy được flag.

Ta cũng có thể sử dụng thư viện `requests` để tương tác trực tiếp với API của CryptoHack:
``` python 
import requests

BASE_URL = "http://aes.cryptohack.org/block_cipher_starter"

r_encrypt = requests.get(f"{BASE_URL}/encrypt_flag/")
data_encrypt = r_encrypt.json()
ciphertext = data_encrypt["ciphertext"]
print(f"[+] Ciphertext: {ciphertext}")

r_decrypt = requests.get(f"{BASE_URL}/decrypt/{ciphertext}/")
data_decrypt = r_decrypt.json()
plaintext_hex = data_decrypt["plaintext"]
print(f"[+] Plaintext (Hex): {plaintext_hex}")

flag = bytes.fromhex(plaintext_hex).decode('utf-8')
print(f"[+] Flag: {flag}")
```
> **Flag:** crypto{bl0ck_c1ph3r5_4r3_f457_!}
## Passwords as Keys
### 1. Đề bài
It is essential that keys in symmetric-key algorithms are random bytes, instead of passwords or other predictable data. The random bytes should be generated using a cryptographically-secure pseudorandom number generator (CSPRNG). If the keys are predictable in any way, then the security level of the cipher is reduced and it may be possible for an attacker who gets access to the ciphertext to decrypt it.

Just because a key looks like it is formed of random bytes, does not mean that it necessarily is. In this case the key has been derived from a simple password using a hashing function, which makes the ciphertext crackable.

For this challenge you may script your HTTP requests to the endpoints, or alternatively attack the ciphertext offline. Good luck!

Play at https://aes.cryptohack.org/passwords_as_keys
### 2. Phân tích 
![](/images/post/cryptohack/image-1792592244701.png)
Source code: 
``` python 
from Crypto.Cipher import AES
import hashlib
import random


# /usr/share/dict/words from
# https://gist.githubusercontent.com/wchargin/8927565/raw/d9783627c731268fb2935a731a618aa8e95cf465/words
with open("/usr/share/dict/words") as f:
    words = [w.strip() for w in f.readlines()]
keyword = random.choice(words)

KEY = hashlib.md5(keyword.encode()).digest()
FLAG = ?


@chal.route('/passwords_as_keys/decrypt/<ciphertext>/<password_hash>/')
def decrypt(ciphertext, password_hash):
    ciphertext = bytes.fromhex(ciphertext)
    key = bytes.fromhex(password_hash)

    cipher = AES.new(key, AES.MODE_ECB)
    try:
        decrypted = cipher.decrypt(ciphertext)
    except ValueError as e:
        return {"error": str(e)}

    return {"plaintext": decrypted.hex()}


@chal.route('/passwords_as_keys/encrypt_flag/')
def encrypt_flag():
    cipher = AES.new(KEY, AES.MODE_ECB)
    encrypted = cipher.encrypt(FLAG.encode())

    return {"ciphertext": encrypted.hex()}
```
Bài này vẫn là chế độ AES-ECB, nhưng `key` không còn cố định mà được lấy ngẫu nhiên một từ trong danh sách từ điển (words), sau đó băm MD5 để làm KEY 16 bytes (128 bits) cho AES.   
Để giải quyết bài này ta cần brute force, giải mã với lần lượt các `key` được tạo từ danh sách và dừng lại đến khi lấy được chuỗi bắt đầu với **crypto{**.

### 3. Lời giải
``` python 
import hashlib
import requests
from Crypto.Cipher import AES

BASE_URL = "http://aes.cryptohack.org/passwords_as_keys"

r = requests.get(f"{BASE_URL}/encrypt_flag/").json()
ciphertext_hex = r["ciphertext"]
ciphertext = bytes.fromhex(ciphertext_hex)

WORDS_URL = "https://gist.githubusercontent.com/wchargin/8927565/raw/d9783627c731268fb2935a731a618aa8e95cf465/words"

words_text = requests.get(WORDS_URL).text
words = [w.strip() for w in words_text.splitlines() if w.strip()]

for word in words:
    KEY = hashlib.md5(word.encode()).digest()
    cipher = AES.new(KEY, AES.MODE_ECB)
    decrypted = cipher.decrypt(ciphertext)

    if decrypted.startswith(b"crypto{"):
        print(decrypted.decode())
        break
```
> **Flag:** crypto{k3y5__r__n07__p455w0rdz?}
## ECB Oracle
### 1. Đề bài 
ECB is the most simple mode, with each plaintext block encrypted entirely independently. In this case, your input is prepended to the secret flag and encrypted and that's it. We don't even provide a decrypt function. Perhaps you don't need a padding oracle when you have an "ECB oracle"?

Play at https://aes.cryptohack.org/ecb_oracle
### 2. Phân tích 
![](/images/post/cryptohack/image-1792592244701.png)
Source code:
``` python 
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad


KEY = ?
FLAG = ?


@chal.route('/ecb_oracle/encrypt/<plaintext>/')
def encrypt(plaintext):
    plaintext = bytes.fromhex(plaintext)

    padded = pad(plaintext + FLAG.encode(), 16)
    cipher = AES.new(KEY, AES.MODE_ECB)
    try:
        encrypted = cipher.encrypt(padded)
    except ValueError as e:
        return {"error": str(e)}

    return {"ciphertext": encrypted.hex()}
```
Bài toán này vẫn mã hóa AES ở chế độ AES-ECB.  
Chế độ này có một nhược điểm lớn: cùng một khối plaintext sẽ luôn tạo ra cùng một khối ciphertext khi sử dụng cùng một khóa.  
Điều này dẫn đến việc dễ dàng phát hiện các mẫu trong dữ liệu, khiến nó dễ bị tấn công hơn.  
Ta sẽ khai thác điểm yếu này và sử dụng tấn công **AES ECB Oracle**.    

Phân tích source code:
- `padded = pad(plaintext + FLAG.encode(), 16)` Chuỗi plaintext do người dùng nhập được ghép với `FLAG` và đưa vào hàm `pad(,16)` hàm này đảm bảo tổng độ dài dữ liệu luôn vừa tròn bội số của 16 bytes.
- `cipher = AES.new(KEY, AES.MODE_ECB)` ` encrypted = cipher.encrypt(padded)` Toàn bộ khối dữ liệu sau khi pad được mã hóa bằng AES-ECB.

> **Kỹ thuật tấn công AES ECB Oracle**  
>
>Tham khảo: https://viblo.asia/p/gioi-thieu-ve-ki-thuat-tan-cong-aes-ecb-oracle-r1QLxwppJAw  
> Dữ liệu được nối dạng $\text{pad}(\text{plaintext} + \text{FLAG})$. AES-ECB mã hóa các khối 16 bytes độc lập bằng cùng một key.  
>
> Tìm $\text{FLAG}[0]$:
>    - Truyền plaintext = 15 bytes 'a'   
    $\rightarrow$ Khối 1 (16 bytes) gồm: aaaaaaaaaaaaaaa + $\text{FLAG}[0]$. 
>    - Lưu 16 bytes ciphertext trả về làm chuẩn.
>    - Brute-force local: Thử các input aaaaaaaaaaaaaaa + $X$ ($X$ là chữ, số, ký tự đặc biệt) đến khi khối ciphertext trả về trùng với khối chuẩn  
    $\rightarrow$ Tìm được $\text{FLAG}[0]$.  
>
>Tìm các ký tự tiếp theo trong Khối 1 ($\text{FLAG}[1 \dots 15]$):  
>    - Bớt 1 byte đệm ở đầu: truyền 14 bytes 'a'   
    $\rightarrow$ Khối 1 gồm: aaaaaaaaaaaaaa + $\text{FLAG}[0]$ + $\text{FLAG}[1]$.
>    - Thử aaaaaaaaaaaaaa + $\text{FLAG}[0]$ + $X$ để tìm $\text{FLAG}[1]$.
>    - Lặp lại việc giảm dần byte đệm 'a' đến khi giải mã xong 16 bytes đầu tiên.
>
>Mở rộng sang Khối 2 ($\text{FLAG}[16 \dots 31]$):
>    - Đệm lại 15 bytes 'a' ở đầu   
    $\rightarrow$ Kéo $\text{FLAG}[16]$ vào vị trí cuối của Khối 2 (byte thứ 32).
>    - Thử chuỗi aaaaaaaaaaaaaaa + $\text{FLAG}[0 \dots 15]$ + $X$ và so sánh kết quả ở Khối 2 (16 bytes thứ hai, tức byte 16–31 của ciphertext).
>
> Dừng vòng lặp khi ký tự tìm được là dấu đóng ngoặc }   

Áp dụng thuật tấn công **AES ECB Oracle** với FLAG đã biết 7 bytes đầu **crypto{**
### 3. Lời giải
``` python 
import requests

URL = "https://aes.cryptohack.org/ecb_oracle/encrypt"
CHARS = b"abcdefghijklmnopqrstuvwxyz0123456789_{}-"
s = requests.Session()


def oracle(x):
    r = s.get(f"{URL}/{x.hex()}/", timeout=10)
    return bytes.fromhex(r.json()["ciphertext"])

flag = b"crypto{"

for i in range(len(flag), 128):
    padding = b"A" * (31 - i % 16)
    start = 16 * (i // 16 + 1)

    target = oracle(padding)[start:start + 16]

    for c in CHARS:
        test = padding + flag + bytes([c])

        if oracle(test)[start:start + 16] == target:
            flag += bytes([c])
            print(flag.decode())
            break
    if flag.endswith(b"}"):
        break

print("FLAG:", flag.decode())
```
Output:
``` text
crypto{p
crypto{p3
crypto{p3n
crypto{p3n6
crypto{p3n6u
crypto{p3n6u1
crypto{p3n6u1n
crypto{p3n6u1n5
crypto{p3n6u1n5_
crypto{p3n6u1n5_h
crypto{p3n6u1n5_h4
crypto{p3n6u1n5_h47
crypto{p3n6u1n5_h473
crypto{p3n6u1n5_h473_
crypto{p3n6u1n5_h473_3
crypto{p3n6u1n5_h473_3c
crypto{p3n6u1n5_h473_3cb
crypto{p3n6u1n5_h473_3cb}
FLAG: crypto{p3n6u1n5_h473_3cb}
```
> **Flag:**  crypto{p3n6u1n5_h473_3cb}
## ECB CBC WTF
### 1. Đề bài
Here you can encrypt in CBC but only decrypt in ECB. That shouldn't be a weakness because they're different modes... right?

Play at https://aes.cryptohack.org/ecbcbcwtf
### 2. Chế độ CBC (Cipher Block Chaining)

![](/images/post/cryptohack/image-1792653145489.png)

> - Sử dụng vector khởi tạo $IV$ (initialization vector) ngẫu nhiên có độ dài đúng bằng khối mã hoá, $IV$ không cần giữ bí mật nhưng bắt buộc phải không thể dự đoán trước.
> - Nguyên lý mã hóa: 
>   - Đầu tiên, ta lấy `plaintext` XOR với $IV$, sau đó **CBC** sẽ lấy kết quả đó mã hóa và trả về `ciphertext` block 
>$$C_1 = E_K(P_1 \oplus IV)$$
>   - Trong khối mã hóa tiếp theo, ta lấy `plaintext` xor với `ciphertext` trả về của block trước đó, tiếp tục mã hóa đến block cuối. 
>$$C_i = E_K(P_i \oplus C_{i-1})$$
>- Nguyên lý giải mã:  
>Quy trình giải mã diễn ra theo chiều ngược lại:
>   - Block đầu tiên:$$P_1 = D_K(C_1) \oplus IV$$
>   - Các block tiếp theo:$$P_i = D_K(C_i) \oplus C_{i-1}$$

**Nhận xét**  
*Mode CBC* khắc phục được điểm yếu của *Mode ECB* nhưng cũng có những điểm yếu có thể bị khai thác.
- **Ưu điểm**: Xóa bỏ *Pattern Leakage*: Nhờ cơ chế liên kết chuỗi (chaining) qua phép XOR, hai khối `Plaintext` giống hệt nhau ($P_i = P_j$) khi mã hóa sẽ cho ra hai khối `Ciphertext` hoàn toàn khác nhau ($C_i \neq C_j$).
- **Nhược điểm**: 
    - **Mã hóa tuần tự**: Không thể song song hóa (parallelize) quá trình mã hóa vì block sau phụ thuộc vào kết quả của block trước (tuy nhiên quá trình giải mã thì vẫn song song hóa được) 
    - **Nhạy cảm với Padding** (Bit-Flip & Padding Oracle Attack): Nếu tấn công thay đổi 1 bit trên $C_{i-1}$, khi giải mã thì $P_i$ sẽ bị biến đổi tương ứng ở đúng vị trí bit đó. Đây là cơ sở cho các dạng bài tấn công CBC Bit-Flip và Padding Oracle Attack.
### 3. Phân tích
Phân tích source code:  
``` python 
from Crypto.Cipher import AES
import os


KEY = ?
FLAG = ?


@chal.route('/ecbcbcwtf/decrypt/<ciphertext>/')
def decrypt(ciphertext):
    ciphertext = bytes.fromhex(ciphertext)

    cipher = AES.new(KEY, AES.MODE_ECB)
    try:
        decrypted = cipher.decrypt(ciphertext)
    except ValueError as e:
        return {"error": str(e)}

    return {"plaintext": decrypted.hex()}


@chal.route('/ecbcbcwtf/encrypt_flag/')
def encrypt_flag():
    iv = os.urandom(16)

    cipher = AES.new(KEY, AES.MODE_CBC, iv)
    encrypted = cipher.encrypt(FLAG.encode())
    ciphertext = iv.hex() + encrypted.hex()

    return {"ciphertext": ciphertext}
```
- Hàm `decrypt(ciphertext)`giải mã ciphertext sử dụng **mode ECB** : `cipher = AES.new(KEY, AES.MODE_ECB)`
- Hàm `encrypt_flag()` mã hóa FLAG bằng **mode CBC** với $IV$ được tạo từ `iv = os.urandom(16)`: tạo ra một chuỗi gồm 16 bytes ngẫu nhiên. Ciphertext trả về bao gồm  $IV$ (16 bytes đầu) và phần FLAG được mã hóa bằng **mode CBC**

Ta thấy để giải mã mode CBC cần XOR Ciphertext đã được decrypt của khối hiện tại với Ciphertext khối trước đó (IV đối với khối đầu tiên)để lấy được Plaintext của khối hiện tại.  
Vậy ta chỉ cần thêm bước XOR local để khôi phục lại plaintext và nối các khối plaintext để lấy được flag cuối cùng.
### 4. Lời giải 
``` python 
import requests

BASE_URL = "https://aes.cryptohack.org/ecbcbcwtf/"
#Gửi request để lấy ciphertext
r = requests.get(f"{BASE_URL}/encrypt_flag/").json()
ciphertext_hex = r["ciphertext"]
ciphertext = bytes.fromhex(ciphertext_hex)
#Chia ciphertext thành các khối 16 bytes
C = [ciphertext[i:i + 16]

for i in range(0,len(ciphertext),16)]
P=[]
#Hàm gửi ciphertext để lâý plaintext được giải mã bằng ECB
def decrypt(ciphertext):
    response = requests.get(f"{BASE_URL}/decrypt/{ciphertext.hex()}/")
    data = response.json()
    return bytes.fromhex(data["plaintext"])
#Sử dụng xOR để khôi phục flag
for i in range(1,len(C)):
    c= decrypt(C[i])
    P.append(bytes(a^b for a,b in zip(c,C[i-1])))
flag= b"".join(P)
print(flag)
```
> **Flag:** crypto{3cb_5uck5_4v01d_17_!!!!!}
## Flipping cookie
### 1. Đề bài 
You can get a cookie for my website, but it won't help you read the flag... I think.

Play at https://aes.cryptohack.org/flipping_cookie
### 2. Phân tích 
Source code:
``` python 
from Crypto.Cipher import AES
import os
from Crypto.Util.Padding import pad, unpad
from datetime import datetime, timedelta


KEY = ?
FLAG = ?


@chal.route('/flipping_cookie/check_admin/<cookie>/<iv>/')
def check_admin(cookie, iv):
    cookie = bytes.fromhex(cookie)
    iv = bytes.fromhex(iv)

    try:
        cipher = AES.new(KEY, AES.MODE_CBC, iv)
        decrypted = cipher.decrypt(cookie)
        unpadded = unpad(decrypted, 16)
    except ValueError as e:
        return {"error": str(e)}

    if b"admin=True" in unpadded.split(b";"):
        return {"flag": FLAG}
    else:
        return {"error": "Only admin can read the flag"}


@chal.route('/flipping_cookie/get_cookie/')
def get_cookie():
    expires_at = (datetime.today() + timedelta(days=1)).strftime("%s")
    cookie = f"admin=False;expiry={expires_at}".encode()

    iv = os.urandom(16)
    padded = pad(cookie, 16)
    cipher = AES.new(KEY, AES.MODE_CBC, iv)
    encrypted = cipher.encrypt(padded)
    ciphertext = iv.hex() + encrypted.hex()

    return {"cookie": ciphertext}
```
- Hàm `check_admin` nhận input cookie và iv người dùng nhập vào, chuyển cookie và iv từ hex về bytes, sau đó giải mã cookie theo `AES.MODE_CBC` với vector khởi tạo là iv, unpad cookie đã được giải mã. Nếu nhận được chuỗi *b"admin=True"* trong cookie đã được nối, output trả ra là FLAG, nếu không sẽ thông báo bạn không phải admin.
- Hàm `get_cookie` cookie gốc là chuỗi kí tự *f"admin=False;expiry={expires_at}"* với expires_at là dấu thời gian ở thời điểm lấy. iv được chọn ngẫu nhiên có độ dài 16 bytes. Cookie được pad thành các khối 16 bytes và mã hóa bằng `AES.MODE_CBC` với vector khởi tạo là iv. Output là ciphertext dạng hex được ghép từ iv và cookie đã mã hóa.

Để lấy được FLAG ta cần thay đổi ciphertext để phần cookie sau khi giải mã sẽ thay đổi từ *"admin=False"* sang *"admin=True"*

Áp dụng thuật tấn công **Bit-Flipping Attack**    
>**Bit-Flipping Attack**
>  
> Tham khảo: https://www.bigous.me/technical/cbc-bit-flipping-en/    
>                   
> Bit-Flipping ( Tấn công lật bit ) cho phép ta thao túng, thay đổi dữ liệu mà không cần biết khóa bí mật KEY.  
> Ta có công thức giải mã của AES mode CBC: $$P_i = D_K(C_i) \oplus C_{i-1}$$  
>$$ \iff D_K(C_i) = P_i\oplus C_{i-1}$$
> Ta cần biến đổi $P_i$ thành $P_i'$, khi đó: $$P_i' = D_K(C_i) \oplus C_{i-1}'$$  
>$$ \iff P_i' =  P_i\oplus C_{i-1} \oplus C_{i-1}'$$
>$$ \iff C_{i-1}' =  P_i\oplus C_{i-1} \oplus P_i' $$  
>Với $P_{0}$:
>  $$IV' =  P_0\oplus IV \oplus P_0' $$
> Vậy, không cần Key, ta vẫn có thể thay đổi Plaintext khi biết được cấu trúc của khối Plaintext gốc tại vị trí muốn thay đổi.

Quay trở lại với bài toán, ta phân tích ciphertext lấy được, phần plaintext ta cần thay đổi nằm ở khối $C_{0}$.
Ta thực hiện phép XOR local: $$IV' =  P_0\oplus IV \oplus P_0'$$
Trong đó: 
- $P_{0}$ : Khối plaintext gốc chứa b"admin=Fals"
- $IV$ : Khối ciphertext đầu trả về của hàm `get_cookie`
- $P_{0}'$ : Khối plaintext mục tiêu chứa b"admin=True"
### 3. Lời giải
``` python
import requests

BASE_URL = "https://aes.cryptohack.org"

#Lấy cookie từ server
r = requests.get(f"{BASE_URL}/flipping_cookie/get_cookie/")
cookie_hex = r.json()["cookie"]
cookie = bytes.fromhex(cookie_hex)

# Tách IV (16 bytes đầu) và Ciphertext phần sau
iv = cookie[:16]
ciphertext = cookie[16:].hex()

# Xác định khối plaintext gốc (P0) và khối plaintext mục tiêu (P0') đúng 16 bytes
P0 = b"admin=False;expi"
P_fixed = b"admin=True;expir" # thêm các kí tự tiếp theo 'expiry' để đủ 16 bytes 

# Tính toán IV mới 
iv_new = bytes(b1 ^ b2 ^ b3 for b1, b2, b3 in zip(P0, iv, P_fixed))
iv_new_hex = iv_new.hex()

#Gửi request kiểm tra admin để lấy flag
response = requests.get(
    f"{BASE_URL}/flipping_cookie/check_admin/{ciphertext}/{iv_new_hex}/"
)
data = response.json()

print(data["flag"])
```
>**Flag:** crypto{4u7h3n71c4710n_15_3553n714l}
## Lazy CBC 
### 1. Đề bài 
I'm just a lazy dev and want my CBC encryption to work. What's all this talk about initialisations vectors? Doesn't sound important.

Play at https://aes.cryptohack.org/lazy_cbc
### 2. Phân tích 
Source code:
``` python
from Crypto.Cipher import AES


KEY = ?
FLAG = ?


@chal.route('/lazy_cbc/encrypt/<plaintext>/')
def encrypt(plaintext):
    plaintext = bytes.fromhex(plaintext)
    if len(plaintext) % 16 != 0:
        return {"error": "Data length must be multiple of 16"}

    cipher = AES.new(KEY, AES.MODE_CBC, KEY)
    encrypted = cipher.encrypt(plaintext)

    return {"ciphertext": encrypted.hex()}


@chal.route('/lazy_cbc/get_flag/<key>/')
def get_flag(key):
    key = bytes.fromhex(key)

    if key == KEY:
        return {"plaintext": FLAG.encode().hex()}
    else:
        return {"error": "invalid key"}


@chal.route('/lazy_cbc/receive/<ciphertext>/')
def receive(ciphertext):
    ciphertext = bytes.fromhex(ciphertext)
    if len(ciphertext) % 16 != 0:
        return {"error": "Data length must be multiple of 16"}

    cipher = AES.new(KEY, AES.MODE_CBC, KEY)
    decrypted = cipher.decrypt(ciphertext)

    try:
        decrypted.decode() # ensure plaintext is valid ascii
    except UnicodeDecodeError:
        return {"error": "Invalid plaintext: " + decrypted.hex()}

    return {"success": "Your message has been received"}
```
- Hàm `encrypt(plaintext)` và hàm `receive(ciphertext)` đơn giản là hai hàm mã hóa plaintext và giải mã ciphertext để gửi đi tin nhắn, hàm `receive(ciphertext)` chỉ trả về plaintext đã decrypt chỉ khi kiểm tra decrypted.decode() không phải ASCII.
- Hàm `get_flag(key)`là hàm kiểm tra key, nếu người dùng nhập đúng key = KEY sẽ trả về FLAG.

Điểm đặc biệt là tác giả chương trình CBC encryption này "lười" nên đã dùng $IV$ làm $KEY$, nhưng không biết $IV$ có thể khôi phục được.  
Ta có 
$$P_1 = D_K(C_1) \oplus IV$$
$$P_2 = D_K(C_2) \oplus C_1$$
$$P_3 = D_K(C_3) \oplus C_2$$
Suy ra 
$$P_1 \oplus P_2= D_K(C_1) \oplus IV \oplus D_K(C_2) \oplus C_1$$
Nếu chọn các giá trị $C_1$, $C_2$ đều bằng 0, ta sẽ được
$$P_1 \oplus P_2= D_K(0) \oplus IV \oplus D_K(0) \oplus 0= IV$$
Vậy ta nhập ciphertext là 2 khối 0 16 bytes ( 32x2 số 0 dạng hex) vào hàm `receive(ciphertext)` lúc này khối plaintext trả về sẽ khác ASCII nên chương trình sẽ trả plaintext đã được decrypt cho ta, XOR 2 khối plaintext nhận được và lấy được key dạng hex.
### 3. Lời giải
![](/images/post/symmetric-ciphers/image-1792750413627.png)
![](/images/post/symmetric-ciphers/image-1792750420184.png)
![](/images/post/symmetric-ciphers/image-1792750425410.png)
![](/images/post/symmetric-ciphers/image-1792750429792.png)
![](/images/post/symmetric-ciphers/image-1792750432933.png)
![](/images/post/symmetric-ciphers/image-1792750437433.png)
> **Flag:** crypto{50m3_p30pl3_d0n7_7h1nk_IV_15_1mp0r74n7_?}
## Double DES (DH)
### 1. Đề bài
It's as simple as a 4-byte full survey!

This is a problem we practice together in **Exploit Tech: Meet in the Middle Attack.**  
Source code prob.py
``` python 
#!/usr/bin/env python3
from Crypto.Cipher import DES
import signal
import os

if __name__ == "__main__":
    signal.alarm(15)

    with open("flag", "rb") as f:
        flag = f.read()
    
    key = b'Dream_' + os.urandom(4) + b'Hacker'
    key1 = key[:8]
    key2 = key[8:]
    print("4-byte Brute-forcing is easy. But can you do it in 15 seconds?")
    cipher1 = DES.new(key1, DES.MODE_ECB)
    cipher2 = DES.new(key2, DES.MODE_ECB)
    encrypt = lambda x: cipher2.encrypt(cipher1.encrypt(x))
    decrypt = lambda x: cipher1.decrypt(cipher2.decrypt(x))

    print(f"Hint for you :> {encrypt(b'DreamHack_blocks').hex()}")

    msg = bytes.fromhex(input("Send your encrypted message(hex) > "))
    if decrypt(msg) == b'give_me_the_flag':
        print(flag)
    else:
        print("Nope!")
```
### 2. Phân tích 
Phân tích source code:
-  `signal.alarm(15)` giới hạn thời gian trong 15s
-  ` key = b'Dream_' + os.urandom(4) + b'Hacker'` key được tạo bằng cách chọn ngẫu nhiên 4 số, ghép vào giữa 2 phần text có sẵn là b'Dream_' và b'Hacker'. Key sau đó được tách thành key1 và key2  `key1 = key[:8]``key2 = key[8:]` key1 8 bytes đầu, key2 8 bytes cuối
- ```python
    cipher1 = DES.new(key1, DES.MODE_ECB)
    cipher2 = DES.new(key2, DES.MODE_ECB)
    encrypt = lambda x: cipher2.encrypt(cipher1.encrypt(x))
    decrypt = lambda x: cipher1.decrypt(cipher2.decrypt(x))
   ```
Để giải quyết bài này, ta sử dụng thuật tấn công **Meet in the Middle**
### 3. Lời giải 
``` python 
from pwn import *
from Crypto.Cipher import DES
#io = process(["python3", "prob.py"])
io = remote("host3.dreamhack.games", 21073)
io.recvuntil(b":> ")

hint = bytes.fromhex(io.recvline().decode())
conflict = dict()

for i in range(65536):
    b = i.to_bytes(2, "big")
    cipher = DES.new(b"Dream_" + b, DES.MODE_ECB)
    enc = cipher.encrypt(b"DreamHack_blocks")
    conflict[enc] = b"Dream_" + b

for i in range(65536):
    b = i.to_bytes(2, "big")
    cipher = DES.new(b + b"Hacker", DES.MODE_ECB)
    dec = cipher.decrypt(hint)

    if dec in conflict:
        key1 = conflict[dec]
        key2 = b + b"Hacker"
        break

cipher1 = DES.new(key1, DES.MODE_ECB)
cipher2 = DES.new(key2, DES.MODE_ECB)
encrypt = lambda x: cipher2.encrypt(cipher1.encrypt(x))
assert encrypt(b"DreamHack_blocks") == hint

io.sendlineafter(b'> ', encrypt(b"give_me_the_flag").hex().encode())

flag = eval(io.recvline())
io.close()

print(flag.decode())
```
## Triple DES
### 1. Đề bài
Data Encryption Standard was the forerunner to AES, and is still widely used in some slow-moving areas like the Payment Card Industry. This challenge demonstrates a strange weakness of DES which a secure block cipher should not have.

Play at https://aes.cryptohack.org/triple_des
### 2. Phân tích
Source code 
``` python
from Crypto.Cipher import DES3
from Crypto.Util.Padding import pad
import os


IV = os.urandom(8)
FLAG = ?


def xor(a, b):
    # xor 2 bytestrings, repeating the 2nd one if necessary
    return bytes(x ^ y for x,y in zip(a, b * (1 + len(a) // len(b))))



@chal.route('/triple_des/encrypt/<key>/<plaintext>/')
def encrypt(key, plaintext):
    try:
        key = bytes.fromhex(key)
        plaintext = bytes.fromhex(plaintext)
        plaintext = xor(plaintext, IV)

        cipher = DES3.new(key, DES3.MODE_ECB)
        ciphertext = cipher.encrypt(plaintext)
        ciphertext = xor(ciphertext, IV)

        return {"ciphertext": ciphertext.hex()}

    except ValueError as e:
        return {"error": str(e)}


@chal.route('/triple_des/encrypt_flag/<key>/')
def encrypt_flag(key):
    return encrypt(key, pad(FLAG.encode(), 8).hex())
```
Ở bài này, ta được chọn key cho chương trình mã hóa `DES3`   
Phép mã hóa DES có điểm yếu là tồn tại các cặp `khóa yếu` 
```text
0101010101010101 FEFEFEFEFEFEFEFE
0000000000000000 FFFFFFFFFFFFFFFF
0000000000000000 FEFEFEFEFEFEFEFE
0101010101010101 FFFFFFFFFFFFFFFF
``` 
Khi dùng cặp khóa yếu $K_1$, $K_2$ thì:
$$ E_{K_{1}}(E_{K_{2}}(P))=P$$
Hay phép mã hóa bằng $K_2$ sẽ chính là phép giải mã bằng $K_1$
$$E_{K_{2}}=D_{K_{1}}$$
Ngoài ra $$ \quad D_{K_2}(D_{K_2}(X)) = E_{K_1}(E_{K_1}(X)) = X$$

Hàm mã hóa `DES3`có nguyên tắc encrypt như sao:
$$ciphertext= E_{K3}(D_{K2}(E_{K1}(plaintext)))$$
Bài thêm một bước XOR với $IV$, quá trình encrypt của hàm `encrypt(key, plaintext)` là:
$$ciphertext= E_{K3}(D_{K2}(E_{K1}(plaintext \oplus IV))) \oplus IV$$
nhưng $IV$ của bài chỉ khởi tạo 1 lần chứ không ngẫu nhiên mỗi lần mã hóa, và chỉ XOR độc lập theo từng khối nên hàm mã hóa trên vẫn không thay đổi tính chất.

Bộ khóa ($K_1$,$K_2$,$K_3$) có các tiêu chuẩn lựa chọn sau:
- Lựa chọn 1: $K_1$,$K_2$,$K_3$ là các khóa độc lập
- Lựa chọn 2: $K_1$,$K_2$ là hai khóa độc lập và $K_3$=$K_1$
- Lựa chọn 3: $K_1$=$K_2$=$K_3$  

Ở bài này chỉ nhận input key có dạng tiêu chuẩn 1 hoặc 2, khi nhập key dạng tiêu chuẩn 3 sẽ có thông báo lỗi 
![](/images/post/symmetric-ciphers/image-1793179068181.png)

Dùng cặp khóa yếu `0101010101010101 FEFEFEFEFEFEFEFE`   
Khi đó hàm encrypt trở thành
$$ct= E_{K1}(D_{K2}(E_{K1}(pt \oplus IV))) \oplus IV$$
$$ \iff ct= E_{K1}(pt \oplus IV) \oplus IV$$
$$ \iff ct= D_{K2}(pt \oplus IV) \oplus IV$$
Encrypt thêm một lần nữa:
$$ct'= D_{K2}(D_{K2}(pt \oplus IV) \oplus IV \oplus IV) \oplus IV$$
$$ = D_{K2}(D_{K2}(pt \oplus IV)) \oplus IV$$
$$=pt \oplus IV\oplus IV=pt$$

Vậy với cặp khóa yếu, việc lấy được flag trở nên đơn giản, ta chỉ cần encrypt phần ciphertext encrypt của flag (hay encrypt flag 2 lần), ciphertext trở về chính là flag đã được giải mã!
### 3. Lời giải
![](/images/post/symmetric-ciphers/image-1793177578402.png)
![](/images/post/symmetric-ciphers/image-1793177624018.png)
![](/images/post/symmetric-ciphers/image-1793177661940.png)
![](/images/post/symmetric-ciphers/image-1793177686793.png)
>**Flag:** crypto{n0t_4ll_k3ys_4r3_g00d_k3ys}

