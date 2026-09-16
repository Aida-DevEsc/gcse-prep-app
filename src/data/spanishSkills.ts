/**
 * Spanish listening, dictation, writing and translation practice in the style of AQA GCSE Spanish (8692).
 * All texts are written for this app. Listening audio is spoken by the browser's Spanish voice.
 */

export type ListeningQuestion =
  | { id: string; prompt: string; type: 'choice'; options: string[]; correct: number }
  /** Short answer in English: every group must be matched by at least one of its keywords. */
  | { id: string; prompt: string; type: 'short'; groups: string[][]; answer: string };

export interface ListeningTask {
  id: string;
  title: string;
  topicId: string;
  level: 'Foundation' | 'Higher';
  lines: { speaker?: 'A' | 'B'; text: string }[];
  translation: string;
  questions: ListeningQuestion[];
}

export interface DictationSet {
  id: string;
  title: string;
  topicId: string;
  sentences: string[];
}

export interface WritingBullet {
  es: string;
  en: string;
  /** A tense the bullet needs, checked in the whole piece. */
  tense?: 'past' | 'future' | 'conditional';
  /** Words that show the bullet has been covered (accents ignored). */
  keywords: string[];
}

export interface WritingTask {
  id: string;
  kind: '90' | '150';
  title: string;
  topicId: string;
  intro: string;
  bullets: WritingBullet[];
  targetWords: number;
  model: string;
}

export interface TranslationSentence {
  en: string;
  /** Each chunk lists acceptable Spanish versions; all chunks are needed for full marks. */
  chunks: string[][];
  model: string;
}

export interface TranslationSet {
  id: string;
  title: string;
  topicId: string;
  sentences: TranslationSentence[];
}

// ------------------------------------------------------------------ listening

