"""AQA GCSE Spanish (8692) content. Run: python scripts/content/gen_spanish.py"""
import os
from common import q, topic, write_subject

T1, T2, T3, G = 'sp-theme1', 'sp-theme2', 'sp-theme3', 'sp-grammar'

identity = topic(
    'sp-identity', T1, 'Identity and Relationships',
    'Describing yourself, family and friends, and how you get on with people.',
    """
As your AQA tutor: this is Theme 1 (People and lifestyle). It comes up in all four papers — especially the Speaking photo card and the Writing tasks — so build a bank of sentences you can adapt.

**Describing people.** Physical description uses tener and ser: Tengo el pelo largo y rizado y los ojos azules. Es alto y delgado. Personality uses ser: Mi madre es comprensiva, mi hermano es un poco pesado. Adjectives must agree in gender and number: simpático → simpática → simpáticos → simpáticas.

**Ser vs estar.** Ser for permanent characteristics and identity (Es inteligente). Estar for temporary states, feelings and location (Hoy está cansado; Mi abuela está en casa).

**Relationships.** Me llevo bien con… (I get on well with…), me llevo mal con… (I get on badly with…), me peleo con… (I argue with…), discutimos (we argue), confío en… (I trust…), me apoya (supports me).

**Aim for grades 7–9.** Justify every opinion (porque, ya que), add contrast (aunque, sin embargo), and move between time frames: Cuando era pequeña me peleaba mucho con mi primo, pero ahora nos llevamos genial y el año que viene vamos a viajar juntos.
""",
    ['Tener for hair/eyes; ser for personality and appearance', 'Adjectives agree: simpático / simpática / simpáticos / simpáticas',
     'Ser = permanent/identity; estar = temporary state, feelings, location', 'Me llevo bien/mal con…, me peleo con…, discutimos',
     'Justify with porque / ya que; contrast with aunque / sin embargo', 'Use the imperfect for the past (cuando era pequeño/a…)'],
    [('Me llevo bien con mi hermana', 'I get on well with my sister'),
     ('When do you use estar rather than ser?', 'For temporary states and feelings (estoy cansado) and for location (está en Madrid).'),
     ('I used to argue with my brother', 'Me peleaba con mi hermano (imperfect)'),
     ('although', 'aunque')],
    [
        q('sp-id-q1', 'What does "Me llevo bien con mi hermana" mean?', ['I look like my sister', 'I get on well with my sister', 'I argue with my sister', 'I live with my sister'], 'I get on well with my sister', 'Llevarse bien con = to get on well with.', 'foundation'),
        q('sp-id-q2', 'Choose the correct adjective: "Mi madre es muy ___." (kind/nice)', ['simpático', 'simpáticos', 'simpática', 'simpáticas'], 'simpática', 'Madre is feminine singular, so the adjective ends in -a.', 'foundation'),
        q('sp-id-q3', 'What does "Tengo los ojos verdes y el pelo rizado" mean?', ['I have green eyes and curly hair', 'I have green hair and curly eyes', 'I have blue eyes and straight hair', 'My eyes are green and my hair is short'], 'I have green eyes and curly hair', 'Ojos verdes = green eyes; pelo rizado = curly hair.', 'intermediate'),
        q('sp-id-q4', 'Which verb completes: "Mi hermano ___ muy cansado hoy."?', ['es', 'tiene', 'hace', 'está'], 'está', 'Being tired today is a temporary state, so estar.', 'intermediate'),
        q('sp-id-q5', 'Translate: "My friends are funny but sometimes they are annoying."', ['Mis amigos están graciosos pero a veces es molesto', 'Mis amigos son graciosos pero a veces son molestos', 'Mi amigo es gracioso pero a veces molesta', 'Mis amigas son graciosa pero a veces son molesta'], 'Mis amigos son graciosos pero a veces son molestos', 'Personality uses ser, and both adjectives agree with amigos (masculine plural).', 'higher'),
        q('sp-id-q6', 'What does "Cuando era pequeña, me peleaba mucho con mi primo" tell you?', ['She argues a lot with her cousin now', 'She will argue with her cousin', 'When she was little she used to argue a lot with her cousin', 'She never argued with her cousin'], 'When she was little she used to argue a lot with her cousin', 'Era and peleaba are imperfect — repeated past actions.', 'higher'),
        q('sp-id-q7', 'Which sentence means "I don\'t get on with anyone"?', ['No me llevo bien con nadie', 'No me llevo bien con alguien', 'Me llevo bien con nadie no', 'Nunca me llevo con todos'], 'No me llevo bien con nadie', 'Spanish uses a double negative: no … nadie.', 'higher'),
        q('sp-id-q8', 'Best translation of "Mi padre, que es muy estricto, no me deja salir entre semana."', ['My dad is strict so he doesn\'t leave during the week', 'My strict dad lets me go out at the weekend', 'My dad, who is very strict, doesn\'t want to go out during the week', 'My dad, who is very strict, doesn\'t let me go out during the week'], "My dad, who is very strict, doesn't let me go out during the week", 'Que = who; dejar + infinitive = to let/allow; entre semana = during the week.', 'further'),
        q('sp-id-q9', 'Choose the correct form: "Si tuviera un hermano, ___ muy feliz." (grade 8–9 structure)', ['soy', 'seré', 'era', 'sería'], 'sería', 'Si + imperfect subjunctive (tuviera) is followed by the conditional (sería): "If I had a brother, I would be very happy."', 'further'),
        q('sp-id-q10', 'In "Nos llevamos genial, aunque a veces discutimos", what does "aunque" add?', ['It means "because"', 'It means "although" and adds a contrasting idea, making a more complex sentence', 'It means "always"', 'It means "never"'], 'It means "although" and adds a contrasting idea, making a more complex sentence', 'Complex sentences with contrast are a hallmark of higher-grade answers.', 'further'),
    ])

