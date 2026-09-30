import re
lines=[l.strip() for l in open('loadouts_raw.txt').readlines() if l.strip()]
role=None
i=0
ops=[]
while i < len(lines):
    line=lines[i].strip()
    low=line.lower()
    if low.startswith('attackers:'):
        role='attackers'; i+=1; continue
    if low in ['operator','primary','alternative','secondary','gadget']:
        i+=1; continue
    if ':' not in line and i+1 < len(lines) and ':' in lines[i+1]:
        name=line
        # parse next 4
        primary=None; alternative=None; secondary=None; gadget=None
        j=i+1
        count=0
        while j < len(lines) and count<4:
            l=lines[j].strip()
            if ':' in l:
                weapon,atts=l.split(':',1)
                if count==0:
                    primary=weapon
                elif count==1:
                    alternative=weapon
                elif count==2:
                    secondary=weapon
                count+=1
                j+=1
            else:
                gadget=l
                j+=1
                break
        ops.append((name,primary,alternative,secondary,gadget))
        i=j
        continue
    i+=1
print('ops',len(ops))
for o in ops[:5]:
    print(o)