export const listeningTasks: ListeningTask[] = [
  {
    id: 'ls-family', title: 'Lucía talks about her family', topicId: 'sp-identity', level: 'Foundation',
    lines: [
      { text: 'Hola, me llamo Lucía y tengo quince años. Vivo en Sevilla con mi madre, mi padrastro y mis dos hermanos.' },
      { text: 'Me llevo muy bien con mi hermano mayor porque es gracioso y siempre me ayuda con los deberes.' },
      { text: 'Sin embargo, a veces discuto con mi hermana pequeña, porque entra en mi dormitorio sin pedir permiso.' },
      { text: 'Los fines de semana visitamos a mis abuelos, que viven en el campo.' },
    ],
    translation: 'Hi, my name is Lucía and I am fifteen. I live in Seville with my mum, my stepdad and my two siblings. I get on very well with my older brother because he is funny and always helps me with my homework. However, sometimes I argue with my little sister because she comes into my bedroom without asking. At weekends we visit my grandparents, who live in the countryside.',
    questions: [
      { id: 'q1', prompt: 'Who does Lucía live with?', type: 'choice', options: ['Her mum, her stepdad and her two siblings', 'Her dad, her grandparents and one sister', 'Her mum and her two older brothers', 'Her grandparents in the countryside'], correct: 0 },
      { id: 'q2', prompt: 'Why does she get on well with her older brother? Give one reason.', type: 'short', groups: [['funny', 'makes me laugh', 'humour', 'helps', 'help', 'homework']], answer: 'He is funny / he helps her with her homework' },
      { id: 'q3', prompt: 'Why does she argue with her little sister?', type: 'choice', options: ['She borrows clothes without asking', 'She comes into her room without asking', 'She is noisy when Lucía is studying', 'She never helps with the housework'], correct: 1 },
      { id: 'q4', prompt: 'Where do her grandparents live?', type: 'short', groups: [['countryside', 'country', 'rural', 'village', 'farm']], answer: 'In the countryside' },
    ],
  },
  {
    id: 'ls-health', title: 'A podcast about a healthy lifestyle', topicId: 'sp-healthy', level: 'Higher',
    lines: [
      { speaker: 'A', text: 'Hoy hablamos con Marcos, un chico de dieciséis años que ha cambiado su estilo de vida. Marcos, ¿qué hacías antes?' },
      { speaker: 'B', text: 'Antes pasaba horas jugando a los videojuegos y comía muchísima comida rápida. Casi nunca salía de casa.' },
      { speaker: 'B', text: 'El año pasado mi médico me dijo que tenía que cuidarme más, así que decidí apuntarme a un club de natación.' },
      { speaker: 'A', text: '¿Y cómo te sientes ahora?' },
      { speaker: 'B', text: 'Mucho mejor. Duermo ocho horas y tengo más energía en clase. Lo más difícil fue dejar los refrescos, pero ahora solo bebo agua.' },
      { speaker: 'B', text: 'El verano que viene me gustaría participar en una competición regional.' },
    ],
    translation: 'Today we talk to Marcos, a sixteen-year-old who has changed his lifestyle. Marcos, what did you used to do? — I used to spend hours playing video games and I ate loads of fast food. I hardly ever left the house. Last year my doctor told me I had to look after myself more, so I decided to join a swimming club. — And how do you feel now? — Much better. I sleep eight hours and I have more energy in class. The hardest thing was giving up fizzy drinks, but now I only drink water. Next summer I would like to take part in a regional competition.',
    questions: [
      { id: 'q1', prompt: 'What was Marcos’s lifestyle like before? Give two details.', type: 'short', groups: [['video game', 'videogame', 'gaming', 'games', 'fast food', 'junk', 'stayed in', 'never left', 'didn\'t go out', 'did not go out', 'at home', 'hardly', 'rarely']], answer: 'Played video games for hours / ate lots of fast food / hardly ever left the house (any two)' },
      { id: 'q2', prompt: 'What made him change?', type: 'choice', options: ['His friends kept inviting him to join their club', 'His doctor said he had to look after himself', 'He saw an advert for a swimming club at school', 'His parents banned video games in the house'], correct: 1 },
      { id: 'q3', prompt: 'Which statement is true about him now?', type: 'choice', options: ['He sleeps about six hours a night', 'He still drinks fizzy drinks sometimes', 'He has more energy in lessons', 'He finds swimming training boring'], correct: 2 },
      { id: 'q4', prompt: 'What was the hardest thing for him?', type: 'short', groups: [['fizzy', 'soft drink', 'soda', 'refresco', 'cola', 'sugary drink']], answer: 'Giving up fizzy drinks' },
      { id: 'q5', prompt: 'What are his plans for next summer?', type: 'choice', options: ['To take part in a regional competition', 'To become a swimming coach at the club', 'To go on holiday with his swimming team', 'To start playing video games again'], correct: 0 },
    ],
  },
  {
    id: 'ls-school', title: 'Two students compare their schools', topicId: 'sp-education', level: 'Higher',
    lines: [
      { speaker: 'A', text: 'En mi instituto las clases empiezan a las ocho y terminan a las tres. Lo bueno es que tenemos mucho tiempo libre por la tarde.' },
      { speaker: 'B', text: 'Pues en mi colegio en Inglaterra las clases terminan más tarde, pero hay muchos clubes después de las clases.' },
      { speaker: 'A', text: 'Aquí no llevamos uniforme, y me parece bien porque podemos expresar nuestra personalidad.' },
      { speaker: 'B', text: 'Nosotros sí llevamos uniforme. Al principio lo odiaba, pero ahora creo que es práctico: no tengo que decidir qué ponerme cada mañana.' },
      { speaker: 'A', text: 'El año que viene voy a hacer el bachillerato de ciencias porque quiero ser veterinaria.' },
    ],
    translation: 'A: At my school lessons start at eight and finish at three. The good thing is we have lots of free time in the afternoon. B: Well, at my school in England lessons finish later, but there are lots of clubs after school. A: Here we don’t wear uniform, and I think that’s fine because we can express our personality. B: We do wear uniform. At first I hated it, but now I think it is practical: I don’t have to decide what to wear each morning. A: Next year I am going to do science A-levels (bachillerato) because I want to be a vet.',
    questions: [
      { id: 'q1', prompt: 'What does speaker A like about her school day?', type: 'choice', options: ['The lessons start later than in England', 'There are lots of after-school clubs', 'She has lots of free time in the afternoon', 'The lunch break is over an hour long'], correct: 2 },
      { id: 'q2', prompt: 'Why does speaker A think having no uniform is fine?', type: 'short', groups: [['personality', 'express', 'individual', 'be yourself', 'identity']], answer: 'Students can express their personality' },
      { id: 'q3', prompt: 'How has speaker B’s opinion of uniform changed?', type: 'choice', options: ['B liked it at first but now finds it boring', 'B hated it at first but now finds it practical', 'B has always thought it was too expensive', 'B used to like it and still wears it at weekends'], correct: 1 },
      { id: 'q4', prompt: 'What job does speaker A want to do?', type: 'short', groups: [['vet', 'veterinar', 'animal doctor']], answer: 'A vet' },
    ],
  },
  {
    id: 'ls-freetime', title: 'Weekend plans', topicId: 'sp-freetime', level: 'Foundation',
    lines: [
      { speaker: 'A', text: 'Oye, Pablo, ¿qué haces este sábado?' },
      { speaker: 'B', text: 'Por la mañana tengo un partido de baloncesto, pero por la tarde estoy libre.' },
      { speaker: 'A', text: '¿Quieres ir al cine? Ponen una película de terror nueva.' },
      { speaker: 'B', text: 'Uf, no me gustan nada las películas de miedo. ¿Por qué no vamos a la bolera?' },
      { speaker: 'A', text: 'Vale. Nos vemos a las cinco delante del centro comercial.' },
    ],
    translation: 'A: Hey, Pablo, what are you doing this Saturday? B: In the morning I have a basketball match, but in the afternoon I am free. A: Do you want to go to the cinema? There is a new horror film on. B: Ugh, I don’t like scary films at all. Why don’t we go bowling? A: OK. See you at five in front of the shopping centre.',
    questions: [
      { id: 'q1', prompt: 'What is Pablo doing on Saturday morning?', type: 'choice', options: ['Playing in a football match', 'Playing in a basketball match', 'Going shopping with his friend', 'Watching a film at the cinema'], correct: 1 },
      { id: 'q2', prompt: 'Why doesn’t Pablo want to go to the cinema?', type: 'short', groups: [['horror', 'scary', 'fear', 'frighten']], answer: 'He doesn’t like horror / scary films' },
      { id: 'q3', prompt: 'Where and when will they meet?', type: 'choice', options: ['At five, in front of the shopping centre', 'At four, outside the bowling alley', 'At five, at the entrance to the cinema', 'At half five, at the sports centre'], correct: 0 },
    ],
  },
  {
    id: 'ls-festival', title: 'Las Fallas in Valencia', topicId: 'sp-festivals', level: 'Higher',
    lines: [
      { text: 'Las Fallas se celebran en Valencia cada marzo. Durante varios días, los vecinos construyen enormes figuras de cartón y madera, llamadas fallas.' },
      { text: 'Algunas figuras critican a los políticos o a los famosos de forma divertida.' },
      { text: 'La última noche, que se llama la Cremà, se queman casi todas las figuras en las calles.' },
      { text: 'El año pasado fui con mis primos y me impresionó el ruido de los petardos. Aunque había demasiada gente, fue una experiencia inolvidable.' },
      { text: 'Si pudiera, volvería el año que viene, pero esta vez reservaría el hotel con antelación.' },
    ],
    translation: 'Las Fallas are celebrated in Valencia every March. For several days, local people build huge figures out of cardboard and wood, called fallas. Some figures make fun of politicians or celebrities. On the last night, called the Cremà, almost all the figures are burned in the streets. Last year I went with my cousins and I was impressed by the noise of the firecrackers. Although there were too many people, it was an unforgettable experience. If I could, I would go back next year, but this time I would book the hotel in advance.',
    questions: [
      { id: 'q1', prompt: 'When do Las Fallas take place?', type: 'short', groups: [['march']], answer: 'In March' },
      { id: 'q2', prompt: 'What are the figures made of?', type: 'choice', options: ['Paper and plastic', 'Cardboard and wood', 'Metal and fabric', 'Stone and clay'], correct: 1 },
      { id: 'q3', prompt: 'What happens on the last night?', type: 'choice', options: ['The best figure wins a prize in the main square', 'Almost all of the figures are burned in the streets', 'The figures are taken to a museum for the year', 'Everyone watches a parade of the biggest figures'], correct: 1 },
      { id: 'q4', prompt: 'Give one negative thing the speaker mentions about last year.', type: 'short', groups: [['crowd', 'too many people', 'busy', 'lots of people', 'many people', 'packed']], answer: 'There were too many people' },
      { id: 'q5', prompt: 'What would the speaker do differently next time?', type: 'choice', options: ['Go without their cousins', 'Stay for fewer days', 'Book the hotel in advance', 'Avoid the firecrackers'], correct: 2 },
    ],
  },
  {
    id: 'ls-celebrity', title: 'Are celebrities good role models?', topicId: 'sp-celebrity', level: 'Higher',
    lines: [
      { speaker: 'A', text: 'Yo sigo a muchos influencers en las redes sociales, pero no creo que todos sean buenos modelos a seguir.' },
      { speaker: 'A', text: 'Algunos solo quieren vender productos caros y muestran una vida que no es real.' },
      { speaker: 'B', text: 'Estoy de acuerdo. Sin embargo, admiro a los deportistas que usan su fama para ayudar a los demás.' },
      { speaker: 'B', text: 'Por ejemplo, una tenista española creó una fundación para que los niños sin recursos puedan practicar deporte.' },
      { speaker: 'A', text: 'Eso sí que es inspirador. Ojalá hubiera más famosos así.' },
    ],
    translation: 'A: I follow lots of influencers on social media, but I don’t think they are all good role models. Some only want to sell expensive products and show a life that isn’t real. B: I agree. However, I admire sports stars who use their fame to help others. For example, a Spanish tennis player set up a foundation so that children without money can do sport. A: That really is inspiring. I wish there were more celebrities like that.',
    questions: [
      { id: 'q1', prompt: 'What criticism does speaker A make of some influencers? Give one detail.', type: 'short', groups: [['sell', 'expensive', 'products', 'not real', 'fake', 'unreal', 'false']], answer: 'They only want to sell expensive products / they show a life that isn’t real' },
      { id: 'q2', prompt: 'Which celebrities does speaker B admire?', type: 'choice', options: ['Singers who write about their own lives', 'Influencers who are honest about adverts', 'Sports stars who use fame to help others', 'Actors who refuse to use social media'], correct: 2 },
      { id: 'q3', prompt: 'What did the tennis player set up?', type: 'choice', options: ['A foundation so poorer children can do sport', 'A tennis academy for professional players', 'A social media campaign about healthy eating', 'A sports shop that sells cheap equipment'], correct: 0 },
    ],
  },
  {
    id: 'ls-travel', title: 'A holiday that went wrong', topicId: 'sp-travel', level: 'Higher',
    lines: [
      { text: 'El verano pasado mi familia y yo fuimos a Mallorca. Teníamos muchas ganas de ir a la playa, pero el viaje empezó mal.' },
      { text: 'Primero, nuestro vuelo salió con tres horas de retraso. Luego, cuando llegamos al hotel, nuestra habitación no estaba lista.' },
      { text: 'Además, la habitación daba al aparcamiento en vez de al mar, y el aire acondicionado no funcionaba.' },
      { text: 'Mi padre se quejó en la recepción y al final nos dieron otra habitación con unas vistas preciosas.' },
      { text: 'A pesar de los problemas, lo pasamos bomba. En el futuro me encantaría visitar Sudamérica.' },
    ],
    translation: 'Last summer my family and I went to Majorca. We really wanted to go to the beach, but the journey started badly. First, our flight left three hours late. Then, when we arrived at the hotel, our room wasn’t ready. Also, the room looked out over the car park instead of the sea, and the air conditioning didn’t work. My dad complained at reception and in the end they gave us another room with beautiful views. Despite the problems, we had a great time. In the future I would love to visit South America.',
    questions: [
      { id: 'q1', prompt: 'What was the first problem?', type: 'choice', options: ['Their luggage was lost at the airport', 'Their flight was three hours late', 'Their taxi to the hotel did not arrive', 'Their hotel booking had been cancelled'], correct: 1 },
      { id: 'q2', prompt: 'Give two problems with the first room.', type: 'short', groups: [['not ready', 'wasn\'t ready', 'was not ready', 'car park', 'parking', 'air con', 'air-con', 'conditioning', 'no sea view', 'view']], answer: 'Not ready / overlooked the car park / air conditioning didn’t work (any two)' },
      { id: 'q3', prompt: 'How was the problem solved?', type: 'choice', options: ['They moved to a different hotel nearby', 'They were given a refund for the week', 'They were given another room with great views', 'They were offered free meals in the restaurant'], correct: 2 },
      { id: 'q4', prompt: 'Where would the speaker love to go in future?', type: 'short', groups: [['south america']], answer: 'South America' },
    ],
  },
  {
    id: 'ls-media', title: 'Phones and teenagers', topicId: 'sp-media', level: 'Higher',
    lines: [
      { speaker: 'A', text: 'Según una encuesta reciente, los jóvenes españoles pasan una media de cinco horas al día con el móvil.' },
      { speaker: 'B', text: 'A mí me parece demasiado. Yo uso el móvil para hablar con mis amigos y buscar información para los deberes, pero intento desconectar antes de dormir.' },
      { speaker: 'A', text: 'Lo peor de las redes sociales es el ciberacoso. Una amiga mía lo sufrió el año pasado y lo pasó fatal.' },
      { speaker: 'B', text: 'Por eso creo que los colegios deberían enseñar a usar internet de forma segura.' },
    ],
    translation: 'A: According to a recent survey, young Spanish people spend an average of five hours a day on their phones. B: I think that’s too much. I use my phone to talk to my friends and look up information for homework, but I try to switch off before sleeping. A: The worst thing about social media is cyberbullying. A friend of mine suffered it last year and had an awful time. B: That’s why I think schools should teach how to use the internet safely.',
    questions: [
      { id: 'q1', prompt: 'According to the survey, how long do young Spanish people spend on their phones?', type: 'choice', options: ['About three hours a week', 'Five hours a day on average', 'More than eight hours a day', 'Around fifteen hours a week'], correct: 1 },
      { id: 'q2', prompt: 'What does speaker B use their phone for? Give one detail.', type: 'short', groups: [['friends', 'talk', 'chat', 'information', 'homework', 'research', 'look up']], answer: 'Talking to friends / looking up information for homework' },
      { id: 'q3', prompt: 'What does speaker A say is the worst thing about social media?', type: 'short', groups: [['bully', 'bullied', 'cyberbull']], answer: 'Cyberbullying' },
      { id: 'q4', prompt: 'What does speaker B think schools should do?', type: 'choice', options: ['Ban phones during the whole school day', 'Teach students how to use the internet safely', 'Give every student a tablet for homework', 'Let students use social media at lunchtime'], correct: 1 },
    ],
  },
  {
    id: 'ls-environment', title: 'Helping the environment in my town', topicId: 'sp-environment', level: 'Higher',
    lines: [
      { text: 'Vivo en un pueblo cerca de Bilbao. Hace unos años había mucha basura en el río, pero las cosas han mejorado.' },
      { text: 'Ahora hay contenedores de reciclaje en cada calle y el ayuntamiento organiza limpiezas una vez al mes.' },
      { text: 'Yo siempre voy al instituto en bici para no contaminar, y en casa intentamos ahorrar agua y energía.' },
      { text: 'Me preocupa mucho el cambio climático. Si todos hiciéramos pequeños cambios, podríamos proteger el planeta.' },
    ],
    translation: 'I live in a village near Bilbao. A few years ago there was lots of rubbish in the river, but things have improved. Now there are recycling bins in every street and the town council organises clean-ups once a month. I always go to school by bike so as not to pollute, and at home we try to save water and energy. I am very worried about climate change. If everyone made small changes, we could protect the planet.',
    questions: [
      { id: 'q1', prompt: 'What was the problem in the town a few years ago?', type: 'choice', options: ['There was a lot of traffic in the streets', 'There was a lot of rubbish in the river', 'There were no parks for young people', 'There was too much noise at night'], correct: 1 },
      { id: 'q2', prompt: 'How often are clean-ups organised?', type: 'short', groups: [['once a month', 'monthly', 'every month', 'one time a month']], answer: 'Once a month' },
      { id: 'q3', prompt: 'How does the speaker travel to school, and why?', type: 'short', groups: [['bike', 'bicycle', 'cycle', 'cycling'], ['pollut', 'environment', 'emission', 'contaminat', 'planet']], answer: 'By bike, so as not to pollute' },
      { id: 'q4', prompt: 'What does the speaker say in the last sentence?', type: 'choice', options: ['Climate change is not a serious problem', 'Only governments can protect the planet', 'Small changes by everyone could protect the planet', 'Recycling in the town has become too expensive'], correct: 2 },
    ],
  },
];

