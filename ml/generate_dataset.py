import pandas as pd
import random

cleaning = [
"dirty washroom in coach",
"toilet not cleaned properly",
"washroom smell very bad",
"garbage in train coach",
"coach floor very dirty",
"no water in washroom",
"toilet blocked in train",
"washroom full of garbage",
"dust everywhere in coach",
"cleaning staff not available",
"coach very dirty",
"washroom leaking water",
"toilet seat broken",
"washroom door broken",
"garbage near train door"
]

catering = [
"food quality very bad",
"food served cold",
"food smell very bad",
"vendor overcharging passengers",
"food not cooked properly",
"expired food in pantry",
"food packet missing items",
"pantry staff behaviour bad",
"food very oily",
"food delivered very late",
"food quantity very less",
"water bottle missing",
"tea very cold",
"food hygiene issue",
"pantry service very slow"
]

electrical = [
"light not working in coach",
"fan not working in compartment",
"charging point not working",
"electric spark near switch",
"coach light blinking",
"no electricity in coach",
"fan making noise",
"switch broken",
"light flickering in coach",
"power supply issue",
"charging socket broken",
"coach lights completely off",
"fan speed very slow",
"switchboard damaged",
"electrical burning smell"
]

medical = [
"passenger fainted need doctor",
"passenger unconscious in train",
"medical emergency passenger injured",
"need first aid immediately",
"passenger having chest pain",
"old passenger feeling sick",
"child injured in train",
"passenger vomiting continuously",
"pregnant woman needs help",
"passenger bleeding heavily",
"passenger having breathing problem",
"high fever passenger",
"passenger collapsed suddenly",
"elderly passenger critical",
"medical help urgently needed"
]

maintenance = [
"seat broken in coach",
"berth damaged in sleeper coach",
"train door not closing properly",
"window glass broken",
"ac not working in coach",
"seat cushion torn",
"table broken in coach",
"door handle missing",
"coach shaking too much",
"ladder broken in sleeper coach",
"window not closing properly",
"berth support broken",
"coach ceiling damaged",
"seat handle broken",
"ac leaking water"
]

security = [
"suspicious person in train",
"passenger theft reported",
"mobile stolen in coach",
"fight between passengers",
"harassment complaint in train",
"unauthorized vendor in coach",
"luggage missing from seat",
"suspicious bag found",
"passenger misbehaving",
"security help required",
"drunk passenger creating trouble",
"someone trying to steal luggage",
"passenger threatening others",
"fight near train door",
"suspicious activity in coach"
]

dataset = []

def add_rows(texts, department, priority):
    for i in range(65):
        desc = random.choice(texts)
        dataset.append([desc, department, priority])

add_rows(cleaning,"cleaning","normal")
add_rows(catering,"catering","medium")
add_rows(electrical,"electrical","medium")
add_rows(medical,"medical","emergency")
add_rows(maintenance,"maintenance","medium")
add_rows(security,"security","medium")

df = pd.DataFrame(dataset, columns=["description","department","priority"])

df.to_csv("dataset.csv", index=False)

print("Dataset generated with", len(df), "rows")