'use strict';

// Переменные игры
let score = 0;
let click = 0;
let addPerClick = 1;
let addPerSecond = 0;
let level = 1;
let exp = 0;
let maxExp = 100;
let totalClicks = 0;
let casePrice = 1250;
let gameStartTime = Date.now();

// Коды, которые уже были использованы - КАЖДЫЙ КОД МОЖНО ИСПОЛЬЗОВАТЬ ТОЛЬКО ОДИН РАЗ
let usedCodes = [];

// Система достижений
let unlockedAchievements = {
    click1: false,
    click10: false,
    click100: false,
    click1000: false,
    click10000: false,
    click100000: false,
    level10: false,
    level100: false,
    level1000: false,
    play15min: false,
    memoriesUnlocked: false
};

// Новая валюта - Солнце
let sunScore = 0;
let sunPerClick = 0.01;

// Система множителей цен
let priceMultipliers = {
    upgrades: {},
    autoClickers: {},
    sunExchanges: {},
    powers: {}
};

// Бусты
let activeBoosts = {
    exp: { active: false, multiplier: 1, endTime: 0 },
    sun: { active: false, multiplier: 1, endTime: 0 },
    drop: { active: false, multiplier: 1, endTime: 0 }
};

// Скины
let unlockedSkins = ['default'];
let currentSkin = 'default';
const skins = {
    'default': { 
        name: 'Стандартный', 
        url: 'https://pvsz2.ru/statics/plants-big/68.png',
        rarity: 'common',
        unlockedByDefault: true
    },
    'common1': { 
        name: 'Ретро', 
        url: 'https://i.pinimg.com/736x/c1/39/78/c139780ac0699dc7ea89b960a7c65db1.jpg',
        rarity: 'common'
    },
    'rare1': { 
        name: 'Зомби?', 
        url: 'https://png.klev.club/uploads/posts/2024-04/png-klev-club-felv-p-gorokhostrel-png-29.png',
        rarity: 'rare'
    },
    'epic1': { 
        name: 'ИГРУШКА', 
        url: 'https://static.insales-cdn.com/r/wyLYTi_x4PA/rs:fit:1000:1000:1/plain/images/products/1/6518/738343286/S99b344709a2c437bad3d5228ff5c2989D-removebg-preview.png@png',
        rarity: 'epic'
    },
    'legendary1': { 
        name: 'УЛЬТРА ИНСТИНКТ ГОРОХ', 
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtVQyQTbYoKxhSByfHMhQF4zmNxkH6Vm0vPQ&s',
        rarity: 'legendary'
    },
    'mythic1': { 
        name: 'ГЕРОЙ ГОРОХ', 
        url: 'https://media.contentapi.ea.com/content/dam/eacom/en-us/migrated-images/2017/02/newsmedia-pvzh-2-feb-ftimg-greenshadow.png.adapt.crop191x100.628p.png',
        rarity: 'mythic'
    },
    'pea1': { 
        name: 'захотел...', 
        url: 'https://img-webcalypt.ru/img/thumb/lg/images/meme-templates/ZdjVHzFr5DQEF2rSDWlfFssh8Cd1UjvW.jpg.jpg',
        rarity: 'pea'
    },
    'pea2': { 
        name: 'женщина', 
        url: 'https://avatars.mds.yandex.net/i?id=88e5e8f2af8f387cc9bc8e705d5e5e6270212dff-5132847-images-thumbs&n=13',
        rarity: 'pea'
    },
    'memories_1057': { 
        name: 'ВОСПОМИНАНИЯ', 
        url: 'https://art.pixilart.com/80614900900a5df.gif',
        rarity: 'secret',
        type: 'gif'
    }
};

// Скины за клики (ПУТЬ)
const clickSkins = {
    'path1': { 
        name: 'ПУТЬ: Ледяной', 
        url: 'https://klev.club/uploads/posts/2023-11/1698878136_klev-club-p-arti-gorokhostrel-zombi-43.jpg',
        rarity: 'path',
        requiredClicks: 1000
    },
    'path2': { 
        name: 'ПУТЬ: Огненый', 
        url: 'https://pvsz2.ru/statics/plants-big/31.png',
        rarity: 'path',
        requiredClicks: 10000
    },
    'path3': { 
        name: 'ПУТЬ: теневой', 
        url: 'https://avatars.mds.yandex.net/i?id=69a2b4239be746c0863ff1d2bf2c2a75_l-8972142-images-thumbs&n=13',
        rarity: 'path',
        requiredClicks: 100000
    },
    'path4': { 
        name: 'ПУТЬ: грохомёт', 
        url: 'https://static.wikia.nocookie.net/fnaf-fanon-animatronics/images/b/bf/Gatling_Pea_Fixed.png/revision/latest/thumbnail/width/360/height/360?cb=20190519095836&path-prefix=ru',
        rarity: 'path',
        requiredClicks: 1000000
    },
    'path5': { 
        name: 'ПУТЬ: 2', 
        url: 'https://pvsz2.ru/statics/plants-big/90.png',
        rarity: 'path',
        requiredClicks: 15000000000
    },
    'path6': { 
        name: 'ПУТЬ: тристрел', 
        url: 'https://pvsz2.ru/statics/plants-big/104.png',
        rarity: 'path',
        requiredClicks: 500000000000
    },
    'path7': { 
        name: 'ПУТЬ: ЭЛЕКТРИЧЕСКИЙ грохострел', 
        url: 'https://png.klev.club/uploads/posts/2024-04/png-klev-club-f52r-p-gorokhostrel-png-12.png',
        rarity: 'path',
        requiredClicks: 6200000000000
    },
    'path8': { 
        name: 'ПУТЬ: гороховая хватка', 
        url: 'https://pvsz2.ru/statics/plants-big/127.png',
        rarity: 'path',
        requiredClicks: 333000000000000
    },
   'path9': { 
       name: 'ПУТЬ: spooky', 
        url: 'https://preview.redd.it/injured-peashooter-v0-le1sg6cjj1wd1.gif?width=640&crop=smart&auto=webp&s=9e04d13269ca86d3adf016d51bdb3e43dd9b4945',
        rarity: 'path',
        requiredClicks: 5
    },
    'path10': { 
       name: 'ПУТЬ: spooky', 
        url: 'https://avatars.mds.yandex.net/i?id=83945a8e52d0d41b0bd43a03b0b1de01b9ec670b-12813659-images-thumbs&n=13',
        rarity: 'path',
        requiredClicks: 963000000000000369
    }
};

// Скины тёмного солнца
const darkSkins = {
    'dark_common1': { 
        name: 'неизвестно', 
        url: 'https://static.wikia.nocookie.net/fnaf-fanon-animatronics/images/9/9b/%D0%A2%D1%91%D0%BC%D0%BD%D1%8B%D0%B9_%D0%B3%D0%BE%D1%80%D0%BE%D1%85%D0%BE%D1%81%D1%82%D1%80%D0%B5%D0%BB.png/revision/latest/thumbnail/width/360/height/360?cb=20200326034111&path-prefix=ru',
        rarity: 'common'
    },
    'dark_rare1': { 
        name: 'тёмная материя грохострела', 
        url: 'https://static.wikia.nocookie.net/fnaf-fanon-animatronics/images/e/e1/Goopeashooter.png/revision/latest?cb=20190928065425&path-prefix=ru',
        rarity: 'rare'
    },
    'dark_epic1': { 
        name: 'Тёмный грохострел с шляпкой', 
        url: 'https://static.wikia.nocookie.net/plantsvs-zombies/images/b/b0/Shadow_Peashooter_Costume_HD.png/revision/latest/scale-to-width-down/250?cb=20200612154633&path-prefix=ru',
        rarity: 'epic'
    },
    'dark_legendary1': { 
        name: 'нарисованый', 
        url: 'https://png.klev.club/uploads/posts/2024-04/png-klev-club-espz-p-gorokhostrel-png-4.png',
        rarity: 'legendary'
    },
    'dark_mythic1': { 
        name: 'ледяное 2', 
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjBj7ss86nUrKP6IEpSnCMN6_E57EFNoAEiA&s',
        rarity: 'mythic'
    },
    'dark_ultimate': { 
        name: 'МАЙНКРАФТ', 
        url: 'https://skinsmc.org/skinrender/aHR0cHM6Ly9za2luc21jLnMzLnVzLWVhc3QtMi5hbWF6b25hd3MuY29tLzM2OGUxNDYzMzUzZDRhOGRiNzAwNGM1N2Q5Yzg4MjA1',
        rarity: 'dark'
    }
};

