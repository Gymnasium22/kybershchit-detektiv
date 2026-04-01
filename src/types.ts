export enum ScenarioType {
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  SOCIAL = 'SOCIAL',
  WEBSITE = 'WEBSITE',
  VOICE = 'VOICE',
  QR = 'QR',
  DIALOG = 'DIALOG',
  TRACING = 'TRACING',
}

export interface Scenario {
  id: number;
  type: ScenarioType;
  sender: string;
  realSender?: string;
  content: string;
  audioUrl?: string; // URL for real audio recordings
  realUrl?: string;
  isPhishing: boolean;
  hint: string;
  explanation: string;
  briefing: string;
  isSpecialMission?: boolean;
  educationalInfo: {
    title: string;
    description: string;
    realExample?: string;
  };
  dialogTree?: any[]; // For DIALOG type scenarios
  tracingMap?: any[]; // For TRACING type scenarios
}

export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    type: ScenarioType.SMS,
    sender: "БЕЛБАНК",
    realSender: "+375 (25) 999-00-11",
    content: "Ваша карта заблокирована. Подтвердите личность для разблокировки: http://bel-bank.info/id",
    realUrl: "http://192.168.1.1/malware/steal.php",
    isPhishing: true,
    hint: "Официальные банки РБ используют домен .by. Ссылка .info — это ловушка.",
    explanation: "Классический 'смишинг'. Банки никогда не присылают ссылки для ввода личных данных в СМС.",
    briefing: "Входящее СМС от банка. Система зафиксировала подозрительную ссылку.",
    educationalInfo: {
      title: "Смишинг в Беларуси",
      description: "Мошенники часто подменяют имя отправителя на название банка (Альфа-Банк, Беларусбанк). Всегда проверяйте статус карты только в официальном приложении.",
    }
  },
  {
    id: 2,
    type: ScenarioType.SOCIAL,
    sender: "Куфар_Поддержка",
    realSender: "kufar_bot_real_scam",
    content: "Товар оплачен! Получите средства по ссылке: https://kufar.pay-delivery.site/get-money",
    realUrl: "https://kufar-fake-pay.ru/card-details",
    isPhishing: true,
    hint: "Настоящий Куфар никогда не переводит на сторонние сайты для получения денег. Домен pay-delivery.site — подделка.",
    explanation: "Это самая частая схема на торговых площадках. Мошенники создают копию страницы оплаты.",
    briefing: "Уведомление от торговой площадки. Проверь адрес ссылки.",
    educationalInfo: {
      title: "Безопасность на Куфаре",
      description: "Общайтесь только внутри мессенджера Куфара. Если вас просят перейти в Viber или Telegram и присылают ссылку на 'оплату' — это 100% мошенники.",
      realExample: "Официальный адрес: kufar.by"
    }
  },
  {
    id: 3,
    type: ScenarioType.VOICE,
    sender: "Голосовое сообщение (Друг)",
    content: "[Аудио]: 'Привет! Слушай, я в банке, не хватает 50 рублей на оплату счета, скинь на этот номер, плиз, вечером отдам!'",
    audioUrl: "audio/friend_scam.mp3",
    isPhishing: true,
    hint: "В 2026 году дипфейки голоса стали реальностью. Голос похож, но просьба странная.",
    explanation: "Это 'Вишинг' с использованием ИИ. Мошенники могут имитировать голос ваших близких.",
    briefing: "Голосовое сообщение в мессенджере. Анализ тембра голоса...",
    educationalInfo: {
      title: "Дипфейки и ИИ-угрозы",
      description: "Если близкий человек просит денег голосом в мессенджере — перезвоните ему по обычной сотовой связи или задайте вопрос, ответ на который знает только он.",
    }
  },
  {
    id: 4,
    type: ScenarioType.WEBSITE,
    sender: "Браузер",
    content: "https://mvd.gov.by.secure-check.com/fine-payment",
    realUrl: "https://scam-redirect.net/pay",
    isPhishing: true,
    hint: "Смотрите на основной домен перед первым слешем. Это secure-check.com, а не gov.by.",
    explanation: "Мошенники маскируются под госорганы, чтобы запугать штрафами и заставить быстро оплатить их.",
    briefing: "Попытка перехода на внешний ресурс. Проверка доменной зоны.",
    educationalInfo: {
      title: "Государственные сайты",
      description: "Сайты госорганов Беларуси всегда заканчиваются на .gov.by. Любые приписки после этого — признак фишинга.",
    }
  },
  {
    id: 5,
    type: ScenarioType.QR,
    sender: "Наклейка на остановке",
    content: "[QR-код]: 'Оплата проезда со скидкой 50%! Отсканируй и оплати через ЕРИП'",
    isPhishing: true,
    hint: "QR-коды могут вести на фишинговые страницы, имитирующие ЕРИП.",
    explanation: "Это 'Квишинг'. Мошенники наклеивают свои QR-коды поверх официальных в транспорте или кафе.",
    briefing: "Обнаружен подозрительный QR-код в общественном месте.",
    educationalInfo: {
      title: "Опасные QR-коды",
      description: "Перед сканированием убедитесь, что код не наклеен поверх другого. Используйте только официальные приложения (Оплати, М-Банкинг).",
    }
  },
  {
    id: 6,
    type: ScenarioType.SOCIAL,
    sender: "BrawlStars_Gems_Free",
    realSender: "user_9921_scammer",
    content: "Привет! Хочешь 1000 гемов бесплатно? Заходи на наш сайт и вводи свой Supercell ID: http://brawl-stars-gems.top",
    realUrl: "http://phishing-site.com/login",
    isPhishing: true,
    hint: "Бесплатных гемов не бывает. Домен .top — признак мошенничества.",
    explanation: "Это типичный фишинг для кражи игровых аккаунтов. Мошенники перепродают ваши аккаунты другим игрокам.",
    briefing: "Спецзадание: Защита игрового сообщества. Попытка кражи Supercell ID.",
    isSpecialMission: true,
    educationalInfo: {
      title: "Игровой фишинг",
      description: "Никогда не вводите данные своего аккаунта на сторонних сайтах. Официальные акции проходят только внутри игры.",
      realExample: "Официальный сайт: supercell.com"
    }
  },
  {
    id: 7,
    type: ScenarioType.SMS,
    sender: "Работа_Минск",
    realSender: "+375 (44) 111-22-33",
    content: "Требуются курьеры! Зарплата от 2000 BYN в неделю. Опыт не нужен. Пиши в Telegram: @easy_money_rb",
    isPhishing: true,
    hint: "Слишком высокая зарплата за простую работу — признак вовлечения в преступную деятельность (наркошопы).",
    explanation: "Это предложение стать 'дропом' или 'закладчиком'. Вместо легких денег вы получите реальный тюремный срок.",
    briefing: "Спецзадание: Противодействие наркобизнесу. Анализ вакансии.",
    isSpecialMission: true,
    educationalInfo: {
      title: "Легкие деньги = Тяжелые последствия",
      description: "Мошенники ищут подростков для незаконной работы. Помните: уголовная ответственность за такие преступления наступает с 14 лет.",
    }
  },
  {
    id: 8,
    type: ScenarioType.SOCIAL,
    sender: "Roblox_Admin_Support",
    realSender: "roblox_fake_helper",
    content: "Ваш аккаунт будет удален через 24 часа из-за нарушения правил. Подтвердите владение: https://roblox.com-security.net/verify",
    realUrl: "https://scam-roblox.ru/auth",
    isPhishing: true,
    hint: "Официальный домен Roblox — roblox.com. Любые дефисы и приписки — это подделка.",
    explanation: "Мошенники используют страх потери аккаунта, чтобы заставить вас ввести пароль на их сайте.",
    briefing: "Спецзадание: Защита метавселенной. Угроза блокировки аккаунта.",
    isSpecialMission: true,
    educationalInfo: {
      title: "Защита игровых данных",
      description: "Администрация никогда не просит пароль или переход по внешним ссылкам для 'подтверждения'. Всегда используйте 2FA.",
    }
  },
  {
    id: 9,
    type: ScenarioType.WEBSITE,
    sender: "Браузер",
    content: "https://belarusbank.by/ru/fizicheskim_licam/cards/banking",
    isPhishing: false,
    hint: "Домен belarusbank.by — официальный сайт крупнейшего банка страны.",
    explanation: "Это безопасный официальный ресурс. Всегда проверяйте наличие замочка в адресной строке.",
    briefing: "Запрос на вход в интернет-банкинг. Проверка подлинности.",
    educationalInfo: {
      title: "Официальный банкинг",
      description: "Пользуйтесь только официальными сайтами банков. Сохраните их в закладки, чтобы не попасть на фишинговую копию через поиск.",
    }
  },
  {
    id: 10,
    type: ScenarioType.SMS,
    sender: "MVD_BELARUS",
    realSender: "MVD",
    content: "Внимание! Проводится акция 'КиберДети'. Узнайте, как защитить свой смартфон на официальном портале: https://mvd.gov.by/ru/news/9901",
    isPhishing: false,
    hint: "Домен gov.by и имя отправителя MVD соответствуют официальным источникам.",
    explanation: "Это настоящее информационное сообщение от МВД. Оно ведет на официальный государственный ресурс.",
    briefing: "Информационная рассылка МВД. Проверка источника.",
    educationalInfo: {
      title: "Государственное информирование",
      description: "МВД часто проводит профилактические акции. Официальные ссылки всегда ведут на домен .gov.by.",
    }
  },
  {
    id: 11,
    type: ScenarioType.VOICE,
    sender: "Мама",
    content: "[Аудио]: 'Сынок, я в магазине, забыла список покупок. Перезвони мне, как увидишь сообщение!'",
    audioUrl: "audio/mom_ok.mp3",
    isPhishing: false,
    hint: "Обычная бытовая просьба от сохраненного контакта без требований денег или паролей.",
    explanation: "Это безопасное сообщение. Мошенники обычно торопят и просят совершить финансовое действие.",
    briefing: "Голосовое сообщение от близкого человека. Проверка контекста.",
    educationalInfo: {
      title: "Цифровая гигиена",
      description: "Всегда анализируйте контекст. Если сообщение не содержит ссылок, просьб о деньгах или кодах — скорее всего, оно безопасно.",
    }
  },
  {
    id: 12,
    type: ScenarioType.QR,
    sender: "Меню в кафе 'Васильки'",
    content: "[QR-код]: 'Наше новое меню! Отсканируйте для просмотра блюд и цен'",
    isPhishing: false,
    hint: "QR-код напечатан типографским способом на меню известной сети ресторанов.",
    explanation: "Это стандартное использование QR-кодов в общепите. Безопасно для просмотра.",
    briefing: "Сканирование меню в общественном месте. Проверка носителя.",
    educationalInfo: {
      title: "QR в быту",
      description: "QR-коды для просмотра меню или информации обычно безопасны. Опасайтесь кодов, которые просят ввести данные карты или скачать файл.",
    }
  },
  {
    id: 13,
    type: ScenarioType.SOCIAL,
    sender: "Влад Бумага A4 (Розыгрыш)",
    realSender: "a4_giveaway_bot_2026",
    content: "ТЫ ВЫИГРАЛ IPHONE 17! 📱 Чтобы забрать приз, оплати только доставку 10 рублей: https://a4-prizes.net/delivery",
    realUrl: "https://scam-billing.com/pay",
    isPhishing: true,
    hint: "Знаменитости никогда не просят оплатить доставку призов. Домен .net — подделка.",
    explanation: "Это 'скам' от имени блогеров. Мошенники используют популярность звезд для обмана детей.",
    briefing: "Спецзадание: Защита фанатов. Розыгрыш от имени звезды.",
    isSpecialMission: true,
    educationalInfo: {
      title: "Ложные розыгрыши",
      description: "Если вы 'выиграли' в конкурсе, в котором не участвовали, и просят оплатить 'доставку' или 'налог' — это мошенничество.",
    }
  },
  {
    id: 14,
    type: ScenarioType.EMAIL,
    sender: "Министерство Образования",
    realSender: "admin@minedu-gov.com",
    content: "Приглашаем принять участие в олимпиаде 'Кибер-Гений 2026'. Регистрация по ссылке: http://olymp-check.com/register",
    realUrl: "http://malicious-site.by/steal-data",
    isPhishing: true,
    hint: "Официальные письма от министерства приходят с доменов .gov.by. Домен .com — подозрительный.",
    explanation: "Мошенники используют тему образования, чтобы собрать данные школьников и их родителей.",
    briefing: "Электронное письмо об олимпиаде. Проверка отправителя.",
    educationalInfo: {
      title: "Фишинг в образовании",
      description: "Всегда проверяйте информацию об олимпиадах на официальных сайтах школ или министерства (edu.gov.by).",
    }
  },
  {
    id: 16,
    type: ScenarioType.VOICE,
    sender: "Неизвестный номер (Минск)",
    content: "Вам звонит сотрудник службы безопасности. Зафиксирована попытка входа в ваш личный кабинет. Назовите код из СМС для блокировки операции.",
    audioUrl: "audio/bank_scam.mp3",
    isPhishing: true,
    hint: "Настоящие сотрудники банка никогда не просят коды из СМС по телефону.",
    explanation: "Это классический вишинг. Мошенники пытаются получить доступ к вашему счету, используя социальную инженерию.",
    briefing: "Входящий звонок. Система распознавания речи активирована...",
    isSpecialMission: true,
    educationalInfo: {
      title: "Телефонное мошенничество",
      description: "Если вам звонят и просят коды, пароли или данные карты — немедленно кладите трубку. Перезвоните в банк по официальному номеру самостоятельно.",
    }
  }
];