healthy = topic(
    'sp-healthy', T1, 'Healthy Living and Lifestyle',
    'Diet, exercise, sleep, illness and unhealthy habits.',
    """
As your AQA tutor: Theme 1 again. Healthy living is a favourite for Reading and Listening questions about what someone used to do versus what they do now — so train your ear for tense markers.

**Key vocabulary.** Llevar una vida sana (to lead a healthy life), estar en forma (to be fit), la comida sana / la comida basura (healthy / junk food), hacer ejercicio, dormir ocho horas, beber agua, fumar (to smoke), el tabaco, el alcohol, las drogas, el estrés.

**Illness.** Me duele la cabeza (my head hurts). Doler works like gustar: me duele + singular, me duelen + plural (me duelen los pies). Tengo dolor de estómago, estoy enfermo/a, tengo fiebre.

**Advice.** Debería + infinitive (I/you should), hay que + infinitive (you have to), es importante + infinitive. At Higher, es importante que / es esencial que + present subjunctive: Es esencial que los jóvenes hagan ejercicio.

**Show change over time.** Antes comía mucha comida basura (imperfect), pero ahora intento comer sano (present) y en el futuro voy a dejar de comer dulces (future).
""",
    ['Llevar una vida sana, estar en forma, comida sana/basura', 'Me duele + singular; me duelen + plural',
     'Debería / hay que + infinitive for advice', 'Es importante que + subjunctive at Higher',
     'Contrast antes (imperfect) with ahora (present)', 'Si + present → future: Si no fumas, vivirás más'],
    [('to be fit', 'estar en forma'), ('My feet hurt', 'Me duelen los pies'), ('I should drink more water', 'Debería beber más agua'),
     ('I used to eat junk food', 'Comía comida basura')],
    [
        q('sp-hl-q1', 'What does "Como mucha fruta y verdura" mean?', ['I buy fruit and vegetables', 'I eat a lot of fruit and vegetables', 'I like fruit but not vegetables', 'I cook a lot of fruit'], 'I eat a lot of fruit and vegetables', 'Como = I eat (comer).', 'foundation'),
        q('sp-hl-q2', 'How do you say "to be fit"?', ['ser forma', 'tener forma', 'estar en forma', 'hacer forma'], 'estar en forma', 'Estar en forma is the set phrase.', 'foundation'),
        q('sp-hl-q3', 'What does "Me duele la cabeza" mean?', ['I have a headache', 'My head is big', 'I hit my head', 'I washed my head'], 'I have a headache', 'Literally "my head hurts me".', 'intermediate'),
        q('sp-hl-q4', 'Complete: "Para llevar una vida sana, ___ beber más agua." (I should)', ['tengo', 'hago', 'debo de', 'debería'], 'debería', 'Debería + infinitive = I should.', 'intermediate'),
        q('sp-hl-q5', 'Translate: "Last week I went to the gym three times."', ['La semana pasada fui al gimnasio tres veces', 'La semana que viene voy al gimnasio tres veces', 'La semana pasada iba al gimnasio tres veces', 'Cada semana voy al gimnasio tres veces'], 'La semana pasada fui al gimnasio tres veces', 'A completed, counted action in the past takes the preterite (fui).', 'higher'),
        q('sp-hl-q6', 'What has changed? "Antes comía mucha comida basura, pero ahora intento comer sano."', ['She eats junk food now', 'She used to eat lots of junk food but now tries to eat healthily', 'She has always eaten healthily', 'She will start eating junk food'], 'She used to eat lots of junk food but now tries to eat healthily', 'Antes + imperfect (comía) vs ahora + present (intento).', 'higher'),
        q('sp-hl-q7', 'Which sentence uses doler correctly?', ['Me duele los pies', 'Yo duelo los pies', 'Me dolen los pies', 'Me duelen los pies'], 'Me duelen los pies', 'Los pies is plural, so duelen; the stem change is o → ue.', 'higher'),
        q('sp-hl-q8', 'What does "Si no fumas, vivirás más años" mean?', ["If you don't smoke, you will live longer", 'If you smoke, you will live longer', "You don't smoke so you live longer", "If you didn't smoke, you would live longer"], "If you don't smoke, you will live longer", 'Si + present tense, then future tense (vivirás).', 'further'),
        q('sp-hl-q9', 'Best translation of "I think it\'s important to sleep well":', ['Pienso que está importante dormir bueno', 'Creo que es importante duermo bien', 'Creo que es importante dormir bien', 'Creo que importa bien dormir'], 'Creo que es importante dormir bien', 'Es importante + infinitive, and bien (adverb) not bueno.', 'further'),
        q('sp-hl-q10', 'In "Es esencial que los jóvenes hagan ejercicio", why "hagan" and not "hacen"?', ['It is the future tense', 'After "es esencial que" Spanish uses the present subjunctive', '"Hacen" is always wrong', 'It is the preterite'], 'After "es esencial que" Spanish uses the present subjunctive', 'Impersonal expressions of necessity + que + a new subject trigger the subjunctive.', 'further'),
    ])

education = topic(
    'sp-education', T1, 'Education and Work',
    'School subjects and rules, exams, future study and careers.',
    """
As your AQA tutor: Theme 1. School and future plans give you a natural reason to use three time frames in one answer — examiners reward that.

**School.** Mi asignatura favorita es… (la informática, las ciencias, la historia), el instituto, los profesores, el uniforme, los deberes (homework), sacar buenas notas (to get good grades), aprobar (to pass), suspender (to fail).

**Rules.** Está prohibido + infinitive (it is forbidden to…), hay que + infinitive (you have to…), no se permite… (…is not allowed), tenemos que llevar uniforme.

**Future plans.** Voy a + infinitive (near future), quiero / me gustaría + infinitive, tengo la intención de…, el bachillerato (sixth form / A-levels), ir a la universidad, hacer un aprendizaje (apprenticeship), trabajar como + job (no article: trabajar como médico).

**Grade 7–9 structures.** Llevo tres años estudiando español (I've been studying Spanish for three years). Cuando + future meaning takes the present subjunctive: Cuando termine el instituto, quiero hacer un aprendizaje. Si saco buenas notas, iré a la universidad.
""",
    ['Asignaturas, deberes, sacar buenas notas, aprobar / suspender', 'Está prohibido / hay que + infinitive for rules',
     'Voy a / quiero / me gustaría + infinitive for the future', 'Trabajar como + job, with no article',
     'Llevo + time + gerund = I have been … for', 'Cuando + subjunctive for the future: cuando termine…'],
    [('I have to do my homework', 'Tengo que hacer los deberes'), ('It is forbidden to use your mobile', 'Está prohibido usar el móvil'),
     ('I passed my exams', 'Aprobé mis exámenes'), ('I have been studying Spanish for three years', 'Llevo tres años estudiando español')],
    [
        q('sp-ed-q1', 'What does "Mi asignatura favorita es la informática" mean?', ['My favourite teacher teaches computing', 'My favourite subject is computing/ICT', "I don't like computing", 'My favourite subject is information'], 'My favourite subject is computing/ICT', 'La informática = ICT / computing.', 'foundation'),
        q('sp-ed-q2', 'What does "Está prohibido usar el móvil en clase" mean?', ['You must use your mobile in class', 'Mobiles are allowed in class', 'It is forbidden to use your mobile in class', 'I prohibit mobiles in class'], 'It is forbidden to use your mobile in class', 'Está prohibido + infinitive = it is forbidden to…', 'foundation'),
        q('sp-ed-q3', 'Which means "I have to do my homework"?', ['Tengo que hacer los deberes', 'Tengo hacer los deberes', 'Hay los deberes', 'Debo los deberes hacer'], 'Tengo que hacer los deberes', 'Tener que + infinitive = to have to.', 'intermediate'),
        q('sp-ed-q4', 'When is this happening? "El año que viene voy a estudiar biología."', ['Last year', 'Every year', 'This year', 'Next year'], 'Next year', 'El año que viene = next year; voy a estudiar = near future.', 'intermediate'),
        q('sp-ed-q5', 'What does "Me gustaría trabajar como médico porque quiero ayudar a la gente" mean?', ['I like working as a doctor because I help people', 'I would like to work as a doctor because I want to help people', 'I worked as a doctor to help people', 'I will work as a doctor with people'], 'I would like to work as a doctor because I want to help people', 'Me gustaría (conditional) = I would like.', 'higher'),
        q('sp-ed-q6', 'Translate: "I passed all my exams."', ['Suspendí todos mis exámenes', 'Apruebo todos mis exámenes', 'Aprobaré todos mis exámenes', 'Aprobé todos mis exámenes'], 'Aprobé todos mis exámenes', 'Aprobar = to pass (suspender = to fail); preterite yo form is aprobé.', 'higher'),
        q('sp-ed-q7', 'What does "Si saco buenas notas, iré a la universidad" mean?', ['If I get good grades, I will go to university', 'If I got good grades, I would go to university', 'I got good grades so I went to university', 'I get good grades at university'], 'If I get good grades, I will go to university', 'Si + present, then future (iré).', 'higher'),
        q('sp-ed-q8', 'What does "Llevo tres años estudiando español" mean?', ['I studied Spanish three years ago', 'I have been studying Spanish for three years', 'I will study Spanish for three years', 'I carry three Spanish books'], 'I have been studying Spanish for three years', 'Llevar + time + gerund expresses how long something has been going on.', 'further'),
        q('sp-ed-q9', 'In "Cuando termine el instituto, quiero hacer un aprendizaje", why "termine"?', ['It is the preterite', 'It is a mistake — it should be "termino"', '"Cuando" referring to the future is followed by the present subjunctive', 'It is the imperfect'], '"Cuando" referring to the future is followed by the present subjunctive', 'Cuando + future meaning → subjunctive: a grade 8–9 structure.', 'further'),
        q('sp-ed-q10', 'Which sentence would score highest in a Writing task about school?', ['Mi instituto es grande.', 'Aunque los profesores son estrictos, me encanta mi instituto porque hay muchas actividades.', 'Me gusta el instituto.', 'El instituto tiene profesores.'], 'Aunque los profesores son estrictos, me encanta mi instituto porque hay muchas actividades.', 'It combines contrast (aunque), a strong opinion and a justification (porque).', 'further'),
    ])