// ДОПОЛНИТЕЛЬНЫЕ СКИНЫ ДЛЯ ДОРОГОГО КЕЙСА
const premiumSkins = {
    'premium_common1': { 
        name: 'нет грохострела', 
        url: 'https://static.wikia.nocookie.net/pvz-fusion/images/1/1e/PeaNut.png/revision/latest?cb=20250119164836&path-prefix=ru',
        rarity: 'common'
    },
    'premium_rare1': { 
        name: 'грохострел', 
        url: 'https://pvsz2.ru/statics/plants-big/171.png',
        rarity: 'rare'
    },
    'premium_epic2': { 
        name: 'огненый 2.0', 
        url: 'https://i.pinimg.com/236x/6e/4f/da/6e4fda417ab8bc18862e3a643c0fc49c.jpg',
        rarity: 'epic'
    },
    'premium_legendary1': { 
        name: 'не правильно!', 
        url: 'https://static.wikia.nocookie.net/pvz-fusion/images/1/1f/SuperTallNut_0.png/revision/latest/thumbnail/width/360/height/450?cb=20250119184636&path-prefix=ru',
        rarity: 'legendary'
    },
    'premium_pea1': { 
        name: '360 НОУ СКОП', 
        url: 'https://static.wikia.nocookie.net/pvz-fusion/images/4/4d/SniperPea_0.png/revision/latest/scale-to-width/360?cb=20250119140443&path-prefix=ru',
        rarity: 'pea'
    }
};

// Система Сил
let amuletPrice = 1000000;
let unlockedPowers = [];
let equippedPower = null;
let powerEffects = {};
let powerIntervals = {};

const powers = {
    'sunflower': {
        name: 'Подсолнух',
        rarity: 'common',
        effect: 'sunPerClick',
        value: 0.01,
        image: 'https://static.wikia.nocookie.net/fnaf-fanon-animatronics/images/3/31/Sunflower_HD.png/revision/latest?cb=20220211160002&path-prefix=ru'
    },
    'squash': {
        name: 'Кабачок',
        rarity: 'common',
        effect: 'dropPerSecond',
        value: 0.072,
        image: 'https://pvsz2.ru/statics/plants-big/93.png'
    },
    'walnut': {
        name: 'Орех',
        rarity: 'common',
        effect: 'dropPerClick',
        value: 0.03,
        image: 'https://static.wikia.nocookie.net/fnaf-fanon-animatronics/images/5/50/HD_%D0%9E%D1%80%D0%B5%D1%85_%D0%B8%D0%B7_%D0%B2%D1%80%D0%B5%D0%BC%D0%B5%D0%BD%D0%B8.png/revision/latest?cb=20220211210323&path-prefix=ru'
    },
    'potato': {
        name: 'Картошка-мина',
        rarity: 'rare',
        effect: 'periodicDrops',
        value: 0.1,
        interval: 115000,
        image: 'https://pvsz2.ru/statics/plants-big/72.png'
    },
    'chomper': {
        name: 'Чомпер',
        rarity: 'rare',
        effect: 'shopDiscount',
        value: 0.08,
        image: 'https://pvsz2.ru/statics/plants-big/18.png'
    },
    'garlic': {
        name: 'Чеснок',
        rarity: 'epic',
        effect: 'combo',
        value: 0.055,
        autoBuyInterval: 300000,
        autoBuyAmount: 3,
        image: 'https://pvsz2.ru/statics/plants-big/16.png'
    },
    'triplesunflower': {
        name: 'Тройной Подсолнух',
        rarity: 'epic',
        effect: 'sunPerClick',
        value: 0.03,
        image: 'https://static.wikia.nocookie.net/fnaf-fanon-animatronics/images/d/dc/Dirt_sun.png/revision/latest?cb=20200526085843&path-prefix=ru'
    },
    'cabbage': {
        name: 'Капуста',
        rarity: 'legendary',
        effect: 'itemDiscount',
        value: 0.05,
        image: 'https://static.wikia.nocookie.net/fnaf-fanon-animatronics/images/3/3f/Cabbage-pult.png/revision/latest?cb=20201123070549&path-prefix=ru'
    },
    'darkrose': {
        name: 'Мрачная Роза',
        rarity: 'mythic',
        effect: 'comboAdvanced',
        value: 0.07,
        autoBuyInterval: 210000,
        image: 'https://pvsz2.ru/statics/plants-big/39.png'
    },
    'primitivesunflower': {
        name: 'Первобытный Подсолнух',
        rarity: 'pea',
        effect: 'ultimate',
        value: 0.04,
        sunInterval: 240000,
        image: 'https://pvsz2.ru/statics/plants-big/76.png'
    }
};

// Текста для меняющихся слов (сокращено для экономии места)
const changingTexts = [
    "Кликай быстрее!",
    "привет", 
    "время это время", 
    "Вау! ты играешь в скучный кликер?",
    "абграбабара - Дейв",
    "Зомби отдыхают... лол", 
    "СМОТРИ В ИНФО ЛИСТЕ НИЧЕГО НЕТ!!! подождитека...!",
    "Стань НАКЛИКНУТЫМ КЛИКОМ КЛИКАМИ КЛИКОСИКИАМ!",
    "попробуй также в Coockie Clicker!", 
    "ты нищий?",
    "Кликай медленее!",
    "если честно эта игра то это сайт типо игры где ты кликаешь и зарабатывавешь капли воды хотя можешь пойти на кухню и попить воды",
    "витамин D", 
    "...",
    "следущая фраза не предсказывает будущее",
    "будешь богатым",
    "попытай удачи и иди в казик! ой то-есть открой кейс!", 
    "витамин C ой.. фотосинтез... ой да пошло",
    "cool... so what the tung sahur - cringe",
    "долго сидишь",
    "если честно эта игра то это сайт типо игры где ты кликаешь и зарабатывавешь капли воды хотя можешь пойти в туалет. стоп я это уже говорил?",
    "меня зовут печенька?",
    "ВЫЙДИ!",
    "ВТОРАЯ ПОПЫТКА: ВЫЙДИ!!!!", 
    "крутая система инвентаря?", 
    "вау как дорого стоит +250 на клик!",
    "... - второй раз", 
    "ОМГ В ИНФ ЛИСТ ДОБАВЯТ ЧТО - то В 1.0.2?!?!?!",
    "если честно эта игра то это сайт типо игры где ты кликаешь и зарабатывавешь капли воды хотя можешь пойти в см знаешь куда... и не шали",
    "солнцы это полезно?",
    "ВОБЩЕТО СОЛНЦЫ ЕТО НЕ КЛАСИВОЕ НАЗВАНИЕ", 
    "О НОУ, СОЛНЕЧНОЕ ЗАТМЕНИЕ!", 
    "где мой тако?",
    "следущая фраза предсказывает будущее",
    "будешь нищим",
    "ЛОЛ!",
    "мен лень!!!!!!!!!!!!",
    "Также будь хорошим и не жди обновления ивент: солнечное затмение",
    "я говорю всегда правду",
    "я не плохой и не люблю людей которые долбят телефон",
    "стэндоф 2 ... прекрати",
    "А ТЫ ИГЛАЕС В ЛОБЛОКС?!?!?!",
    "слушай... советую еакопить много солнц",
    "...  3 раз... лол зачем?",
    "АКЦИЯ! +0% КО ВСЕМ ЦЕНАМ!!",
    "зайди в тг пж",
    "СКОЛЬКО СДЕСЬ УЖЕ ФРАЗ?!",
    "бес гламатный - какойто чел... хз... не правда",
    "ты богатый, ты хороший! держи в себя руках и не пальцем комната...",
    "что здесь ещё придумать?",
    "ТЫ ПОЛУИЛ ГОРОХНЫЙ?",
    "О НОУ! ТУАЛЕТ ПАДАЕТ",
    "ты видишь как ты играешь в эту игру, которую создовали ??? веков ,а точнее миллисикунд",
    "1.0.5 - это круто",
    "привет",
    "это уже долго длится",
    "ЗНАЕШЬ! ТЫ НЕ ГЛУПЫЙ!!!! ТЫ...",
    "чё так мало капель?",
    "культ фотосинтеза",
    "ееее 1.1.0 скоро?",
    "О НОУ! грохострел ТЕПЕРЬ САМОЕ ДОРОГОЕ РАСТЕНИЕ!!!",
    "если в саду грохострела не будет то лор игры был бы бесполезен",
    "с вас 1000 капель за то что ты челдовек",
    "EZ",
    "бро пж сделай перерождене :(",
    "витамин грохострел",
    "послушай... ты реально долго сидишь сдесь",
    "я знаю всё о тебе!!!",
    "1 - сейчас 00:00 - 23:58 время",
    "2 - Ты сидишб или стоишь или кликаешь или лежишь или сидишележашотунг",
    "3 - ты играешь",
    "ЭТА ИГРА - САМАЯ ХУДШАЯ ПАРОДИЯ НА АНДЕРТЙЛ!!!!!!",
    "ты плохой?",
    "ты прав... ты ультранищий",
    "тызнаешьроналдо?",
    "кликни на белый кружок",
    "секретка",
    "67",
    "привет",
    "НЕТ ИДЕЙ ДЛЯ ЭТИХ СЛОВ!!",
    "туг тунг тунг сахур та та та сахур, у дин дин дин дун мадиндиндиндун, лирири ларира оркалеро оркала балерина капучина лилири лалира брр брр патапим тралалело тралала брр брр патапим трелалело тралала лилири лалира",
    "СПАСИБО! эта песня 10 из 10! - не так ли?",
    "ААААААААААААААААААААААА",
    "хочешь конфетку?",
    "ДААА ХОЧЕШЬ!!",
    "ААА БУГА БУГА",
    "НЕ СИДИ В ТУАЛЕТЕ!!! В 3 ЧАСА НОЧИ!!!!",
    "СТРАШНО?!",
    "ЩАС ИПУГАЮ!",
    "А4 стал адыкватным",
    "СТРАШНО БЫЛО?!",
    "тода иди в туалет >:(",
    "ВОЗРОЩЕНИЕ!",
    "любишь золото? не дам!",
    "что ещё сдесь может быть?",
    "а ты нашёл тестовое измерение?",
    "if click == 10000000 then click = 0",
    "я знаю... ты ничего не понял",
    "СЛУШАЙ!!!!!! ты знаешь его?",
    "может бы получить все достижения?",
    "+100 аура",
    "о да за подсказку аура :)",
    "-1000 аура",
    "._.",
    "теперь гниль мозга это мышь",
    "у морского моря горохострел сид.. у лукого моря... у луфушоного ... АААААА ХВАТИТ",
    "фразы фразами, которые фразы фраза-фраза фразуются фразами",
    "вы чувствуете газ",
    "может костёр?",
    "qwertyuiopasdfghjklzxcvbnm",
    "йцукенгшщзфывапролдячсмитьбю",
    "1 картошка + 1 морковка - сколько капуст и баклажанов",
    "слушай! а может ты не будешь чичерить??? ",
    "ты же не смотрел коды через код???",
    "туалет - это мусор",
    "...",
    "... ... -.--.....--.---.--.-...--.-.-.-. .---.-..-....-..--.-..-.",
    "ты понял что это?",
    "это послание...",
    "ШУТКА. ЕСЛИ ТЫ ЭТО ЧИТАЛ ТО ЭТО ПРОСТО НИЧЕГО!!!",
    "ФЫХ",
    "я устал... может иди уже?",
    "чтоб потрогать траву: 1 шаг: выйти на улицу. 2 шаг: потрогать траву",
];