// ------------------------------------------------------------------ dictation

export const dictationSets: DictationSet[] = [
  {
    id: 'dict-1', title: 'Family and school', topicId: 'sp-identity',
    sentences: [
      'Mi hermano es alto y tiene el pelo corto.',
      'Me llevo bien con mis padres.',
      'Mi asignatura favorita es la historia.',
      'Los profesores son muy simpáticos.',
      'Después del instituto voy a casa.',
    ],
  },
  {
    id: 'dict-2', title: 'Free time and holidays', topicId: 'sp-freetime',
    sentences: [
      'Los fines de semana juego al tenis.',
      'El verano pasado fui a la playa con mi familia.',
      'Me encanta escuchar música en mi dormitorio.',
      'Mañana vamos a ver una película.',
      'Nos alojamos en un hotel cerca del mar.',
    ],
  },
  {
    id: 'dict-3', title: 'Technology and the environment', topicId: 'sp-environment',
    sentences: [
      'Uso el móvil todos los días.',
      'Hay que reciclar el papel y el vidrio.',
      'Mi ciudad tiene mucho tráfico.',
      'Es importante ahorrar energía en casa.',
      'Creo que las redes sociales son útiles.',
    ],
  },
];

// ------------------------------------------------------------------ writing

export const writingTasks: WritingTask[] = [
  {
    id: 'w90-family', kind: '90', title: 'My family and friends', topicId: 'sp-identity',
    intro: 'You are writing to your Spanish exchange partner about your family and friends. Write about 90 words in Spanish. You must write something about each bullet point.',
    bullets: [
      { es: 'tu familia', en: 'your family', keywords: ['familia', 'madre', 'padre', 'hermano', 'hermana', 'padres', 'abuelo', 'abuela'] },
      { es: 'tu mejor amigo/a', en: 'your best friend', keywords: ['amigo', 'amiga', 'mejor'] },
      { es: 'una actividad reciente con tu familia', en: 'a recent activity with your family', tense: 'past', keywords: ['fuimos', 'fui', 'pasado', 'ayer', 'visitamos', 'hicimos', 'comimos', 'vimos', 'jugamos'] },
      { es: 'tus planes para el fin de semana que viene', en: 'your plans for next weekend', tense: 'future', keywords: ['voy a', 'vamos a', 'que viene', 'proximo', 'manana', 'ire', 'iremos'] },
    ],
    targetWords: 90,
    model: 'Vivo con mi madre, mi padre y mi hermano menor. Me llevo muy bien con mi madre porque es paciente, pero a veces discuto con mi hermano porque es muy ruidoso. Mi mejor amiga se llama Chloe. Es divertida y generosa, y siempre me escucha. El sábado pasado fuimos a la costa y comimos pescado en un restaurante. ¡Fue genial! El fin de semana que viene voy a ir al cine con Chloe y después vamos a cenar en casa de mis abuelos. Si hace sol, también iremos al parque. Creo que será muy divertido.',
  },
  {
    id: 'w90-school', kind: '90', title: 'My school', topicId: 'sp-education',
    intro: 'Write a blog post about your school for a Spanish website. Write about 90 words in Spanish. You must write something about each bullet point.',
    bullets: [
      { es: 'tu instituto', en: 'your school', keywords: ['instituto', 'colegio', 'escuela'] },
      { es: 'las asignaturas', en: 'subjects', keywords: ['asignatura', 'matematicas', 'ciencias', 'historia', 'ingles', 'espanol', 'arte', 'informatica'] },
      { es: 'algo que hiciste en el instituto la semana pasada', en: 'something you did at school last week', tense: 'past', keywords: ['pasada', 'ayer', 'hice', 'fui', 'tuve', 'jugue', 'aprendi', 'participe'] },
      { es: 'lo que vas a estudiar en el futuro', en: 'what you are going to study in the future', tense: 'future', keywords: ['voy a', 'futuro', 'universidad', 'estudiare', 'quiero', 'me gustaria', 'bachillerato'] },
    ],
    targetWords: 90,
    model: 'Mi instituto es bastante grande y moderno. Hay un gimnasio nuevo, pero la cantina es pequeña. Mi asignatura favorita es la biología porque es fascinante y la profesora explica muy bien. No me gustan las matemáticas porque son difíciles. La semana pasada hice un experimento en el laboratorio y participé en un concierto del coro. ¡Me encantó! En el futuro voy a estudiar ciencias porque me gustaría ser médica. Si apruebo mis exámenes, iré a la universidad en Londres.',
  },
  {
    id: 'w90-holiday', kind: '90', title: 'Holidays', topicId: 'sp-travel',
    intro: 'Write an email to a Spanish friend about holidays. Write about 90 words in Spanish. You must write something about each bullet point.',
    bullets: [
      { es: 'dónde vas normalmente de vacaciones', en: 'where you usually go on holiday', keywords: ['normalmente', 'suelo', 'siempre', 'vamos', 'voy'] },
      { es: 'tu opinión sobre los hoteles o el camping', en: 'your opinion of hotels or camping', keywords: ['hotel', 'camping', 'acampar', 'tienda'] },
      { es: 'unas vacaciones recientes', en: 'a recent holiday', tense: 'past', keywords: ['pasado', 'fui', 'fuimos', 'visite', 'visitamos', 'me aloje', 'nos alojamos'] },
      { es: 'tus vacaciones ideales', en: 'your ideal holiday', tense: 'conditional', keywords: ['ideal', 'gustaria', 'encantaria', 'iria', 'seria', 'tendria'] },
    ],
    targetWords: 90,
    model: 'Normalmente voy de vacaciones a Cornualles con mi familia. Prefiero los hoteles porque son más cómodos que el camping, aunque son más caros. El verano pasado fuimos a Italia. Nos alojamos en un hotel cerca del mar, visitamos Roma y comimos helado todos los días. Lo mejor fue la comida. ¡Lo pasé bomba! Mis vacaciones ideales serían en Japón con mis amigas. Me encantaría probar la comida típica y visitar los templos. Sería una experiencia inolvidable.',
  },
  {
    id: 'w150-health', kind: '150', title: 'A healthy life', topicId: 'sp-healthy',
    intro: 'A Spanish magazine wants articles about healthy living. Write about 150 words in Spanish. You must write something about both bullet points, and give opinions and reasons.',
    bullets: [
      { es: 'lo que hiciste recientemente para estar en forma', en: 'what you did recently to keep fit', tense: 'past', keywords: ['forma', 'deporte', 'gimnasio', 'corri', 'nade', 'jugue', 'hice', 'pasado'] },
      { es: 'cómo vas a cambiar tu estilo de vida en el futuro', en: 'how you will change your lifestyle in the future', tense: 'future', keywords: ['voy a', 'futuro', 'intentare', 'cambiare', 'comere', 'dejare', 'quiero'] },
    ],
    targetWords: 150,
    model: 'Para mí, llevar una vida sana es muy importante, ya que tenemos mucho estrés con los exámenes. La semana pasada corrí cinco kilómetros en el parque con mi hermana y el sábado jugué un partido de baloncesto. Aunque estaba muy cansada, me sentí genial después. Antes comía demasiados dulces, pero ahora intento comer más fruta y verdura. Sin embargo, todavía me cuesta dormir bien porque uso el móvil hasta muy tarde.\n\nEn el futuro voy a cambiar varias cosas. Primero, dejaré el móvil fuera de mi dormitorio para dormir ocho horas. Además, me gustaría apuntarme a un club de natación, porque es un deporte completo. Si tuviera más tiempo, cocinaría platos sanos para toda mi familia. Creo que es esencial que los jóvenes hagan ejercicio y que no pasen tantas horas delante de las pantallas.',
  },
  {
    id: 'w150-tech', kind: '150', title: 'Technology in my life', topicId: 'sp-media',
    intro: 'Write a blog post about technology. Write about 150 words in Spanish. You must write something about both bullet points, and give opinions and reasons.',
    bullets: [
      { es: 'las ventajas y desventajas de las redes sociales', en: 'the advantages and disadvantages of social media', keywords: ['redes', 'ventaja', 'desventaja', 'peligro', 'acoso', 'util', 'contacto'] },
      { es: 'cómo la tecnología cambiará nuestras vidas', en: 'how technology will change our lives', tense: 'future', keywords: ['futuro', 'cambiara', 'habra', 'podremos', 'sera', 'van a', 'robots', 'inteligencia'] },
    ],
    targetWords: 150,
    model: 'Hoy en día no podría vivir sin mi móvil. Lo uso para hablar con mis amigos, escuchar música y buscar información para los deberes. En mi opinión, la mayor ventaja de las redes sociales es que podemos estar en contacto con gente de todo el mundo. Por ejemplo, el año pasado conocí a una chica de México en un foro de fotografía y ahora somos buenas amigas.\n\nSin embargo, también hay desventajas. Algunos jóvenes pasan demasiado tiempo en línea y el ciberacoso es un problema grave. Una amiga mía lo sufrió y lo pasó fatal.\n\nEn el futuro, creo que la tecnología cambiará nuestras vidas aún más. Habrá coches sin conductor y la inteligencia artificial nos ayudará en el trabajo. Espero que los gobiernos protejan nuestra privacidad, porque si no, será muy peligroso.',
  },
  {
    id: 'w150-festival', kind: '150', title: 'Festivals and celebrations', topicId: 'sp-festivals',
    intro: 'Write an article about festivals for a Spanish school magazine. Write about 150 words in Spanish. You must write something about both bullet points, and give opinions and reasons.',
    bullets: [
      { es: 'una celebración especial que te gustó', en: 'a special celebration you enjoyed', tense: 'past', keywords: ['celebr', 'fiesta', 'cumpleanos', 'navidad', 'boda', 'festival', 'fue', 'celebramos'] },
      { es: 'un festival español que te gustaría visitar', en: 'a Spanish festival you would like to visit', tense: 'conditional', keywords: ['gustaria', 'encantaria', 'tomatina', 'fallas', 'san fermin', 'semana santa', 'feria', 'visitaria', 'iria'] },
    ],
    targetWords: 150,
    model: 'La celebración que más me gustó fue la boda de mi tía el verano pasado. Fue en un castillo antiguo y había más de cien invitados. Primero hubo una ceremonia preciosa en el jardín y luego comimos un banquete enorme. Lo mejor fue el baile: bailé con mis primos hasta la medianoche. Aunque al día siguiente estaba agotada, fue un día inolvidable.\n\nMe encantaría visitar la Tomatina de Buñol, porque parece muy divertida y diferente. Es una batalla de tomates que se celebra cada agosto. Sin embargo, creo que se desperdicia mucha comida, y eso no me parece bien. Si pudiera, también iría a las Fallas de Valencia para ver las figuras gigantes. Espero que algún día pueda viajar a España con mis amigas para vivir estas fiestas.',
  },
];