freetime = topic(
    'sp-freetime', T2, 'Free-Time Activities',
    'Sport, music, TV and film, going out, and expressing likes and dislikes.',
    """
As your AQA tutor: Theme 2 (Popular culture). Hobbies are the easiest place to show off verb control, because you can naturally say what you usually do, did last weekend, and are going to try next.

**Which verb?** Jugar a + sport/game (jugar al fútbol — a + el = al). Tocar + instrument (tocar la guitarra). Hacer + activity (hacer natación, hacer equitación). Also salir con amigos, quedar con amigos (to meet up), ver series, ir al cine, escuchar música.

**Likes and dislikes.** Gustar, encantar and interesar agree with the THING liked: me gusta el deporte (singular), me gustan los videojuegos (plural), me encanta + infinitive (me encanta salir). No me interesa nada = I'm not at all interested.

**Frequency.** Suelo + infinitive (I usually…), los fines de semana, a menudo, de vez en cuando, nunca.

**Grade 7–9.** Hace dos años que toco el piano (I've been playing the piano for two years). Si tuviera más tiempo libre, aprendería a bailar salsa. Aim to show three time frames: Antes jugaba al tenis, ahora prefiero nadar y el año que viene voy a probar el surf.
""",
    ['Jugar a (al) + sport; tocar + instrument; hacer + activity', 'Me gusta + singular / infinitive; me gustan + plural',
     'Suelo + infinitive = I usually…', 'Hace + time + que + present = have been …ing for',
     'Preterite for last weekend (fui, vi); imperfect for used to (jugaba)', 'Show three time frames in one answer'],
    [('I play the guitar', 'Toco la guitarra'), ('I love video games', 'Me encantan los videojuegos'),
     ('I usually go out with my friends', 'Suelo salir con mis amigos'), ('I have been playing the piano for two years', 'Hace dos años que toco el piano')],
    [
        q('sp-ft-q1', 'What does "Juego al fútbol los sábados" mean?', ['I played football on Saturday', 'I watch football on Saturdays', 'I will play football on Saturday', 'I play football on Saturdays'], 'I play football on Saturdays', 'Juego = I play; los sábados = on Saturdays.', 'foundation'),
        q('sp-ft-q2', 'Which verb goes with "la guitarra"?', ['tocar', 'jugar', 'hacer', 'ir'], 'tocar', 'Instruments use tocar; sports and games use jugar.', 'foundation'),
        q('sp-ft-q3', 'Complete: "Me ___ los videojuegos."', ['gusta', 'gusto', 'gustan', 'gustamos'], 'gustan', 'Los videojuegos is plural, so gustan.', 'intermediate'),
        q('sp-ft-q4', 'What does "Suelo ver series en Netflix" mean?', ['I only watch series on Netflix', 'I usually watch series on Netflix', "I don't watch series", 'I will watch series'], 'I usually watch series on Netflix', 'Soler + infinitive = to usually do something.', 'intermediate'),
        q('sp-ft-q5', 'What did they do? "El fin de semana pasado fui al cine con mis amigos y vimos una película de terror."', ['Next weekend they will watch a horror film', 'They go to the cinema every weekend', 'Last weekend they went to the cinema and watched a horror film', 'They watched a comedy last weekend'], 'Last weekend they went to the cinema and watched a horror film', 'Fui and vimos are preterite; película de terror = horror film.', 'higher'),
        q('sp-ft-q6', 'Translate: "I love going out with my friends."', ['Me encantan salir con mis amigos', 'Encanto salir con mis amigos', 'Me encanta salgo con mis amigos', 'Me encanta salir con mis amigos'], 'Me encanta salir con mis amigos', 'With an infinitive, encantar stays singular: me encanta salir.', 'higher'),
        q('sp-ft-q7', 'What does "No me interesa nada el deporte" mean?', ["I'm not at all interested in sport", 'Sport interests me a lot', 'Nothing interests me except sport', "I'm interested in some sport"], "I'm not at all interested in sport", 'No … nada = not at all.', 'higher'),
        q('sp-ft-q8', 'What does "Hace dos años que toco el piano" mean?', ['I played the piano two years ago', 'I will play the piano in two years', 'I have been playing the piano for two years', 'I played the piano for two years'], 'I have been playing the piano for two years', 'Hace + time + que + present = something that started in the past and is still going on.', 'further'),
        q('sp-ft-q9', 'What does "Si tuviera más tiempo libre, aprendería a bailar salsa" mean?', ['If I had more free time, I would learn to dance salsa', 'If I have more free time, I will learn salsa', 'I had more free time so I learnt salsa', 'I would have learnt salsa'], 'If I had more free time, I would learn to dance salsa', 'Si + imperfect subjunctive (tuviera) + conditional (aprendería).', 'further'),
        q('sp-ft-q10', 'Which sentence shows three different time frames?', ['Juego al tenis y nado.', 'Me gusta el tenis y la natación.', 'Jugaba al tenis.', 'Antes jugaba al tenis, ahora prefiero nadar y el año que viene voy a probar el surf.'], 'Antes jugaba al tenis, ahora prefiero nadar y el año que viene voy a probar el surf.', 'Imperfect (jugaba), present (prefiero) and near future (voy a probar).', 'further'),
    ])

festivals = topic(
    'sp-festivals', T2, 'Customs, Festivals and Celebrations',
    'Festivals in Spain and Latin America, family celebrations, and describing a past celebration.',
    """
As your AQA tutor: Theme 2. Reading and Listening texts often describe a festival, so you need both the cultural facts and the vocabulary to follow them.

**Festivals to know.**
• La Tomatina (Buñol, Valencia, late August): a huge tomato fight in the streets.
• Las Fallas (Valencia, March): enormous papier-mâché figures (ninots) are displayed and then burned.
• San Fermín (Pamplona, July): the running of the bulls (los encierros).
• Semana Santa (Holy Week, Easter): religious processions through the streets, especially in Andalucía.
• Nochebuena (24 December) and Navidad (25 December). Nochevieja (31 December): people eat twelve grapes (las doce uvas), one on each chime at midnight, for good luck.
• El Día de Reyes (6 January): the Three Kings (los Reyes Magos) bring children presents.
• El Día de los Muertos (Mexico, 1–2 November): families remember relatives who have died, building altars (ofrendas) with photos, food and marigold flowers.

**Useful language.** Se celebra en… (it is celebrated in…), se come turrón (turrón is eaten — impersonal se), la gente se disfraza (people dress up), hay desfiles / procesiones / fuegos artificiales.

**Describing a past celebration.** Preterite for events (fuimos, comimos, celebramos), imperfect for description (había mucha gente, hacía calor), plus an evaluation: fue impresionante, lo pasé bomba.
""",
    ['La Tomatina = tomato fight (Buñol, August); Las Fallas = burning figures (Valencia, March)',
     'Nochevieja = New Year\'s Eve: twelve grapes at midnight', 'Día de Reyes (6 January) = Three Kings bring presents',
     'Día de los Muertos (Mexico) = remembering relatives who have died', 'Impersonal se: se celebra, se come',
     'Preterite for events, imperfect for description, then an evaluation'],
    [("New Year's Eve", 'Nochevieja — eat twelve grapes at midnight'), ('When do the Reyes Magos bring presents?', '6 January'),
     ('What is La Tomatina?', 'A tomato fight in Buñol, near Valencia, in August'), ('Se celebra en México', 'It is celebrated in Mexico')],
    [
        q('sp-fe-q1', 'What happens at La Tomatina?', ['People run with bulls', 'Giant figures are burned', 'People throw tomatoes at each other', 'People eat twelve grapes'], 'People throw tomatoes at each other', 'La Tomatina in Buñol is a huge tomato fight.', 'foundation'),
        q('sp-fe-q2', 'What is "Nochevieja"?', ["New Year's Eve", 'Christmas Eve', 'Easter', 'Twelfth Night'], "New Year's Eve", 'Nochebuena is Christmas Eve; Nochevieja is New Year\'s Eve.', 'foundation'),
        q('sp-fe-q3', 'On which date do many Spanish children traditionally receive presents from los Reyes Magos?', ['25 December', '31 December', '1 November', '6 January'], '6 January', 'El Día de Reyes is 6 January.', 'intermediate'),
        q('sp-fe-q4', 'What is the tradition at midnight on Nochevieja in Spain?', ['Throwing tomatoes', 'Eating twelve grapes, one for each chime of the clock', 'Burning giant figures', 'Running with bulls'], 'Eating twelve grapes, one for each chime of the clock', 'Las doce uvas bring good luck for each month of the new year.', 'intermediate'),
        q('sp-fe-q5', 'What does "El Día de los Muertos se celebra en México para recordar a los familiares que han muerto" mean?', ['The Day of the Dead is a Spanish Halloween festival', 'The Day of the Dead is celebrated in Mexico to remember relatives who have died', 'Mexicans celebrate to forget dead relatives', 'The festival celebrates the living only'], 'The Day of the Dead is celebrated in Mexico to remember relatives who have died', 'Recordar = to remember; han muerto = have died (perfect tense).', 'higher'),
        q('sp-fe-q6', 'At the end of Las Fallas in Valencia, what happens to most of the giant figures?', ['They are thrown in the sea', 'They are kept in a museum', 'They are given to children', 'They are burned'], 'They are burned', 'The burning, la cremà, is the climax of the festival.', 'higher'),
        q('sp-fe-q7', 'Translate: "Last year we celebrated my birthday at home."', ['El año pasado celebramos mi cumpleaños en casa', 'El año que viene celebraremos mi cumpleaños en casa', 'El año pasado celebrábamos mi cumpleaños en casa', 'Cada año celebramos mi cumpleaños en casa'], 'El año pasado celebramos mi cumpleaños en casa', 'One completed occasion in the past takes the preterite.', 'higher'),
        q('sp-fe-q8', 'In "Se come mucho turrón en Navidad", what does "se come" mean?', ['He eats a lot of turrón', 'We ate turrón', 'A lot of turrón is eaten at Christmas', 'Turrón eats a lot'], 'A lot of turrón is eaten at Christmas', 'Impersonal se describes what people generally do.', 'further'),
        q('sp-fe-q9', 'What does "Durante la Semana Santa hay procesiones por las calles" mean?', ['During Christmas there are parades', 'During Holy Week (Easter) there are processions through the streets', 'Every week there are processions', 'Holy Week is a summer festival'], 'During Holy Week (Easter) there are processions through the streets', 'Semana Santa = Holy Week, the week before Easter.', 'further'),
        q('sp-fe-q10', 'Which sentence would gain the most credit when describing a festival?', ['Las Fallas son en Valencia.', 'Me gustan las fiestas.', 'Fui a las Fallas el año pasado; fue impresionante ver cómo quemaban los ninots, aunque había demasiada gente.', 'Hay fiestas en España.'], 'Fui a las Fallas el año pasado; fue impresionante ver cómo quemaban los ninots, aunque había demasiada gente.', 'Preterite, imperfect, an evaluation and a contrast in one sentence.', 'further'),
    ])