// Элементы DOM
const scoreEl = document.getElementById('score');
const addEl = document.getElementById('add');
const buttonEl = document.getElementById('button');
const levelEl = document.getElementById('level');
const expEl = document.getElementById('exp');
const maxExpEl = document.getElementById('max-exp');
const progressBar = document.getElementById('level-progress');
const skinsContainer = document.getElementById('skins-container');
const notification = document.getElementById('notification');
const mainContent = document.getElementById('main-content');
const changingTextEl = document.getElementById('changing-text');
const sunScoreEl = document.getElementById('sun-score');
const equippedPowerEl = document.getElementById('equipped-power');
const powersContainer = document.getElementById('powers-container');
const amuletPriceEl = document.getElementById('amulet-price');

// ==================== ФУНКЦИИ ДЛЯ МОБИЛЬНЫХ ====================

// Определение мобильного устройства
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           window.innerWidth <= 768;
}

// Инициализация свайпов для мобильных
function initMobileSwipe() {
    if (!isMobileDevice()) return;
    
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    
    document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        startTime = Date.now();
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const endTime = Date.now();
        
        const diffX = startX - endX;
        const diffY = startY - endY;
        const timeDiff = endTime - startTime;
        
        // Быстрый свайп (менее 300мс)
        if (timeDiff < 300) {
            // Свайп вправо для закрытия
            if (diffX < -50 && Math.abs(diffX) > Math.abs(diffY)) {
                closeAllPanels();
            }
        }
    }, { passive: true });
}

// Адаптация интерфейса для мобильных
function adaptForMobile() {
    if (isMobileDevice()) {
        // Добавляем класс для мобильных
        document.body.classList.add('mobile-device');
        
        // Увеличиваем touch-зоны
        document.querySelectorAll('button, .upgrade-item, .interface-btn').forEach(btn => {
            btn.style.minHeight = '44px';
        });
        
        // Улучшаем скроллинг
        document.querySelectorAll('.shop-content, .powers-content, .other-content').forEach(el => {
            el.style.webkitOverflowScrolling = 'touch';
        });
    }
}

// ==================== ОСНОВНЫЕ ФУНКЦИИ ИГРЫ ====================

// Функция активации кодов (только один раз)
function activateCode(code) {
    const codeElement = document.getElementById('code-result');
    code = code.trim().toUpperCase();
    
    // Проверяем, был ли код уже использован
    if (usedCodes.includes(code)) {
        codeElement.style.color = '#e74c3c';
        codeElement.textContent = "❌ Этот код уже был использован!";
        return false;
    }
    
    let success = false;
    let message = '';
    
    switch(code) {
        case "HI":
            success = true;
            score += 100;
            message = "✅ Код HI активирован! +100 капель";
            break;
        case "2026":
            success = true;
            score += 2026;
            message = "✅ Код 2026 активирован! +2026 капель";
            break;
        case "PVZ":
            success = true;
            score += 10000;
            sunScore += 10;
            message = "✅ Код PVZ активирован! +10,000 капель и +10 солнц";
            break;
        case "ILOVECLICK":
            success = true;
            score += 2500;
            message = "✅ Код ILOVECLICK активирован! +2500 капель";
            break;
        case "ONLYMYGOODSUNANDMYBOOMTORIGHT":
            success = true;
            sunScore += 25;
            message = "✅ Код ONLYMYGOODSUNANDMYBOOMTORIGHT активирован! +25 солнц";
            break;
        case "IAMSTEVE":
            success = true;
            score += 15000;
            message = "✅ Код IAMSTEVE активирован! +15,000 капель";
            break;
        case "1057":
            if (unlockedSkins.includes('memories_1057')) {
                message = "❌ Вы уже получили скин 'ВОСПОМИНАНИЯ'!";
                success = false;
            } else {
                skins['memories_1057'] = {
                    name: 'ВОСПОМИНАНИЯ',
                    url: 'https://art.pixilart.com/80614900900a5df.gif',
                    rarity: 'secret',
                    type: 'gif'
                };
                unlockedSkins.push('memories_1057');
                unlockedAchievements.memoriesUnlocked = true;
                score += 55555;
                sunScore += 10;
                message = "🎉🎉🎉 Секретный код 1057 активирован! Получен скин 'ВОСПОМИНАНИЯ' +55,555 капель и +10 солнц";
                
                loadSkins();
                
                const link = document.getElementById('LINK');
                if (link) {
                    link.style.opacity = '1';
                    link.style.position = 'static';
                    link.style.top = 'auto';
                    link.style.color = '#ff0000';
                    link.style.fontWeight = 'bold';
                    link.style.margin = '20px';
                    link.style.display = 'block';
                    link.style.textAlign = 'center';
                    link.style.textDecoration = 'underline';
                }
                
                checkAchievements();
            }
            success = true;
            break;
        default:
            message = "❌ Неверный код!";
    }
    
    if (success) {
        usedCodes.push(code);
        updateDisplay();
        saveGame();
        codeElement.style.color = '#2ecc71';
    } else {
        codeElement.style.color = '#e74c3c';
    }
    
    codeElement.textContent = message;
    return success;
}

