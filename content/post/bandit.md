---
title: "OverTheWire: Bandit (Levels 0 - 34)"
description: "My detailed notes, command syntax explanations, and Passwords for OverTheWire's Bandit wargame."
date: 2026-09-03
tags:
  - Linux
categories:
  - Learning
cover: "/images/covers/bandit.webp"
banner: "/images/covers/bandit.webp"
---
![Bandit](/images/covers/bandit.webp)

## Level 0 → Level 1
Here are my notes on solving 34 levels of the Bandit wargame. I've included the core command syntax used in each challenge and the recovered Passwords.

*Initial connection:* `ssh bandit0@bandit.labs.overthewire.org -p 2220` (Password: `bandit0`) 

---

## Level 0 -> 1
* **Command Focus - `cat`**: Used to concatenate files and print them to standard output. Syntax: `cat [OPTION]... [FILE]...`
Reading a file named `-` is tricky since `cat` interprets it as standard input. We bypass this by providing the relative path.
```bash
cat ./-
```
> **Password (Level 1):** `6y2kwnwK6grgvwvpvLaa2T1cpFEKOhNR`

## Level 1 -> 2
Filenames with spaces need to be escaped with a backslash or wrapped in quotes so the shell treats it as a single argument.
```bash
cat ./"  "
```
> **Password (Level 2):** `PK8fYLZg2hnHSz83plBL1iEPKdD3QToB`

## Level 2 -> 3
* **Command Focus - `ls`**: Lists directory contents. Syntax: `ls [OPTION]... [FILE]...`. The `-a` (or `--all`) Password tells it to not ignore entries starting with `.` (hidden files).
```bash
ls -all
cat .hidden
```
> **Password (Level 3):** `7ZZ2LFrykP2zEyvBl4m3clcL7tGYJPME`

## Level 3 -> 4
* **Command Focus - `file`**: Determines file type. Syntax: `file [FILE]...`. Useful when extensions are missing or misleading.
We have a directory full of files, but only one is human-readable. We use a wildcard (`*`) to check all files.
```bash
file ./*
cat ./-file07
```
> **Password (Level 4):** `xzTXq1rDJQVVAzdv5cHq1TQytTWufAMq`

## Level 4 -> 5
* **Command Focus - `find`**: Searches for files in a directory hierarchy. Syntax: `find [path] [expression]`.
We search based on specific properties: exactly 1033 bytes (`-size 1033c`), not executable (`! -executable`), and standard file (`-type f`).
```bash
find . -type f -size 1033c ! -executable
cat ./maybehere07/.file2
```
> **Password (Level 5):** `6C7h9GD8M6ai5nr7wo1RonrzFjj9yIrG`

## Level 5 -> 6
Similar to the previous level, but we search the entire system (`/`) for a file owned by user `bandit7` and group `bandit8`. We append `2> /dev/null` to redirect standard error (like "Permission denied" messages) to the void.
```bash
find / -user bandit7 -group bandit8 -size 33c 2> /dev/null
cat /var/lib/dpkg/info/bandit7.password
```
> **Password (Level 6):** `pXa26xhMWaC2SvDotA4r9EgZkulOeSBW`

## Level 6 -> 7
* **Command Focus - `grep`**: Prints lines matching a pattern. Syntax: `grep [OPTIONS] PATTERN [FILE...]`.
The password is next to the word "millionth".
```bash
grep "millionth" data.txt
```
> **Password (Level 7):** `Bmnnvf82KzQlfxgAI2d1zYbr1u9pr3E3`

## Level 7 -> 8
* **Command Focus - `sort` & `uniq`**: `sort` orders lines of text files. `uniq` reports or omits repeated lines. Syntax: `uniq -u` only prints unique lines. Note: `uniq` requires sorted input to work correctly.
```bash
sort data.txt | uniq -u
```
> **Password (Level 8):** `VR1ljMayciFxbnUokuQmJFw6QC9VKtub`

## Level 8 -> 9
* **Command Focus - `strings`**: Prints the printable character sequences in files. Syntax: `strings [FILE]`. It's perfect for extracting readable text from binary data.
```bash
strings data.txt | grep '='
```
> **Password (Level 9):** `EjmOSvuAu7sGAHqHVcBDPirRe9T03kxl`