// ------------------------------------------------------------------ translation into Spanish

export const translationSets: TranslationSet[] = [
  {
    id: 'tr-1', title: 'Family and free time', topicId: 'sp-identity',
    sentences: [
      { en: 'My sister is very funny.', chunks: [['mi hermana'], ['es muy graciosa', 'es muy divertida', 'es muy chistosa']], model: 'Mi hermana es muy graciosa.' },
      { en: 'I get on well with my parents.', chunks: [['me llevo bien'], ['con mis padres']], model: 'Me llevo bien con mis padres.' },
      { en: 'At the weekend I play football with my friends.', chunks: [['el fin de semana', 'los fines de semana'], ['juego al futbol', 'juego futbol'], ['con mis amigos', 'con mis amigas']], model: 'El fin de semana juego al fútbol con mis amigos.' },
      { en: 'Yesterday we went to the cinema.', chunks: [['ayer'], ['fuimos al cine']], model: 'Ayer fuimos al cine.' },
      { en: 'Next year I am going to learn to play the guitar.', chunks: [['el ano que viene', 'el proximo ano'], ['voy a aprender'], ['a tocar la guitarra']], model: 'El año que viene voy a aprender a tocar la guitarra.' },
    ],
  },
  {
    id: 'tr-2', title: 'School and future plans', topicId: 'sp-education',
    sentences: [
      { en: 'I like science because it is interesting.', chunks: [['me gustan las ciencias', 'me gusta la ciencia', 'me gustan las ciencia'], ['porque son interesantes', 'porque es interesante', 'ya que son interesantes', 'ya que es interesante']], model: 'Me gustan las ciencias porque son interesantes.' },
      { en: 'We have to wear a uniform.', chunks: [['tenemos que llevar', 'hay que llevar', 'debemos llevar'], ['un uniforme', 'uniforme']], model: 'Tenemos que llevar uniforme.' },
      { en: 'Last week I passed my maths exam.', chunks: [['la semana pasada'], ['aprobe'], ['mi examen de matematicas', 'el examen de matematicas']], model: 'La semana pasada aprobé mi examen de matemáticas.' },
      { en: 'The teachers are strict but fair.', chunks: [['los profesores', 'las profesoras'], ['son estrictos', 'son estrictas', 'son severos'], ['pero justos', 'pero justas']], model: 'Los profesores son estrictos pero justos.' },
      { en: 'In the future I would like to work abroad.', chunks: [['en el futuro'], ['me gustaria trabajar'], ['en el extranjero']], model: 'En el futuro me gustaría trabajar en el extranjero.' },
    ],
  },
  {
    id: 'tr-3', title: 'Holidays and the environment', topicId: 'sp-travel',
    sentences: [
      { en: 'I usually go to Spain with my family.', chunks: [['normalmente voy', 'suelo ir', 'voy normalmente'], ['a espana'], ['con mi familia']], model: 'Normalmente voy a España con mi familia.' },
      { en: 'Last summer we stayed in a hotel near the beach.', chunks: [['el verano pasado'], ['nos alojamos', 'nos quedamos'], ['en un hotel'], ['cerca de la playa']], model: 'El verano pasado nos alojamos en un hotel cerca de la playa.' },
      { en: 'There is a lot of traffic in my town.', chunks: [['hay mucho trafico'], ['en mi ciudad', 'en mi pueblo']], model: 'Hay mucho tráfico en mi ciudad.' },
      { en: 'We must recycle more.', chunks: [['debemos reciclar', 'tenemos que reciclar', 'hay que reciclar'], ['mas']], model: 'Debemos reciclar más.' },
      { en: 'If I had money, I would travel around the world.', chunks: [['si tuviera dinero'], ['viajaria'], ['por el mundo', 'alrededor del mundo', 'por todo el mundo']], model: 'Si tuviera dinero, viajaría por el mundo.' },
    ],
  },
];

export const SPANISH_SKILLS_SUBJECT = 'spanish';