// Проверка достижений
function checkAchievements() {
    if (!unlockedAchievements.click1 && totalClicks >= 1) {
        unlockedAchievements.click1 = true;
        score += 1;
        showNotification("Первый клик! +1 капля");
        document.getElementById('gift-1').textContent = "Получено!";
        document.getElementById('gift-1').style.color = "#2ecc71";
        updateDisplay();
        saveGame();
    }
    
    if (!unlockedAchievements.click10 && totalClicks >= 10) {
        unlockedAchievements.click10 = true;
        score += 10;
        showNotification("10 кликов! +10 капель");
        document.getElementById('gift-2').textContent = "Получено!";
        document.getElementById('gift-2').style.color = "#2ecc71";
        updateDisplay();
        saveGame();
    }
    
    if (!unlockedAchievements.click100 && totalClicks >= 100) {
        unlockedAchievements.click100 = true;
        sunScore += 1;
        showNotification("100 кликов! +1 солнце");
        document.getElementById('gift-3').textContent = "Получено!";
        document.getElementById('gift-3').style.color = "#2ecc71";
        updateDisplay();
        saveGame();
    }
    
    if (!unlockedAchievements.click1000 && totalClicks >= 1000) {
        unlockedAchievements.click1000 = true;
        score += 10000;
        showNotification("1000 кликов! +10,000 капель");
        document.getElementById('gift-4').textContent = "Получено!";
        document.getElementById('gift-4').style.color = "#2ecc71";
        updateDisplay();
        saveGame();
    }
    
    if (!unlockedAchievements.click10000 && totalClicks >= 10000) {
        unlockedAchievements.click10000 = true;
        score += 1000000;
        showNotification("10,000 кликов! +1,000,000 капель");
        document.getElementById('gift-5').textContent = "Получено!";
        document.getElementById('gift-5').style.color = "#2ecc71";
        updateDisplay();
        saveGame();
    }
    
    if (!unlockedAchievements.click100000 && totalClicks >= 100000) {
        unlockedAchievements.click100000 = true;
        score += 1000000;
        sunScore += 100;
        showNotification("100,000 кликов! +1,000,000 капель и +100 солнц");
        document.getElementById('gift-6').textContent = "Получено!";
        document.getElementById('gift-6').style.color = "#2ecc71";
        updateDisplay();
        saveGame();
    }
    
    if (!unlockedAchievements.play15min && gameStartTime) {
        const playTime = Date.now() - gameStartTime;
        if (playTime >= 15 * 60 * 1000) {
            unlockedAchievements.play15min = true;
            score += 15000;
            sunScore += 15;
            showNotification("15 минут игры! +15,000 капель и +15 солнц");
            document.getElementById('gift-11').textContent = "Получено!";
            document.getElementById('gift-11').style.color = "#2ecc71";
            updateDisplay();
            saveGame();
        }
    }
    
    if (!unlockedAchievements.level10 && level >= 10) {
        unlockedAchievements.level10 = true;
        sunScore += 20;
        showNotification("10 уровень! +20 солнц");
        document.getElementById('gift-8').textContent = "Получено!";
        document.getElementById('gift-8').style.color = "#2ecc71";
        updateDisplay();
        saveGame();
    }
    
    if (!unlockedAchievements.level100 && level >= 100) {
        unlockedAchievements.level100 = true;
        sunScore += 250;
        showNotification("100 уровень! +250 солнц");
        document.getElementById('gift-9').textContent = "Получено!";
        document.getElementById('gift-9').style.color = "#2ecc71";
        updateDisplay();
        saveGame();
    }
    
    if (!unlockedAchievements.level1000 && level >= 1000) {
        unlockedAchievements.level1000 = true;
        sunScore += 2500;
        showNotification("1000 уровень! +2500 солнц");
        document.getElementById('gift-10').textContent = "Получено!";
        document.getElementById('gift-10').style.color = "#2ecc71";
        updateDisplay();
        saveGame();
    }
    
    if (!unlockedAchievements.memories && unlockedAchievements.memoriesUnlocked) {
        unlockedAchievements.memories = true;
        showNotification("Ты вспомнил...");
        document.getElementById('gift-7').textContent = "Получено!";
        document.getElementById('gift-7').style.color = "#2ecc71";
        saveGame();
    }
}

// Восстановление статуса достижений
function restoreAchievementsStatus() {
    for (let i = 1; i <= 11; i++) {
        const giftElement = document.getElementById(`gift-${i}`);
        if (giftElement) {
            giftElement.textContent = "Не Получено";
            giftElement.style.color = "#e74c3c";
        }
    }
    
    if (unlockedAchievements.click1) {
        document.getElementById('gift-1').textContent = "Получено!";
        document.getElementById('gift-1').style.color = "#2ecc71";
    }
    if (unlockedAchievements.click10) {
        document.getElementById('gift-2').textContent = "Получено!";
        document.getElementById('gift-2').style.color = "#2ecc71";
    }
    if (unlockedAchievements.click100) {
        document.getElementById('gift-3').textContent = "Получено!";
        document.getElementById('gift-3').style.color = "#2ecc71";
    }
    if (unlockedAchievements.click1000) {
        document.getElementById('gift-4').textContent = "Получено!";
        document.getElementById('gift-4').style.color = "#2ecc71";
    }
    if (unlockedAchievements.click10000) {
        document.getElementById('gift-5').textContent = "Получено!";
        document.getElementById('gift-5').style.color = "#2ecc71";
    }
    if (unlockedAchievements.click100000) {
        document.getElementById('gift-6').textContent = "Получено!";
        document.getElementById('gift-6').style.color = "#2ecc71";
    }
    if (unlockedAchievements.memories || unlockedAchievements.memoriesUnlocked) {
        document.getElementById('gift-7').textContent = "Получено!";
        document.getElementById('gift-7').style.color = "#2ecc71";
    }
    if (unlockedAchievements.level10) {
        document.getElementById('gift-8').textContent = "Получено!";
        document.getElementById('gift-8').style.color = "#2ecc71";
    }
    if (unlockedAchievements.level100) {
        document.getElementById('gift-9').textContent = "Получено!";
        document.getElementById('gift-9').style.color = "#2ecc71";
    }
    if (unlockedAchievements.level1000) {
        document.getElementById('gift-10').textContent = "Получено!";
        document.getElementById('gift-10').style.color = "#2ecc71";
    }
    if (unlockedAchievements.play15min) {
        document.getElementById('gift-11').textContent = "Получено!";
        document.getElementById('gift-11').style.color = "#2ecc71";
    }
}

// Сохранение игры
function saveGame() {
    const gameData = {
        score: score,
        addPerClick: addPerClick,
        addPerSecond: addPerSecond,
        level: level,
        exp: exp,
        maxExp: maxExp,
        totalClicks: totalClicks,
        unlockedSkins: unlockedSkins,
        currentSkin: currentSkin,
        casePrice: casePrice,
        sunScore: sunScore,
        sunPerClick: sunPerClick,
        click: click,
        unlockedAchievements: unlockedAchievements,
        activeBoosts: activeBoosts,
        priceMultipliers: priceMultipliers,
        usedCodes: usedCodes,
        gameStartTime: gameStartTime,
        amuletPrice: amuletPrice,
        unlockedPowers: unlockedPowers,
        equippedPower: equippedPower,
        powerEffects: powerEffects
    };
    localStorage.setItem('gorohostrelSave', JSON.stringify(gameData));
}

// Загрузка игры
function loadGame() {
    const saved = localStorage.getItem('gorohostrelSave');
    if (saved) {
        try {
            const gameData = JSON.parse(saved);
            
            score = gameData.score || 0;
            addPerClick = gameData.addPerClick || 1;
            addPerSecond = gameData.addPerSecond || 0;
            level = gameData.level || 1;
            exp = gameData.exp || 0;
            maxExp = gameData.maxExp || 100;
            totalClicks = gameData.totalClicks || 0;
            click = gameData.click || 0;
            currentSkin = gameData.currentSkin || 'default';
            casePrice = gameData.casePrice || 1250;
            sunScore = gameData.sunScore || 0;
            sunPerClick = gameData.sunPerClick || 0.01;
            usedCodes = gameData.usedCodes || [];
            gameStartTime = gameData.gameStartTime || Date.now();
            
            unlockedAchievements = gameData.unlockedAchievements || {
                click1: false,
                click10: false,
                click100: false,
                click1000: false,
                click10000: false,
                click100000: false,
                level10: false,
                level100: false,
                level1000: false,
                play15min: false,
                memoriesUnlocked: false
            };
            
            activeBoosts = gameData.activeBoosts || {
                exp: { active: false, multiplier: 1, endTime: 0 },
                sun: { active: false, multiplier: 1, endTime: 0 },
                drop: { active: false, multiplier: 1, endTime: 0 }
            };
            
            unlockedSkins = gameData.unlockedSkins || ['default'];
            
            // Сохраняем темные скины
            const allDarkSkins = Object.keys(darkSkins);
            allDarkSkins.forEach(skinId => {
                if (gameData.unlockedSkins && gameData.unlockedSkins.includes(skinId) && !unlockedSkins.includes(skinId)) {
                    unlockedSkins.push(skinId);
                }
            });
            
            priceMultipliers = gameData.priceMultipliers || {
                upgrades: {},
                autoClickers: {},
                sunExchanges: {},
                powers: {}
            };
            
            // Силы
            amuletPrice = gameData.amuletPrice || 1000000;
            unlockedPowers = gameData.unlockedPowers || [];
            equippedPower = gameData.equippedPower || null;
            powerEffects = gameData.powerEffects || {};
            
            // Проверяем скин ВОСПОМИНАНИЯ
            if (unlockedAchievements.memoriesUnlocked && !unlockedSkins.includes('memories_1057')) {
                skins['memories_1057'] = {
                    name: 'ВОСПОМИНАНИЯ',
                    url: 'https://art.pixilart.com/80614900900a5df.gif',
                    rarity: 'secret',
                    type: 'gif'
                };
                unlockedSkins.push('memories_1057');
            }
            
            return true;
        } catch (e) {
            console.error('Ошибка загрузки:', e);
            return false;
        }
    }
    return false;
}

// Меняющиеся фразы
function startChangingText() {
    let currentIndex = 0;
    changingTextEl.textContent = changingTexts[currentIndex];
    
    setInterval(() => {
        currentIndex = (currentIndex + 1) % changingTexts.length;
        changingTextEl.textContent = changingTexts[currentIndex];
    }, 7000);
}

function initChangingTextClick() {
    if (changingTextEl) {
        changingTextEl.style.cursor = 'pointer';
        changingTextEl.addEventListener('click', showNextText);
    }
}