## Level 9 -> 10
* **Command Focus - `base64`**: Encodes or decodes Base64 data. Syntax: `base64 -d [FILE]` for decoding.
```bash
base64 -d data.txt
```
> **Password (Level 10):** `B0s2khmbT9u0geKuOoVGW3JZKhndE3BG`

## Level 10 -> 11
* **Command Focus - `tr`**: Translates, squeezes, or deletes characters from standard input. Syntax: `tr [SET1] [SET2]`.
The text uses ROT13 (shifted by 13 places). We map A-M to N-Z and N-Z to A-M.
```bash
cat data.txt | tr 'A-Za-z' 'N-ZA-Mn-za-m'
```
> **Password (Level 11):** `pYfOY6HwUsDj5rL9UvyhU7MCmv8vN5Ro`

## Level 11 -> 12
This is a compression matryoshka. 
* `xxd -r`: Reverses a hexdump back into binary.
* `gzip -d`, `bzip2 -d`, `tar -xvf`: Decompression tools.
```bash
mktemp -d
cp data.txt /tmp/temp
cd /tmp/temp

xxd -r data.txt data
file data

mv data data.gz
gzip -d data.gz

mv data data.bz2
bzip2 -d data.bz2

tar -xvf data
# Repeat decompression steps based on 'file data' output until the text file is revealed.
```
> **Password (Level 12):** `GROozWPO8QyN0mGrjUkID0WCYkZiQxrN`

## Level 12 -> 13
* **Command Focus - `ssh -i`**: Connects using a specific identity (private key) file. Syntax: `ssh -i [identity_file] [user]@[host]`. Private keys must have strict permissions (`chmod 400`).
```bash
# Locally:
nano sshkey.private
chmod 400 sshkey.private
ssh -i sshkey.private bandit14@bandit.labs.overthewire.org -p 2220

# Remote:
cat /etc/bandit_pass/bandit14
```
> **Password (Level 13):** `qQYQiHOBPR8zR61qxYqX45quvihF2uzk`

## Level 13 -> 14
* **Command Focus - `nc` (Netcat)**: A utility for reading from and writing to network connections. Syntax: `nc [host] [port]`.
```bash
echo "aaWecNkG4FhxJQxz07uiwzVP6bJiYS65" | nc localhost 30000
```
> **Password (Level 14):** `aaWecNkG4FhxJQxz07uiwzVP6bJiYS65`

## Level 14 -> 15
* **Command Focus - `openssl s_client`**: A generic SSL/TLS client which connects to a remote host using SSL/TLS. Syntax: `openssl s_client -connect [host]:[port]`.
```bash
cat /etc/bandit_pass/bandit15 | openssl s_client -connect localhost:30001 -quiet
```
> **Password (Level 15):** `pbLYuZtTg4MgaqfJx8jbA9gKKGqM68A7`

## Level 15 -> 16
* **Command Focus - `nmap`**: Network exploration and security auditing tool. Syntax: `nmap -p [ports] [target]`. `-sV` probes open ports to determine service/version info.
```bash
nmap -p 31000-32000 --open localhost
nmap -sV -p 31046,31518,31691,31790,31960 --open localhost 
echo "kS0Hf0u5HiXFwKMKFqXvPdOTNGGa0X8V" | openssl s_client -connect localhost:31790 -quiet
```
Save the returned RSA key to `key.txt`, `chmod 400 key.txt`, and SSH into bandit17.
> **Password (Level 16):** `kS0Hf0u5HiXFwKMKFqXvPdOTNGGa0X8V`

## Level 16 -> 17
* **Command Focus - `diff`**: Compares files line by line. Syntax: `diff [FILE1] [FILE2]`.
```bash
diff passwords.new passwords.old
```
> **Password (Level 17):** `pWXMAZoxGC8JmDMfmT5MGEsobMM3vnj2`

## Level 17 -> 18
* **Command Focus - SSH Remote Execution**: You can execute a command directly upon SSH login without opening an interactive shell. Syntax: `ssh [user]@[host] "command"`. This bypasses the `.bashrc` file that forces an exit.
```bash
ssh bandit17@bandit.labs.overthewire.org -p 2220 "cat readme"
```
> **Password (Level 18):** `OQxXZjELndr90zuhOTDYBEomI0SZITXI`
## Level 18 -> 19
> **Password (Level 19):** `KpsOfPkcP7i1FlIExk2QEjyt6dw8dxZI`

*(To be continued...)*
