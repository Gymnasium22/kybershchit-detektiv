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
    audioUrl: "/audio/friend_scam.mp3",
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
    audioUrl: "/audio/mom_ok.mp3",
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
    audioUrl: "/audio/bank_scam.mp3",
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