celebrity = topic(
    'sp-celebrity', T2, 'Celebrity Culture',
    'Famous people, role models, influencers and social media, with comparatives and opinions.',
    """
As your AQA tutor: Theme 2. Celebrity questions are really opinion questions, so this is where you practise balanced arguments.

**Vocabulary.** Los famosos, el/la cantante, el actor / la actriz, el/la deportista, el/la influencer, un modelo a seguir (a role model), la fama, ganar mucho dinero, tener talento, la vida privada, la presión, las redes sociales, los seguidores.

**Comparing.** Más … que (more … than), menos … que (less … than), tan … como (as … as), mayor / menor (older / younger), mejor / peor (better / worse). Superlative: Es la actriz más conocida de España (the best-known actress in Spain — note de, not en).

**Opinions.** En mi opinión, creo que, pienso que, me parece que + indicative. At grades 8–9, negative opinions of belief take the subjunctive: No creo que la fama sea importante.

**Balanced argument.** Aunque algunos famosos son buenos modelos a seguir, creo que muchos jóvenes se sienten presionados por las imágenes perfectas que ven en las redes sociales.
""",
    ['Un modelo a seguir = a role model', 'Más/menos … que; tan … como; mejor/peor',
     'Superlative: el/la más … de', 'Creo que + indicative; no creo que + subjunctive',
     'Si fuera famoso/a, … + conditional', 'Balance views with aunque, sin embargo, por un lado…'],
    [('a role model', 'un modelo a seguir'), ('as famous as', 'tan famoso como'), ('I don\'t think fame is important', 'No creo que la fama sea importante'),
     ('If I were famous…', 'Si fuera famoso/a…')],
    [
        q('sp-ce-q1', 'What does "Mi cantante favorita es Rosalía" mean?', ['Rosalía sings my favourite song', "I don't like Rosalía", 'My favourite actress is Rosalía', 'My favourite singer is Rosalía'], 'My favourite singer is Rosalía', 'Cantante = singer.', 'foundation'),
        q('sp-ce-q2', 'What does "un modelo a seguir" mean?', ['a role model', 'a fashion model', 'a follower', 'a model car'], 'a role model', 'Literally "a model to follow".', 'foundation'),
        q('sp-ce-q3', 'What does "Admiro a los deportistas porque trabajan muy duro" mean?', ['Sportspeople admire me because I work hard', 'I admire sportspeople because they work very hard', "I don't admire sportspeople", 'Sportspeople work hard and are admired by nobody'], 'I admire sportspeople because they work very hard', 'Admirar a = to admire (personal a before people).', 'intermediate'),
        q('sp-ce-q4', 'Complete: "Messi es ___ famoso ___ Ronaldo." (as famous as)', ['más … que', 'menos … que', 'tan … como', 'tanto … que'], 'tan … como', 'Tan + adjective + como = as … as.', 'intermediate'),
        q('sp-ce-q5', 'What is the speaker\'s view? "Los famosos ganan demasiado dinero y no tienen vida privada."', ['Positive — celebrities deserve their money', 'Negative — celebrities earn too much and have no private life', 'Neutral', 'The speaker wants to be famous'], 'Negative — celebrities earn too much and have no private life', 'Demasiado = too much; no tienen vida privada = they have no private life.', 'higher'),
        q('sp-ce-q6', 'Translate: "In my opinion, influencers are a bad influence."', ['En mi opinión, los influencers son una mala influencia', 'En mi opinión, los influencers están una mala influencia', 'En mi opinión, el influencer es malo influencia', 'Mi opinión es influencers malos'], 'En mi opinión, los influencers son una mala influencia', 'Ser for characteristics; mala agrees with influencia (feminine).', 'higher'),
        q('sp-ce-q7', 'What does "Es la actriz más conocida de España" mean?', ['She is a more known actress than Spain', 'She is known in Spain as an actress', 'She is the best-known actress in Spain', 'She knows Spain best'], 'She is the best-known actress in Spain', 'Superlative: el/la más + adjective + de.', 'higher'),
        q('sp-ce-q8', 'In "No creo que la fama sea importante", why "sea" and not "es"?', ['"No creo que" expresses doubt, which triggers the subjunctive', '"Sea" is the preterite of ser', 'It is a spelling mistake', '"Sea" is used after all verbs of thinking'], '"No creo que" expresses doubt, which triggers the subjunctive', 'Creo que + indicative, but no creo que + subjunctive.', 'further'),
        q('sp-ce-q9', 'What does "Si fuera famoso, usaría mi fama para ayudar a los demás" mean?', ['If I am famous, I will use my fame', 'If I were famous, I would use my fame to help others', 'I was famous and used my fame', 'I would like to be famous to help myself'], 'If I were famous, I would use my fame to help others', 'Si + imperfect subjunctive (fuera) + conditional (usaría).', 'further'),
        q('sp-ce-q10', 'Which is the most developed opinion?', ['Los famosos son guays.', 'Me gustan los famosos.', 'No me gustan los famosos.', 'Aunque algunos famosos son buenos modelos a seguir, creo que muchos jóvenes se sienten presionados por las imágenes perfectas que ven en las redes sociales.'], 'Aunque algunos famosos son buenos modelos a seguir, creo que muchos jóvenes se sienten presionados por las imágenes perfectas que ven en las redes sociales.', 'It balances two views, gives a reason and uses a relative clause.', 'further'),
    ])

