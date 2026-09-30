import json
d=json.load(open('operators_clean.json'))
print(len(d['attackers']), len(d['defenders']))