let currentTextIndex = 0;
function showNextText() {
    currentTextIndex = (currentTextIndex + 1) % changingTexts.length;
    changingTextEl.textContent = changingTexts[currentTextIndex];
    
    changingTextEl.style.transform = 'scale(1.1)';
    setTimeout(() => {
        changingTextEl.style.transform = 'scale(1)';
    }, 200);
}

// Основной обработчик клика
function setupButton() {
    let isPressed = false;
    let clickCount = 0;
    let lastClickTime = 0;
    
    function handleClick() {
        const now = Date.now();
        if (now - lastClickTime < 50) return;
        
        lastClickTime = now;
        clickCount++;
        click++;
        
        let dropMultiplier = activeBoosts.drop.active ? activeBoosts.drop.multiplier : 1;
        let expMultiplier = activeBoosts.exp.active ? activeBoosts.exp.multiplier : 1;
        let sunMultiplier = activeBoosts.sun.active ? activeBoosts.sun.multiplier : 1;
        
        let dropBonus = addPerClick * dropMultiplier;
        let scoreB = addPerClick;
        let expBonus = 1 * expMultiplier;
        let sunBonus = sunPerClick * sunMultiplier;
        
        if (powerEffects.dropPerClick) {
            dropBonus += addPerClick * powerEffects.dropPerClick;
        }
        
        if (powerEffects.sunPerClick) {
            sunBonus += powerEffects.sunPerClick;
        }
        
        if (powerEffects.combo) {
            dropBonus += addPerClick * powerEffects.combo;
        }
        
        if (powerEffects.comboAdvanced) {
            dropBonus += addPerClick * powerEffects.comboAdvanced;
        }
        
        if (powerEffects.ultimate) {
            sunBonus += powerEffects.ultimate;
        }
        
        score += dropBonus;
        click += scoreB;
        exp += expBonus;
        sunScore += sunBonus;
        totalClicks += 1;
        
        checkAchievements();
        
        updateDisplay();
        checkLevelUp();
        checkSkinUnlocks();
        
        if (clickCount % 10 === 0) {
            saveGame();
        }
    }
    
    // Touch события
    buttonEl.addEventListener('touchstart', function(e) {
        e.preventDefault();
        isPressed = true;
        this.style.transform = 'translateY(-7px) scale(0.95)';
        handleClick();
    }, { passive: false });
    
    buttonEl.addEventListener('touchend', function() {
        isPressed = false;
        this.style.transform = 'translateY(0) scale(1)';
    }, { passive: false });
    
    buttonEl.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });
    
    // Mouse события
    buttonEl.addEventListener('mousedown', function() {
        isPressed = true;
        this.style.transform = 'translateY(-7px) scale(0.95)';
        handleClick();
    });
    
    buttonEl.addEventListener('mouseup', function() {
        isPressed = false;
        this.style.transform = 'translateY(0) scale(1)';
    });
    
    buttonEl.addEventListener('mouseleave', function() {
        if (isPressed) {
            isPressed = false;
            this.style.transform = 'translateY(0) scale(1)';
        }
    });
    
    // Автокликер
    let lastUpdate = 0;
    function gameLoop(timestamp) {
        if (timestamp - lastUpdate > 1000) {
            if (addPerSecond > 0) {
                let dropBonus = addPerSecond;
                
                if (powerEffects.dropPerSecond) {
                    dropBonus += addPerSecond * powerEffects.dropPerSecond;
                }
                
                score += dropBonus;
                updateDisplay();
                
                if (Date.now() % 60000 < 1000) {
                    saveGame();
                }
            }
            lastUpdate = timestamp;
        }
        requestAnimationFrame(gameLoop);
    }
    requestAnimationFrame(gameLoop);
}

// Покупка улучшения
function buyUpgrade(power, basePrice, requiredLevel = 1) {
    const upgradeKey = `upgrade_${power}_${basePrice}`;
    const currentMultiplier = priceMultipliers.upgrades[upgradeKey] || 1;
    let actualPrice = Math.round(basePrice * currentMultiplier);
    
    if (powerEffects.shopDiscount) {
        actualPrice = Math.round(actualPrice * (1 - powerEffects.shopDiscount));
    }
    
    if (score < actualPrice) {
        showNotification("Недостаточно капель!");
        return;
    }
    
    if (level < requiredLevel) {
        showNotification(`Требуется уровень ${requiredLevel}!`);
        return;
    }
    
    score -= actualPrice;
    addPerClick += power;
    
    priceMultipliers.upgrades[upgradeKey] = currentMultiplier * 1.1;
    
    updateDisplay();
    checkUpgradesAvailability();
    saveGame();
    showNotification(`Улучшение куплено! +${power} на клик`);
}

// Покупка авто-кликера
function buyAutoClicker(power, basePrice, requiredLevel = 1) {
    const autoClickerKey = `autoclicker_${power}_${basePrice}`;
    const currentMultiplier = priceMultipliers.autoClickers[autoClickerKey] || 1;
    let actualPrice = Math.round(basePrice * currentMultiplier);
    
    if (powerEffects.shopDiscount) {
        actualPrice = Math.round(actualPrice * (1 - powerEffects.shopDiscount));
    }
    
    if (score < actualPrice) {
        showNotification("Недостаточно капель!");
        return;
    }
    
    if (level < requiredLevel) {
        showNotification(`Требуется уровень ${requiredLevel}!`);
        return;
    }
    
    score -= actualPrice;
    addPerSecond += power;
    
    priceMultipliers.autoClickers[autoClickerKey] = currentMultiplier * 1.1;
    
    updateDisplay();
    checkUpgradesAvailability();
    saveGame();
    showNotification(`Авто-кликер куплен! +${power}/сек`);
}

// Покупка обмена солнц
function buySunExchange(drops, sunCost) {
    const exchangeKey = `exchange_${drops}_${sunCost}`;
    const currentMultiplier = priceMultipliers.sunExchanges[exchangeKey] || 1;
    const actualSunCost = Math.round(sunCost * currentMultiplier);
    
    if (sunScore < actualSunCost) {
        showNotification("Недостаточно солнц!");
        return;
    }
    
    const requiredLevel = parseInt(event.target.closest('.upgrade-item').getAttribute('data-level'));
    if (level < requiredLevel) {
        showNotification(`Требуется уровень ${requiredLevel}!`);
        return;
    }
    
    sunScore -= actualSunCost;
    score += drops;
    
    priceMultipliers.sunExchanges[exchangeKey] = currentMultiplier * 1.01;
    
    updateDisplay();
    checkUpgradesAvailability();
    saveGame();
    showNotification(`Получено ${drops} капель!`);
}

// Покупка предмета
function buyItem(itemType) {
    const button = event.target.closest('.upgrade-item');
    let price = parseInt(button.querySelector('.price-display').textContent);
    const requiredLevel = parseInt(button.getAttribute('data-level'));
    
    if (powerEffects.itemDiscount) {
        price = Math.round(price * (1 - powerEffects.itemDiscount));
    }
    
    if (sunScore < price) {
        showNotification("Недостаточно солнц!");
        return;
    }
    
    if (level < requiredLevel) {
        showNotification(`Требуется уровень ${requiredLevel}!`);
        return;
    }
    
    sunScore -= price;
    
    const boostDuration = 2 * 60 * 1000;
    
    switch(itemType) {
        case 'exp1':
            activeBoosts.exp = { active: true, multiplier: 2, endTime: Date.now() + boostDuration };
            showNotification("×2 опыта на 2 минуты!");
            break;
        case 'exp2':
            activeBoosts.exp = { active: true, multiplier: 5, endTime: Date.now() + boostDuration };
            showNotification("×5 опыта на 2 минуты!");
            break;
        case 'sunBoost':
            activeBoosts.sun = { active: true, multiplier: 2, endTime: Date.now() + boostDuration };
            showNotification("×2 солнц на 2 минуты!");
            break;
        case 'levelUp':
            level++;
            exp = 0;
            maxExp = Math.round(maxExp * 1.04);
            showNotification("Уровень повышен!");
            updateLevelDisplay();
            break;
        case 'dropBoost':
            activeBoosts.drop = { active: true, multiplier: 1.5, endTime: Date.now() + boostDuration };
            showNotification("×1.5 капель на 2 минуты!");
            break;
        case 'sunBoost2':
            activeBoosts.sun = { active: true, multiplier: 3, endTime: Date.now() + (3 * 60 * 1000) };
            showNotification("×3 солнц на 3 минуты!");
            break;
        case '???':
            activeBoosts.sun = { active: true, multiplier: 5, endTime: Date.now() + (5 * 60 * 1000) };
            activeBoosts.drop = { active: true, multiplier: 5, endTime: Date.now() + (5 * 60 * 1000) };
            showNotification("×5 на 5 минут!");
            break;
        case 'spooky':
            activeBoosts.drop = { active: true, multiplier: 2, endTime: Date.now() + boostDuration };
            showNotification("×2 на 2 мин капель!!");
            break;
        case 'spooky2':
            activeBoosts.exp = { active: true, multiplier: 75, endTime: Date.now() + (2 * 60 * 1000) };
            showNotification("×75 на 2 мин опыта!!!");
            break;
        case 'spooky3':
            activeBoosts.drop = { active: true, multiplier: 15, endTime: Date.now() + (20 * 1000) };
            showNotification("ЖМИ У ТЕБЯ 20 сек!!!!!!!!!!!!!!");
            break;
    }
    
    updateDisplay();
    checkUpgradesAvailability();
    saveGame();
}