travel = topic(
    'sp-travel', T3, 'Travel and Tourism',
    'Holidays, transport, accommodation and places of interest, using past, present and future.',
    """
As your AQA tutor: Theme 3 (Communication and the world around us). Holiday descriptions are the classic test of preterite vs imperfect — get this right and your accuracy mark jumps.

**Vocabulary.** Ir de vacaciones, viajar en avión / en tren / en coche (en + transport), alojarse en un hotel / un camping / un albergue, quedarse (to stay), la playa, la montaña, hacer turismo, visitar monumentos, el castillo, el museo, tomar el sol.

**Preterite vs imperfect.** Preterite for completed actions: fuimos a Madrid, visité el museo, nos quedamos dos semanas. Imperfect for description, background and weather in the past: hacía sol, había mucha gente, el hotel era moderno. Both together: Mientras tomaba el sol, alguien me robó la cartera (the imperfect sets the scene; the preterite interrupts it).

**Future and wishes.** El verano que viene iré a Italia / voy a ir a Italia. Me gustaría visitar Perú.

**Evaluation.** Fue genial, lo pasé bomba (I had a great time), lo mejor fue… (the best thing was…), lo peor fue… (the worst thing was…).

**Grade 8–9 stretch.** Si hubiera tenido más dinero, me habría quedado más tiempo (If I had had more money, I would have stayed longer).
""",
    ['Viajar en avión/tren/coche; alojarse en un hotel', 'Preterite = completed actions (fui, visité, nos quedamos)',
     'Imperfect = description and weather (hacía sol, había…, era…)', 'Mientras + imperfect, then preterite for the interruption',
     'Future: iré / voy a ir; wish: me gustaría', 'Evaluate: fue genial, lo mejor fue…, lo pasé bomba'],
    [('It was sunny (describing a past holiday)', 'Hacía sol'), ('I stayed in a hotel', 'Me alojé en un hotel'),
     ('The best thing was…', 'Lo mejor fue…'), ('Next summer I will go to Italy', 'El verano que viene iré a Italia')],
    [
        q('sp-tr-q1', 'What does "Fuimos a la playa en avión" mean?', ['We go to the beach by plane', 'We went to the beach by plane', 'We will go to the beach by car', 'We were at the beach on the plane'], 'We went to the beach by plane', 'Fuimos = we went (preterite of ir); en avión = by plane.', 'foundation'),
        q('sp-tr-q2', 'What does "Me alojé en un hotel de cinco estrellas" mean?', ['I booked a five-star hotel', 'I work in a five-star hotel', 'I stayed in a five-star hotel', 'I would like to stay in a hotel'], 'I stayed in a five-star hotel', 'Alojarse = to stay (in accommodation).', 'foundation'),
        q('sp-tr-q3', 'Which is the best way to say "It was sunny" when describing a past holiday?', ['Hace sol', 'Hacía sol', 'Hará sol', 'Haría sol'], 'Hacía sol', 'Weather as background description in the past uses the imperfect.', 'intermediate'),
        q('sp-tr-q4', 'What does "El verano que viene iré a Italia" mean?', ['Next summer I will go to Italy', 'Last summer I went to Italy', 'Every summer I go to Italy', 'I would go to Italy in summer'], 'Next summer I will go to Italy', 'Iré is the future of ir.', 'intermediate'),
        q('sp-tr-q5', 'What does "Mientras tomaba el sol, alguien me robó la cartera" mean?', ['I sunbathed and then stole a wallet', 'Someone was sunbathing while I stole the wallet', 'While I was sunbathing, someone stole my wallet', 'I will sunbathe and someone will steal my wallet'], 'While I was sunbathing, someone stole my wallet', 'Imperfect (tomaba) sets the scene; preterite (robó) is the interrupting event.', 'higher'),
        q('sp-tr-q6', 'Translate: "We stayed for two weeks and it was fantastic."', ['Nos quedamos dos semanas y es fantástico', 'Nos quedamos dos semanas y fue fantástico', 'Quedamos dos semanas y era fantástico siempre', 'Nos quedaremos dos semanas y será fantástico'], 'Nos quedamos dos semanas y fue fantástico', 'A completed stay and an overall judgement both take the preterite.', 'higher'),
        q('sp-tr-q7', 'Which sentence contains a mistake?', ['Ayer visité el castillo.', 'Mis padres fueron al museo.', 'Comimos paella en un restaurante.', 'El año pasado voy a España.'], 'El año pasado voy a España.', 'El año pasado needs a past tense: fui a España.', 'higher'),
        q('sp-tr-q8', 'What does "Lo mejor del viaje fue conocer a gente de otros países" mean?', ['The trip was better than meeting people', 'I met the best people in other countries', 'The best thing about the trip was meeting people from other countries', 'Knowing other countries was better'], 'The best thing about the trip was meeting people from other countries', 'Lo mejor = the best thing; conocer a gente = to meet people.', 'further'),
        q('sp-tr-q9', 'What does "Si hubiera tenido más dinero, me habría quedado más tiempo" mean? (grade 9 structure)', ['If I have more money, I will stay longer', 'If I had more money, I would stay longer', 'I had more money so I stayed longer', 'If I had had more money, I would have stayed longer'], 'If I had had more money, I would have stayed longer', 'Pluperfect subjunctive + conditional perfect: a regret about the past.', 'further'),
        q('sp-tr-q10', 'In "Fui a Madrid y hacía mucho calor", why "fui" but "hacía"?', ['"Fui" is a completed action (preterite); "hacía calor" describes the weather at the time (imperfect)', 'Both are the same tense', '"Fui" is future and "hacía" is present', '"Hacía" is a mistake'], '"Fui" is a completed action (preterite); "hacía calor" describes the weather at the time (imperfect)', 'This distinction is one of the most tested points in GCSE Spanish.', 'further'),
    ])

media = topic(
    'sp-media', T3, 'Media and Technology',
    'Mobile phones, social media, the internet and their advantages and dangers.',
    """
As your AQA tutor: Theme 3. Technology is ideal for the open-ended Writing task because it has obvious pros and cons — plan a balanced answer.

**Vocabulary.** El móvil, las redes sociales, subir fotos (to upload photos), chatear, descargar (to download), navegar por internet, los mensajes, la aplicación, el ciberacoso (cyberbullying), la privacidad, los datos personales, estar enganchado/a a (to be hooked on), pasar tiempo en…

**Advantages and disadvantages.** Es útil para…, me ayuda a…, puedo estar en contacto con…; but puede ser peligroso, es una pérdida de tiempo, hay riesgos.

**Structuring a balanced view.** Por un lado… por otro lado… (on the one hand… on the other hand…), sin embargo (however), además (moreover), en conclusión, creo que…

**Grade 8–9.** Es importante que los jóvenes protejan su privacidad (present subjunctive after es importante que). Si no tuviera móvil, me sentiría aislado (If I didn't have a phone, I would feel isolated).
""",
    ['Las redes sociales, subir fotos, descargar, chatear', 'El ciberacoso = cyberbullying; la privacidad = privacy',
     'Estar enganchado/a a = to be hooked on', 'Por un lado… por otro lado… sin embargo… en conclusión',
     'Pasar tiempo en = to spend time on', 'Es importante que + subjunctive; si + imperfect subjunctive + conditional'],
    [('social media', 'las redes sociales'), ('cyberbullying', 'el ciberacoso'), ('I spend too much time on my phone', 'Paso demasiado tiempo en mi móvil'),
     ('on the one hand… on the other hand', 'por un lado… por otro lado')],
    [
        q('sp-me-q1', 'What does "Uso mi móvil para chatear con mis amigos" mean?', ['I use my mobile to chat with my friends', "I use my friends' mobiles", 'I chat about mobiles', 'My friends use my mobile'], 'I use my mobile to chat with my friends', 'Para + infinitive = in order to.', 'foundation'),
        q('sp-me-q2', 'What does "las redes sociales" mean?', ['the social club', 'social media / social networks', 'the internet café', 'the network cable'], 'social media / social networks', 'Red = network.', 'foundation'),
        q('sp-me-q3', 'What does "Subo fotos a Instagram todos los días" mean?', ['I look at photos every day', 'I take photos but never upload them', 'I upload photos once a week', 'I upload photos to Instagram every day'], 'I upload photos to Instagram every day', 'Subir = to upload (literally to go up); todos los días = every day.', 'intermediate'),
        q('sp-me-q4', 'What does "el ciberacoso" mean?', ['cyber security', 'cyberbullying', 'online shopping', 'a computer virus'], 'cyberbullying', 'El acoso = bullying/harassment.', 'intermediate'),
        q('sp-me-q5', 'What does "Por un lado, internet es muy útil; por otro lado, puede ser peligroso" mean?', ['On one hand the internet is very useful; on the other hand it can be dangerous', 'The internet is useful and never dangerous', 'The internet is dangerous on both sides', 'One side of the internet is useful'], 'On one hand the internet is very useful; on the other hand it can be dangerous', 'Por un lado… por otro lado… structures a balanced argument.', 'higher'),
        q('sp-me-q6', 'Translate: "I spend too much time on my phone."', ['Paso demasiado dinero en mi móvil', 'Paso mucho tiempo con mis amigos', 'Paso demasiado tiempo en mi móvil', 'Estoy demasiado en el tiempo'], 'Paso demasiado tiempo en mi móvil', 'Pasar tiempo = to spend time; demasiado = too much.', 'higher'),
        q('sp-me-q7', 'What does "Mis padres dicen que estoy enganchado a los videojuegos" mean?', ['My parents are hooked on video games', "My parents say I'm hooked on video games", 'My parents say video games are hooked', 'I say my parents play video games'], "My parents say I'm hooked on video games", 'Estar enganchado a = to be hooked on.', 'higher'),
        q('sp-me-q8', 'In "Es importante que los jóvenes protejan su privacidad en línea", why "protejan"?', ['It is the future tense', 'It is the imperfect', 'It is a noun', '"Es importante que" + a new subject triggers the present subjunctive'], '"Es importante que" + a new subject triggers the present subjunctive', 'Proteger → protejan in the subjunctive (g changes to j to keep the sound).', 'further'),
        q('sp-me-q9', 'What does "Si no tuviera móvil, me sentiría aislado" mean?', ["If I didn't have a mobile, I would feel isolated", "If I don't have a mobile, I feel isolated", "I didn't have a mobile so I felt isolated", 'I will feel isolated without a mobile'], "If I didn't have a mobile, I would feel isolated", 'Si + imperfect subjunctive + conditional: a hypothetical situation.', 'further'),
        q('sp-me-q10', 'Which is the best framework for a balanced opinion in the Writing exam?', ['Me gusta. No me gusta.', 'Por un lado… por otro lado… sin embargo… en conclusión, creo que…', 'Es bueno.', 'Móvil, internet, redes.'], 'Por un lado… por otro lado… sin embargo… en conclusión, creo que…', 'Connectives organise the argument and show range.', 'further'),
    ])

