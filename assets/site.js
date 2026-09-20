/* ============================================================
   ARC Trading — shared behaviour for every page
   ============================================================ */
(function(){
  'use strict';
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function(s,c){return (c||document).querySelector(s);};
  var $$ = function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s));};
  var ARROW = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  /* ============================================================
     catalogue — names, order and links kept as on the live site
     ============================================================ */
  var LANG = (document.documentElement.lang || 'en').toLowerCase() === 'tr' ? 'tr' : 'en';
  var BASE = document.documentElement.getAttribute('data-base') || '';

  var UI = {
    en:{ more:'More details', allTitle:'All 25 positions',
         allSub:'Long products, semi-finished, ferroalloys, chemicals, raw materials and gases',
         allLink:'Open the catalogue', slide:'Slide ',
         copied:'Copied', fill:'Please fill in all fields', sent:'Message sent',
         thanks:'Thank you — our specialist will contact you shortly', send:'Send message',
         enquiry:'Enquiry: ', fields:'Volume:\nGrade or standard:\nDestination:\nDelivery terms:',
         vol:'Production volume', spec:'Specification', app:'Application',
         askT:'Specification on request',
         askB:'This position is supplied to the buyer\u2019s specification. Send us the grade, standard, size and volume you need and we will confirm what the mills in the network can produce.',
         askC:'Request the specification' },
    tr:{ more:'Daha fazla detay', allTitle:'25 kalemin tamamı',
         allSub:'Uzun ürünler, yarı mamuller, ferroalaşımlar, kimyasallar, hammaddeler ve gazlar',
         allLink:'Kataloğu aç', slide:'Slayt ',
         copied:'Kopyalandı', fill:'Lütfen tüm alanları doldurun', sent:'Mesaj gönderildi',
         thanks:'Teşekkürler — uzmanımız kısa süre içinde sizinle iletişime geçecektir', send:'Mesaj gönder',
         enquiry:'Talep: ', fields:'Miktar:\nKalite veya standart:\nVarış noktası:\nTeslim koşulu:',
         vol:'Üretim hacmi', spec:'Spesifikasyon', app:'Kullanım alanları',
         askT:'Spesifikasyon talep üzerine',
         askB:'Bu kalem alıcının spesifikasyonuna göre tedarik edilir. İhtiyacınız olan kaliteyi, standardı, ölçüyü ve miktarı iletin; ağdaki fabrikaların neyi üretebileceğini teyit edelim.',
         askC:'Spesifikasyon isteyin' }
  }[LANG];

  var GLABEL_TR = { all:'Tüm ürünler', long:'Uzun ürünler', semi:'Yarı mamuller',
                    ferro:'Ferroalaşımlar', chem:'Kimyasallar',
                    raw:'Hammadde ve cüruf', gas:'Endüstriyel gazlar' };

  var GROUPS = [
    ['all','All products'],
    ['long','Long products'],
    ['semi','Semi-finished'],
    ['ferro','Ferroalloys'],
    ['chem','Chemicals'],
    ['raw','Raw materials & slag'],
    ['gas','Industrial gases']
  ];
  var PRODUCTS = [
    ['REBAR','u1','long'],
    ['WIRE ROD','u2','long'],
    ['HRS PLATE','u3','long'],
    ['STRUCTURAL CHANNEL','u4','long'],
    ['STEEL BEAM','u5','long'],
    ['STEEL ANGLE','u6','long'],
    ['STEEL RODS','u7','long'],
    ['STEEL MINE STAND','u8','long'],
    ['PIG IRON','u10','semi'],
    ['STEEL SLABS','u11','semi'],
    ['SQUARE STEEL BILLETS','u12','semi'],
    ['FERROSILICON','u13','ferro'],
    ['FERROSILICON MANGANESE','u14','ferro'],
    ['COKE PRODUCTS','u15','chem'],
    ['AMMONIUM SULFATE','u16','chem'],
    ['IRON ORE FINES','u17','raw'],
    ['COAL TAR','u18','chem'],
    ['CRUDE COAL BENZENE','u19','chem'],
    ['FLUXIC LIMESTONE | RUBBLE','u20','raw'],
    ['GRANULATED SLAG | DUMP SLAG','u22','raw'],
    ['STEELMAKING CRUSHED STONE','u23','raw'],
    ['QUICKLIME LUMPY','u24','raw'],
    ['CONVERTER SLAG','u25','raw'],
    ['Hot-rolled steel unsymmetrical bulb section for shipbuilding','u9','long'],
    ['ARGON LIQUID/GASEOUS | OXYGEN LIQUID/GASEOUS NITROGEN LIQUID | KRYPTONOXENONE MIXTURE | NEON-HELIUM MIXTURE','u21','gas']
  ];
  /* ============================================================
     product reference — what each position is, the parameters it is
     normally specified by, and where it ends up. Generic trade and
     metallurgy practice; actual grades and sizes are confirmed per
     enquiry, so nothing here is presented as stock on hand.
     ============================================================ */
  var INFO = {
  u1:{d:'Hot-rolled reinforcing bar for concrete. Ribbed surface so the bar keys into the concrete and transfers load through the bond rather than friction.',
      s:['Nominal diameter','Strength class and steel grade','Bar length, or coil for small diameters','Rib pattern and relative rib area','Weldability and bend behaviour','Bundle weight and tagging'],
      u:['Reinforced concrete frames and cores','Foundations, rafts and piling','Slabs, bridge decks and retaining walls','Precast and prestressed elements']},
  u2:{d:'Hot-rolled steel in coil, produced as feedstock for drawing and cold forming rather than for use as delivered.',
      s:['Coil diameter and steel grade','Carbon range and residual limits','Coil weight, inner and outer diameter','Surface and scale condition','Dimensional tolerance and ovality','Decarburisation depth where it matters'],
      u:['Wire drawing','Fasteners, nails and screws','Welding wire and electrodes','Mesh, rope and spring wire']},
  u3:{d:'Hot-rolled steel plate — flat product supplied cut to size, the base material for anything fabricated from sheet steel thicker than strip.',
      s:['Steel grade and delivery condition','Thickness, width and length','Flatness and edge condition (mill or trimmed)','Surface quality','Impact test temperature where required','Ultrasonic testing where required'],
      u:['Shipbuilding and offshore structures','Pressure vessels, tanks and silos','Structural fabrication and bridges','Heavy machinery and earthmoving equipment']},
  u4:{d:'Hot-rolled U-section. Stiff in one axis and easy to bolt or weld along the web, which makes it the default for secondary structure.',
      s:['Profile number or section size','Steel grade','Length','Web and flange thickness tolerance','Straightness and twist'],
      u:['Purlins, girts and secondary framing','Machine bases and frames','Vehicle and trailer chassis','Support and bracing structures']},
  u5:{d:'Hot-rolled I- and H-sections. The primary load-carrying member in framed structures, sized by span and load rather than by preference.',
      s:['Profile designation and section depth','Steel grade','Length','Weight per metre','Flange and web tolerances','Camber and straightness'],
      u:['Building frames and industrial halls','Bridges and viaducts','Crane runway beams','Heavy equipment platforms']},
  u6:{d:'Hot-rolled L-section, equal or unequal leg. The cheapest way to get a stiff corner into a structure.',
      s:['Leg dimensions and thickness','Steel grade','Length','Tolerance class','Straightness'],
      u:['Trusses and lattice towers','Brackets, cleats and connections','Frames, racking and shelving','Edge protection and bracing']},
  u7:{d:'Hot-rolled bar in round, square and hexagonal section, supplied as stock for machining, forging and fixing.',
      s:['Cross-section and dimension','Steel grade','Delivery condition (as-rolled, annealed, normalised)','Tolerance class','Straightness','Cut length or random length'],
      u:['Machined shafts, pins and bushings','Forging and upsetting stock','Fasteners and anchor bolts','General engineering fabrication']},
  u8:{d:'Rolled steel props and arch segments for underground support, designed to yield in a controlled way rather than fail when the roof loads them.',
      s:['Section profile and weight per metre','Steel grade and yield strength','Element length','Rated working load','Coupling and clamp type'],
      u:['Roadway and gate-road support in coal mines','Ore mine development headings','Temporary support during driving']},
  u9:{d:'Hot-rolled unsymmetrical bulb section — a flat with a thickened bulb along one edge, which stiffens a plate without the weight of a welded-on angle.',
      s:['Profile number','Shipbuilding steel grade','Length','Dimensional tolerance','Classification society approval where required'],
      u:['Hull stiffeners and longitudinals','Deck and bulkhead framing','Barge and inland vessel construction']},
  u10:{d:'Crude iron from the blast furnace, cast into ingots. High carbon and not usable as-is — it is a charge material, not a product.',
      s:['Silicon and manganese content','Sulphur and phosphorus limits','Carbon content','Ingot weight and size','Chemical class (foundry or steelmaking)'],
      u:['Foundry charge for grey and ductile iron','Converter and electric-arc furnace charge','Ductile iron and cast components']},
  u11:{d:'Continuously cast semi-finished flat product. Slabs exist to be re-rolled; their value is in internal soundness, not appearance.',
      s:['Steel grade','Thickness, width and length','Casting route and internal quality','Surface condition and scarfing','Weight per piece'],
      u:['Re-rolling to hot-rolled plate','Hot strip mill feedstock','Coil and sheet production']},
  u12:{d:'Continuously cast square semi-finished long product — the feedstock every long-product rolling mill runs on.',
      s:['Section size','Steel grade and carbon range','Length','Casting route','Internal soundness and corner quality'],
      u:['Re-rolling to rebar and wire rod','Re-rolling to sections and bar','Forging and seamless tube stock']},
  u13:{d:'Iron-silicon alloy used to remove dissolved oxygen from liquid steel and to carry silicon into the bath. Sold by silicon content and size fraction.',
      s:['Silicon content (typically 65% or 75% grades)','Aluminium, carbon, phosphorus and sulphur limits','Size fraction','Packing — big bags, drums or bulk'],
      u:['Deoxidation in steelmaking','Silicon alloying','Inoculation in ductile iron','Ferroalloy and welding consumable production']},
  u14:{d:'Manganese-silicon alloy. Deoxidises and alloys in one addition, which is why it is the highest-volume ferroalloy in steelmaking.',
      s:['Manganese and silicon content','Carbon, phosphorus and sulphur limits','Size fraction','Packing — big bags or bulk'],
      u:['Combined deoxidation and manganese alloying','Carbon and low-alloy steel production','Feedstock for refined ferromanganese']},
  u15:{d:'Metallurgical coke and breeze. Fuel, reductant and the structural support that holds the blast furnace burden open — the last of those is why quality matters so much.',
      s:['Ash, sulphur, moisture and volatile matter','Size fraction','Mechanical strength (drum indices)','CSR and CRI where specified','Fixed carbon'],
      u:['Blast furnace fuel and reductant','Foundry cupola melting','Ferroalloy and calcium carbide production','Sintering fuel (breeze)']},
  u16:{d:'Crystalline (NH₄)₂SO₄ recovered from coke-oven gas. A by-product of coke chemistry that happens to be a good nitrogen and sulphur fertilizer.',
      s:['Nitrogen content','Sulphur content','Moisture and free acid','Crystal size distribution','Packing — bulk, big bags or 50 kg bags'],
      u:['Nitrogen-sulphur fertilizer, straight or blended','Feedstock for compound fertilizer','Industrial and technical applications']},
  u17:{d:'Fine iron ore for agglomeration. Too fine to charge directly into a blast furnace, so it is sintered or pelletised first.',
      s:['Iron content','Silica, alumina, phosphorus and sulphur','Moisture','Size distribution','Loss on ignition'],
      u:['Sinter plant feed','Pelletising feed','Blast furnace burden preparation']},
  u18:{d:'Viscous by-product of coal carbonisation and the starting point for a long chain of carbon chemistry.',
      s:['Density and viscosity','Water and ash content','Distillation fractions','Naphthalene content','Quinoline-insoluble content'],
      u:['Pitch for graphite and aluminium electrodes','Carbon black feedstock','Creosote and wood preservatives','Chemical intermediates']},
  u19:{d:'Light oil recovered from coke-oven gas, containing benzene with toluene and xylene. Refined further before end use.',
      s:['Benzene content','Density','Distillation range','Sulphur and non-aromatic content','Water content'],
      u:['Feedstock for refined benzene, toluene and xylene','Cyclohexane and downstream polymer production','Solvents and chemical intermediates']},
  u20:{d:'Limestone sized for metallurgical use. Its job is to take silica and alumina out of the melt and into the slag.',
      s:['CaO content','Silica and magnesia content','Size fraction','Moisture','Loss on ignition'],
      u:['Blast furnace and converter flux','Lime and quicklime production','Sinter plant feed','Construction aggregate (rubble)']},
  u21:{d:'Industrial gases from air separation — argon, oxygen and nitrogen in liquid or gaseous form, plus the rare-gas mixtures recovered alongside them.',
      s:['Purity and impurity limits','Phase — liquid or gaseous','Delivery form — tanker, cylinder bundle or on-site','Pressure and fill volume','Analysis certificate'],
      u:['Shielding gas for welding and cutting','Oxygen for steelmaking and cutting','Nitrogen for inerting, purging and cooling','Krypton-xenon for lighting and insulating glazing','Neon-helium for lasers and electronics']},
  u22:{d:'Blast furnace slag, either water-quenched into a glassy granulate or aged from the dump. The two behave completely differently and are not interchangeable.',
      s:['Glass content and basicity (granulated)','Chemical composition','Moisture','Size fraction','Grindability where used in cement'],
      u:['Ground granulated slag as clinker replacement','Road base and sub-base','Concrete and asphalt aggregate','Fill and embankment material']},
  u23:{d:'Crushed steelmaking slag graded as construction aggregate. Denser and harder than most natural stone, which is what makes it useful.',
      s:['Fraction and grading','Compressive strength','Frost resistance','Volumetric stability','Chemical composition'],
      u:['Road construction base layers','Railway ballast','Concrete and asphalt aggregate','Ground stabilisation']},
  u24:{d:'Lump quicklime (CaO) from calcined limestone. Sold on reactivity as much as on chemistry, because slow lime is of little use in a converter.',
      s:['Available CaO','Reactivity (slaking behaviour)','Size fraction','Magnesia content','Loss on ignition and residual CO₂'],
      u:['Slag former in converter and electric-arc steelmaking','Water and effluent treatment','Construction and soil stabilisation','Chemical and pulp processing']},
  u25:{d:'Slag tapped from the converter, crushed and graded. Carries residual iron and lime, so it goes back into the process or out as aggregate.',
      s:['Iron, CaO and magnesia content','Free lime content','Size fraction','Volumetric stability'],
      u:['Internal recycling as sinter and blast furnace feed','Road construction aggregate','Agricultural liming material']}
  };

  var INFO_TR = {
  u1:{d:'Betonarme için sıcak haddelenmiş nervürlü inşaat demiri. Nervürler sayesinde çubuk betona kenetlenir ve yükü sürtünmeyle değil aderansla aktarır.',
      s:['Anma çapı','Dayanım sınıfı ve çelik kalitesi','Çubuk boyu veya küçük çaplarda bobin','Nervür deseni ve bağıl nervür alanı','Kaynaklanabilirlik ve bükme davranışı','Demet ağırlığı ve etiketleme'],
      u:['Betonarme taşıyıcı sistemler ve çekirdekler','Temeller, radye ve kazıklar','Döşemeler, köprü tabliyeleri ve istinat duvarları','Prefabrik ve öngermeli elemanlar']},
  u2:{d:'Bobin hâlinde sıcak haddelenmiş çelik. Doğrudan kullanım için değil, tel çekme ve soğuk şekillendirme için ara ürün olarak üretilir.',
      s:['Bobin çapı ve çelik kalitesi','Karbon aralığı ve kalıntı element sınırları','Bobin ağırlığı, iç ve dış çap','Yüzey ve tufal durumu','Ölçü toleransı ve ovallik','Gerektiğinde dekarbürizasyon derinliği'],
      u:['Tel çekme','Bağlantı elemanları, çivi ve vida','Kaynak teli ve elektrot','Hasır, halat ve yay teli']},
  u3:{d:'Sıcak haddelenmiş çelik sac — ölçüsünde kesilerek verilen yassı ürün; kalın saçtan imal edilen her şeyin temel malzemesi.',
      s:['Çelik kalitesi ve teslim durumu','Kalınlık, genişlik ve boy','Düzlük ve kenar durumu (haddelenmiş veya kesilmiş)','Yüzey kalitesi','Gerektiğinde darbe deneyi sıcaklığı','Gerektiğinde ultrasonik muayene'],
      u:['Gemi inşa ve açık deniz yapıları','Basınçlı kaplar, tanklar ve silolar','Çelik konstrüksiyon ve köprüler','Ağır makine ve iş makinesi imalatı']},
  u4:{d:'Sıcak haddelenmiş U profil. Tek eksende rijit ve gövdesinden kolayca cıvatalanıp kaynaklanabildiği için ikincil taşıyıcılarda ilk tercih.',
      s:['Profil numarası veya kesit ölçüsü','Çelik kalitesi','Boy','Gövde ve başlık kalınlık toleransı','Doğrusallık ve burulma'],
      u:['Aşık, kuşak ve ikincil taşıyıcılar','Makine kaideleri ve şasiler','Araç ve römork şasileri','Destek ve çapraz elemanlar']},
  u5:{d:'Sıcak haddelenmiş I ve H profiller. Çerçeveli yapılarda ana taşıyıcı eleman; kesiti tercihe göre değil açıklığa ve yüke göre seçilir.',
      s:['Profil tanımı ve kesit yüksekliği','Çelik kalitesi','Boy','Metre ağırlığı','Başlık ve gövde toleransları','Kamburluk ve doğrusallık'],
      u:['Bina iskeletleri ve endüstriyel yapılar','Köprüler ve viyadükler','Vinç kirişleri','Ağır ekipman platformları']},
  u6:{d:'Sıcak haddelenmiş köşebent, eşit veya farklı kollu. Bir yapıya rijit köşe kazandırmanın en ekonomik yolu.',
      s:['Kol ölçüleri ve kalınlık','Çelik kalitesi','Boy','Tolerans sınıfı','Doğrusallık'],
      u:['Kafes kirişler ve kafes kuleler','Konsollar, plakalar ve birleşimler','Şasiler, raf ve depolama sistemleri','Kenar koruma ve çaprazlar']},
  u7:{d:'Yuvarlak, kare ve altıgen kesitte sıcak haddelenmiş çubuk; talaşlı imalat, dövme ve bağlantı için stok malzeme.',
      s:['Kesit ve ölçü','Çelik kalitesi','Teslim durumu (haddelenmiş, tavlanmış, normalize)','Tolerans sınıfı','Doğrusallık','Sabit veya rastgele boy'],
      u:['İşlenmiş mil, pim ve burç','Dövme ve yığma stoğu','Bağlantı elemanları ve ankraj cıvataları','Genel makine imalatı']},
  u8:{d:'Yeraltı tahkimatı için haddelenmiş çelik direk ve bağ segmentleri; tavan yüklendiğinde kırılmak yerine kontrollü şekilde deforme olacak biçimde tasarlanır.',
      s:['Profil kesiti ve metre ağırlığı','Çelik kalitesi ve akma dayanımı','Eleman boyu','Anma taşıma yükü','Bağlantı ve kelepçe tipi'],
      u:['Kömür madenlerinde galeri ve ana yol tahkimatı','Cevher madenlerinde hazırlık galerileri','Sürme sırasında geçici tahkimat']},
  u9:{d:'Sıcak haddelenmiş asimetrik armuz profil — bir kenarı kalınlaştırılmış lama; sacı, kaynaklı köşebendin ağırlığı olmadan rijitleştirir.',
      s:['Profil numarası','Gemi inşa çelik kalitesi','Boy','Ölçü toleransı','Gerektiğinde klas kuruluşu onayı'],
      u:['Tekne gövdesi berkitmeleri ve boyuna elemanlar','Güverte ve perde iskeleti','Mavna ve iç su araçları imalatı']},
  u10:{d:'Yüksek fırından çıkan ve külçe hâlinde dökülen ham demir. Karbonu yüksektir ve olduğu gibi kullanılmaz — bir ürün değil, şarj malzemesidir.',
      s:['Silisyum ve mangan içeriği','Kükürt ve fosfor sınırları','Karbon içeriği','Külçe ağırlığı ve ölçüsü','Kimyasal sınıf (döküm veya çelik üretimi)'],
      u:['Gri ve küresel grafitli döküm için şarj','Konverter ve elektrik ark ocağı şarjı','Küresel grafitli demir ve döküm parçalar']},
  u11:{d:'Sürekli dökümle üretilen yarı mamul yassı ürün. Slab yeniden haddelenmek için vardır; değeri görünüşünde değil iç sağlamlığındadır.',
      s:['Çelik kalitesi','Kalınlık, genişlik ve boy','Döküm yöntemi ve iç kalite','Yüzey durumu ve taşlama','Parça ağırlığı'],
      u:['Sıcak haddelenmiş saca yeniden haddeleme','Sıcak şerit haddehanesi şarjı','Bobin ve sac üretimi']},
  u12:{d:'Sürekli dökümle üretilen kare yarı mamul uzun ürün — her uzun ürün haddehanesinin çalıştığı temel şarj malzemesi.',
      s:['Kesit ölçüsü','Çelik kalitesi ve karbon aralığı','Boy','Döküm yöntemi','İç sağlamlık ve köşe kalitesi'],
      u:['İnşaat demiri ve filmaşine yeniden haddeleme','Profil ve çubuğa yeniden haddeleme','Dövme ve dikişsiz boru stoğu']},
  u13:{d:'Sıvı çelikteki çözünmüş oksijeni almak ve banyoya silisyum kazandırmak için kullanılan demir-silisyum alaşımı. Silisyum içeriğine ve tane boyutuna göre satılır.',
      s:['Silisyum içeriği (genellikle %65 veya %75 kaliteleri)','Alüminyum, karbon, fosfor ve kükürt sınırları','Tane boyutu','Ambalaj — big bag, varil veya dökme'],
      u:['Çelik üretiminde deoksidasyon','Silisyum alaşımlama','Küresel grafitli dökümde aşılama','Ferroalaşım ve kaynak sarf malzemesi üretimi']},
  u14:{d:'Mangan-silisyum alaşımı. Tek ilaveyle hem deoksidasyon hem alaşımlama sağladığı için çelik üretiminde en yüksek hacimli ferroalaşımdır.',
      s:['Mangan ve silisyum içeriği','Karbon, fosfor ve kükürt sınırları','Tane boyutu','Ambalaj — big bag veya dökme'],
      u:['Birleşik deoksidasyon ve mangan alaşımlama','Karbon ve düşük alaşımlı çelik üretimi','Rafine ferromangan için şarj']},
  u15:{d:'Metalurjik kok ve kok tozu. Yakıt, indirgeyici ve yüksek fırın şarjını açık tutan taşıyıcı yapı — sonuncusu kalitenin neden bu kadar önemli olduğunu açıklar.',
      s:['Kül, kükürt, nem ve uçucu madde','Tane boyutu','Mekanik dayanım (tambur indisleri)','Belirtildiğinde CSR ve CRI','Sabit karbon'],
      u:['Yüksek fırında yakıt ve indirgeyici','Döküm kupol ocağında ergitme','Ferroalaşım ve kalsiyum karbür üretimi','Sinterde yakıt (kok tozu)']},
  u16:{d:'Kok gazından geri kazanılan kristal (NH₄)₂SO₄. Kok kimyasının yan ürünüdür ve iyi bir azot-kükürt gübresidir.',
      s:['Azot içeriği','Kükürt içeriği','Nem ve serbest asit','Kristal boyut dağılımı','Ambalaj — dökme, big bag veya 50 kg çuval'],
      u:['Tek başına veya harmanlanmış azot-kükürt gübresi','Kompoze gübre için hammadde','Endüstriyel ve teknik kullanımlar']},
  u17:{d:'Aglomerasyon için ince demir cevheri. Doğrudan yüksek fırına şarj edilemeyecek kadar incedir, önce sinterlenir veya peletlenir.',
      s:['Demir içeriği','Silis, alümina, fosfor ve kükürt','Nem','Tane boyut dağılımı','Kızdırma kaybı'],
      u:['Sinter tesisi şarjı','Pelet tesisi şarjı','Yüksek fırın şarj hazırlığı']},
  u18:{d:'Kömür karbonizasyonunun viskoz yan ürünü ve uzun bir karbon kimyası zincirinin başlangıç noktası.',
      s:['Yoğunluk ve viskozite','Su ve kül içeriği','Damıtma fraksiyonları','Naftalin içeriği','Kinolinde çözünmeyen madde'],
      u:['Grafit ve alüminyum elektrotları için zift','Karbon siyahı hammaddesi','Kreozot ve ahşap koruyucular','Kimyasal ara ürünler']},
  u19:{d:'Kok gazından geri kazanılan, benzenin yanı sıra toluen ve ksilen içeren hafif yağ. Nihai kullanımdan önce rafine edilir.',
      s:['Benzen içeriği','Yoğunluk','Damıtma aralığı','Kükürt ve aromatik olmayan madde','Su içeriği'],
      u:['Rafine benzen, toluen ve ksilen hammaddesi','Siklohekzan ve devamındaki polimer üretimi','Solventler ve kimyasal ara ürünler']},
  u20:{d:'Metalurjik kullanım için boyutlandırılmış kireçtaşı. Görevi, silis ve alüminayı ergiyikten alıp cürufa taşımaktır.',
      s:['CaO içeriği','Silis ve magnezya içeriği','Tane boyutu','Nem','Kızdırma kaybı'],
      u:['Yüksek fırın ve konverter flaksı','Kireç ve sönmemiş kireç üretimi','Sinter tesisi şarjı','İnşaat agregası (moloz)']},
  u21:{d:'Hava ayrıştırmasından elde edilen endüstriyel gazlar — sıvı veya gaz hâlde argon, oksijen ve azot ile bunlarla birlikte kazanılan soy gaz karışımları.',
      s:['Saflık ve safsızlık sınırları','Faz — sıvı veya gaz','Teslim şekli — tanker, tüp demeti veya sahada üretim','Basınç ve dolum miktarı','Analiz sertifikası'],
      u:['Kaynak ve kesmede koruyucu gaz','Çelik üretimi ve kesme için oksijen','İnertleme, süpürme ve soğutma için azot','Aydınlatma ve yalıtım camında kripton-ksenon','Lazer ve elektronikte neon-helyum']},
  u22:{d:'Yüksek fırın cürufu; ya suyla ani soğutularak camsı granüle edilir ya da döküm sahasında yaşlandırılır. İkisi tamamen farklı davranır ve birbirinin yerine geçmez.',
      s:['Cam içeriği ve bazikliği (granüle)','Kimyasal bileşim','Nem','Tane boyutu','Çimentoda kullanılıyorsa öğütülebilirlik'],
      u:['Klinker ikamesi olarak öğütülmüş granüle cüruf','Yol temeli ve alt temel','Beton ve asfalt agregası','Dolgu ve set malzemesi']},
  u23:{d:'İnşaat agregası olarak sınıflandırılmış kırılmış çelikhane cürufu. Çoğu doğal taştan daha yoğun ve sert olması onu kullanışlı kılar.',
      s:['Fraksiyon ve granülometri','Basınç dayanımı','Dona dayanıklılık','Hacimsel kararlılık','Kimyasal bileşim'],
      u:['Yol inşaatında temel tabakaları','Demiryolu balastı','Beton ve asfalt agregası','Zemin stabilizasyonu']},
  u24:{d:'Kalsine kireçtaşından elde edilen parça sönmemiş kireç (CaO). Kimyasal bileşimi kadar reaktivitesiyle de satılır, çünkü yavaş kireç konverterde işe yaramaz.',
      s:['Mevcut CaO','Reaktivite (sönme davranışı)','Tane boyutu','Magnezya içeriği','Kızdırma kaybı ve kalıntı CO₂'],
      u:['Konverter ve elektrik ark ocağında cüruf yapıcı','Su ve atık su arıtma','İnşaat ve zemin stabilizasyonu','Kimya ve kâğıt hamuru işlemleri']},
  u25:{d:'Konverterden alınan, kırılmış ve sınıflandırılmış cüruf. İçinde kalıntı demir ve kireç taşıdığı için ya sürece geri döner ya da agrega olarak çıkar.',
      s:['Demir, CaO ve magnezya içeriği','Serbest kireç içeriği','Tane boyutu','Hacimsel kararlılık'],
      u:['Sinter ve yüksek fırın şarjı olarak iç geri dönüşüm','Yol inşaatı agregası','Tarımsal kireçleme malzemesi']}
  };

  /* ============================================================
     Company data carried over from the old arc-trading.com/service/
     pages: monthly production volume, the applications the company
     lists, and the specification table. Transcribed from that site,
     nothing added.
     ============================================================ */
  var VOL = {
    u1:'> 55 000 mt/month', u2:'< 70 000 mt/month',  u3:'< 80 000 mt/month',
    u4:'< 25 000 mt/month', u5:'< 25 000 mt/month',  u6:'< 10 000 mt/month',
    u7:'< 15 000 mt/month', u8:'< 5 000 mt/month',   u9:'< 5 000 mt/month',
    u10:'< 25 000 mt/month',u11:'< 50 000 mt/month', u12:'< 30 000 mt/month',
    u13:'< 3 000 mt/month', u14:'< 2 000 mt/month',  u15:'< 100 000 mt/month',
    u16:'< 3 000 mt/month', u17:'< 100 000 mt/month',u18:'< 6 500 mt/month'
  };

  var SPEC = {
  u1:{ app:['COLUMNS OF BUILDINGS','REINFORCED CONCRETE STRUCTURES','REINFORCED CONCRETE PRODUCTS','INDUSTRIAL AND CIVIL BUILDINGS AND STRUCTURES'],
       rows:[['STANDARD SIZES','10-32 · 8 (packaging)'],
             ['STEEL GRADE / STRENGTH CLASSES','4SP · 4PS · A500S · A400S · A240S · 25G2S'],
             ['STANDARDS','GOST 34028 · GOST 34029 · GOST 5781']]},
  u2:{ app:['WIRE MAKING','LINKING FITTINGS IN THE HOUSING AND COMMUNAL SERVICES','STEEL ROPES AND CABLES','MANUFACTURE OF FASTENERS'],
       rows:[['STANDARD SIZES','5,5-13 (step 0,5)'],
             ['STEEL GRADE','ST 1-5 PS / SP · ST 10-85 · SAE 1006-1052 · alloyed steel grades'],
             ['STANDARDS','GOST 30136 · GOST 1050 · GOST 14959 · ASTM']]},
  u3:{ app:['METAL STRUCTURES','MECHANICAL ENGINEERING','BRIDGE CONSTRUCTION','PIPE MANUFACTURING'],
       rows:[['STANDARD SIZES','Thickness 8-50 · Width 1800-2650 · Length 6000-12000'],
             ['STEEL GRADE','st0, st1, 2, 3, 4, 5, st3gsp, st3gps, st5gps, 09G2S, 17GS, 10G2S1, 17G1S, 09G2D, 09G2, 14G2, PPA, PPB, PPE, PPD, PPA32, PPD32, PPA36, PPD36, 10KhSND, 15KhSND, 08kp-ps, 08, 10-20kp-ps, 20-60, S235JR/JO, S275JR/JRG2, S275JO, S450JO, S355JR/JO, A516/60, A516/70, A131A, B, A283C, A285C, A572/50, A572/42A, 572/55, A572/60, A572/65, SS330, SS400, St37-2, St44-2, P235GH, P265GH, A516/60 MT LTV, A516/70MT LTV, A131 D, A32, D32, A36, D36'],
             ['STANDARDS','GOST 14637–89 · GOST 19281–89 · GOST 5520 · Russian River Register · GOST 6713 · GOST 1577–93 · EN 10025–94 · EN 10025–2:2004 · ASTM A516/A516M–06 · ASTM A131/A131M–08 · ASTM A283 / A285 · ASTM A572/A572M–07 · JIS G–3101–1995 · DIN 17100 · DIN EN 10028–2 · ASTM A36/A36M–12']]},
  u4:{ app:['METAL STRUCTURES','SUPPORTS OF POWER LINES','BRIDGE CONSTRUCTION','BUILDING OVERLAPS'],
       rows:[['STANDARD SIZES','8 · 10 · 12 · 14 · 16 · 18 · 20 · 22 · 24'],
             ['STEEL GRADE','ST 1-5 PS / SP · 09G2S · 12G2FD · RST 37-2 · ST 37-2 · ST 52-3 · S235JRG2 · S235JO · S235JR · S355JR · S235JRG1'],
             ['STANDARDS','GOST 380 · GOST 535 · GOST 19281 · GOST 8240 · DIN EN 10025']]},
  u5:{ app:['METAL STRUCTURES','SUPPORTS OF STRUCTURES','BRIDGE CONSTRUCTION','BUILDING OVERLAPS'],
       rows:[['STANDARD SIZES','10 · 12 · 14 · 16 · 18 · 20 · 140DIN'],
             ['STEEL GRADE','ST3PS · 09G2S · 12G2FD · S235JO · S235JR · S235JRG1 · S235JRG2 · S355JR · RST 37-2 · ST 37-2 · ST 52-3'],
             ['STANDARDS','GOST 8239 · GOST 380 · GOST 535 · GOST 19281 · DIN EN 10025']]},
  u6:{ app:['METAL STRUCTURES','SUPPORTS OF POWER LINES','BRIDGE CONSTRUCTION','BUILDING OVERLAPS'],
       rows:[['STANDARD SIZES','75×6/8 · 90×6/7/8 · 100×7/8/10/12 · 110×7/8 · 125×8/9/10/12'],
             ['STEEL GRADE','ST 1-5 PS / SP · 09G2S · 12G2FD · S235JO · S235JR · S235JRG1 · S235JRG2 · S355JR'],
             ['STANDARDS','GOST 380 · GOST 8509 · GOST 19281']]},
  u7:{ app:['MECHANICAL ENGINEERING','REINFORCED CONCRETE STRUCTURES'],
       rows:[['STANDARD SIZES','20 · 22 · 25 · 32 · 36 · 40'],
             ['STEEL GRADE','ST 1-5 PS / SP · ST 10-85 · alloyed steel grades'],
             ['STANDARDS','GOST 1050 · GOST 14959 · GOST 380']]},
  u8:{ app:['SUPPORTS FOR MINING OPERATIONS'],
       rows:[['STANDARD SIZES','17 · 22 · 27 · 33'],
             ['STEEL GRADE','ST5PS'],
             ['STANDARDS','GOST 18662']]},
  u9:{ app:['SHIPBUILDING'],
       rows:[['STANDARD SIZES','10 · 12 · 14 A, B · 16 A, B · 18 A, B'],
             ['STEEL GRADE','A/D32 · A/D36 · A/D40'],
             ['STANDARDS','GOST R 52927 · GOST 5521 · River Register · Maritime Register']]},
  u10:{ app:['STEEL SMELTING','MECHANICAL ENGINEERING FOR SMELTING'],
       rows:[['STANDARD SIZES','200×200×115'],
             ['GRADES','P1 · P2 · PL-1 · PL-2 · L1 – L6'],
             ['STANDARDS','GOST 805 · GOST 4832']]},
  u11:{ app:['PRODUCTION OF FLAT ROLLED PRODUCTS (SHEET, ROLL)'],
       rows:[['STANDARD SIZES','Thickness 200 · 220 · 250 · 300 mm · Width 1000-1800 mm · Length 4500-12000 mm'],
             ['GRADES','ST 1-5 PS / SP · ST 10-85 · SAE 1006, 1008, 1010 · S235JRG2 · S275JO · D32, D36'],
             ['STANDARDS','GOST 19281 · GOST 380 · GOST 14959 · GOST R 52927 · ASTM A 510M-03 · TU U 14-2-1253']]},
  u12:{ app:['PRODUCTION (REBARS, WIRE ROD, STYLE)'],
       rows:[['STANDARD SIZES','100×100 · 120×120 · 125×125 · 130×130 · 150×150'],
             ['GRADES','ST 1-5 PS / SP · ST 10-85 · SAE 1006, 1008, 1010 · S235JRG2 · S275JO · D32, D36 · alloyed steel grades'],
             ['STANDARDS','GOST 19281 · GOST 380 · GOST 14959 · GOST R 52927 · ASTM A 510M-03 · TU U 14-2-1253']]},
  u13:{ app:['INCREASING THE STRENGTH CHARACTERISTICS OF STEEL'],
       rows:[['STANDARD SIZES','0-3 · 0-10 · 10-50 · 10-100 · 50-200 · 0-300'],
             ['GRADE','FS75 · FS65 · FS45'],
             ['STANDARDS','GOST 1415-93']]},
  u14:{ app:['DEOXIDIZER AND ALLOYING ELEMENT FOR STEEL'],
       rows:[['GRADES','MNS17'],
             ['STANDARDS','GOST 4756-91']]},
  u15:{ app:['FUEL FOR METALLURGICAL PRODUCTION'],
       rows:[['PRODUCT TYPE / GRADES','Coke blast furnace — KD1, KD2, KD3 · Coke nut — OK1, OK2, OK3 · Coke change — MK1, MK2, MK3'],
             ['STANDARDS','TU 19.10.10-002-48368873-2023 · TU U 19.1_84200158_011_2019 · TU U 19.1-84200158_004_2018 · TU 19.10.10-006-56936541-2023 · TU D 19.1-50254224-010:2022 · TU D 19.1-84200158-001_2018 · TU 19.10.10-008-56936541-2023 · TU 19.10.10-011-48368873-2023 · TU U 19.1-84200158-005_2018']]},
  u16:{ app:['FERTILIZER, PROTEIN PURIFICATION IN BIOCHEMISTRY, WATER CHLORINATION ADDITIVE'],
       rows:[['GRADE','Upper · First'],
             ['STANDARDS','TU D 20.1-50254224-016:2022 · TU U 20.1-84200158-003-2018 · TU 20.15.32-003-56936541-2023']]},
  u17:{ app:['MATERIAL FOR METALLURGICAL PRODUCTION'],
       rows:[['PRODUCT TYPE / IRON CONTENT','OH-1 — 61% · OH-2 — 58% · AO-1 — 54%'],
             ['SIZE','Max 20,0 mm — control class 0-10 mm min 85,0% · Max 100,0 mm — max 25,0% · Max 100,0 mm — max 15,0%']]},
  u18:{ app:['RAW MATERIALS FOR THE PRODUCTION OF NAPHTHALENE, CRESOLS AND ANTHRACENE'],
       rows:[['GRADE','A · B · C · D'],
             ['STANDARDS','TU D 19.1-50254224-017:2022 · TU U 19.1-84200158-002_2018']]}
  };

  /* Turkish for the labels above; the codes, grades and standards stay as written */
  var APP_TR = {
    'COLUMNS OF BUILDINGS':'Bina kolonları',
    'REINFORCED CONCRETE STRUCTURES':'Betonarme yapılar',
    'REINFORCED CONCRETE PRODUCTS':'Betonarme ürünler',
    'INDUSTRIAL AND CIVIL BUILDINGS AND STRUCTURES':'Sanayi ve sivil yapılar',
    'WIRE MAKING':'Tel üretimi',
    'LINKING FITTINGS IN THE HOUSING AND COMMUNAL SERVICES':'Konut ve altyapı hizmetlerinde bağlantı donanımları',
    'STEEL ROPES AND CABLES':'Çelik halat ve kablolar',
    'MANUFACTURE OF FASTENERS':'Bağlantı elemanı üretimi',
    'METAL STRUCTURES':'Metal konstrüksiyonlar',
    'MECHANICAL ENGINEERING':'Makine imalatı',
    'BRIDGE CONSTRUCTION':'Köprü inşaatı',
    'PIPE MANUFACTURING':'Boru üretimi',
    'SUPPORTS OF POWER LINES':'Enerji nakil hattı direkleri',
    'SUPPORTS OF STRUCTURES':'Yapı taşıyıcıları',
    'BUILDING OVERLAPS':'Bina döşemeleri',
    'SUPPORTS FOR MINING OPERATIONS':'Madencilik işlemleri için tahkimat',
    'SHIPBUILDING':'Gemi inşa',
    'STEEL SMELTING':'Çelik ergitme',
    'MECHANICAL ENGINEERING FOR SMELTING':'Ergitme için makine imalatı',
    'PRODUCTION OF FLAT ROLLED PRODUCTS (SHEET, ROLL)':'Yassı haddelenmiş ürün üretimi (sac, rulo)',
    'PRODUCTION (REBARS, WIRE ROD, STYLE)':'Üretim (inşaat demiri, filmaşin, profil)',
    'INCREASING THE STRENGTH CHARACTERISTICS OF STEEL':'Çeliğin dayanım özelliklerini artırma',
    'DEOXIDIZER AND ALLOYING ELEMENT FOR STEEL':'Çelik için deoksidan ve alaşım elementi',
    'FUEL FOR METALLURGICAL PRODUCTION':'Metalurjik üretim için yakıt',
    'FERTILIZER, PROTEIN PURIFICATION IN BIOCHEMISTRY, WATER CHLORINATION ADDITIVE':'Gübre, biyokimyada protein saflaştırma, su klorlama katkısı',
    'MATERIAL FOR METALLURGICAL PRODUCTION':'Metalurjik üretim için malzeme',
    'RAW MATERIALS FOR THE PRODUCTION OF NAPHTHALENE, CRESOLS AND ANTHRACENE':'Naftalin, krezol ve antrasen üretimi için hammadde'
  };
  var ROW_TR = {
    'STANDARD SIZES':'STANDART ÖLÇÜLER',
    'STEEL GRADE':'ÇELİK KALİTESİ',
    'STEEL GRADE / STRENGTH CLASSES':'ÇELİK KALİTESİ / DAYANIM SINIFLARI',
    'STANDARDS':'STANDARTLAR',
    'GRADE':'KALİTE',
    'GRADES':'KALİTELER',
    'PRODUCT TYPE / GRADES':'ÜRÜN TİPİ / KALİTELER',
    'PRODUCT TYPE / IRON CONTENT':'ÜRÜN TİPİ / DEMİR İÇERİĞİ',
    'SIZE':'BOYUT'
  };

  /* the six positions shown on the home page */
  var FEATURED = ['u1','u2','u3','u10','u13','u15'];
  var IMG = BASE + 'img/';
  var GLABEL = {};
  GROUPS.forEach(function(g){ GLABEL[g[0]] = LANG === 'tr' ? GLABEL_TR[g[0]] : g[1]; });
  window.ARC = { PRODUCTS: PRODUCTS, GROUPS: GROUPS, IMG: IMG };

  function cardHTML(p){
    return '<div class="card__ph">' +
        '<span class="card__tag">' + GLABEL[p[2]] + '</span>' +
        '<img src="' + IMG + p[1] + '.jpg" alt="" loading="lazy">' +
      '</div>' +
      '<div class="card__body">' +
        '<h3>' + p[0] + '</h3>' +
        '<span class="card__more">' + UI.more + ' ' + ARROW + '</span>' +
      '</div>' +
      '<a class="card__link" href="product.html?id=' + p[1] + '" aria-label="' + p[0] + ' — ' + UI.more + '"></a>';
  }
  function renderCards(grid, list, perRow){
    list.forEach(function(p, i){
      var el = document.createElement('article');
      el.className = 'card';
      el.id = p[1];
      el.dataset.g = p[2];
      el.dataset.tilt = '';
      el.style.transitionDelay = (i % perRow) * 90 + 'ms';
      el.setAttribute('data-rv','');
      el.innerHTML = cardHTML(p);
      grid.appendChild(el);
    });
  }

  var grid = $('#grid');
  if (grid){
    if (grid.dataset.mode === 'all'){
      renderCards(grid, PRODUCTS, 4);
    } else {
      renderCards(grid, PRODUCTS.filter(function(p){ return FEATURED.indexOf(p[1]) > -1; }), 3);
      /* last card of the phone rail — the way out to the full catalogue */
      var more = document.createElement('a');
      more.className = 'card card--more';
      more.href = 'products.html';
      more.innerHTML = '<div><b>' + UI.allTitle + '</b>' +
        '<span>' + UI.allSub + '</span>' +
        '<em>' + UI.allLink + ' ' + ARROW + '</em></div>';
      grid.appendChild(more);

      /* rail progress indicator */
      var bar = document.createElement('div');
      bar.className = 'cbar';
      bar.innerHTML = '<i></i>';
      grid.parentNode.insertBefore(bar, grid.nextSibling);
      var fill = bar.firstChild;
      var sync = function(){
        var max = grid.scrollWidth - grid.clientWidth;
        if (max < 8){ bar.classList.remove('on'); return; }
        bar.classList.add('on');
        var frac = grid.clientWidth / grid.scrollWidth;
        fill.style.width = (frac * 100) + '%';
        fill.style.transform = 'translateX(' + (grid.scrollLeft / max) * ((1 - frac) / frac) * 100 + '%)';
      };
      grid.addEventListener('scroll', sync, { passive: true });
      addEventListener('resize', sync);
      sync();
    }
  }

  /* ---- chips + FLIP, catalogue page only ---- */
  var chips = $('#chips');
  if (chips && grid){
    GROUPS.forEach(function(g){
      var n = g[0] === 'all' ? PRODUCTS.length : PRODUCTS.filter(function(p){ return p[2] === g[0]; }).length;
      var b = document.createElement('button');
      b.className = 'chip' + (g[0] === 'all' ? ' on' : '');
      b.dataset.g = g[0];
      b.innerHTML = g[1] + '<em>' + n + '</em>';
      chips.appendChild(b);
    });
    chips.addEventListener('click', function(e){
      var chip = e.target.closest('.chip');
      if (!chip) return;
      $$('.chip', chips).forEach(function(c){ c.classList.toggle('on', c === chip); });
      var g = chip.dataset.g, cards = $$('.card', grid), first = {};
      cards.forEach(function(c,i){ first[i] = c.getBoundingClientRect(); });
      cards.forEach(function(c){ c.classList.toggle('hide', g !== 'all' && c.dataset.g !== g); });
      var live = $('#chipCount');
      if (live) live.textContent = cards.filter(function(c){ return !c.classList.contains('hide'); }).length;
      if (RM) return;
      cards.forEach(function(c,i){
        if (c.classList.contains('hide')) return;
        var last = c.getBoundingClientRect();
        var dx = first[i].left - last.left, dy = first[i].top - last.top;
        if (!dx && !dy) return;
        c.animate([{transform:'translate(' + dx + 'px,' + dy + 'px)'},{transform:'none'}],
                  {duration:520, easing:'cubic-bezier(.22,1,.36,1)'});
      });
    });
  }

  /* ---- marquee ---- */
  var mq = $('#marq');
  if (mq){
    var strip = PRODUCTS.map(function(p){ return '<span>' + p[0].split(' | ')[0] + '</span>'; }).join('');
    mq.innerHTML = strip + strip;
  }

  /* ============================================================
     headline split — words stay unbreakable
     ============================================================ */
  $$('[data-split]').forEach(function(h1){
    var idx = 0;
    (function split(node){
      Array.prototype.slice.call(node.childNodes).forEach(function(n){
        if (n.nodeType === 3){
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function(tok){
            if (!tok) return;
            if (/^\s+$/.test(tok)){ frag.appendChild(document.createTextNode(' ')); return; }
            var word = document.createElement('span');
            word.className = 'wd';
            tok.split('').forEach(function(ch){
              var s = document.createElement('span');
              s.className = 'ch';
              s.textContent = ch;
              s.style.animationDelay = (0.28 + idx * 0.028) + 's';
              idx++;
              word.appendChild(s);
            });
            frag.appendChild(word);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1){ split(n); }
      });
    })(h1);
  });

  /* ============================================================
     hero slider
     ============================================================ */
  var stage = $('#slides'), copies = $$('.hero__copy'), dotsBox = $('#dots');
  if (stage && copies.length > 1){
    var imgs = $$('.slide', stage), n = imgs.length, cur = 0, timer = null;
    var DUR = 7000;

    copies.forEach(function(c, i){
      var d = document.createElement('button');
      d.className = 'dot' + (i === 0 ? ' on' : '');
      d.style.setProperty('--dur', (DUR / 1000) + 's');
      d.setAttribute('aria-label', UI.slide + (i + 1));
      d.innerHTML = '<b></b><svg width="34" height="34" viewBox="0 0 34 34"><circle cx="17" cy="17" r="15.9"/></svg>';
      d.addEventListener('click', function(){ go(i, true); });
      dotsBox.appendChild(d);
    });
    var counter = document.createElement('span');
    counter.className = 'hero__count';
    counter.innerHTML = '<b>01</b> / ' + String(n).padStart(2,'0');
    dotsBox.appendChild(counter);
    var dots = $$('.dot', dotsBox);

    function go(i, manual){
      if (i === cur) return;
      imgs[cur].classList.remove('on');
      copies[cur].classList.remove('on');
      dots[cur].classList.remove('on');
      cur = (i + n) % n;
      imgs[cur].classList.add('on');
      copies[cur].classList.add('on');
      /* restart the ring animation */
      var d = dots[cur], c = $('circle', d);
      c.style.animation = 'none'; void c.offsetWidth; c.style.animation = '';
      d.classList.add('on');
      counter.innerHTML = '<b>' + String(cur + 1).padStart(2,'0') + '</b> / ' + String(n).padStart(2,'0');
      /* restart the Ken Burns pan */
      var im = $('img', imgs[cur]);
      im.style.animation = 'none'; void im.offsetWidth; im.style.animation = '';
      if (manual) start();
    }
    function next(){ go(cur + 1); }
    function start(){ stop(); if (!RM) timer = setInterval(next, DUR); }
    function stop(){ if (timer){ clearInterval(timer); timer = null; } }

    var hero = $('.hero');
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    document.addEventListener('visibilitychange', function(){ document.hidden ? stop() : start(); });
    addEventListener('keydown', function(e){
      if (e.key === 'ArrowRight'){ go(cur + 1, true); }
      if (e.key === 'ArrowLeft'){ go(cur - 1, true); }
    });
    var tx = 0;
    hero.addEventListener('touchstart', function(e){ tx = e.touches[0].clientX; stop(); }, {passive:true});
    hero.addEventListener('touchend', function(e){
      var dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1), true); else start();
    }, {passive:true});
    start();
  }

  /* ============================================================
     splash — entry page only, once per browser session
     ============================================================ */
  var pre = $('#preloader');
  if (pre){
    var seen = false;
    try { seen = !!sessionStorage.getItem('arc-visited'); } catch (e) {}
    if (seen){ pre.remove(); pre = null; }
    else { try { sessionStorage.setItem('arc-visited','1'); } catch (e) {} }
  }
  if (!pre){
    document.documentElement.classList.add('loaded');
  } else {
    var booted = false;
    var boot = function(){
      if (booted) return;
      booted = true;
      document.documentElement.classList.add('loaded');
      setTimeout(function(){ if (pre) pre.remove(); }, 700);
    };
    window.addEventListener('load', function(){ setTimeout(boot, RM ? 0 : 900); });
    setTimeout(boot, 2600);   /* never hold the page hostage to a slow asset */
  }

  /* ============================================================
     smooth scroll
     ============================================================ */
  var lenis = null;
  function initSmooth(){
    if (RM || !window.Lenis){ document.documentElement.style.scrollBehavior = 'smooth'; return; }
    lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
    (function raf(t){ lenis.raf(t); requestAnimationFrame(raf); })();
    if (window.ScrollTrigger) lenis.on('scroll', window.ScrollTrigger.update);
  }
  document.addEventListener('click', function(e){
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (id === '#') return;
    var el = id === '#top' ? document.body : $(id);
    if (!el) return;
    e.preventDefault();
    closeMenu();
    if (lenis) lenis.scrollTo(el, { offset: id === '#top' ? 0 : -70 });
    else window.scrollTo({ top: id === '#top' ? 0 : el.getBoundingClientRect().top + pageYOffset - 70,
                           behavior: RM ? 'auto' : 'smooth' });
  });

  /* ============================================================
     header, progress, back-to-top
     ============================================================ */
  var hdr = $('#hdr'), prog = $('#progress'), totop = $('#totop');
  function onScroll(){
    var y = pageYOffset || document.documentElement.scrollTop;
    if (hdr){ hdr.classList.toggle('stuck', y > 40); hdr.classList.toggle('on-hero', y <= 40); }
    if (totop) totop.classList.toggle('on', y > 600);
    if (prog){
      var h = document.documentElement.scrollHeight - innerHeight;
      prog.style.transform = 'scaleX(' + (h > 0 ? Math.min(y / h, 1) : 0) + ')';
    }
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ============================================================
     reveal + counters
     ============================================================ */
  var io = new IntersectionObserver(function(en){
    en.forEach(function(e){
      if (!e.isIntersecting) return;
      var t = e.target;
      t.classList.add('in');
      io.unobserve(t);
      if (t.style.transitionDelay) setTimeout(function(){ t.style.transitionDelay = ''; }, 1200);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  $$('[data-rv],[data-rv-x],.rv-line,.about__rule').forEach(function(el){ io.observe(el); });

  function fmt(v, dec, sep){
    if (dec) return v.toFixed(dec).replace('.', ',');
    var s = Math.round(v).toString();
    return sep ? s.replace(/\B(?=(\d{3})+(?!\d))/g, sep) : s;
  }
  var cio = new IntersectionObserver(function(en){
    en.forEach(function(e){
      if (!e.isIntersecting) return;
      var el = e.target; cio.unobserve(el);
      var to = parseFloat(el.dataset.count), dec = parseInt(el.dataset.dec || '0', 10),
          sep = el.dataset.sep || '', t0 = performance.now();
      if (RM){ el.textContent = fmt(to, dec, sep); return; }
      (function step(t){
        var p = Math.min((t - t0) / 1500, 1), k = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(to * k, dec, sep);
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    });
  }, { threshold: 0.4 });
  $$('[data-count]').forEach(function(el){ cio.observe(el); });


  /* ============================================================
     numbered list — the rail draws itself as you scroll past,
     each row lights its marker and turns its numeral gold
     ============================================================ */
  var rows = $('.rows');
  if (rows){
    var items = $$('.row', rows);
    var fill  = $('.rows__rail i', rows);

    if (RM){
      items.forEach(function(r){ r.classList.add('on'); });
      if (fill) fill.style.height = '100%';
    } else {
      var rio = new IntersectionObserver(function(en){
        en.forEach(function(e){
          if (!e.isIntersecting) return;
          e.target.classList.add('on');
          rio.unobserve(e.target);
        });
      }, { rootMargin: '0px 0px -28% 0px', threshold: 0.25 });
      items.forEach(function(r){ rio.observe(r); });

      var railTick = false;
      var drawRail = function(){
        railTick = false;
        if (!fill) return;
        var r = rows.getBoundingClientRect();
        var mark = innerHeight * 0.62;                 /* where the line "is" on screen */
        var p = (mark - r.top) / r.height;
        fill.style.height = Math.max(0, Math.min(1, p)) * 100 + '%';
      };
      addEventListener('scroll', function(){
        if (!railTick){ railTick = true; requestAnimationFrame(drawRail); }
      }, { passive: true });
      addEventListener('resize', drawRail);
      drawRail();
    }
  }

  /* ============================================================
     parallax
     ============================================================ */
  var parEls = $$('[data-par]'), ticking = false;
  function parallax(){
    ticking = false;
    var vh = innerHeight;
    parEls.forEach(function(el){
      var r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var mid = r.top + r.height / 2 - vh / 2;
      el.style.transform = 'translate3d(0,' + (-mid * parseFloat(el.dataset.par)).toFixed(2) + 'px,0)';
    });
  }
  if (!RM && parEls.length){
    addEventListener('scroll', function(){ if (!ticking){ ticking = true; requestAnimationFrame(parallax); } }, { passive: true });
    addEventListener('resize', parallax);
    parallax();
  }

  /* ============================================================
     cursor, magnetic buttons, 3D tilt
     ============================================================ */
  if (matchMedia('(hover:hover) and (pointer:fine)').matches && !RM){
    var dot = $('#cursor'), ring = $('#cursor-ring');
    if (dot && ring){
      var mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
      addEventListener('mousemove', function(e){
        mx = e.clientX; my = e.clientY;
        dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
      }, { passive: true });
      (function loop(){
        rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
        ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
        requestAnimationFrame(loop);
      })();
      var HOT = 'a,button,.card,.row,.chip,.tile,.step,input,textarea';
      document.addEventListener('mouseover', function(e){ if (e.target.closest(HOT)) document.body.classList.add('cur-hot'); });
      document.addEventListener('mouseout',  function(e){ if (e.target.closest(HOT)) document.body.classList.remove('cur-hot'); });
    }
    $$('[data-mag]').forEach(function(el){
      el.addEventListener('mousemove', function(e){
        var r = el.getBoundingClientRect();
        el.style.transform = 'translate(' + (e.clientX - r.left - r.width / 2) * 0.24 + 'px,' +
                                            (e.clientY - r.top - r.height / 2) * 0.32 + 'px)';
      });
      el.addEventListener('mouseleave', function(){ el.style.transform = ''; });
    });
    document.addEventListener('mousemove', function(e){
      var el = e.target.closest('[data-tilt]');
      if (!el) return;
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = 'perspective(900px) rotateX(' + (-py * 5).toFixed(2) + 'deg) rotateY(' + (px * 6).toFixed(2) + 'deg) translateY(-6px)';
    });
    document.addEventListener('mouseout', function(e){
      var el = e.target.closest('[data-tilt]');
      if (el && !el.contains(e.relatedTarget)) el.style.transform = '';
    });
  }

  /* ============================================================
     mobile menu
     ============================================================ */
  var burger = $('#burger');
  function closeMenu(){ document.body.classList.remove('menu-open','is-locked'); }
  if (burger){
    burger.addEventListener('click', function(){
      var open = document.body.classList.toggle('menu-open');
      document.body.classList.toggle('is-locked', open);
    });
    addEventListener('keydown', function(e){ if (e.key === 'Escape') closeMenu(); });
  }

  /* ============================================================
     toast + copy to clipboard
     ============================================================ */
  var toast = $('#toast'), tt;
  function say(msg){
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('on');
    clearTimeout(tt);
    tt = setTimeout(function(){ toast.classList.remove('on'); }, 2200);
  }
  $$('[data-copy]').forEach(function(el){
    el.addEventListener('click', function(){
      var v = el.dataset.copy;
      if (navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(v).then(function(){ say(UI.copied); }, function(){ say(v); });
      } else { say(v); }
    });
  });


  /* ============================================================
     product detail page — driven by ?id=uN
     ============================================================ */
  var detail = $('#detail');
  if (detail){
    var id = (location.search.match(/[?&]id=([a-z0-9]+)/i) || [])[1];
    var row = PRODUCTS.filter(function(p){ return p[1] === id; })[0];
    if (!row){
      location.replace('products.html');
    } else {
      var TABLE = LANG === 'tr' ? INFO_TR : INFO;
      var meta = TABLE[id] || INFO[id] || { d:'', s:[], u:[] };
      var siblings = PRODUCTS.filter(function(p){ return p[2] === row[2] && p[1] !== id; }).slice(0, 4);
      var idx = PRODUCTS.indexOf(row);
      var prev = PRODUCTS[(idx - 1 + PRODUCTS.length) % PRODUCTS.length];
      var next = PRODUCTS[(idx + 1) % PRODUCTS.length];
      var li = function(t){ return '<li>' + t + '</li>'; };
      var card = function(p){
        return '<a class="rel" href="product.html?id=' + p[1] + '">' +
               '<span class="rel__ph"><img src="' + IMG + p[1] + '.jpg" alt="" loading="lazy"></span>' +
               '<span class="rel__t">' + p[0] + '</span></a>';
      };

      document.title = row[0].split(' | ')[0] + ' — Arc Trading';
      $('#d-crumb').textContent = row[0].split(' | ')[0];
      $('#d-tag').textContent = GLABEL[row[2]];
      $('#d-title').textContent = row[0];
      $('#d-lede').textContent = meta.d;
      $('#d-img').src = IMG + id + '.jpg';
      $('#d-spec').innerHTML = meta.s.map(li).join('');

      /* the company's own application list wins over the generic one */
      var company = SPEC[id];
      var uses = company ? company.app.map(function(a){
        return LANG === 'tr' ? (APP_TR[a] || a) : a.charAt(0) + a.slice(1).toLowerCase();
      }) : meta.u;
      $('#d-use').innerHTML = uses.map(li).join('');

      var volWrap = $('#d-vol');
      if (VOL[id]){
        $('#d-vol-label').textContent = UI.vol;
        $('#d-vol-value').textContent = VOL[id];
      } else if (volWrap){ volWrap.remove(); }

      var tbl = $('#d-table');
      if (company && tbl){
        $('#d-table-title').textContent = UI.spec;
        $('#d-table-body').innerHTML = company.rows.map(function(r){
          var head = LANG === 'tr' ? (ROW_TR[r[0]] || r[0]) : r[0];
          return '<tr><th>' + head + '</th><td>' + r[1] + '</td></tr>';
        }).join('');
      } else if (tbl){
        tbl.className = 'askspec';
        tbl.innerHTML =
          '<div class="askspec__in">' +
            '<p class="eyebrow">' + UI.spec + '</p>' +
            '<h2>' + UI.askT + '</h2>' +
            '<p>' + UI.askB + '</p>' +
            '<a class="btn btn--amber" href="contact.html?product=' +
              encodeURIComponent(row[0]) + '" data-mag>' + UI.askC + ' ' + ARROW + '</a>' +
          '</div>';
      }
      $('#d-ask').href = 'contact.html?product=' + encodeURIComponent(row[0]);
      $('#d-prev').href = 'product.html?id=' + prev[1];
      $('#d-prev-t').textContent = prev[0].split(' | ')[0];
      $('#d-next').href = 'product.html?id=' + next[1];
      $('#d-next-t').textContent = next[0].split(' | ')[0];
      if (siblings.length){
        $('#d-rel').innerHTML = siblings.map(card).join('');
      } else {
        $('#d-rel-sec').remove();
      }
      detail.classList.add('ready');
    }
  }

  /* an enquiry that arrives from a product page starts with it filled in */
  var pre = (location.search.match(/[?&]product=([^&]+)/) || [])[1];
  if (pre && $('#f-msg')){
    try {
      var nameOf = decodeURIComponent(pre.replace(/\+/g, ' '));
      $('#f-msg').value = UI.enquiry + nameOf + '\n\n' + UI.fields;
      $('#f-msg').setAttribute('placeholder', ' ');
    } catch (e) {}
  }

  /* ============================================================
     map — the embed only takes gestures once it is asked for
     ============================================================ */
  var map = $('#map');
  if (map){
    var wake = function(){ map.classList.add('live'); };
    map.addEventListener('click', wake);
    map.addEventListener('touchstart', wake, { passive: true });
  }

  /* ============================================================
     contact form
     ============================================================ */
  var form = $('#form'), submit = $('#submit');
  if (form && submit){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var name = $('#f-name').value.trim(), mail = $('#f-mail').value.trim(), msg = $('#f-msg').value.trim();
      if (!name || !mail || !msg || mail.indexOf('@') < 1){ say(UI.fill); return; }
      if (submit.classList.contains('loading')) return;
      submit.classList.add('loading');
      /* demo endpoint — wire to the real handler on integration */
      setTimeout(function(){
        submit.classList.remove('loading');
        submit.classList.add('done');
        $('.lbl', submit).textContent = UI.sent;
        say(UI.thanks);
        form.reset();
        setTimeout(function(){ submit.classList.remove('done'); $('.lbl', submit).textContent = UI.send; }, 4000);
      }, 1300);
    });
  }

  /* ============================================================
     GSAP extras — optional
     ============================================================ */
  addEventListener('load', function(){
    initSmooth();
    if (RM || !window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    if ($('.hero__in')){
      gsap.fromTo('.hero__in', { y: 0 }, {
        y: -70, opacity: .35, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
    }
    ScrollTrigger.refresh();
  });
})();