// Покупка обычного кейса
function buyCase() {
    const basePrice = 1250;
    let actualPrice = basePrice;
    
    if (powerEffects.shopDiscount) {
        actualPrice = Math.round(actualPrice * (1 - powerEffects.shopDiscount));
    }
    
    if (score < actualPrice) {
        showNotification("Недостаточно капель!");
        return;
    }
    
    score -= actualPrice;
    
    const random = Math.random();
    let rarity = '';
    
    if (random < 0.00055) rarity = 'pea';
    else if (random < 0.00455) rarity = 'mythic';
    else if (random < 0.01455) rarity = 'legendary';
    else if (random < 0.10055) rarity = 'epic';
    else if (random < 0.40055) rarity = 'rare';
    else rarity = 'common';
    
    const allSkins = {...skins, ...darkSkins};
    const availableSkins = Object.keys(allSkins).filter(skinId => 
        allSkins[skinId].rarity === rarity && 
        skinId !== 'default' && 
        !unlockedSkins.includes(skinId)
    );
    
    if (availableSkins.length > 0) {
        const wonSkin = availableSkins[Math.floor(Math.random() * availableSkins.length)];
        unlockedSkins.push(wonSkin);
        
        if (rarity === 'pea') {
            showNotification(`🎉🎉🎉 НЕВЕРОЯТНО! ${allSkins[wonSkin].name} (ГОРОХНЫЙ)!!! 🎉🎉🎉`);
        } else {
            showNotification(`🎉 ${allSkins[wonSkin].name} (${rarity})!`);
        }
        
        loadSkins();
    } else {
        const compensation = Math.round(basePrice * (rarity === 'pea' ? 10 : 0.5));
        score += compensation;
        showNotification(`Все скины ${rarity} есть! +${compensation} капель`);
    }
    
    updateDisplay();
    checkUpgradesAvailability();
    saveGame();
}

// Покупка премиум кейса
function buyPowerCase() {
    const basePrice = 500000000;
    let actualPrice = basePrice;
    
    if (powerEffects.shopDiscount) {
        actualPrice = Math.round(actualPrice * (1 - powerEffects.shopDiscount));
    }
    
    if (score < actualPrice) {
        showNotification("Недостаточно капель!");
        return;
    }
    
    score -= actualPrice;
    
    const random = Math.random();
    let rarity = '';
    
    if (random < 0.00003) rarity = 'pea';
    else if (random < 0.01003) rarity = 'mythic';
    else if (random < 0.02503) rarity = 'legendary';
    else if (random < 0.10003) rarity = 'epic';
    else if (random < 0.30003) rarity = 'rare';
    else rarity = 'common';
    
    const allPremiumSkins = {...premiumSkins};
    const availableSkins = Object.keys(allPremiumSkins).filter(skinId => 
        allPremiumSkins[skinId].rarity === rarity && 
        !unlockedSkins.includes(skinId)
    );
    
    if (availableSkins.length > 0) {
        const wonSkin = availableSkins[Math.floor(Math.random() * availableSkins.length)];
        unlockedSkins.push(wonSkin);
        
        if (rarity === 'pea') {
            showNotification(`🎉🎉🎉 НЕВЕРОЯТНО! ${allPremiumSkins[wonSkin].name} (ГОРОХНЫЙ)!!! 🎉🎉🎉`);
        } else {
            showNotification(`🎉 Премиум скин: ${allPremiumSkins[wonSkin].name} (${rarity})!`);
        }
        
        loadSkins();
    } else {
        const compensation = Math.round(basePrice * 0.3);
        score += compensation;
        showNotification(`Все премиум скины ${rarity} есть! +${compensation} капель`);
    }
    
    updateDisplay();
    saveGame();
}

// Покупка амулета
function buyAmulet() {
    if (score < amuletPrice) {
        showNotification("Недостаточно капель!");
        return;
    }
    
    score -= amuletPrice;
    
    const random = Math.random();
    let rarity = '';
    
    if (random < 0.00005) rarity = 'pea';
    else if (random < 0.00255) rarity = 'mythic';
    else if (random < 0.00755) rarity = 'legendary';
    else if (random < 0.03255) rarity = 'epic';
    else if (random < 0.21255) rarity = 'rare';
    else rarity = 'common';
    
    const availablePowers = Object.keys(powers).filter(powerId => 
        powers[powerId].rarity === rarity && 
        !unlockedPowers.includes(powerId)
    );
    
    if (availablePowers.length > 0) {
        const wonPower = availablePowers[Math.floor(Math.random() * availablePowers.length)];
        unlockedPowers.push(wonPower);
        
        if (rarity === 'pea') {
            showNotification(`🎉🎉🎉 НЕВЕРОЯТНО! ${powers[wonPower].name} (ГОРОХНЫЙ)!!! 🎉🎉🎉`);
        } else {
            showNotification(`🎉 Получена сила: ${powers[wonPower].name} (${rarity})!`);
        }
        
        loadPowers();
    } else {
        const compensation = Math.round(amuletPrice * 0.5);
        score += compensation;
        showNotification(`Все силы ${rarity} есть! +${compensation} капель`);
    }
    
    amuletPrice = Math.min(Math.round(amuletPrice * 1.25), 1000000000000);
    updateAmuletPrice();
    
    updateDisplay();
    saveGame();
}

// Обновление цены амулета
function updateAmuletPrice() {
    if (amuletPriceEl) {
        amuletPriceEl.textContent = amuletPrice.toLocaleString();
    }
}

// Загрузка Сил
function loadPowers() {
    if (!powersContainer) return;
    
    powersContainer.innerHTML = '';
    
    unlockedPowers.forEach(powerId => {
        if (powers[powerId]) {
            const power = powers[powerId];
            const powerItem = document.createElement('button');
            powerItem.className = `power-item ${equippedPower === powerId ? 'active' : ''}`;
            powerItem.onclick = () => togglePower(powerId);
            
            powerItem.innerHTML = `
                <img src="${power.image}" alt="${power.name}" onerror="this.style.display='none'">
                <div>${power.name}</div>
                <small>${power.rarity}</small>
            `;
            
            powersContainer.appendChild(powerItem);
        }
    });
}

// Переключение Силы
function togglePower(powerId) {
    if (equippedPower === powerId) {
        unequipPower();
    } else {
        if (equippedPower) {
            unequipPower();
        }
        equipPower(powerId);
    }
    
    loadPowers();
    saveGame();
}

// Экипировка Силы
function equipPower(powerId) {
    equippedPower = powerId;
    const power = powers[powerId];
    
    if (equippedPowerEl) {
        equippedPowerEl.style.backgroundImage = `url(${power.image})`;
    }
    
    applyPowerEffect(powerId);
    
    showNotification(`Сила "${power.name}" экипирована!`);
}

// Снятие Силы
function unequipPower() {
    if (equippedPower) {
        const power = powers[equippedPower];
        
        removePowerEffect(equippedPower);
        
        if (equippedPowerEl) {
            equippedPowerEl.style.backgroundImage = 'none';
        }
        
        showNotification(`Сила "${power.name}" снята!`);
        equippedPower = null;
    }
}

// Применение эффектов Силы
function applyPowerEffect(powerId) {
    const power = powers[powerId];
    
    switch(power.effect) {
        case 'sunPerClick':
            powerEffects.sunPerClick = power.value;
            break;
        case 'dropPerSecond':
            powerEffects.dropPerSecond = power.value;
            break;
        case 'dropPerClick':
            powerEffects.dropPerClick = power.value;
            break;
        case 'periodicDrops':
            startPeriodicDrops(power);
            break;
        case 'shopDiscount':
            powerEffects.shopDiscount = power.value;
            break;
        case 'itemDiscount':
            powerEffects.itemDiscount = power.value;
            break;
        case 'combo':
            powerEffects.combo = power.value;
            startAutoBuy(power);
            break;
        case 'comboAdvanced':
            powerEffects.comboAdvanced = power.value;
            startAdvancedAutoBuy(power);
            break;
        case 'ultimate':
            powerEffects.ultimate = power.value;
            startUltimateEffects(power);
            break;
    }
    
    updatePowerEffects();
}