environment = topic(
    'sp-environment', T3, 'The Environment and Where People Live',
    'Your town or region, environmental problems and what we can do about them.',
    """
As your AQA tutor: Theme 3. This topic links where you live with global issues, so it is great for showing opinions and suggestions with should / ought to.

**Where you live.** Vivo en un pueblo / una ciudad / un barrio, en las afueras (on the outskirts), en el campo (countryside), en la costa. Hay mucho que hacer / no hay nada que hacer. Lo bueno es que… / lo malo es que…

**Environmental problems.** El medio ambiente, la contaminación, el cambio climático, el calentamiento global, la basura / los residuos, la sequía (drought), los incendios forestales.

**Solutions.** Reciclar, ahorrar energía / agua, apagar las luces, usar el transporte público, ir en bici, reutilizar las bolsas. Deberíamos + infinitive (we should), hay que…, se debería…

**Grade 8–9.** Si todos recicláramos, habría menos basura (If everyone recycled, there would be less rubbish). Es una pena que la gente no cuide el planeta (subjunctive after an expression of emotion). Lo que más me preocupa es… (What worries me most is…). Desde hace un año voy al instituto en bici (I have been cycling to school for a year).
""",
    ['Vivo en un pueblo / una ciudad / en las afueras / en el campo', 'La contaminación, el cambio climático, el calentamiento global',
     'Reciclar, ahorrar energía, usar el transporte público', 'Deberíamos / hay que + infinitive for solutions',
     'Lo que más me preocupa es… / lo bueno es que…', 'Si + imperfect subjunctive + conditional; es una pena que + subjunctive'],
    [('global warming', 'el calentamiento global'), ('We should use public transport more', 'Deberíamos usar más el transporte público'),
     ('What worries me most is…', 'Lo que más me preocupa es…'), ('If everyone recycled, there would be less rubbish', 'Si todos recicláramos, habría menos basura')],
    [
        q('sp-en-q1', 'What does "Vivo en un pueblo en el campo" mean?', ['I live in a city centre', 'I live in a village in the countryside', 'I live by the sea', 'I live in the mountains in a city'], 'I live in a village in the countryside', 'Pueblo = village/small town; el campo = the countryside.', 'foundation'),
        q('sp-en-q2', 'What does "reciclar" mean?', ['to reuse', 'to recharge', 'to repair', 'to recycle'], 'to recycle', 'Reciclar = to recycle; reutilizar = to reuse.', 'foundation'),
        q('sp-en-q3', 'What does "Para proteger el medio ambiente, apago las luces" mean?', ['To protect the environment, I switch off the lights', 'I switch on the lights to protect the environment', 'The environment turns off the lights', 'I protect the lights'], 'To protect the environment, I switch off the lights', 'Apagar = to switch off (encender = to switch on).', 'intermediate'),
        q('sp-en-q4', 'What does "En mi ciudad hay mucho tráfico y contaminación" mean?', ['My town has no traffic', 'There is little pollution in my town', 'In my town there is a lot of traffic and pollution', 'My town is clean and quiet'], 'In my town there is a lot of traffic and pollution', 'Contaminación = pollution.', 'intermediate'),
        q('sp-en-q5', 'Translate: "We should use public transport more."', ['Deberíamos usar más el transporte público', 'Debemos usamos el transporte público', 'Usábamos más el transporte público', 'Usaremos transporte público menos'], 'Deberíamos usar más el transporte público', 'Deberíamos (conditional of deber) + infinitive = we should.', 'higher'),
        q('sp-en-q6', 'What does "Antes vivía en una ciudad, pero ahora vivo en la costa" mean?', ['I live in a city and on the coast', 'I used to live in a city, but now I live on the coast', 'I will move to the coast', 'I have always lived on the coast'], 'I used to live in a city, but now I live on the coast', 'Vivía (imperfect) contrasts with vivo (present).', 'higher'),
        q('sp-en-q7', 'What does "el calentamiento global" mean?', ['global heating system', 'the global calendar', 'worldwide cooling', 'global warming'], 'global warming', 'Calentar = to heat up.', 'higher'),
        q('sp-en-q8', 'What does "Si todos recicláramos, habría menos basura" mean?', ['If everyone recycled, there would be less rubbish', 'If everyone recycles, there is less rubbish', 'Everyone recycled and there was less rubbish', 'There will be less rubbish if you recycle'], 'If everyone recycled, there would be less rubbish', 'Si + imperfect subjunctive (recicláramos) + conditional (habría).', 'further'),
        q('sp-en-q9', 'In "Es una pena que la gente no cuide el planeta", why "cuide"?', ['It is the preterite', 'It is the imperative only', '"Es una pena que" expresses emotion, which triggers the present subjunctive', 'It is a noun'], '"Es una pena que" expresses emotion, which triggers the present subjunctive', 'Expressions of emotion + que + a new subject take the subjunctive.', 'further'),
        q('sp-en-q10', 'Which sentence shows the widest range of structures?', ['Me preocupa la contaminación.', 'Reciclo.', 'La contaminación es mala.', 'Lo que más me preocupa es la contaminación; por eso, desde hace un año voy al instituto en bici y en el futuro me gustaría instalar paneles solares.'], 'Lo que más me preocupa es la contaminación; por eso, desde hace un año voy al instituto en bici y en el futuro me gustaría instalar paneles solares.', 'Lo que…, desde hace + present, and a conditional — three different structures.', 'further'),
    ])

