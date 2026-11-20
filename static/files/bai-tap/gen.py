text = "REDACTED"
endian = text.encode(encoding="_").decode(encoding="_")

with open("chall.txt", "wb") as file:
    file.write(endian.encode())