// Удаление эффектов Силы
function removePowerEffect(powerId) {
    const power = powers[powerId];
    
    switch(power.effect) {
        case 'sunPerClick':
            delete powerEffects.sunPerClick;
            break;
        case 'dropPerSecond':
            delete powerEffects.dropPerSecond;
            break;
        case 'dropPerClick':
            delete powerEffects.dropPerClick;
            break;
        case 'periodicDrops':
            if (powerIntervals.periodicDrops) {
                clearInterval(powerIntervals.periodicDrops);
                delete powerIntervals.periodicDrops;
            }
            break;
        case 'shopDiscount':
            delete powerEffects.shopDiscount;
            break;
        case 'itemDiscount':
            delete powerEffects.itemDiscount;
            break;
        case 'combo':
            delete powerEffects.combo;
            if (powerIntervals.autoBuy) {
                clearInterval(powerIntervals.autoBuy);
                delete powerIntervals.autoBuy;
            }
            break;
        case 'comboAdvanced':
            delete powerEffects.comboAdvanced;
            if (powerIntervals.advancedAutoBuy) {
                clearInterval(powerIntervals.advancedAutoBuy);
                delete powerIntervals.advancedAutoBuy;
            }
            break;
        case 'ultimate':
            delete powerEffects.ultimate;
            if (powerIntervals.ultimate) {
                clearInterval(powerIntervals.ultimate);
                delete powerIntervals.ultimate;
            }
            break;
    }
    
    updatePowerEffects();
}

// Периодические бонусы
function startPeriodicDrops(power) {
    powerIntervals.periodicDrops = setInterval(() => {
        const bonus = Math.round(score * power.value);
        score += bonus;
        showNotification(`Картошка-мина дала +${bonus} капель!`);
        updateDisplay();
        saveGame();
    }, power.interval);
}

function startAutoBuy(power) {
    powerIntervals.autoBuy = setInterval(() => {
        addPerClick += power.autoBuyAmount;
        showNotification(`Чеснок автоматически купил +${power.autoBuyAmount} на клик!`);
        updateDisplay();
        saveGame();
    }, power.autoBuyInterval);
}

function startAdvancedAutoBuy(power) {
    powerIntervals.advancedAutoBuy = setInterval(() => {
        const amount = score < 1000000000000 ? 500000 : 1000000;
        addPerClick += amount;
        showNotification(`Мрачная роза купила +${amount} на клик!`);
        updateDisplay();
        saveGame();
    }, power.autoBuyInterval);
}

function startUltimateEffects(power) {
    powerIntervals.ultimate = setInterval(() => {
        const sunBonus = sunScore < 100 ? 10 : 50;
        sunScore += sunBonus;
        showNotification(`Первобытный подсолнух дал +${sunBonus} солнц!`);
        updateDisplay();
        saveGame();
    }, power.sunInterval);
}

function updatePowerEffects() {
    updateDisplay();
    checkUpgradesAvailability();
}