tenses = topic(
    'sp-tenses', G, 'Key Tenses',
    'Present, preterite, imperfect, future, conditional and perfect, plus Higher subjunctive uses.',
    """
As your AQA tutor: verb accuracy runs through all four papers — in Listening and Reading you must spot WHEN something happens, and in Writing and Speaking you must show you can use different time frames.

**Present.** Regular -ar: hablo, hablas, habla, hablamos, habláis, hablan; -er: como…; -ir: vivo… Key irregulars: soy, estoy, voy, tengo, hago. Stem-changers: juego (jugar), puedo (poder), prefiero (preferir).

**Preterite — completed actions.** -ar: é, aste, ó, amos, asteis, aron (hablé); -er/-ir: í, iste, ió, imos, isteis, ieron (comí). Irregulars: fui (ir and ser), hice, tuve, estuve, pude, vine. Markers: ayer, el año pasado, la semana pasada.

**Imperfect — used to / was …ing / description.** -ar: aba (hablaba); -er/-ir: ía (comía). Only three irregulars: era, iba, veía. Markers: cuando era pequeño, antes, siempre, a menudo.

**Future.** Near future: voy a + infinitive. Simple future: infinitive + é, ás, á, emos, éis, án (iré, comeré). Irregular stems: tendr-, har-, podr-, saldr-, vendr- (tendré, haré).

**Conditional.** Future stem + ía endings: me gustaría, sería, haría, podría.

**Perfect.** Haber + past participle: he visitado, ha comido, hemos hecho (irregular participles: hecho, visto, escrito, dicho, puesto, vuelto).

**Higher (grades 7–9).** Pluperfect: había + participle (ya había empezado — had already started). Present subjunctive after cuando with a future meaning (cuando sea mayor), after querer que (quiero que estudies), and after es importante que. Recognise the imperfect subjunctive in si clauses (si tuviera…, sería…).
""",
    ['Preterite = completed action (fui, hice, comí); markers: ayer, el año pasado', 'Imperfect = used to / description (era, iba, comía); markers: antes, cuando era pequeño',
     'Near future voy a + infinitive; simple future iré, tendré, haré', 'Conditional: me gustaría, sería, haría',
     'Perfect: he + participle (he visitado, he hecho)', 'Higher: pluperfect (había…), subjunctive after cuando (future), quiero que, es importante que'],
    [('I went (ir, preterite)', 'fui'), ('I used to live', 'vivía'), ('I will have', 'tendré'), ('When I am older', 'Cuando sea mayor')],
    [
        q('sp-te-q1', 'Complete: "Ayer ___ al cine." (I went)', ['voy', 'iré', 'fui', 'iba'], 'fui', 'Ayer signals a completed past action, so the preterite fui.', 'foundation'),
        q('sp-te-q2', 'Which tense is "voy a jugar"?', ['Near future', 'Preterite', 'Imperfect', 'Conditional'], 'Near future', 'Ir a + infinitive = going to do something.', 'foundation'),
        q('sp-te-q3', 'Complete: "Cuando era pequeño, ___ en Londres." (I used to live)', ['viví', 'vivo', 'viviré', 'vivía'], 'vivía', 'A long-lasting past situation uses the imperfect.', 'intermediate'),
        q('sp-te-q4', 'Complete: "Me ___ ir a Perú." (I would like)', ['gusta', 'gustaría', 'gustó', 'gustará'], 'gustaría', 'Gustaría is the conditional.', 'intermediate'),
        q('sp-te-q5', 'What is the "yo" preterite of hacer?', ['hizo', 'hacía', 'haré', 'hice'], 'hice', 'Hacer is irregular: hice, hiciste, hizo…', 'higher'),
        q('sp-te-q6', 'Which tense is used in "He visitado España tres veces"?', ['Perfect', 'Preterite', 'Imperfect', 'Future'], 'Perfect', 'He + past participle = the perfect tense (I have visited).', 'higher'),
        q('sp-te-q7', 'Complete: "Mañana ___ (tener) un examen de español."', ['teneré', 'tendré', 'tuve', 'tenía'], 'tendré', 'Tener has an irregular future stem: tendr-.', 'higher'),
        q('sp-te-q8', 'What does "Cuando llegué, la película ya había empezado" mean?', ['When I arrived, the film had already started', 'When I arrive, the film will have started', 'I arrived when the film started', 'The film started before I will arrive'], 'When I arrived, the film had already started', 'Había empezado is the pluperfect — an action before another past action.', 'further'),
        q('sp-te-q9', 'Complete: "Cuando ___ mayor, quiero ser periodista."', ['soy', 'seré', 'era', 'sea'], 'sea', 'Cuando + future meaning takes the present subjunctive.', 'further'),
        q('sp-te-q10', 'Complete: "Mis padres quieren que (yo) ___ medicina."', ['estudio', 'estudie', 'estudiar', 'estudiaré'], 'estudie', 'Querer que + a different subject takes the subjunctive.', 'further'),
        q('sp-te-q11', 'Which sentence uses three different tenses correctly?', ['Normalmente juego al baloncesto, pero ayer nadé y mañana voy a correr.', 'Normalmente jugué al baloncesto, pero ayer nado y mañana corrí.', 'Juego, nado, corro.', 'Ayer juego y mañana jugué.'], 'Normalmente juego al baloncesto, pero ayer nadé y mañana voy a correr.', 'Present (juego), preterite (nadé) and near future (voy a correr), each matching its time marker.', 'further'),
    ])

grammar = topic(
    'sp-grammar-core', G, 'Core Grammar',
    'Agreement, ser and estar, gustar-type verbs, negatives, pronouns, comparatives and por / para.',
    """
As your AQA tutor: the Writing paper's accuracy marks and the translation tasks punish small grammar slips — these are the ones that cost the most marks.

**Agreement.** Nouns have gender; adjectives agree in gender and number and usually come after the noun: las casas blancas.

**Ser vs estar.** Ser: identity, characteristics, nationality, time (Es alto, es de Londres). Estar: location, temporary states and feelings (Madrid está en el centro; estoy cansado). Some adjectives change meaning: ser aburrido = to be boring; estar aburrido = to be bored.

**Gustar-type verbs** agree with the thing liked: me gusta el chocolate / me gustan los animales. Same for encantar, interesar, doler. Use a + person to clarify: a mi hermana le encantan los perros.

**Negatives.** No … nunca / nada / nadie / tampoco — or put the negative word first: nunca como carne.

**Pronouns.** Direct object: lo, la, los, las (Compro el libro → Lo compro). Indirect: le, les. When both come together, le/les becomes se: se lo di a mi madre (I gave it to my mother).

**Comparatives.** Más … que, menos … que, tan … como; mayor / menor, mejor / peor.

**Por vs para.** Para = purpose, destination, deadline (voy a Madrid para ver a mis abuelos). Por = cause, exchange, through, duration (gracias por tu ayuda; paseo por el parque).
""",
    ['Adjectives agree and usually follow the noun', 'Estar for location and feelings; ser for characteristics (ser aburrido = boring, estar aburrido = bored)',
     'Me gusta + singular; me gustan + plural', 'Double negatives: no … nunca / nada / nadie',
     'Lo/la/los/las = it/them; le + lo → se lo', 'Para = purpose/destination; por = cause, exchange, through'],
    [('bored vs boring', 'estar aburrido = bored; ser aburrido = boring'), ('I buy it (el libro)', 'Lo compro'),
     ('Thank you for your help', 'Gracias por tu ayuda'), ('I never eat meat', 'Nunca como carne')],
    [
        q('sp-gr-q1', 'Which is correct?', ['las casas blanca', 'la casas blancas', 'las casas blancas', 'las casa blancos'], 'las casas blancas', 'Article, noun and adjective all feminine plural.', 'foundation'),
        q('sp-gr-q2', 'How do you say "I never eat meat"?', ['Nunca como carne', 'Como nunca carne no', 'No como carne siempre', 'Nunca carne como'], 'Nunca como carne', 'A negative word before the verb replaces no.', 'foundation'),
        q('sp-gr-q3', 'Choose: "Madrid ___ en el centro de España."', ['es', 'hay', 'tiene', 'está'], 'está', 'Location uses estar.', 'intermediate'),
        q('sp-gr-q4', 'Complete: "A mi hermana le ___ los animales."', ['encantan', 'encanta', 'encanto', 'encantamos'], 'encantan', 'Encantar agrees with los animales (plural).', 'intermediate'),
        q('sp-gr-q5', 'Complete: "Voy a Madrid ___ ver a mis abuelos." (in order to)', ['por', 'para', 'de', 'a'], 'para', 'Para + infinitive expresses purpose.', 'higher'),
        q('sp-gr-q6', 'Replace the noun with a pronoun: "Compro el libro."', ['La compro', 'Le compro', 'Lo compro', 'Los compro'], 'Lo compro', 'El libro is masculine singular, so lo, placed before the verb.', 'higher'),
        q('sp-gr-q7', 'What does "Mi hermano es mayor que yo" mean?', ['My brother is younger than me', 'My brother is as old as me', 'My brother is the oldest', 'My brother is older than me'], 'My brother is older than me', 'Mayor que = older than.', 'higher'),
        q('sp-gr-q8', '"¿El regalo? Se lo di a mi madre." What do "se" and "lo" refer to?', ['"Se" = to her (my mother); "lo" = it (the present)', '"Se" = himself; "lo" = the mother', '"Se lo" means "myself"', 'It means "I gave it to myself"'], '"Se" = to her (my mother); "lo" = it (the present)', 'Le becomes se before lo: se lo di = I gave it to her.', 'further'),
        q('sp-gr-q9', 'Complete: "Gracias ___ tu ayuda."', ['para', 'por', 'de', 'con'], 'por', 'Gracias por = thanks for (cause/exchange).', 'further'),
        q('sp-gr-q10', 'Which sentence is correct?', ['Soy aburrido porque la clase está aburrido.', 'Estoy aburrida porque la clase es aburrido.', 'Estoy aburrido porque la clase es aburrida.', 'Es aburrido porque estoy la clase.'], 'Estoy aburrido porque la clase es aburrida.', 'Estar aburrido = to be bored; ser aburrida = to be boring (agreeing with la clase).', 'further'),
    ])

