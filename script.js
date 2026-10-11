/* =========================================================
   Fra jeger til filosof · skript
   Meny, parallakse, tidslinje, ordliste, quiz og presentasjon.
   All fakta bygger på kapittel 3–8 i læreboken og undervisningspresentasjonene.
   ========================================================= */
(function () {
  'use strict';

  window.__siteReady = true;

  /* ---------- Hjelpere ---------- */
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  var store = {
    get: function (key) { try { return window.localStorage.getItem(key); } catch (e) { return null; } },
    set: function (key, value) { try { window.localStorage.setItem(key, value); } catch (e) { /* ignorer */ } }
  };

  function esc(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function scrollBehavior() { return reduceMotion.matches ? 'auto' : 'smooth'; }

  /* =========================================================
     DATA
     ========================================================= */

  /* Tidslinje. y = omtrentlig årstall brukt til sortering (negativt = f.Kr.).
     src: 'undervisning' betyr at opplysningen kommer fra presentasjonene, ikke boken. */
  var EVENTS = [
    { y: -298000, date: 'Ca. 300 000 år siden', title: 'Homo sapiens oppstår', text: 'Gjennom nesten hele denne lange historien har mennesker levd som jegere og sankere i små grupper.', ch: 3 },
    { y: -13001, date: 'Ca. 15 000 år siden', approx: '≈ 13 000 f.Kr.', title: 'Hunden blir det første husdyret', text: 'Ulver som holdt seg nær mennesker, fikk lett tilgang på mat. Etter hvert avlet menneskene fram hunder til jakt, vakthold og gjeting.', ch: 4 },
    { y: -13000, date: 'Ca. 15 000 år siden', approx: '≈ 13 000 f.Kr.', title: 'Hulemaleriene i Altamira', text: 'Hulemaleriene fra Altamira i Nord-Spania er om lag 15 000 år gamle.', ch: 3, src: 'undervisning' },
    { y: -10000, date: 'Ca. 12 000 år siden', approx: '≈ 10 000 f.Kr.', title: 'De første begynner å drive jordbruk', text: 'Et av de første stedene var den fruktbare halvmåne i Midtøsten. Jordbruk oppsto minst åtte steder uavhengig av hverandre.', ch: 4 },
    { y: -9800, date: 'Ca. 11 800 år siden', approx: '≈ 9800 f.Kr.', title: 'Pionerene i Brunlanes', text: 'En liten gruppe slo seg ned ved Pauler gård nær Larvik. Det er en av de eldste boplassene som er funnet i Norge.', ch: 3 },
    { y: -7500, date: 'Ca. 9500 år siden', approx: '≈ 7500 f.Kr.', title: 'Hustuftene på Tønsnes', text: 'Tuftene ved Tromsø kan være de eldste sporene etter faste bosetninger i Norden.', ch: 3 },
    { y: -7499, date: 'Ca. 7500–5700 f.Kr.', title: 'Çatal Huyuk', text: 'I bosetningen i dagens Tyrkia lå husene tett inntil hverandre uten gater, og inngangen var en luke i taket.', ch: 4 },
    { y: -7000, date: 'Ca. 9000 år siden', approx: '≈ 7000 f.Kr.', title: 'Isen smelter for alvor', text: 'Havet og landet hevet seg, og folk i Norge begynte å utforske innlandet.', ch: 3 },
    { y: -6500, date: '7000-tallet f.Kr.', title: 'Kvinnegraven i Skåne', text: 'Våpnene og knoklene i graven tyder på at kvinnen var storviltjeger.', ch: 3 },
    { y: -6000, date: 'Ca. 8000 år siden', approx: '≈ 6000 f.Kr.', title: 'De eldste sporene i Vistehulen', text: 'Hulen nordvest for Stavanger lå den gang i strandkanten.', ch: 3 },
    { y: -5501, date: 'Fra ca. 5500 f.Kr.', title: 'Samfunn med omfattende jordbruk', text: 'Først nå finnes det tydelige spor etter samfunn der jordbruk er den viktigste levemåten. Overgangen tok altså flere tusen år.', ch: 4 },
    { y: -5500, date: '5000-tallet f.Kr.', title: 'Byer i Mesopotamia', text: 'Det har oppstått flere byer mellom Eufrat og Tigris, og mange av dem utvikler seg til egne stater.', ch: 5 },
    { y: -3500, date: 'Ca. 5500 år siden', approx: '≈ 3500 f.Kr.', title: 'Sivilisasjon mellom Eufrat og Tigris', text: 'Befolkningen har fått mange yrker: håndverkere, handelsmenn, prester, kunstnere og tjenestemenn.', ch: 5, src: 'undervisning' },
    { y: -3200, date: '3000-tallet f.Kr.', title: 'Sumererne utvikler kileskrift', text: 'Tegnene ble trykt i våte leirtavler. De fleste tavlene handler om økonomi: regnskap, skatt og handel.', ch: 5 },
    { y: -3100, date: 'Ca. 3100 f.Kr.', title: 'Egypt samles under en farao', text: 'Øvre og Nedre Egypt blir forent. Farao blir regnet som guden Horus i menneskeskikkelse.', ch: 6 },
    { y: -3001, date: 'Ca. 5000 år siden', approx: '≈ 3000 f.Kr.', title: 'Jordbruket har nådd de fleste områder', text: 'Mennesker dyrker nå planter som fortsatt er viktige i kostholdet vårt: hvete, ris, mais og poteter.', ch: 4 },
    { y: -3000, date: 'Ca. 5000 år siden', approx: '≈ 3000 f.Kr.', title: 'Sivilisasjoner ved Nilen og Indus', text: 'I Indusdalen vokste det fram byer med offentlige bad, som Mohenjo-Daro.', ch: 5, src: 'undervisning' },
    { y: -2350, date: 'Ca. 2350 f.Kr.', title: 'Sargon skaper det første imperiet', text: 'Med byen Akkad som base erobret Sargon flere sumeriske bystater. For første gang hersket én stat over andre stater.', ch: 5 },
    { y: -2300, date: '2300-tallet f.Kr.', title: 'Jordbruket får gjennombrudd i Norge', text: 'Senere helleristninger fra bronsealderen i Skandinavia viser okser og en bonde med plog.', ch: 4 },
    { y: -2100, date: 'Ca. 2100 f.Kr.', title: 'Zigguraten i Ur', text: 'Det store trappetempelet ble bygd under det tredje dynastiet i bystaten Ur.', ch: 5 },
    { y: -2050, date: 'Etter Sargons tid', title: 'Hammurapis lover', text: 'Amorittkongen Hammurapi samlet et enda større rike enn Sargon, med Babylon som hovedstad, og lot 282 lovparagrafer skrive ned. Han hevdet at han hadde fått lovene fra guden Shamasj.', ch: 5 },
    { y: -2000, date: 'Ca. 4000 år siden', approx: '≈ 2000 f.Kr.', title: 'Kongedømmer i Kina', text: 'Konkurrerende kongedømmer, eget skriftspråk og avansert bronseteknologi.', ch: 5, src: 'undervisning' },
    { y: -1501, date: 'Ca. 1500 f.Kr.', title: 'Jegere og sankere presses ut', text: 'Områdene med jegere og sankere er kraftig redusert. De holder hovedsakelig til i utkanter og vanskelig tilgjengelige områder.', ch: 4 },
    { y: -1500, date: 'Ca. 3500 år siden', approx: '≈ 1500 f.Kr.', title: 'Sivilisasjoner i Mellom-Amerika og Peru', text: 'I motsetning til sivilisasjonene i Midtøsten, Kina og Indusdalen var de ikke knyttet til store elver.', ch: 5, src: 'undervisning' },
    { y: -800, date: 'Ca. 800 f.Kr.', title: 'Et forenklet gresk alfabet', text: 'Alfabetet med 20 tegn var lettere å lære. Flere kunne skrive, og tanker kunne lagres og diskuteres.', ch: 8 },
    { y: -750, date: 'Fram til 700-tallet f.Kr.', title: 'Aristokratene styrer polisene', text: 'De rikeste jordeierne ledet forsvaret og betalte for hester, våpen og rustning.', ch: 7 },
    { y: -650, date: '600-tallet f.Kr.', title: 'Jern blir bedre og billigere', text: 'Flere bønder kunne utruste seg selv som soldater og ble mindre avhengige av aristokratene.', ch: 7 },
    { y: -625, date: '625–545 f.Kr.', title: 'Tales fra Milet', text: 'Den første vestlige naturfilosofen mente at alt var laget av vann.', ch: 8 },
    { y: -594, date: '590-årene f.Kr.', title: 'Solons reformer', text: 'Gjelden ble strøket, og borgerne fikk politiske rettigheter etter hvor mye jord de eide.', ch: 7 },
    { y: -570, date: 'Ca. 570–500 f.Kr.', title: 'Pytagoras', text: 'Han brukte tall for å forstå naturen og mente at matematikken har faste sannheter.', ch: 8 },
    { y: -508, date: '508 f.Kr.', title: 'Kleistenes og folkeforsamlingen', text: 'Alle borgere får lik rett til å delta i folkeforsamlingen. Storhetstiden i Aten begynner.', ch: 7 },
    { y: -470, date: 'Ca. 470–399 f.Kr.', title: 'Sokrates', text: 'Han stilte spørsmål til folk i Atens gater og regnes som grunnleggeren av læren om etikk.', ch: 8 },
    { y: -460, date: '460–370 f.Kr.', title: 'Demokrit', text: 'Han mente at alt er bygd opp av små, udelelige atomer.', ch: 8 },
    { y: -447, date: '447–432 f.Kr.', title: 'Partenon bygges', text: 'Tempelet på Akropolis ble reist til ære for gudene etter at det attiske sjøforbundet hadde seiret over perserne.', ch: 7 },
    { y: -440, date: '400-tallet f.Kr.', title: 'Herodot', text: 'Han reiste mellom polisene, stilte seg kritisk til kildene sine og regnes som historiefagets far.', ch: 8 },
    { y: -427, date: '427–347 f.Kr.', title: 'Platon', text: 'Han skrev ned dialogene til Sokrates og mente at filosofene burde styre staten.', ch: 8 },
    { y: -400, date: 'Ca. 400 f.Kr.', title: 'Flere slaver enn frie borgere', text: 'Aten hadde langt flere slaver enn frie borgere. Slavene gjorde mye av arbeidet, så borgerne fikk tid til politikk.', ch: 7 },
    { y: -399, date: '399 f.Kr.', title: 'Sokrates dømmes til døden', text: 'Han ble anklaget for å forderve ungdommen og fornærme gudene.', ch: 8 },
    { y: -338, date: '338 f.Kr.', title: 'Filip av Makedonia erobrer Hellas', text: 'Krigene mellom polisene hadde gjort dem sårbare. Sønnen Aleksander førte erobringene videre.', ch: 8, src: 'undervisning' },
    { y: -323, date: '323 f.Kr.', title: 'Aleksander den store dør', text: 'Riket hans strakte seg fra Indus til Middelhavet. Gresk kultur blandet seg med kunnskap fra øst og ble til hellenismen.', ch: 8 },
    { y: -322, date: '322 f.Kr.', title: 'Det atenske demokratiet tar slutt', text: 'Kildene forteller mest om demokratiet slik det fungerte i Aten fra 508 til 322 f.Kr.', ch: 7 },
    { y: -300, date: '300-tallet f.Kr.', title: 'Euklids «Elementer»', text: 'Boken har betydd så mye for matematikken at den fortsatt regnes blant tidenes viktigste bidrag.', ch: 8 },
    { y: -100, date: 'Ca. 100 f.Kr.', title: 'Biblioteket i Alexandria', text: 'Biblioteket hadde hundretusenvis av manuskripter, og havnen hadde plass til 1200 skip samtidig.', ch: 8 },

    { y: 354, date: '354–430', title: 'Augustin', text: 'Han skrev at et rettferdig samfunn avhenger av sann gudsdyrkelse.', ch: 6 },
    { y: 1000, date: 'Etter år 1000', title: 'Frostatingsloven skrives ned', text: '«Med lov skal landet vårt byggjast og ikkje med ulov øydast.» Samme tanke som hos Hammurapi: Lover binder et rike sammen.', ch: 5 },
    { y: 1400, date: '1400-tallet', title: 'Ny interesse for antikken', text: 'Kunst, kultur og filosofi fra antikken blir studert på nytt.', ch: 8 },
    { y: 1541, date: '1541', title: 'Calvins Genève', text: 'Et råd av prester skal passe på at alle i byen følger kristen moral. Et eksempel på skriftteokrati.', ch: 6 },
    { y: 1676, date: '1676', title: 'Newton og kjempene', text: '«Hvis jeg har sett lenger enn andre, er det fordi jeg har stått på skuldrene til kjemper.»', ch: 8 },
    { y: 1750, date: '1700-tallet', title: 'Linné ordner plantene', text: 'Carl von Linné tok opp igjen tenkemåten til Aristoteles og la grunnlaget for plantelæren.', ch: 8 },
    { y: 1790, date: 'Slutten av 1700-tallet', title: 'Utryddelse blir et begrep', text: 'Ifølge Elisabeth Kolbert fantes ikke engang kategorien utryddelse før dette.', ch: 3 },
    { y: 1814, date: '1814', title: 'Norges grunnlov', text: 'Menn uten eiendom og alle kvinner får ikke stemmerett, men eiendomsløse menn har ytringsfrihet.', ch: 7 },
    { y: 1845, date: '1845–49', title: 'Hungersnøden i Irland', text: 'Potetavlingen slo feil flere år på rad. Én million mennesker døde av sult, og omtrent like mange emigrerte.', ch: 4 },
    { y: 1865, date: '1865', title: 'USA opphever slaveriet', text: 'Grunnloven fra 1789 fremmet frihet og likhet, men godtok slaveri. Først i 1960-årene fikk svarte amerikanere fulle borgerrettigheter.', ch: 7 },
    { y: 1898, date: '1898', title: 'Allmenn stemmerett for menn i Norge', text: 'Også menn uten eiendom får stemme.', ch: 7 },
    { y: 1902, date: '1902', title: 'Hammurapis lovstøtte blir funnet', text: 'Franske arkeologer fant lovene risset inn i en steinstøtte.', ch: 5, src: 'undervisning' },
    { y: 1913, date: '1913', title: 'Stemmerett for kvinner i Norge', text: 'Norske kvinner får stemmerett på lik linje med menn. USA følger i 1920, Storbritannia i 1928 og Sveits i 1971.', ch: 7 },
    { y: 1979, date: '1979', title: 'Revolusjonen i Iran', text: 'Iran blir en republikk som også er et teokrati.', ch: 6 },
    { y: 2004, date: '2004', title: 'Vokterrådet griper inn', text: 'Om lag 2000 kandidater blir stengt ute fra parlamentsvalget i Iran.', ch: 6 },
    { y: 2013, date: '2013', title: 'Den islamske staten', text: 'Gruppen vil «gjenopprette kalifatet» og samle alle muslimer i en religiøs stat.', ch: 6 },
    { y: 2018, date: '2018', title: 'Norge avvikler juryen', text: 'Fram til da avgjorde vanlige borgere skyldspørsmålet i lagmannsretten, litt som i Aten.', ch: 7 }
  ];

  var ERAS = [
    { title: 'Før 10 000 f.Kr.', text: 'Alle mennesker lever som jegere og sankere.', test: function (y) { return y < -10000; } },
    { title: '10 000–3500 f.Kr.', text: 'Jordbruket oppstår og brer seg. I Norge lever folk fortsatt av jakt, fiske og sanking.', test: function (y) { return y >= -10000 && y < -3500; } },
    { title: '3500–800 f.Kr.', text: 'De første sivilisasjonene, skriften og gudekongene.', test: function (y) { return y >= -3500 && y < -800; } },
    { title: '800 f.Kr.–år 0', text: 'Antikken: greske bystater, demokrati og filosofi.', test: function (y) { return y >= -800 && y < 0; } },
    { title: 'Senere ekko', text: 'Hendelser fra senere tid som kapitlene sammenligner med.', test: function (y) { return y >= 0; } }
  ];

  /* Begreper: [begrep, kapittel, forklaring]. Kapittel 0 = historisk tenkning. */
  var TERMS = [
    ['Jeger og sanker', 3, 'Et menneske som lever av jakt, fiske og ville planter, bær, nøtter og røtter.'],
    ['Nomade', 3, 'En som ikke er bofast, men flytter etter maten eller etter beite for dyrene.'],
    ['Eldre steinalder', 3, 'Tiden da alle i vår verdensdel levde som jegere og sankere og laget redskaper av stein.'],
    ['Flint', 3, 'En hard bergart som ble brukt til redskaper og våpen. Den finnes ikke naturlig i Norge, så flint i norske funn forteller om kontakt med andre områder.'],
    ['Megafauna', 3, 'De store pattedyrene, som mammut, kjempehjort og hulebjørn, som levde da mennesket kom til Europa og Asia. De fleste døde ut.'],
    ['Antropocen', 3, '«Menneskets tidsalder». En ny geologisk epoke der mennesket preger hele jordkloden, ifølge stadig flere forskere.'],
    ['Spesialisering', 3, 'At folk blir eksperter på hver sin oppgave. Lav blant jegere og sankere, høy i de første statene.'],

    ['Jordbruksrevolusjonen', 4, 'Overgangen fra å leve av jakt, fiske og sanking til å leve av mat man selv dyrker, og dyr man har alt opp.'],
    ['Domestisering', 4, 'At mennesker tar kontroll over formeringen av planter og dyr, slik at egenskapene deres endres.'],
    ['Den fruktbare halvmåne', 4, 'Et område i Midtøsten der noen av de første sporene etter jordbruk er funnet.'],
    ['Overskudd', 4, 'Mer mat enn man trenger for å overleve. Overskuddet ga rom for andre yrker enn matproduksjon.'],
    ['Arbeidsdeling', 4, 'At folk har ulike oppgaver og yrker. Den økte mye etter overgangen til jordbruk, også mellom kjønnene.'],
    ['Fruktbarhetskultus', 4, 'Religiøse ritualer for å sikre fruktbar jord og god avling. Kvinnefigurer fra jordbrukssamfunn viser framveksten av slik kultus.'],
    ['Revolusjon', 4, 'En rask og grunnleggende endring i samfunnet.'],
    ['Bofast', 4, 'Å bo fast på ett sted, slik bøndene måtte for å passe åkrene og dyrene.'],

    ['Stat', 5, 'Ifølge Max Weber den som har monopol på legitim bruk av makt innenfor et territorium.'],
    ['Suverenitet', 5, 'At en stat er selvstendig, slik at ingen andre formelt kan bestemme over den.'],
    ['Bystat', 5, 'En by med jordbruksområdene rundt som utgjør en egen stat.'],
    ['Tempelkapitalisme', 5, 'Økonomien i de sumeriske bystatene, der prestene kontrollerte handel og produksjon og krevde inn skatt.'],
    ['Ziggurat', 5, 'Et stort, trappeformet tempel midt i de sumeriske byene. Det ble også brukt til å observere himmelen.'],
    ['Lugal', 5, 'Sumerisk kongetittel. Prestene pekte ut lugalen, og tittelen gikk opprinnelig ikke i arv.'],
    ['Imperium', 5, 'En stat som hersker over andre stater. Sargon av Akkad skapte det første rundt 2350 f.Kr.'],
    ['Kileskrift', 5, 'Sumerernes skrift fra 3000-tallet f.Kr. Tegnene ble trykt i våt leire med kileformede pinner.'],
    ['Hieroglyfer', 5, 'Egypternes skrift, som var tett knyttet til religionen deres.'],

    ['Teokrati', 6, 'En styreform der politisk makt begrunnes med religion.'],
    ['Sakralt kongedømme', 6, 'Et teokrati der herskerens makt springer ut av religionen. Herskeren kan selv bli regnet som en gud.'],
    ['Prestestyre (hierokrati)', 6, 'Et teokrati der prestene har den reelle makten.'],
    ['Skriftteokrati', 6, 'Et teokrati der en hellig tekst er øverste lov, som Bibelen i Calvins Genève eller sharia.'],
    ['Farao', 6, 'Tittelen til kongene i oldtidens Egypt. Farao ble regnet som guden Horus i menneskeskikkelse.'],
    ['Sekulær', 6, 'Når religionen er én av mange deler av samfunnet og ikke styrer politikken.'],

    ['Polis', 7, 'En gresk bystat i antikken, med bymur og jordbruksland rundt. Flertall: poliser.'],
    ['Aristokrati', 7, 'Styre av en elite, i Hellas de rikeste jordeierne.'],
    ['Tyrann', 7, 'En leder som tok makten alene, ofte med støtte fra soldatene.'],
    ['Falanks', 7, 'En tett formasjon der soldatene kjempet side om side.'],
    ['Demos', 7, 'Folket, det vil si borgerne som fikk delta i styret.'],
    ['Demokrati', 7, 'Folkestyre. I Aten brukte Perikles ordet om et styre der makten er hos de mange, ikke de få.'],
    ['Direkte demokrati', 7, 'Borgerne stemmer selv over hver sak, slik som i folkeforsamlingen i Aten.'],
    ['Representativt demokrati', 7, 'Borgerne velger representanter som bestemmer på deres vegne, slik som i Norge i dag.'],
    ['Strateg', 7, 'En av de ti høyest rangerte embetsmennene i Aten, valgt blant hærførerne. Strategene hadde ansvar for forsvar og utenrikspolitikk.'],
    ['Ostrakisme', 7, 'En hemmelig, skriftlig avstemning om å vise en borger ut av polisen. Navnet ble skrevet på et potteskår.'],
    ['Oligarki', 7, 'Styre av noen få. Brukes i undervisningen om Sparta.'],

    ['Mythos–logos-overgangen', 8, 'Overgangen fra å forklare verden med myter til å forklare den med fornuft og logikk.'],
    ['Filosofi', 8, 'Gresk for «kjærlighet til visdom». En utforskende måte å tenke på, der man stiller opp teorier og prøver dem.'],
    ['Naturfilosof', 8, 'En tenker som lette etter forklaringer på naturen i naturen selv, som Tales fra Milet.'],
    ['Atom', 8, 'Demokrits idé om at alt er bygd opp av små, udelelige partikler som ikke er synlige for øyet.'],
    ['Sokratisk metode', 8, 'Å stille spørsmål og prøve svarene med logisk analyse for å komme nærmere sannheten.'],
    ['Idélæren', 8, 'Platons teori om at det vi sanser, bare er skygger av en evig og ideell verden.'],
    ['Hellenisme', 8, 'Blandingskulturen som oppsto da gresk kultur og språk spredte seg i Aleksander den stores rike.'],
    ['Historia', 8, 'Gresk for «undersøkelse». Ordet har gitt navn til historiefaget.'],

    ['Brudd og kontinuitet', 0, 'Brudd betyr at noe forandrer seg, kontinuitet at noe forblir det samme. Alle brudd i historien rommer også kontinuitet.'],
    ['Epoke', 0, 'Et avgrenset tidsavsnitt med en spesiell karakter, som steinalderen eller antikken.'],
    ['Årsak og konsekvens', 0, 'Hvorfor noe skjedde, og hva det førte til. Ofte virker flere årsaker sammen.']
  ];

  /* Quiz: riktig svar står alltid først i listen og stokkes ved visning. */
  var QUIZ = [
    { ch: 3, q: 'Hvor ligger de eldste sporene etter mennesker i Norge?', a: ['Ved kysten', 'I fjellet', 'Langs de store elvene i innlandet', 'I skogene på Østlandet'], e: 'Boplassene er fra slutten av istiden. Først for om lag 9000 år siden smeltet isen for alvor, og folk begynte å utforske innlandet.' },
    { ch: 3, q: 'Hvorfor levde jegere og sankere i små grupper?', a: ['De måtte flytte mye etter dyrene, og det er upraktisk i store grupper', 'Det fantes for få mennesker til å lage store grupper', 'Høvdingene forbød store grupper', 'De hadde ikke språk til å samarbeide i store grupper'], e: 'En gruppe som lever av jakt, må være mobil. Gruppene fikk trolig også få barn, fordi det er vanskelig å bære mange små barn over lange strekninger.' },
    { ch: 3, q: 'Hva sier boken om kjønnsrollene blant jegere og sankere?', a: ['Menn jaktet trolig mest storvilt, men også kvinner kunne jakte', 'Bare menn jaktet, og bare kvinner sanket', 'Kvinner jaktet mest, mens menn passet barna', 'Det fantes ingen arbeidsdeling i det hele tatt'], e: 'Kjønnsrollene var mindre skarpe enn i jordbrukssamfunnene. En kvinnegrav i Skåne tyder på at kvinnen var storviltjeger.' },
    { ch: 3, q: 'Hvilke to forklaringer gir boken på at megafaunaen døde ut?', a: ['Klimaendring da istiden tok slutt, og jakt fra mennesker', 'Vulkanutbrudd og sykdom', 'Jordbruk og hogst av skog', 'Konkurranse fra husdyrene'], e: 'Dyrene utenfor Afrika hadde aldri møtt mennesker og hadde ikke lært å frykte dem. Dermed ble de et lett bytte.' },
    { ch: 3, q: 'Hva betyr antropocen?', a: ['Menneskets tidsalder, en geologisk epoke der mennesket preger jordkloden', 'Den eldste delen av steinalderen', 'Læren om menneskets utvikling fra ape', 'Perioden da megafaunaen levde'], e: 'Stadig flere forskere mener vi er inne i en ny geologisk epoke. Det store spørsmålet er når den begynte.' },

    { ch: 4, q: 'Hva er domestisering?', a: ['At mennesker tar kontroll over formeringen av planter og dyr', 'At folk flytter fra land til by', 'At man bytter varer i stedet for å bruke penger', 'At man bygger hus av stein'], e: 'Når bøndene sådde kornene som ga størst avling, endret plantenes egenskaper seg over tid.' },
    { ch: 4, q: 'Hvilket dyr ble det første husdyret?', a: ['Hunden', 'Sauen', 'Kua', 'Hesten'], e: 'Hunden ble temmet for om lag 15 000 år siden. Deretter fulgte sau, geit, gris og ku.' },
    { ch: 4, q: 'Hvilken av disse var en ulempe med jordbruk for den enkelte?', a: ['Mer arbeid og et mer ensidig kosthold', 'Mindre matsikkerhet i gode år', 'Færre mennesker på samme område', 'Mindre kontakt mellom mennesker'], e: 'Bøndene jobbet mer, fikk mer næringsfattig mat og mer sykdom, og levealderen gikk ned.' },
    { ch: 4, q: 'Hvorfor gikk aboriginene i Australia bort fra jordbruket?', a: ['Klimaet var så uforutsigbart at det lønte seg bedre å kunne flytte', 'De manglet kunnskap om dyrking', 'Europeerne forbød jordbruk', 'Det fantes ingen planter som kunne dyrkes'], e: 'Boken kaller det en rasjonell tilpasning til lokale forhold, ikke mangel på evner eller kunnskap.' },
    { ch: 4, q: 'Hvorfor kan det diskuteres om jordbruksrevolusjonen var en revolusjon?', a: ['Endringen var grunnleggende, men den tok flere tusen år', 'Den skjedde bare i Midtøsten', 'Den førte ikke til noen endringer i samfunnet', 'Den skjedde på bare noen få måneder'], e: 'En revolusjon er en rask og grunnleggende endring. Jordbruket oppfyller det ene kravet, men ikke nødvendigvis det andre.' },

    { ch: 5, q: 'Hvordan definerte Max Weber en stat?', a: ['Den som har monopol på legitim bruk av makt innenfor et territorium', 'Et område der alle snakker samme språk', 'En by med mur rundt', 'Et land som styres av en konge'], e: 'Bare staten har rett til å bruke tvang, lage lover og utstede penger innenfor sine grenser.' },
    { ch: 5, q: 'Hva menes med tempelkapitalisme?', a: ['At prestene kontrollerte handel og produksjon og krevde inn skatt', 'At templene ble solgt til de rikeste', 'At kongen eide alle templene', 'At handel var forbudt nær templene'], e: 'Prestenes makt bygde på religionen: De visste hva gudinnen Inanna krevde for å gi god avling.' },
    { ch: 5, q: 'Hvem skapte historiens første imperium, rundt 2350 f.Kr.?', a: ['Sargon av Akkad', 'Hammurapi av Babylon', 'Farao i Egypt', 'Kleistenes i Aten'], e: 'Sargon var opprinnelig høvding for en nomadisk folkegruppe. Han erobret flere sumeriske byer.' },
    { ch: 5, q: 'Hvorfor lot Hammurapi lovene skrive ned?', a: ['For å holde sammen et stort rike med mange folkegrupper, språk og tradisjoner', 'For å selge lovbøker til innbyggerne', 'Fordi folket krevde det i en folkeavstemning', 'For å lære barna å lese'], e: 'Kopier på leirtavler ble sendt rundt i riket, så loven skulle gjelde likt overalt.' },
    { ch: 5, q: 'Hva handler de fleste sumeriske leirtavlene om?', a: ['Økonomi: regnskap, skatt og handel', 'Kjærlighetsdikt', 'Krigshistorie', 'Oppskrifter på mat'], e: 'Skriften var et redskap for å administrere, og den styrket kongemakten.' },

    { ch: 6, q: 'Hva kjennetegner et teokrati?', a: ['Politisk makt begrunnes med religion', 'Folket velger alle lederne', 'Hæren har all makt', 'Staten har ingen religion'], e: 'I et teokrati er politikk og religion blandet sammen.' },
    { ch: 6, q: 'Hvorfor kalles oldtidens Egypt et sakralt kongedømme?', a: ['Farao ble regnet som en levende gud', 'Prestene valgte farao ved loddtrekning', 'Egypt hadde en skrevet grunnlov', 'Farao delte makten med en folkeforsamling'], e: 'Ifølge Osiris-myten var den levende faraoen guden Horus. Hammurapi var derimot bare utvalgt av en gud.' },
    { ch: 6, q: 'Hva er prestestyre, eller hierokrati?', a: ['At prestene har den reelle makten', 'At kongen også er øverste prest', 'At en hellig bok er øverste lov', 'At kirken og kongen samarbeider'], e: 'Eksempler er perioder i Egypt og i de sumeriske bystatene, munkesamfunnet på Athos og delvis Vatikanstaten.' },
    { ch: 6, q: 'Hvorfor kalles Calvins Genève et skriftteokrati?', a: ['Byen ble styrt etter Bibelens normer og regler', 'Calvin ble regnet som en gud', 'Prestene ble valgt av folket', 'Byen hadde ingen skrevne lover'], e: 'Et råd av prester, konsistoriet, skulle sørge for at alle fulgte kristen moral, med strenge straffer.' },
    { ch: 6, q: 'Hvorfor kan Iran kalles både et demokrati og et teokrati?', a: ['Folket velger president og parlament, men den øverste lederen er en religiøs leder som ikke er valgt av folket', 'Iran har to presidenter', 'Alle lover vedtas i folkeavstemninger', 'Kongen og presten bytter på å styre'], e: 'Ayatolla Khamenei har makten over militæret, politiet og de statlige mediene.' },

    { ch: 7, q: 'Hvem kunne være borger i Aten?', a: ['Frie menn over 18 år, født i området og med jord gjennom arv', 'Alle som bodde i Aten', 'Alle voksne, både kvinner og menn', 'Bare medlemmer av aristokratiet'], e: 'Færre enn én av fem innbyggere oppfylte kravene. Kvinner, slaver, innflyttere og unge var utestengt.' },
    { ch: 7, q: 'Hvorfor fikk billigere jern betydning for demokratiet?', a: ['Flere bønder kunne utruste seg selv som soldater og ble mindre avhengige av aristokratene', 'Jern kunne brukes som penger', 'Jernet gjorde det lettere å skrive', 'Aristokratene fikk enda mer makt'], e: 'Soldatene som kjempet side om side, både fikk og tiltvang seg politisk innflytelse.' },
    { ch: 7, q: 'Hvordan ble rådet på 500 satt sammen?', a: ['Ved loddtrekning, 50 borgere fra hvert av de ti områdene, for ett år', 'Ved valg hvert fjerde år', 'Strategene utnevnte medlemmene', 'Bare de rikeste fikk plass'], e: 'Loddtrekning og hyppig utskifting skulle hindre korrupsjon og at de rike fikk for mye makt.' },
    { ch: 7, q: 'Hva var ostrakisme?', a: ['En hemmelig, skriftlig avstemning om å vise en borger ut', 'En militær formasjon', 'Et religiøst offer til gudene', 'Et valg av strateger'], e: 'Ostrakisme var den eneste avstemningen som var hemmelig. Ellers stemte borgerne ved å rekke opp hånden.' },
    { ch: 7, q: 'Hva gjorde Perikles for å utvide demokratiet?', a: ['Han innførte betaling for verv i rådet og juryene', 'Han ga kvinner stemmerett', 'Han avskaffet slaveriet', 'Han innførte partier'], e: 'Dermed kunne også fattige borgere delta uten å tape inntekt.' },

    { ch: 8, q: 'Hva er mythos–logos-overgangen?', a: ['Overgangen fra å forklare verden med myter til å forklare den med fornuft', 'Overgangen fra jakt til jordbruk', 'Overgangen fra bystater til imperier', 'Overgangen fra muntlige til skriftlige myter'], e: 'Noen grekere begynte å lete etter logiske årsaker i naturen selv i stedet for hos gudene.' },
    { ch: 8, q: 'Hva mente Tales fra Milet at alt var laget av?', a: ['Vann', 'Atomer', 'Ild', 'Tall'], e: 'Han tok feil, men han lette etter et prinsipp i naturen og ikke etter en gud. Det var det nye.' },
    { ch: 8, q: 'Hva gikk Sokrates’ metode ut på?', a: ['Å stille spørsmål og prøve svarene med logisk analyse', 'Å skrive ned alt han visste, i bøker', 'Å gjøre eksperimenter i laboratorier', 'Å spørre gudene om råd'], e: 'Han spurte folk i Atens gater: «Hvordan vet du at det du sier, er riktig?»' },
    { ch: 8, q: 'Hvorfor støttet ikke Platon demokratiet?', a: ['Han mente folk flest var for opptatt av egne interesser, og at filosofer burde styre', 'Han mente kongen var en gud', 'Han mente bare kvinner burde stemme', 'Han mente demokratiet var for dyrt'], e: 'Ifølge Platon ser den som ikke undrer seg, bare skygger av den ideelle verdenen.' },
    { ch: 8, q: 'Hva er hellenismen?', a: ['Blandingskulturen som oppsto da gresk kultur spredte seg i Aleksander den stores rike', 'Den greske religionen med Zevs som øverste gud', 'Det atenske demokratiet', 'Læren om at alt er laget av vann'], e: 'Byer som Alexandria fikk akademier og biblioteker, og matematikere som Euklid og Arkimedes arbeidet der.' }
  ];

  /* Lysbilder */
  var SLIDES = [
    { type: 'title', kicker: 'Historie · kapittel 3–8', title: 'Fra jeger til <em>filosof</em>', lede: 'Hvordan små grupper av jegere og sankere ble til bønder, byer og stater, styrt av gudekonger, borgere og etter hvert fornuften.' },
    { type: 'steps', kicker: 'Oversikt', title: 'Den røde tråden', steps: [
      ['3', 'Jakt og sanking', 'Små grupper flytter etter maten.'],
      ['4', 'Jordbruk', 'Overskudd gjør at flere kan bo tett.'],
      ['5', 'Stater', 'Prester, konger, lover og skrift.'],
      ['6', 'Teokrati', 'Makten begrunnes med religion.'],
      ['7', 'Demokrati', 'Borgerne i Aten stemmer selv.'],
      ['8', 'Fornuft', 'Logos i stedet for mythos.']
    ] },
    { type: 'stats', kicker: 'Perspektiv', title: 'Menneskets historie som ett døgn', lede: 'Hvis de om lag 300 000 årene med Homo sapiens var ett døgn:', stats: [
      ['23.02', 'jordbruket begynner'],
      ['23.36', 'kileskrift i Mesopotamia'],
      ['23.48', 'demokrati i Aten']
    ] },
    { type: 'split', kicker: 'Kapittel 3', title: 'Livet som jegere og sankere', list: [
      'De eldste boplassene i Norge ligger ved kysten, som Pauler gård i Brunlanes for om lag 11 800 år siden.',
      'Gruppene var små fordi de måtte flytte mye, og alle måtte kunne mye om alt.',
      'Megafaunaen døde ut, trolig på grunn av både klimaendring og jakt.'
    ], img: 'bilder/altamira-bison.jpg', w: 1024, h: 810, alt: 'Hulemaleri av en bison i rødbrune og svarte farger.', cap: 'Hulemaleri fra Altamira, om lag 15 000 år gammelt', q: 'Når begynte mennesket å prege jordkloden?' },
    { type: 'compare', kicker: 'Kapittel 4', title: 'Jordbruksrevolusjonen', lede: 'For om lag 12 000 år siden begynte mennesker å dyrke mat og holde husdyr.', cols: [
      ['Gevinster', ['Flere kan leve på mindre plass', 'Overskudd og større matsikkerhet', 'Nye yrker, landsbyer og byer']],
      ['Kostnader', ['Mer arbeid og slitasje', 'Ensidig kost og mer sykdom', 'Større forskjeller og mindre likestilling']]
    ], q: 'Var det en revolusjon når overgangen tok flere tusen år?' },
    { type: 'split', kicker: 'Kapittel 5', title: 'De første statene', list: [
      'Stat: monopol på legitim bruk av makt innenfor et territorium (Max Weber).',
      'I Sumer kontrollerte prestene skatt og handel. Det kalles tempelkapitalisme.',
      'Sargon skapte det første imperiet rundt 2350 f.Kr.',
      'Hammurapi holdt riket samlet med 282 skrevne lover. Skriften ble statens redskap.'
    ], img: 'bilder/hammurapi-stele.jpg', w: 567, h: 730, alt: 'Relieff av en stående mann foran en sittende gud.', cap: 'Hammurapi foran solguden Shamasj', q: 'Oppsto staten i kjølvannet av skriften?' },
    { type: 'grid', kicker: 'Kapittel 6', title: 'Teokrati: makt fra gudene', cards: [
      ['Sakralt kongedømme', 'Farao var guden Horus i menneskeskikkelse.'],
      ['Prestestyre', 'Prestene styrer, som i Ur, Uruk og Vatikanstaten.'],
      ['Konge og kirke', 'Karl den store var konge «av Guds nåde».'],
      ['Skriftteokrati', 'En hellig tekst er lov, som i Calvins Genève.']
    ], q: 'Kan Iran være både demokrati og teokrati?' },
    { type: 'split', kicker: 'Kapittel 7', title: 'Demokratiet i polisene', list: [
      'Billigere jern på 600-tallet f.Kr. ga bondesoldatene makt.',
      'Kleistenes ga alle borgere plass i folkeforsamlingen i 508 f.Kr.',
      'Loddtrekning, korte verv og ostrakisme skulle hindre at noen fikk for mye makt.',
      'Perikles innførte betaling for verv, så også fattige kunne delta.'
    ], img: 'bilder/ostraka.jpg', w: 403, h: 768, alt: 'Tre potteskår med greske bokstaver.', cap: 'Potteskår brukt ved ostrakisme' },
    { type: 'compare', kicker: 'Kapittel 7', title: 'Var Aten et demokrati?', cols: [
      ['For', ['Borgerne stemte direkte over lover og krig', 'Loddtrekning hindret at makten samlet seg', 'Betaling gjorde at fattige kunne delta']],
      ['Mot', ['Færre enn én av fem innbyggere var borgere', 'Kvinner, slaver og innflyttere var utestengt', 'Ingen hemmelig avstemning, unntatt ved ostrakisme']]
    ], q: 'Hva var Norge før kvinnene fikk stemmerett i 1913?' },
    { type: 'people', kicker: 'Kapittel 8', title: 'Fra mythos til logos', lede: 'Forklaringer i naturen selv, ikke hos gudene.', people: [
      ['Tales', '625–545 f.Kr.', 'Alt er laget av vann'],
      ['Pytagoras', 'ca. 570–500 f.Kr.', 'Naturen følger matematiske lover'],
      ['Sokrates', 'ca. 470–399 f.Kr.', 'Spør til du kommer til bunns'],
      ['Demokrit', '460–370 f.Kr.', 'Alt består av atomer'],
      ['Platon', '427–347 f.Kr.', 'Det vi sanser, er skygger av ideene'],
      ['Aristoteles', 'elev av Platon', 'Ordnet dyr og planter i grupper']
    ] },
    { type: 'compare', kicker: 'Historisk tenkning', title: 'Brudd og kontinuitet', lede: 'Alle brudd i historien rommer også kontinuitet.', cols: [
      ['Brudd', ['Fra jakt til jordbruk', 'Fra bystat til imperium', 'Fra myter til rasjonelle forklaringer']],
      ['Kontinuitet', ['Jakt, fiske og sanking fortsatte som tilskudd', 'Religion begrunnet makt i tusenvis av år', 'Herodot brukte fortsatt gudene i noen forklaringer']]
    ] },
    { type: 'list', kicker: 'Avslutning', title: 'Store spørsmål å drøfte', list: [
      'Var jordbruksrevolusjonen en felle eller et framskritt?',
      'Hvorfor har så mange herskere begrunnet makten med religion?',
      'Skal vi beundre eller fordømme det atenske demokratiet?',
      'Finnes det grenser for hva vi kan forstå med fornuften?'
    ] }
  ];

  /* =========================================================
     MENY OG FREMDRIFT
     ========================================================= */
  function initNav() {
    var nav = $('.site-nav');
    var toggle = $('.site-nav__toggle');
    var hero = $('#topp');
    var bar = $('.site-nav__progress span');
    var currentEl = $('[data-current]');
    var links = $$('[data-nav]');

    var sections = $$('main section[id], main article[id]').map(function (el) {
      var isChapter = el.tagName === 'ARTICLE';
      var key = isChapter ? 'kapitler' : el.id;
      var link = $('[data-nav="' + key + '"]');
      var label = isChapter ? el.getAttribute('data-label') : (link ? link.textContent : el.id);
      return { el: el, key: key, label: label };
    });

    var lastKey = null;
    var lastLabel = null;
    var ticking = false;

    function update() {
      ticking = false;
      var y = window.scrollY || window.pageYOffset;
      var heroEnd = hero.offsetHeight - nav.offsetHeight;
      nav.classList.toggle('is-over-hero', y < heroEnd);

      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';

      var line = window.innerHeight * 0.35;
      var active = null;
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].el.getBoundingClientRect().top <= line) active = sections[i];
      }
      var key = active ? active.key : null;
      var label = active ? active.label : 'Forsiden';

      if (key !== lastKey) {
        links.forEach(function (a) {
          if (a.getAttribute('data-nav') === key) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
        lastKey = key;
      }
      if (label !== lastLabel) {
        currentEl.textContent = label;
        lastLabel = label;
      }
    }

    function requestUpdate() {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }

    function setOpen(open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    links.forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open') && !nav.contains(e.target)) setOpen(false);
    });

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    update();
  }

  /* =========================================================
     AVSLØRING OG PARALLAKSE
     ========================================================= */
  function initReveal() {
    var els = $$('.reveal');
    if (!('IntersectionObserver' in window) || reduceMotion.matches) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    els.forEach(function (el) { io.observe(el); });
  }

  function initParallax() {
    var hero = $('#topp');
    var layers = $$('.hero__layer');
    var content = $('.hero__content');
    var ticking = false;

    function apply() {
      ticking = false;
      if (reduceMotion.matches) {
        layers.forEach(function (l) { l.style.transform = ''; });
        content.style.transform = '';
        content.style.opacity = '';
        return;
      }
      var y = window.scrollY || window.pageYOffset;
      var h = hero.offsetHeight;
      if (y > h + 100) return;
      layers.forEach(function (l) {
        var depth = parseFloat(l.getAttribute('data-depth')) || 0;
        l.style.transform = 'translate3d(0,' + (y * depth).toFixed(1) + 'px,0)';
      });
      content.style.transform = 'translate3d(0,' + (y * 0.22).toFixed(1) + 'px,0)';
      content.style.opacity = String(Math.max(0, 1 - y / (h * 0.55)));
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(apply); }
    }, { passive: true });
    if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', apply);
    apply();
  }

  /* =========================================================
     TIDSLINJE
     ========================================================= */
  function initTimeline() {
    var root = $('[data-timeline]');
    var filter = $('[data-timeline-filter]');
    var later = $('[data-timeline-later]');
    var count = $('[data-timeline-count]');
    if (!root) return;

    var events = EVENTS.map(function (e, i) {
      return Object.assign({ id: 'hendelse-' + i, later: e.y >= 0 }, e);
    }).sort(function (a, b) { return a.y - b.y; });

    var state = { ch: 'alle', later: false };
    var open = {};

    function eventHtml(e) {
      var isOpen = !!open[e.id];
      var date = esc(e.date) + (e.approx ? ' <span aria-hidden="true">·</span> ' + esc(e.approx) : '');
      var meta = (e.src === 'undervisning' ? 'Kilde: undervisningspresentasjonene. ' : '') +
        '<a href="#kap' + e.ch + '">Les kapittel ' + e.ch + '</a>';
      return '<li class="event' + (e.later ? ' is-later' : '') + (isOpen ? ' is-open' : '') + '">' +
        '<button class="event__btn" type="button" aria-expanded="' + isOpen + '" aria-controls="' + e.id + '">' +
          '<span class="event__date">' + date + '</span>' +
          '<span class="event__title">' + esc(e.title) + '</span>' +
          '<span class="event__side"><span class="event__tag">Kap. ' + e.ch + '</span><span class="event__chev" aria-hidden="true"></span></span>' +
        '</button>' +
        '<div class="event__body" id="' + e.id + '"' + (isOpen ? '' : ' hidden') + '>' +
          '<p>' + esc(e.text) + '</p>' +
          '<p class="event__meta">' + meta + '</p>' +
        '</div>' +
      '</li>';
    }

    function render() {
      var visible = events.filter(function (e) {
        return (state.ch === 'alle' || String(e.ch) === state.ch) && (state.later || !e.later);
      });
      var html = '';
      ERAS.forEach(function (era) {
        var items = visible.filter(function (e) { return era.test(e.y); });
        if (!items.length) return;
        html += '<section class="era"><header class="era__head"><h3>' + esc(era.title) + '</h3><p>' + esc(era.text) + '</p></header>' +
          '<ol class="era__list">' + items.map(eventHtml).join('') + '</ol></section>';
      });
      root.innerHTML = html || '<p class="timeline-empty">Ingen hendelser passer med dette valget.</p>';
      var n = visible.length;
      count.textContent = 'Viser ' + n + (n === 1 ? ' hendelse' : ' hendelser') +
        (state.ch === 'alle' ? '' : ' fra kapittel ' + state.ch) +
        (state.later ? ', inkludert senere hendelser.' : '.');
    }

    root.addEventListener('click', function (e) {
      var btn = e.target.closest('.event__btn');
      if (!btn) return;
      var id = btn.getAttribute('aria-controls');
      var body = document.getElementById(id);
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isOpen));
      body.hidden = isOpen;
      btn.parentElement.classList.toggle('is-open', !isOpen);
      if (isOpen) delete open[id]; else open[id] = true;
    });

    filter.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-ch]');
      if (!btn) return;
      state.ch = btn.getAttribute('data-ch');
      $$('button', filter).forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      render();
    });

    later.addEventListener('change', function () {
      state.later = later.checked;
      render();
    });

    render();
  }

  /* =========================================================
     BEGREPER
     ========================================================= */
  function initGlossary() {
    var root = $('[data-glossary]');
    var search = $('[data-glossary-search]');
    var filter = $('[data-glossary-filter]');
    var practice = $('[data-glossary-practice]');
    var count = $('[data-glossary-count]');
    if (!root) return;

    var sorted = TERMS.slice().sort(function (a, b) { return a[0].localeCompare(b[0], 'nb'); });

    root.innerHTML = sorted.map(function (t, i) {
      var chLabel = t[1] ? 'Kap. ' + t[1] : 'Historisk tenkning';
      return '<div class="term" data-ch="' + t[1] + '" data-term="' + esc(t[0]) + '" tabindex="-1">' +
        '<dt>' + esc(t[0]) + ' <span class="term__ch">' + chLabel + '</span></dt>' +
        '<dd><span class="term__def" id="forklaring-' + i + '">' + esc(t[2]) + '</span>' +
          '<button class="term__reveal" type="button" aria-expanded="false" aria-controls="forklaring-' + i + '">Vis forklaring</button>' +
        '</dd>' +
      '</div>';
    }).join('');

    var items = $$('.term', root);
    var state = { ch: 'alle', q: '' };

    function norm(s) { return s.toLocaleLowerCase('nb').trim(); }

    function apply() {
      var q = norm(state.q);
      var shown = 0;
      items.forEach(function (el, i) {
        var t = sorted[i];
        var chOk = state.ch === 'alle' || String(t[1]) === state.ch;
        var qOk = !q || norm(t[0]).indexOf(q) !== -1 || norm(t[2]).indexOf(q) !== -1;
        el.hidden = !(chOk && qOk);
        if (!el.hidden) shown++;
      });
      if (!shown) {
        count.textContent = 'Ingen begreper passer. Prøv et annet ord eller velg «Alle».';
      } else {
        count.textContent = 'Viser ' + shown + ' av ' + items.length + ' begreper.';
      }
    }

    search.addEventListener('input', function () { state.q = search.value; apply(); });

    filter.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-ch]');
      if (!btn) return;
      state.ch = btn.getAttribute('data-ch');
      $$('button', filter).forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      apply();
    });

    function setRevealed(term, on) {
      term.classList.toggle('is-revealed', on);
      var b = $('.term__reveal', term);
      b.setAttribute('aria-expanded', String(on));
      b.textContent = on ? 'Skjul forklaring' : 'Vis forklaring';
    }

    practice.addEventListener('change', function () {
      root.classList.toggle('is-practice', practice.checked);
      items.forEach(function (el) { setRevealed(el, false); });
    });

    root.addEventListener('click', function (e) {
      var btn = e.target.closest('.term__reveal');
      if (!btn) return;
      var term = btn.closest('.term');
      setRevealed(term, !term.classList.contains('is-revealed'));
    });

    /* Begrepsknapper i kapitlene hopper hit og markerer begrepet */
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[data-term]');
      if (!link) return;
      e.preventDefault();
      var name = link.getAttribute('data-term');
      search.value = name;
      state.q = name;
      state.ch = 'alle';
      $$('button', filter).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-ch') === 'alle')); });
      apply();
      var target = items.filter(function (el) { return el.getAttribute('data-term') === name; })[0];
      if (!target) return;
      if (root.classList.contains('is-practice')) setRevealed(target, true);
      target.scrollIntoView({ behavior: scrollBehavior(), block: 'center' });
      target.focus({ preventScroll: true });
      target.classList.add('is-flash');
      window.setTimeout(function () { target.classList.remove('is-flash'); }, 1800);
    });

    apply();
  }

  /* =========================================================
     QUIZ
     ========================================================= */
  function initQuiz() {
    var root = $('[data-quiz]');
    if (!root) return;

    var CH_NAMES = { 3: 'Jegere og sankere', 4: 'Jordbruksrevolusjonen', 5: 'De første statene', 6: 'Teokrati', 7: 'Demokratiet i polisene', 8: 'Fra myter til fornuft' };
    var state = { ch: 'alle', pool: [], i: 0, answered: false, score: 0, missed: [] };

    function chLabel(ch) { return ch === 'alle' ? 'Alle kapitler' : 'Kapittel ' + ch + ': ' + CH_NAMES[ch]; }
    function bestKey(ch) { return 'fjtf-quiz-beste-' + ch; }

    function bestText(ch) {
      var v = store.get(bestKey(ch));
      return v ? 'Ditt beste resultat her: ' + v + ' riktige.' : '';
    }

    function renderSetup() {
      var chs = ['alle', '3', '4', '5', '6', '7', '8'];
      root.innerHTML =
        '<h3>Velg kapittel</h3>' +
        '<p class="quiz__intro">Svar på ett spørsmål om gangen. Du får vite med en gang om svaret er riktig, og hvorfor.</p>' +
        '<div class="segmented" role="group" aria-label="Velg kapittel for quizen">' +
          chs.map(function (c) {
            return '<button type="button" data-quiz-ch="' + c + '" aria-pressed="' + (state.ch === c) + '">' + (c === 'alle' ? 'Alle kapitler' : 'Kap. ' + c) + '</button>';
          }).join('') +
        '</div>' +
        '<div class="quiz__actions"><button class="btn btn--accent" type="button" data-quiz-start>Start quizen</button></div>' +
        '<p class="quiz__best" data-quiz-best>' + esc(bestText(state.ch)) + '</p>';
    }

    function start() {
      var list = state.ch === 'alle' ? shuffle(QUIZ).slice(0, 10) : shuffle(QUIZ.filter(function (q) { return String(q.ch) === state.ch; }));
      state.pool = list.map(function (q) {
        var opts = shuffle(q.a.map(function (text, idx) { return { text: text, right: idx === 0 }; }));
        return { ch: q.ch, q: q.q, e: q.e, opts: opts };
      });
      state.i = 0;
      state.score = 0;
      state.missed = [];
      renderQuestion();
    }

    function keepInView() {
      var top = root.getBoundingClientRect().top;
      if (top < 70 || top > window.innerHeight * 0.6) {
        var y = top + (window.scrollY || window.pageYOffset) - 90;
        window.scrollTo({ top: y, behavior: scrollBehavior() });
      }
    }

    function renderQuestion() {
      var item = state.pool[state.i];
      var n = state.pool.length;
      state.answered = false;
      root.innerHTML =
        '<div class="quiz__meta"><span>Spørsmål ' + (state.i + 1) + ' av ' + n + '</span><span>' + esc(chLabel(state.ch)) + '</span></div>' +
        '<div class="quiz__bar" aria-hidden="true"><span style="width:' + (state.i / n * 100) + '%"></span></div>' +
        '<form data-quiz-form novalidate>' +
          '<fieldset>' +
            '<legend tabindex="-1">' + esc(item.q) + '</legend>' +
            item.opts.map(function (o, k) {
              return '<label class="option"><input type="radio" name="svar" value="' + k + '"><span class="option__text">' + esc(o.text) + '</span></label>';
            }).join('') +
          '</fieldset>' +
          '<div data-quiz-feedback aria-live="polite"></div>' +
          '<div class="quiz__actions"><button class="btn btn--accent" type="submit" data-quiz-submit disabled>Sjekk svaret</button>' +
          '<button class="btn btn--outline" type="button" data-quiz-quit>Avslutt</button></div>' +
        '</form>';
      var legend = $('legend', root);
      legend.focus({ preventScroll: true });
    }

    function check(form) {
      var item = state.pool[state.i];
      var chosen = form.querySelector('input[name="svar"]:checked');
      if (!chosen) return;
      var k = Number(chosen.value);
      var right = item.opts[k].right;
      state.answered = true;
      if (right) state.score++;
      else state.missed.push(item);

      $$('.option', form).forEach(function (label, idx) {
        var input = $('input', label);
        input.disabled = true;
        label.classList.add('is-locked');
        if (item.opts[idx].right) {
          label.classList.add('is-correct');
          label.insertAdjacentHTML('beforeend', '<span class="option__badge">Riktig svar</span>');
        } else if (idx === k) {
          label.classList.add('is-wrong');
          label.insertAdjacentHTML('beforeend', '<span class="option__badge">Ditt svar</span>');
        }
      });

      var fb = $('[data-quiz-feedback]', form);
      fb.className = 'quiz__feedback ' + (right ? 'is-right' : 'is-wrong');
      fb.innerHTML = '<strong>' + (right ? 'Riktig.' : 'Ikke helt.') + '</strong><p>' + esc(item.e) + '</p>';

      var btn = $('[data-quiz-submit]', form);
      btn.textContent = state.i < state.pool.length - 1 ? 'Neste spørsmål' : 'Se resultatet';
      btn.disabled = false;
      btn.focus({ preventScroll: true });
      $('.quiz__bar span', root).style.width = ((state.i + 1) / state.pool.length * 100) + '%';
    }

    function renderResult() {
      var n = state.pool.length;
      var ratio = state.score / n;
      var msg = ratio >= 0.9 ? 'Svært bra. Du har god oversikt over stoffet.'
        : ratio >= 0.6 ? 'Bra. Les forklaringene på det du bommet på, og prøv igjen.'
        : 'Les kapitlene en gang til, og prøv igjen. Forklaringene under viser hva du bør se på.';

      var prev = store.get(bestKey(state.ch));
      var prevRatio = prev ? Number(prev.split('/')[0]) / Number(prev.split('/')[1]) : -1;
      if (ratio > prevRatio) store.set(bestKey(state.ch), state.score + '/' + n);

      root.innerHTML =
        '<p class="kicker">' + esc(chLabel(state.ch)) + '</p>' +
        '<h3 tabindex="-1" data-quiz-result>Resultat</h3>' +
        '<p class="quiz__score">' + state.score + ' av ' + n + '</p>' +
        '<p>' + msg + '</p>' +
        (state.missed.length ?
          '<h4 class="label">Dette bommet du på</h4><ul class="quiz__review">' +
          state.missed.map(function (m) {
            var right = m.opts.filter(function (o) { return o.right; })[0].text;
            return '<li><strong>' + esc(m.q) + '</strong><span>Riktig svar: ' + esc(right) + '. ' + esc(m.e) + '</span></li>';
          }).join('') + '</ul>' : '') +
        '<div class="quiz__actions"><button class="btn btn--accent" type="button" data-quiz-again>Prøv igjen</button>' +
        '<button class="btn btn--outline" type="button" data-quiz-setup>Velg et annet kapittel</button></div>';
      $('[data-quiz-result]', root).focus({ preventScroll: true });
      keepInView();
    }

    root.addEventListener('click', function (e) {
      var chBtn = e.target.closest('[data-quiz-ch]');
      if (chBtn) {
        state.ch = chBtn.getAttribute('data-quiz-ch');
        $$('[data-quiz-ch]', root).forEach(function (b) { b.setAttribute('aria-pressed', String(b === chBtn)); });
        $('[data-quiz-best]', root).textContent = bestText(state.ch);
        return;
      }
      if (e.target.closest('[data-quiz-start]') || e.target.closest('[data-quiz-again]')) { start(); keepInView(); return; }
      if (e.target.closest('[data-quiz-setup]') || e.target.closest('[data-quiz-quit]')) { renderSetup(); $('[data-quiz-start]', root).focus({ preventScroll: true }); return; }
    });

    root.addEventListener('change', function (e) {
      if (e.target.name === 'svar' && !state.answered) $('[data-quiz-submit]', root).disabled = false;
    });

    root.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!state.answered) { check(e.target); return; }
      if (state.i < state.pool.length - 1) { state.i++; renderQuestion(); keepInView(); }
      else renderResult();
    });

    renderSetup();
  }

  /* =========================================================
     PRESENTASJON
     ========================================================= */
  function slideHtml(s) {
    var head = '<p class="slide__kicker">' + esc(s.kicker) + '</p><h3 class="slide__title">' + s.title + '</h3>';
    var lede = s.lede ? '<p class="slide__lede">' + esc(s.lede) + '</p>' : '';
    var q = s.q ? '<p class="slide__q">' + esc(s.q) + '</p>' : '';
    var list = function (items) { return '<ul class="slide__list">' + items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>'; };

    switch (s.type) {
      case 'title':
        return '<div class="slide slide--title">' + head + '<div class="slide__rule" aria-hidden="true"></div>' + lede + '</div>';
      case 'steps':
        return '<div class="slide">' + head + '<ol class="slide__steps">' + s.steps.map(function (st) {
          return '<li><b><span>' + esc(st[0]) + '</span>' + esc(st[1]) + '</b><p>' + esc(st[2]) + '</p></li>';
        }).join('') + '</ol></div>';
      case 'stats':
        return '<div class="slide">' + head + lede + '<div class="slide__stats">' + s.stats.map(function (st) {
          return '<div><strong>' + esc(st[0]) + '</strong><span>' + esc(st[1]) + '</span></div>';
        }).join('') + '</div></div>';
      case 'split':
        return '<div class="slide"><div class="slide__split"><div>' + head + list(s.list) + q + '</div>' +
          '<figure><img src="' + s.img + '" width="' + s.w + '" height="' + s.h + '" alt="' + esc(s.alt) + '"><figcaption>' + esc(s.cap) + '</figcaption></figure></div></div>';
      case 'compare':
        return '<div class="slide">' + head + lede + '<div class="slide__compare">' + s.cols.map(function (c) {
          return '<div><h4>' + esc(c[0]) + '</h4><ul>' + c[1].map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>';
        }).join('') + '</div>' + q + '</div>';
      case 'grid':
        return '<div class="slide">' + head + '<div class="slide__grid">' + s.cards.map(function (c) {
          return '<div><h4>' + esc(c[0]) + '</h4><p>' + esc(c[1]) + '</p></div>';
        }).join('') + '</div>' + q + '</div>';
      case 'people':
        return '<div class="slide">' + head + lede + '<ul class="slide__people">' + s.people.map(function (p) {
          return '<li><b>' + esc(p[0]) + '<small>' + esc(p[1]) + '</small></b><span>' + esc(p[2]) + '</span></li>';
        }).join('') + '</ul></div>';
      default:
        return '<div class="slide">' + head + list(s.list) + '</div>';
    }
  }

  function initDeck() {
    var deck = $('[data-deck]');
    var stage = $('[data-deck-stage]');
    var bar = $('[data-deck-bar]');
    var counter = $('[data-deck-count]');
    var prev = $('[data-deck-prev]');
    var next = $('[data-deck-next]');
    var full = $('[data-deck-full]');
    var close = $('[data-deck-close]');
    var index = $('[data-deck-index]');
    var n = SLIDES.length;
    var current = 0;
    var lastFocus = null;

    function plain(html) { var d = document.createElement('div'); d.innerHTML = html; return d.textContent; }

    if (index) {
      index.innerHTML = SLIDES.map(function (s, i) {
        return '<li><button type="button" data-open-slides="' + i + '"><span>' + (i + 1 < 10 ? '0' : '') + (i + 1) + '</span>' + esc(plain(s.title)) + '</button></li>';
      }).join('');
    }

    function go(i, dir) {
      current = Math.max(0, Math.min(n - 1, i));
      stage.innerHTML = slideHtml(SLIDES[current]);
      if (dir < 0) stage.firstChild.classList.add('is-back');
      stage.scrollTop = 0;
      bar.style.width = ((current + 1) / n * 100) + '%';
      counter.innerHTML = (current + 1) + ' / ' + n + '<span class="visually-hidden">: ' + esc(plain(SLIDES[current].title)) + '</span>';
      prev.disabled = current === 0;
      next.disabled = current === n - 1;
    }

    function openDeck(i) {
      lastFocus = document.activeElement;
      deck.hidden = false;
      document.body.style.overflow = 'hidden';
      go(i, 1);
      (current === n - 1 ? prev : next).focus();
    }

    function closeDeck() {
      if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen();
      deck.hidden = true;
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    function toggleFull() {
      if (!document.fullscreenEnabled) return;
      if (document.fullscreenElement) document.exitFullscreen();
      else if (deck.requestFullscreen) deck.requestFullscreen();
    }

    if (!document.fullscreenEnabled) full.hidden = true;
    document.addEventListener('fullscreenchange', function () {
      full.setAttribute('aria-label', document.fullscreenElement ? 'Avslutt fullskjerm' : 'Fullskjerm');
    });

    document.addEventListener('click', function (e) {
      var opener = e.target.closest('[data-open-slides]');
      if (opener) { openDeck(Number(opener.getAttribute('data-open-slides')) || 0); }
    });

    prev.addEventListener('click', function () { go(current - 1, -1); if (prev.disabled) next.focus(); });
    next.addEventListener('click', function () { go(current + 1, 1); if (next.disabled) prev.focus(); });
    full.addEventListener('click', toggleFull);
    close.addEventListener('click', closeDeck);

    document.addEventListener('keydown', function (e) {
      if (deck.hidden) return;
      var onButton = e.target.tagName === 'BUTTON';
      switch (e.key) {
        case 'ArrowRight': case 'PageDown':
          e.preventDefault(); go(current + 1, 1); break;
        case ' ':
          if (onButton) return;
          e.preventDefault(); go(current + 1, 1); break;
        case 'ArrowLeft': case 'PageUp':
          e.preventDefault(); go(current - 1, -1); break;
        case 'Home':
          e.preventDefault(); go(0, -1); break;
        case 'End':
          e.preventDefault(); go(n - 1, 1); break;
        case 'Escape':
          e.preventDefault(); closeDeck(); break;
        case 'f': case 'F':
          if (e.ctrlKey || e.metaKey || e.altKey) return;
          e.preventDefault(); toggleFull(); break;
        case 'Tab': {
          var focusables = $$('button:not([disabled]):not([hidden]), a[href]', deck);
          if (!focusables.length) return;
          var first = focusables[0];
          var last = focusables[focusables.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
          else if (!deck.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
          break;
        }
      }
    });

    var touch = null;
    stage.addEventListener('touchstart', function (e) {
      var t = e.changedTouches[0];
      touch = { x: t.clientX, y: t.clientY };
    }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      if (!touch) return;
      var t = e.changedTouches[0];
      var dx = t.clientX - touch.x;
      var dy = t.clientY - touch.y;
      touch = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) {
        if (dx < 0) go(current + 1, 1); else go(current - 1, -1);
      }
    }, { passive: true });
  }

  /* ---------- Start ---------- */
  initNav();
  initReveal();
  initParallax();
  initTimeline();
  initGlossary();
  initQuiz();
  initDeck();
})();