// Проверка доступности улучшений
function checkUpgradesAvailability() {
    const upgradeButtons = document.querySelectorAll('.upgrade-item');
    
    upgradeButtons.forEach(button => {
        const priceElement = button.querySelector('.price-display') || button.querySelector('span');
        let basePrice = 0;
        
        if (priceElement) {
            basePrice = parseInt(button.getAttribute('data-base-price')) || 
                       parseInt(priceElement.textContent.replace(/,/g, '')) || 0;
            
            if (!button.getAttribute('data-base-price')) {
                button.setAttribute('data-base-price', basePrice);
            }
        }
        
        let actualPrice = basePrice;
        const onclick = button.getAttribute('onclick');
        
        if (onclick) {
            if (onclick.includes('buyUpgrade')) {
                const match = onclick.match(/buyUpgrade\((\d+),\s*(\d+)/);
                if (match) {
                    const power = parseInt(match[1]);
                    const basePrice = parseInt(match[2]);
                    const upgradeKey = `upgrade_${power}_${basePrice}`;
                    const multiplier = priceMultipliers.upgrades[upgradeKey] || 1;
                    actualPrice = Math.round(basePrice * multiplier);
                    
                    if (powerEffects.shopDiscount) {
                        actualPrice = Math.round(actualPrice * (1 - powerEffects.shopDiscount));
                    }
                }
            }
            else if (onclick.includes('buyAutoClicker')) {
                const match = onclick.match(/buyAutoClicker\(([\d.]+),\s*(\d+)/);
                if (match) {
                    const power = parseFloat(match[1]);
                    const basePrice = parseInt(match[2]);
                    const autoClickerKey = `autoclicker_${power}_${basePrice}`;
                    const multiplier = priceMultipliers.autoClickers[autoClickerKey] || 1;
                    actualPrice = Math.round(basePrice * multiplier);
                    
                    if (powerEffects.shopDiscount) {
                        actualPrice = Math.round(actualPrice * (1 - powerEffects.shopDiscount));
                    }
                }
            }
            else if (onclick.includes('buySunExchange')) {
                const match = onclick.match(/buySunExchange\((\d+),\s*(\d+)/);
                if (match) {
                    const drops = parseInt(match[1]);
                    const sunCost = parseInt(match[2]);
                    const exchangeKey = `exchange_${drops}_${sunCost}`;
                    const multiplier = priceMultipliers.sunExchanges[exchangeKey] || 1;
                    actualPrice = Math.round(sunCost * multiplier);
                }
            }
            else if (onclick.includes('buyItem')) {
                const priceElement = button.querySelector('.price-display');
                if (priceElement) {
                    let price = parseInt(button.getAttribute('data-base-price')) || 
                               parseInt(priceElement.textContent.replace(/,/g, '')) || 0;
                    
                    if (!button.getAttribute('data-base-price')) {
                        button.setAttribute('data-base-price', price);
                    }
                    
                    if (powerEffects.itemDiscount) {
                        price = Math.round(price * (1 - powerEffects.itemDiscount));
                    }
                    actualPrice = price;
                }
            }
            else if (onclick.includes('buyCase') || onclick.includes('buyPowerCase')) {
                const priceElement = button.querySelector('.price-display');
                if (priceElement) {
                    let price = parseInt(button.getAttribute('data-base-price')) || 
                               parseInt(priceElement.textContent.replace(/,/g, '')) || 0;
                    
                    if (!button.getAttribute('data-base-price')) {
                        button.setAttribute('data-base-price', price);
                    }
                    
                    if (powerEffects.shopDiscount) {
                        price = Math.round(price * (1 - powerEffects.shopDiscount));
                    }
                    actualPrice = price;
                }
            }
        }
        
        if (priceElement) {
            priceElement.textContent = actualPrice.toLocaleString();
        }
        
        const requiredLevel = parseInt(button.getAttribute('data-level')) || 1;
        
        let canAfford = false;
        if (onclick && onclick.includes('buySunExchange')) {
            canAfford = sunScore >= actualPrice;
        } else if (onclick && (onclick.includes('buyUpgrade') || onclick.includes('buyAutoClicker') || onclick.includes('buyCase') || onclick.includes('buyPowerCase'))) {
            canAfford = score >= actualPrice;
        } else if (onclick && onclick.includes('buyItem')) {
            canAfford = sunScore >= actualPrice;
        } else {
            canAfford = true;
        }
        
        if (canAfford && level >= requiredLevel) {
            button.disabled = false;
            button.style.background = 'lightblue';
            button.style.cursor = 'pointer';
            button.style.opacity = '1';
            
            // На мобильных
            if (isMobileDevice()) {
                button.style.minHeight = '50px';
                button.style.display = 'flex';
                button.style.flexDirection = 'column';
                button.style.justifyContent = 'center';
                button.style.alignItems = 'center';
            }
        } else {
            button.disabled = true;
            button.style.background = '#7f8c8d';
            button.style.cursor = 'not-allowed';
            button.style.opacity = '0.6';
        }
    });
}

// Проверка разблокировки скинов
function checkSkinUnlocks() {
    const allSkins = {...skins, ...clickSkins, ...darkSkins, ...premiumSkins};
    let unlockedNew = false;
    
    for (const skinId in clickSkins) {
        if (!unlockedSkins.includes(skinId)) {
            const skin = clickSkins[skinId];
            if (totalClicks >= skin.requiredClicks) {
                unlockedSkins.push(skinId);
                showNotification(`🎉 Разблокирован скин: ${skin.name}!`);
                unlockedNew = true;
            }
        }
    }
    
    if (unlockedNew) {
        loadSkins();
        saveGame();
    }
}

// Загрузка скинов
function loadSkins() {
    if (!skinsContainer) return;
    
    skinsContainer.innerHTML = '';
    const allSkins = {...skins, ...clickSkins, ...darkSkins, ...premiumSkins};
    
    unlockedSkins.forEach(skinId => {
        if (allSkins[skinId]) {
            const skin = allSkins[skinId];
            const skinItem = document.createElement('button');
            skinItem.className = `skin-item ${currentSkin === skinId ? 'active' : ''}`;
            skinItem.onclick = () => selectSkin(skinId);
            
            const isGif = skin.type === 'gif' || skin.url.includes('.gif');
            
            skinItem.innerHTML = `
                <div style="width:60px;height:60px;position:relative;margin:0 auto 5px;">
                    ${isGif ? 
                        `<img src="${skin.url}" 
                              style="width:100%;height:100%;object-fit:contain;
                                     border-radius:10px;">` :
                        `<div style="width:100%;height:100%;background-image:url(${skin.url});
                                background-size:contain;background-position:center;
                                background-repeat:no-repeat;border-radius:10px;"></div>`
                    }
                </div>
                <div>${skin.name}</div>
                <small>${skin.rarity}</small>
            `;
            
            // На мобильных
            if (isMobileDevice()) {
                skinItem.style.minHeight = '120px';
                skinItem.style.padding = '10px';
            }
            
            skinsContainer.appendChild(skinItem);
        }
    });
}

const style = document.createElement('style');
style.textContent = `
    #button {
        position: relative;
        overflow: hidden;
    }
    
    #button img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
        pointer-events: none;
        z-index: 1;
    }
    
    .skin-item img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
`;
document.head.appendChild(style);

// Выбор скина
function selectSkin(skinId) {
    const allSkins = {...skins, ...clickSkins, ...darkSkins, ...premiumSkins};
    if (allSkins[skinId]) {
        currentSkin = skinId;
        const skin = allSkins[skinId];
        
        const isGif = skin.type === 'gif' || 
                     skin.url.includes('.gif') || 
                     skin.url.includes('giphy') ||
                     skin.url.includes('preview.redd.it');
        
        if (isGif) {
            buttonEl.style.backgroundImage = 'none';
            buttonEl.innerHTML = `<img src="${skin.url}" 
                                     style="width:100%;height:100%;object-fit:contain;
                                            position:absolute;top:0;left:0;z-index:1;
                                            pointer-events:none;">`;
        } else {
            buttonEl.style.backgroundImage = `url(${skin.url})`;
            buttonEl.innerHTML = '';
        }
        
        loadSkins();
        saveGame();
    }
}

// Уведомление
function showNotification(message) {
    if (!notification) return;
    
    notification.textContent = message;
    notification.classList.add('show');
    
    // Адаптация для мобильных
    if (isMobileDevice()) {
        notification.style.fontSize = '14px';
        notification.style.padding = '12px';
        notification.style.borderRadius = '8px';
        notification.style.maxWidth = 'calc(100vw - 40px)';
        notification.style.left = '20px';
        notification.style.right = '20px';
        notification.style.margin = '0 auto';
    }
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Проверка уровня
function checkLevelUp() {
    while (exp >= maxExp) {
        level++;
        exp -= maxExp;
        maxExp = Math.round(maxExp * 1.04);
        showNotification(`🎉 Уровень ${level}!`);
    }
    updateLevelDisplay();
}

// Обновление отображения
function updateDisplay() {
    if (scoreEl) scoreEl.textContent = Math.floor(score).toLocaleString();
    if (addEl) addEl.textContent = addPerClick.toLocaleString();
    if (sunScoreEl) sunScoreEl.textContent = sunScore.toFixed(2);
}

// Обновление уровня
function updateLevelDisplay() {
    if (levelEl) levelEl.textContent = level;
    if (expEl) expEl.textContent = Math.floor(exp);
    if (maxExpEl) maxExpEl.textContent = maxExp;
    const progressPercent = (exp / maxExp) * 100;
    if (progressBar) progressBar.style.width = `${progressPercent}%`;
}

// Проверка бустов
function startBoostChecker() {
    setInterval(() => {
        const now = Date.now();
        let updated = false;
        
        for (const boostType in activeBoosts) {
            if (activeBoosts[boostType].active && now > activeBoosts[boostType].endTime) {
                activeBoosts[boostType].active = false;
                activeBoosts[boostType].multiplier = 1;
                updated = true;
            }
        }
        
        if (updated) saveGame();
    }, 1000);
}

// ==================== УПРАВЛЕНИЕ ПАНЕЛЯМИ ====================

// Магазин
function toggleShop() {
    const shopPanel = document.getElementById('shop-panel');
    const overlay = document.getElementById('overlay');
    
    if (isMobileDevice()) {
        shopPanel.style.transition = 'right 0.3s ease-out';
    }
    
    if (shopPanel && overlay) {
        shopPanel.classList.toggle('active');
        overlay.classList.toggle('active');
        mainContent.classList.toggle('shop-open');
        checkUpgradesAvailability();
        
        // На мобильных фокусируемся на первой вкладке
        if (isMobileDevice() && shopPanel.classList.contains('active')) {
            setTimeout(() => {
                const firstTab = document.querySelector('.shop-tab.active');
                if (firstTab) {
                    firstTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }
            }, 100);
        }
    }
}

function closeShop() {
    const shopPanel = document.getElementById('shop-panel');
    const overlay = document.getElementById('overlay');
    if (shopPanel && overlay) {
        shopPanel.classList.remove('active');
        overlay.classList.remove('active');
        mainContent.classList.remove('shop-open');
    }
}

// Инвентарь
function toggleInventory() {
    const inventoryPanel = document.getElementById('inventory-panel');
    const overlay = document.getElementById('overlay');
    if (inventoryPanel && overlay) {
        inventoryPanel.classList.toggle('active');
        overlay.classList.toggle('active');
    }
}

function closeInventory() {
    const inventoryPanel = document.getElementById('inventory-panel');
    const overlay = document.getElementById('overlay');
    if (inventoryPanel && overlay) {
        inventoryPanel.classList.remove('active');
        overlay.classList.remove('active');
    }
}

// Силы
function togglePowers() {
    const powersPanel = document.getElementById('powers-panel');
    const overlay = document.getElementById('overlay');
    
    if (isMobileDevice()) {
        powersPanel.style.transition = 'left 0.3s ease-out';
    }
    
    if (powersPanel && overlay) {
        powersPanel.classList.toggle('active');
        overlay.classList.toggle('active');
        mainContent.classList.toggle('powers-open');
    }
}

function closePowers() {
    const powersPanel = document.getElementById('powers-panel');
    const overlay = document.getElementById('overlay');
    if (powersPanel && overlay) {
        powersPanel.classList.remove('active');
        overlay.classList.remove('active');
        mainContent.classList.remove('powers-open');
    }
}

// Другое
function toggleOther() {
    const otherPanel = document.getElementById('other-panel');
    const overlay = document.getElementById('overlay');
    
    if (isMobileDevice()) {
        otherPanel.style.transition = 'right 0.3s ease-out';
    }
    
    if (otherPanel && overlay) {
        otherPanel.classList.toggle('active');
        overlay.classList.toggle('active');
        mainContent.classList.toggle('other-open');
    }
}

function closeOther() {
    const otherPanel = document.getElementById('other-panel');
    const overlay = document.getElementById('overlay');
    if (otherPanel && overlay) {
        otherPanel.classList.remove('active');
        overlay.classList.remove('active');
        mainContent.classList.remove('other-open');
    }
}

// Закрыть все панели
function closeAllPanels() {
    closeShop();
    closeInventory();
    closePowers();
    closeOther();
}

// Открытие табов
function openShopTab(tabName) {
    document.querySelectorAll('.shop-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.shop-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    const tabElement = document.getElementById(`${tabName}-tab`);
    if (tabElement) {
        tabElement.classList.add('active');
    }
    event.target.classList.add('active');
    checkUpgradesAvailability();
}

function openPowersTab(tabName) {
    document.querySelectorAll('.powers-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.powers-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    const tabElement = document.getElementById(`${tabName}-tab`);
    if (tabElement) {
        tabElement.classList.add('active');
    }
    event.target.classList.add('active');
    
    if (tabName === 'amulet') {
        updateAmuletPrice();
    }
}

function openOtherTab(tabName) {
    document.querySelectorAll('.other-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.other-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    const tabElement = document.getElementById(`${tabName}-tab`);
    if (tabElement) {
        tabElement.classList.add('active');
    }
    event.target.classList.add('active');
}

// ==================== ИНИЦИАЛИЗАЦИЯ ИГРЫ ====================

function initGame() {
    loadGame();
    updateDisplay();
    updateLevelDisplay();
    updateAmuletPrice();
    loadSkins();
    loadPowers();
    setupButton();
    startChangingText();
    initChangingTextClick();
    checkSkinUnlocks();
    checkUpgradesAvailability();
    startBoostChecker();
    restoreAchievementsStatus();
    initMobileSwipe();
    adaptForMobile();
    
    // Восстанавливаем экипированную силу
    if (equippedPower && powers[equippedPower]) {
        if (equippedPowerEl) {
            equippedPowerEl.style.backgroundImage = `url(${powers[equippedPower].image})`;
        }
        applyPowerEffect(equippedPower);
    }
    
    // Восстанавливаем текущий скин
    const allSkins = {...skins, ...clickSkins, ...darkSkins, ...premiumSkins};
    if (currentSkin && allSkins[currentSkin]) {
        buttonEl.style.backgroundImage = `url(${allSkins[currentSkin].url})`;
    }
    
    // Инициализируем форму кодов
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const textarea = this.querySelector('textarea');
            const code = textarea.value.trim();
            
            if (code) {
                activateCode(code);
                textarea.value = '';
            }
        });
    }
}

// Автосохранение
setInterval(() => {
    saveGame();
}, 30000);

// Обработка изменения ориентации
window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        checkUpgradesAvailability();
        updateDisplay();
    }, 300);
});

// Запуск игры
window.addEventListener('load', initGame);
