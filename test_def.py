lines=[l.strip() for l in open('loadouts_raw.txt').readlines() if l.strip()]
# find defenders header
idx=[i for i,l in enumerate(lines) if l.lower().startswith('defenders:')][0]
print('defenders at',idx)
for i in range(idx, min(idx+50,len(lines))):
    print(i, lines[i])