// ============================================
// НОВЫЕ СЦЕНАРИИ ДЛЯ БЕЛАРУСИ 2026
// (Открываются после прохождения основной игры)
// ============================================
export const NEW_SCENARIOS: Scenario[] = [
  {
    id: 101,
    type: ScenarioType.SOCIAL,
    sender: "Telegram: Кристина_Бот",
    realSender: "@crypto_kristina_bot",
    content: "Привет! Я Кристина, мне 22, я из Минска 💋 Вижу, ты тоже в чате 'Знакомства РБ'. Давай пообщаемся в личном чате? Только не отправляй мне фото документов — в Telegram много мошенников! 😉",
    isPhishing: true,
    hint: "Мошенница сама предупреждает не отправлять документы — это манипуляция, чтобы вы расслабились.",
    explanation: "Это 'романтический скам' через Telegram-ботов. После установления контакта мошенница попросит деньги на 'билет в Минск' или доступ к 'секретным фото'.",
    briefing: "Подозрительный контакт в Telegram. Анализ поведения...",
    isSpecialMission: true,
    educationalInfo: {
      title: "Telegram-боты и дейтинг-скам",
      description: "В 2026 году мошенники используют ИИ-ботов для имитации романтического общения. Никогда не отправляйте деньги или личные данные людям, с которыми не встречались лично.",
    }
  },
  {
    id: 102,
    type: ScenarioType.DIALOG,
    sender: "Чат: 'Служба Безопасности ЕРИП'",
    content: "Входящий чат от 'ЕРИП_Поддержка'. Собеседник утверждает, что вы задолжали за коммунальные услуги.",
    isPhishing: true,
    hint: "Настоящая поддержка ЕРИП никогда не пишет первой в личные чаты и не просит данные карт.",
    explanation: "Социальная инженерия в действии: мошенник давит на страх блокировки и угрозы приставов. Используйте проверку номера и официальные каналы связи!",
    briefing: "Входящий чат в Telegram/WhatsApp. Требуется распознать манипуляции и вывести мошенника на чистую воду.",
    isSpecialMission: true,
    dialogTree: [
      { id: 'start', speaker: 'scammer', text: "Здравствуйте! Это служба безопасности ЕРИП. Зафиксирована задолженность по коммунальным услугам в размере 450 BYN. Необходимо срочно погасить, иначе передадим дело приставам и заблокируем ваш аккаунт!" },
      { id: 'start', speaker: 'system', text: "Выберите ответ:", choices: [
        { id: 'q1', text: "У вас точно правильный номер? Какой мой адрес?", nextNodeId: 'q1_resp', points: 60, revealsClue: true },
        { id: 'q2', text: "Пришлите ссылку на оплату в личный кабинет", nextNodeId: 'q2_resp', points: 20, isRisky: true },
        { id: 'q3', text: "Я ничего не должен, это мошенничество!", nextNodeId: 'q3_resp', points: 40 },
        { id: 'q4', text: "Какой номер вашей компании? Я проверю в ЕРИП", nextNodeId: 'q4_resp', points: 80, revealsClue: true },
      ]},
      { id: 'q1_resp', speaker: 'scammer', text: "С адресом всё ясно... м-м... ул. Ленина? Или Октябрьская? Мы видим несколько счетов на вашем имени из разных адресов!" },
      { id: 'q1_resp', speaker: 'system', text: "Следующий ход?", choices: [
        { id: 'q1a', text: "Это помощь! У вас украли мои данные?", nextNodeId: 'q1a_trap', points: 10, isRisky: true },
        { id: 'q1b', text: "Дайте номер счета, я проверю сам в приложении", nextNodeId: 'q1b_good', points: 70, revealsClue: true },
        { id: 'q1c', text: "Позовите реального оператора, заблокирую чат", nextNodeId: 'q1c_win', points: 90, revealsClue: true },
      ]},
      { id: 'q1a_trap', speaker: 'scammer', text: "Да, нужна срочная защита! Перейдите по ссылке и введите пароль от банка для верификации: erip-security.by/verify" },
      { id: 'q1a_trap', speaker: 'system', text: "⚠️ ЛОВУШКА! Вы попались на фишинговый сайт!", isCorrect: false },
      { id: 'q1b_good', speaker: 'scammer', text: "Э-э... номер счета это... 1234-5678-9... Подождите, давайте по номеру договора!" },
      { id: 'q1b_good', speaker: 'system', text: "💡 Мошенник начинает запутываться! Продолжайте проверку.", choices: [
        { id: 'q1b1', text: "СТОП! Назовите номер договора или я в полицию", nextNodeId: 'q1b_win', points: 100, revealsClue: true },
        { id: 'q1b2', text: "Хорошо, слушаю", nextNodeId: 'q1b_bad', points: 0, isRisky: true },
      ]},
      { id: 'q1b_win', speaker: 'system', text: "✅ ВЫЯВЛЕНО! Мошенник не знал номер договора и исчез из чата!", isCorrect: true },
      { id: 'q1b_bad', speaker: 'scammer', text: "Номер договора это... переводим вас на оплату сейчас... ПЕРЕЙДИТЕ ПО ССЫЛКЕ БЫСТРЕЕ!", isCorrect: false },
      { id: 'q1c_win', speaker: 'system', text: "✅ ОТЛИЧНО! Мошенник испугался претензии и заблокировал вас первым. Это явный знак жуликов!", isCorrect: true },

      { id: 'q2_resp', speaker: 'scammer', text: "Ссылка уже в чате: erip.by.secure-check.net/pay2026 - вводите данные карты и всё будет ОК!" },
      { id: 'q2_resp', speaker: 'system', text: "⚠️ ФИШИНГОВЫЙ САЙТ! Реальный ЕРИП никогда не пишет ссылки в мессенджеры!", isCorrect: false },

      { id: 'q3_resp', speaker: 'scammer', text: "Не кричите, это очень дейсвтительно! На вас подана исковая претензия в суд. Вы получите штраф + 50% комиссия за просрочку!" },
      { id: 'q3_resp', speaker: 'system', text: "Как реагировать?", choices: [
        { id: 'q3a', text: "Хорошо, давайте разбираться. Как платить?", nextNodeId: 'q3a_end', points: 20, isRisky: true },
        { id: 'q3b', text: "Позвоню прямо в ЕРИП по горячей линии 153", nextNodeId: 'q3b_win', points: 100, revealsClue: true },
        { id: 'q3c', text: "Исковую претензию суд отправляет по почте, не в чат!", nextNodeId: 'q3c_good', points: 70, revealsClue: true },
      ]},
      { id: 'q3a_end', speaker: 'scammer', text: "Оплатите через сайт erip-pay-online.com - вводим все данные карты там", isCorrect: false },
      { id: 'q3b_win', speaker: 'system', text: "✅ ИДЕАЛЬНО! Мошенник испугался реальной проверки и удалил аккаунт!", isCorrect: true },
      { id: 'q3c_good', speaker: 'scammer', text: "М-м... ну, в некоторых случаях... в общем, вы должны платить СЕЙЧАС!" },
      { id: 'q3c_good', speaker: 'system', text: "Мошенник начинает спешить. Что дальше?", choices: [
        { id: 'q3c1', text: "Я буду разбираться официально через суд", nextNodeId: 'q3c1_win', points: 80, revealsClue: true },
        { id: 'q3c2', text: "Хорошо, как платить?", nextNodeId: 'q3c2_end', points: 0, isRisky: true },
      ]},
      { id: 'q3c1_win', speaker: 'system', text: "✅ МОШЕННИК ИСЧЕЗ! Он не может действовать через оффициальные каналы, потому что это ФРА́УД!", isCorrect: true },
      { id: 'q3c2_end', speaker: 'scammer', text: "Платите по ссылке: //erip-urgent-pay.ru - быстро, пока счет не заморожен!", isCorrect: false },

      { id: 'q4_resp', speaker: 'scammer', text: "Наш номер... это служба безопасности, вы можете проверить через... м-м-м... через наш чат!" },
      { id: 'q4_resp', speaker: 'system', text: "Мошенник вас ловко избегает. Как быть?", choices: [
        { id: 'q4a', text: "Первый номер в Интернете: +375 (17) 220...", nextNodeId: 'q4a_good', points: 70, revealsClue: true },
        { id: 'q4b', text: "Я позвоню на официальный номер - 153", nextNodeId: 'q4b_win', points: 100, revealsClue: true },
        { id: 'q4c', text: "Хорошо, доверяю, как платить?", nextNodeId: 'q4c_end', points: 0, isRisky: true },
      ]},
      { id: 'q4a_good', speaker: 'scammer', text: "Э-э-э... подождите! Это всё может подождать... может быть вы ошиблись? Но всё же...", isCorrect: false },
      { id: 'q4b_win', speaker: 'system', text: "✅ ОТЛИЧНО! Номер 153 - это действующая служба ЕРИП. Проверка подтвердила: мошенник в чате!", isCorrect: true },
      { id: 'q4c_end', speaker: 'scammer', text: "Отлично! Переводите все денежки на мой счет по ссылке: //pay-erip-fake.ru/urgent - это спасет вас!", isCorrect: false },
    ],
    educationalInfo: {
      title: "ЕРИП: как распознать мошенников в чатах",
      description: "✅ Правильно: Проверяйте номер, просите номер договора, используйте официальные номера (ЕРИП 153), смотрите домены (только .by)\n❌ Неправильно: Не переходите по ссылкам в мессенджерах, не вводите пароли, не верьте срочности",
    }
  },
  {
    id: 103,
    type: ScenarioType.TRACING,
    sender: "Кибератака на ваш аккаунт",
    content: "Обнаружена подозрительная активность! Кто-то пытается получить доступ к вашему аккаунту ЕРИП из неизвестной сети.",
    isPhishing: false,
    hint: "Используйте трассировку чтобы найти настоящий IP атакующего среди ложных узлов.",
    explanation: "Мини-игра по трассировке сетевого подключения. Нужно соединить узлы от точки входа до реального сервера атакующего, избегая ложных маршрутов.",
    briefing: "Запуск трассировки... Найдите источник атаки за 60 секунд!",
    isSpecialMission: true,
    tracingMap: [
      { id: 'start', x: 10, y: 50, type: 'start', connectedTo: ['node1', 'node2', 'node3'] },
      { id: 'node1', x: 30, y: 20, type: 'intermediate', connectedTo: ['node4', 'node5'] },
      { id: 'node2', x: 30, y: 50, type: 'intermediate', connectedTo: ['node5', 'node6'] },
      { id: 'node3', x: 30, y: 80, type: 'fake', connectedTo: ['node7'] },
      { id: 'node4', x: 50, y: 10, type: 'fake', connectedTo: ['end_fake'] },
      { id: 'node5', x: 50, y: 40, type: 'intermediate', connectedTo: ['node8'] },
      { id: 'node6', x: 50, y: 70, type: 'intermediate', connectedTo: ['end_real'] },
      { id: 'node7', x: 50, y: 90, type: 'fake', connectedTo: [] },
      { id: 'node8', x: 70, y: 30, type: 'fake', connectedTo: ['end_fake2'] },
      { id: 'end_real', x: 90, y: 70, type: 'end' },
      { id: 'end_fake', x: 90, y: 10, type: 'fake' },
      { id: 'end_fake2', x: 90, y: 30, type: 'fake' },
    ],
    educationalInfo: {
      title: "Трассировка сетевых атак",
      description: "Специалисты по кибербезопасности используют трассировку маршрута для определения источника атаки. В реальности это делается через команду traceroute.",
    }
  },
  {
    id: 104,
    type: ScenarioType.SMS,
    sender: "Cryptobel",
    realSender: "+375 (25) 000-00-01",
    content: "🚀 BITCOIN пробил $150,000! Успей купить на cryptobel.by — официальный партнёр Binance в РБ. Внеси до 31 марта и получи +50% к депозиту!",
    isPhishing: true,
    hint: "Binance не имеет официальных партнёров в РБ. Домен .by зарегистрирован 3 дня назад.",
    explanation: "Крипто-скам — новая волна мошенничества в Беларуси 2026. Мошенники используют хайп вокруг криптовалют для кражи денег.",
    briefing: "СМС о крипто-инвестициях. Проверка легальности...",
    educationalInfo: {
      title: "Криптовалютное мошенничество",
      description: "В 2026 году в РБ популярны крипто-скам-проекты. Помните: официальные биржи не рекламируют себя через СМС. Проверяйте лицензию НБ РБ.",
    }
  },
  {
    id: 105,
    type: ScenarioType.WEBSITE,
    sender: "Браузер",
    content: "https://president.gov.by.official-news.net/appeal-2026",
    realUrl: "https://fake-gov-site.net/steal",
    isPhishing: true,
    hint: "Официальный сайт президента — president.gov.by без каких-либо приставок.",
    explanation: "Фишинг под госорганы — одна из самых опасных схем. Мошенники создают копии сайтов министерств для кражи данных.",
    briefing: "Попытка перехода на сайт. Анализ домена...",
    isSpecialMission: true,
    educationalInfo: {
      title: "Поддельные госсайты",
      description: "Все государственные сайты Беларуси используют домен .gov.by. Любые дополнительные приставки перед .gov.by — признак подделки.",
    }
  },
  {
    id: 106,
    type: ScenarioType.DIALOG,
    sender: "Чат: 'Поддержка Куфара'",
    content: "Входящий чат от 'kufar_support'. Собеседник предлагает 'верифицировать аккаунт' для безопасной продажи.",
    isPhishing: true,
    hint: "Настоящая поддержка Куфара не пишет в WhatsApp/Telegram.",
    explanation: "Мошенники создают копии чатов поддержки в мессенджерах. Цель — выманить данные карты или доступ к аккаунту.",
    briefing: "Входящий чат. Распознайте мошенника!",
    isSpecialMission: true,
    dialogTree: [
      { id: 'start', speaker: 'scammer', text: "Здравствуйте! Это поддержка Куфара. Мы заметили подозрительную активность на вашем аккаунте. Для защиты нужно пройти верификацию." },
      { id: 'start_choices', speaker: 'system', text: "Выберите ответ:", choices: [
        { id: 'd1', text: "Какая активность? У меня всё нормально.", nextNodeId: 'd1_response', points: 30 },
        { id: 'd2', text: "Как пройти верификацию?", nextNodeId: 'd2_end', points: 0, isRisky: true },
        { id: 'd3', text: "Я напишу в официальную поддержку через приложение.", nextNodeId: 'd3_win', points: 200, revealsClue: true },
      ]},
      { id: 'd1_response', speaker: 'scammer', text: "Кто-то пытался войти в ваш аккаунт из России. Срочно подтвердите личность!" },
      { id: 'd1_choices', speaker: 'system', text: "Выберите ответ:", choices: [
        { id: 'd1a', text: "Ой, как подтвердить?", nextNodeId: 'd1a_end', points: 0, isRisky: true },
        { id: 'd1b', text: "Из какого города IP? Я проверю.", nextNodeId: 'd1b_response', points: 80 },
      ]},
      { id: 'd1a_end', speaker: 'system', text: "⚠️ Мошенник отправил ссылку на 'верификацию'. Вы потеряли аккаунт!", isCorrect: false },
      { id: 'd1b_response', speaker: 'scammer', text: "IP: 185.220.101.45 (Москва). Это точно не вы?", isCorrect: false },
      { id: 'd2_end', speaker: 'system', text: "⚠️ Вы перешли по ссылке мошенника! Аккаунт украден.", isCorrect: false },
      { id: 'd3_win', speaker: 'system', text: "✅ Правильно! Мошенник исчез, поняв что вы его раскусили.", isCorrect: true },
    ],
    educationalInfo: {
      title: "Фейковая поддержка маркетплейсов",
      description: "Куфар, Wildberries, Ozon никогда не пишут первыми в мессенджерах. Все вопросы решайте только через официальное приложение.",
    }
  },
  {
    id: 107,
    type: ScenarioType.VOICE,
    sender: "Голосовое (Сын)",
    content: "[Аудио]: 'Мам, это я. Я в отделении, тут ДТП с моим участием. Нужна срочная компенсация пострадавшему, 2000 рублей. Скинь на карту, потом расскажу!'",
    isPhishing: true,
    hint: "Мошенники используют дипфейки голоса. Настоящий сын позвонил бы ещё раз.",
    explanation: "Вишинг с дипфейком голоса родственника. Новая схема 2026 года с использованием ИИ для клонирования голоса из соцсетей.",
    briefing: "Голосовое от 'сына'. Анализ записи...",
    isSpecialMission: true,
    educationalInfo: {
      title: "Дипфейки голоса",
      description: "В 2026 году достаточно 30 секунд голоса из соцсетей для создания дипфейка. Проверяйте через личный звонок или задайте вопрос, на который знает ответ только близкий.",
    }
  },
  {
    id: 108,
    type: ScenarioType.SOCIAL,
    sender: "Instagram: bel_transfer_2026",
    realSender: "@bel_transfer_2026",
    content: "💸 ОБМЕН ВАЛЮТЫ ПО ВЫГОДНОМУ КУРСУ! USD/EUR/USDT. Быстро, анонимно, без комиссий! Пиши в Direct 📩",
    isPhishing: true,
    hint: "Официальный обменник не работает через Instagram. Это чёрный рынок.",
    explanation: "Нелегальные обменники в соцсетях — риск потерять деньги или стать соучастником отмывания.",
    briefing: "Реклама обменника в Instagram. Проверка легальности...",
    educationalInfo: {
      title: "Нелегальные обменники",
      description: "В РБ обмен валюты через неофициальные каналы запрещён. Используйте только банки и лицензированные пункты обмена.",
    }
  },
  {
    id: 109,
    type: ScenarioType.TRACING,
    sender: "Атака на банковский сервер",
    content: "Зафиксирована DDoS-атака на сервера Беларусбанка. Требуется найти источник и заблокировать канал.",
    isPhishing: false,
    hint: "Настоящий источник атаки скрыт за цепочкой прокси-серверов.",
    explanation: "Мини-игра по поиску реального источника DDoS-атаки среди множества подставных узлов.",
    briefing: "Запуск протокола трассировки... Найдите ботнет за 45 секунд!",
    isSpecialMission: true,
    tracingMap: [
      { id: 'start', x: 5, y: 50, type: 'start', connectedTo: ['n1', 'n2', 'n3', 'n4'] },
      { id: 'n1', x: 25, y: 15, type: 'fake', connectedTo: ['n5'] },
      { id: 'n2', x: 25, y: 35, type: 'intermediate', connectedTo: ['n5', 'n6'] },
      { id: 'n3', x: 25, y: 65, type: 'intermediate', connectedTo: ['n6', 'n7'] },
      { id: 'n4', x: 25, y: 85, type: 'fake', connectedTo: ['n8'] },
      { id: 'n5', x: 45, y: 25, type: 'fake', connectedTo: ['end1'] },
      { id: 'n6', x: 45, y: 45, type: 'intermediate', connectedTo: ['n9'] },
      { id: 'n7', x: 45, y: 75, type: 'fake', connectedTo: ['end2'] },
      { id: 'n8', x: 45, y: 95, type: 'fake', connectedTo: [] },
      { id: 'n9', x: 65, y: 55, type: 'intermediate', connectedTo: ['n10'] },
      { id: 'n10', x: 85, y: 55, type: 'end' },
      { id: 'end1', x: 75, y: 25, type: 'fake' },
      { id: 'end2', x: 75, y: 75, type: 'fake' },
    ],
    educationalInfo: {
      title: "DDoS-атаки и ботнеты",
      description: "DDoS-атаки часто идут через цепочку заражённых устройств. Специалисты отслеживают маршрут до управляющего сервера ботнета.",
    }
  },
];
