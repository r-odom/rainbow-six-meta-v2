lines=[l.strip() for l in open('loadouts_raw.txt').readlines() if l.strip()]
for i in range(min(30,len(lines))):
    print(i, lines[i])
