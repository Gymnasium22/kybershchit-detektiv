export enum ScenarioType {
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  SOCIAL = 'SOCIAL',
  WEBSITE = 'WEBSITE',
  VOICE = 'VOICE',
  QR = 'QR',
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
    hint: "Настоящая поддержка ЕРИП никогда не пишет первой и не просит данные карт.",
    explanation: "Социальная инженерия в действии: мошенник давит на страх блокировки и пытается выманить данные карты или доступ к банковскому приложению.",
    briefing: "Входящий чат. Требуется распознать манипуляции и вывести мошенника на чистую воду.",
    isSpecialMission: true,
    dialogTree: [
      { id: 'start', speaker: 'scammer', text: "Здравствуйте! Это служба безопасности ЕРИП. Зафиксирована задолженность по вашим лицевым счетам за коммунальные услуги в размере 450 BYN. Необходимо срочно погасить, иначе передадим дело приставам." },
      { id: 'start_choices', speaker: 'system', text: "Выберите ответ:", choices: [
        { id: 'c1', text: "Какие лицевые счета? У меня только одна квартира.", nextNodeId: 'c1_response', points: 50 },
        { id: 'c2', text: "Я ничего не должен! Отстаньте!", nextNodeId: 'c2_response', points: 10, isRisky: true },
        { id: 'c3', text: "Назовите ваш номер телефона и ФИО оператора.", nextNodeId: 'c3_response', points: 100, revealsClue: true },
      ]},
      { id: 'c1_response', speaker: 'scammer', text: "У вас несколько лицевых счетов, оформленных на ваш паспорт. Мы видим активность в разных районах Минска. Это может быть признаком мошенничества с вашими документами!" },
      { id: 'c1_choices', speaker: 'system', text: "Выберите ответ:", choices: [
        { id: 'c1a', text: "Ой, что делать? Как защитить себя?", nextNodeId: 'c1a_response', points: 20, isRisky: true },
        { id: 'c1b', text: "Я сам разберусь. Дайте официальный номер ЕРИП для проверки.", nextNodeId: 'c1b_response', points: 100, revealsClue: true },
      ]},
      { id: 'c1a_response', speaker: 'scammer', text: "Для защиты нужно оформить заявление. Перейдите по ссылке erip-secure.by и введите данные паспорта и карты для верификации." },
      { id: 'c1a_end', speaker: 'system', text: "⚠️ Мошенник пытается увести на фишинговый сайт! Игра окончена.", isCorrect: false },
      { id: 'c1b_response', speaker: 'scammer', text: "Мы не можем дать номер, это внутренний канал связи. Но я могу соединить с оператором..." },
      { id: 'c1b_choices', speaker: 'system', text: "Выберите ответ:", choices: [
        { id: 'c1b1', text: "Соединяйте, жду.", nextNodeId: 'c1b1_response', points: 30 },
        { id: 'c1b2', text: "Я сам позвоню в ЕРИП по номеру 153. До свидания.", nextNodeId: 'c1b2_win', points: 200, revealsClue: true },
      ]},
      { id: 'c1b1_response', speaker: 'scammer', text: "Сейчас... (пауза 30 секунд) ...Оператор не отвечает. Давайте я сам помогу.", isCorrect: false },
      { id: 'c1b2_win', speaker: 'system', text: "✅ Вы правильно решили задачу! Мошенник не стал ждать и исчез из чата.", isCorrect: true },
      { id: 'c2_response', speaker: 'scammer', text: "Мы не можем просто 'отстать'. Это официальное уведомление. Если не погасите долг сегодня, завтра придут приставы." },
      { id: 'c2_choices', speaker: 'system', text: "Выберите ответ:", choices: [
        { id: 'c2a', text: "Хорошо, я заплачу. Как?", nextNodeId: 'c2a_end', points: 0, isRisky: true },
        { id: 'c2b', text: "Присылайте официальную квитанцию на email.", nextNodeId: 'c2b_response', points: 80 },
      ]},
      { id: 'c2a_end', speaker: 'system', text: "⚠️ Вы попались! Мошенник отправил ссылку на фишинговый сайт 'оплаты'.", isCorrect: false },
      { id: 'c2b_response', speaker: 'scammer', text: "Квитанцию можно получить только в личном кабинете. Перейдите по ссылке...", isCorrect: false },
      { id: 'c3_response', speaker: 'scammer', text: "Меня зовут Александр Петрович, мой номер +375 (29) 123-45-67. Но я не могу сейчас говорить, я на линии." },
      { id: 'c3_choices', speaker: 'system', text: "Выберите ответ:", choices: [
        { id: 'c3a', text: "Я перезвоню на этот номер позже.", nextNodeId: 'c3a_response', points: 50 },
        { id: 'c3b', text: "Проверю ваш номер через ЕРИП. До свидания.", nextNodeId: 'c3b_win', points: 150, revealsClue: true },
      ]},
      { id: 'c3a_response', speaker: 'scammer', text: "Нет, нужно решить вопрос прямо сейчас!", isCorrect: false },
      { id: 'c3b_win', speaker: 'system', text: "✅ Вы выиграли! Номер оказался зарегистрирован на сим-карту, купленную анонимно. Мошенник заблокировал вас.", isCorrect: true },
    ],
    educationalInfo: {
      title: "Социальная инженерия в чатах",
      description: "Мошенники используют страх, срочность и авторитет госорганов. Правильная тактика: не поддаваться панике, проверять информацию через официальные каналы, не переходить по ссылкам от неизвестных.",
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
    audioUrl: "audio/son_fake.mp3",
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