skills = topic(
    'sp-exam-skills', G, 'Exam Skills: Listening, Speaking, Reading and Writing',
    'Dictation, translation, reading aloud, the photo card, and tactics for each paper.',
    """
As your AQA tutor: the four papers are each worth 25%, all at the same tier. Here is what each one expects and how to pick up the marks.

**Listening (Paper 1).** Includes a dictation section: you hear short sentences and write them down in Spanish. Spanish spelling is very regular, so learn the sound–spelling links: h is silent, j and g (before e/i) sound like a throaty h, ll and y usually sound like the y in "yes", ñ is "ny", c (before e/i) and z sound like "th" in Spain, and b and v sound the same. In comprehension questions, listen for negatives (no, nunca, ni… ni) and distractors — speakers often mention something and then say they don't do it.

**Speaking (Paper 2).** A role-play, a reading-aloud task followed by questions, and a photo card conversation. For the photo card: describe what you can see, give opinions with reasons, and use more than one time frame. Reading aloud rewards accurate pronunciation — practise the sound–spelling links above.

**Reading (Paper 3).** Includes translation from Spanish into English. Translate every word accurately; don't paraphrase or skip small words (ya, todavía, nunca, también change the meaning). Look for tense markers to work out time frames.

**Writing (Paper 4).** Includes translation from English into Spanish and open-ended tasks. Plan to include: opinions with justifications, at least three time frames, complex sentences (aunque, cuando, si…, lo que más me gusta es…), and then check verb endings, agreements and accents.

**Vocabulary.** The course is built around a defined vocabulary list (larger at Higher). Learn it little and often with flashcards and retrieval practice.
""",
    ['Four papers, 25% each, all at the same tier', 'Listening includes dictation — learn sound–spelling links (h silent, ll/y, ñ, j, z/c)',
     'Speaking: role-play, reading aloud, photo card', 'Reading: translation into English — translate every word',
     'Writing: translation into Spanish plus open tasks — opinions, three time frames, complex sentences', 'Watch for negatives and distractors in Listening and Reading'],
    [('Which letter is silent in Spanish?', 'h'), ('How is "ll" usually pronounced?', 'Like the y in "yes"'),
     ('Three things every Writing answer needs', 'Justified opinions, several time frames, complex sentences (aunque, si, cuando…)'),
     ('Photo card strategy', 'Describe what you see, give opinions with reasons, use more than one tense')],
    [
        q('sp-ex-q1', 'Which letter is always silent in Spanish?', ['j', 'h', 'ñ', 'r'], 'h', 'H is silent: hola is pronounced "ola".', 'foundation'),
        q('sp-ex-q2', 'In a listening task, which word warns you that the speaker does NOT do something?', ['siempre', 'también', 'nunca', 'mucho'], 'nunca', 'Nunca = never.', 'foundation'),
        q('sp-ex-q3', 'In the dictation section, how is "ll" usually pronounced?', ['Like an English "l"', 'Silent', 'Like "j"', 'Like the "y" in "yes"'], 'Like the "y" in "yes"', 'Most Spanish speakers pronounce ll like y.', 'intermediate'),
        q('sp-ex-q4', 'Which time marker signals the imperfect tense?', ['Cuando era pequeño…', 'Ayer…', 'Mañana…', 'El año que viene…'], 'Cuando era pequeño…', 'Cuando era pequeño (when I was little) introduces what used to happen.', 'intermediate'),
        q('sp-ex-q5', 'Best translation of "Normalmente voy al instituto a pie, pero hoy he venido en autobús":', ['I usually go to school by bus, but today I walked', 'I usually walk to school, but today I have come by bus', 'I always walk to school and came by bus', 'Normally I go to school by foot and bus'], 'I usually walk to school, but today I have come by bus', 'A pie = on foot; he venido = I have come (perfect tense).', 'higher'),
        q('sp-ex-q6', 'In a Writing task, which phrase best gives a justified opinion?', ['Me encanta porque me ayuda a relajarme', 'Es', 'Sí', 'Me gusta la'], 'Me encanta porque me ayuda a relajarme', 'Opinion (me encanta) + reason (porque me ayuda a relajarme).', 'higher'),
        q('sp-ex-q7', 'Reading: "Mi hermano no ha ido nunca a España." Which statement is true?', ['His brother went to Spain once', 'His brother lives in Spain', 'His brother has never been to Spain', 'His brother is going to Spain'], 'His brother has never been to Spain', 'No … nunca = never; ha ido = has been (perfect).', 'higher'),
        q('sp-ex-q8', 'Translate into Spanish: "When I was young, I used to play the piano."', ['Cuando fui joven, toqué el piano', 'Cuando era joven, tocaba el piano', 'Cuando soy joven, toco el piano', 'Cuando era joven, jugaba al piano'], 'Cuando era joven, tocaba el piano', 'Imperfect for "used to", and tocar (not jugar) for instruments.', 'further'),
        q('sp-ex-q9', 'Which is the best strategy for the photo card task?', ['Only list the objects in the photo', 'Describe what you can see, give opinions with reasons, and use more than one tense where you can', "Say you don't understand", 'Answer in English'], 'Describe what you can see, give opinions with reasons, and use more than one tense where you can', 'Development, justification and range are what lift the mark.', 'further'),
        q('sp-ex-q10', 'A question asks what Ana DOESN\'T like. She says: "Me encantan las ciencias; en cambio, el dibujo me parece un rollo." What doesn\'t she like?', ['Science', 'Both', 'Neither', 'Art'], 'Art', 'En cambio = on the other hand; el dibujo = art/drawing; un rollo = boring.', 'further'),
    ])

subject = {
    'id': 'spanish',
    'name': 'Spanish',
    'icon': '🇪🇸',
    'color': '#f97316',
    'examBoard': 'AQA',
    'specification': 'GCSE Spanish (8692)',
    'units': [
        {'id': T1, 'subjectId': 'spanish', 'name': 'People and Lifestyle', 'topics': [identity, healthy, education]},
        {'id': T2, 'subjectId': 'spanish', 'name': 'Popular Culture', 'topics': [freetime, festivals, celebrity]},
        {'id': T3, 'subjectId': 'spanish', 'name': 'Communication and the World Around Us', 'topics': [travel, media, environment]},
        {'id': G, 'subjectId': 'spanish', 'name': 'Grammar & Exam Skills', 'topics': [tenses, grammar, skills]},
    ],
    'diagnosticQuestions': [],
}

if __name__ == '__main__':
    here = os.path.dirname(os.path.abspath(__file__))
    out = os.path.join(here, '..', '..', 'src', 'data', 'spanish.ts')
    write_subject(out, 'spanishSubject', subject, 'AQA GCSE Spanish (8692)')
