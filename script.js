$(function () {
  const $body = $("body");

  // ---------------------------------------------------------------------------
  // Модальные окна
  // ---------------------------------------------------------------------------

  function closeModal($modal) {
    if (!$modal.length) return;

    $modal.removeClass("open").attr("aria-hidden", "true");
    if (!$(".modal.open").length) {
      $body.removeClass("modal-open");
    }
  }

  function closeAllModals() {
    $(".modal.open").each(function () {
      closeModal($(this));
    });
  }

  function openModal(id) {
    const $modal = $("#" + id);
    if (!$modal.length) return;

    closeAllModals();
    $modal.addClass("open").attr("aria-hidden", "false");
    $body.addClass("modal-open");

    window.setTimeout(function () {
      $modal.find("input, textarea, button").first().trigger("focus");
    }, 100);
  }

  $("[data-open-search]").on("click", function () {
    openModal("search-modal");
  });

  $("[data-open-services]").on("click", function () {
    openModal("services-modal");
  });

  $("[data-open-application]").on("click", function () {
    const $modal = $("#application-modal");
    $modal.find(".application-form-wrap").prop("hidden", false);
    $modal.find(".form-success").prop("hidden", true);
    openModal("application-modal");
  });

  $("[data-close-modal]").on("click", function () {
    closeModal($(this).closest(".modal"));
  });

  $(document).on("keydown", function (event) {
    if (event.key !== "Escape") return;

    if ($("#mobile-drawer").hasClass("open")) {
      setDrawerOpen(false);
      return;
    }

    closeAllModals();
  });

  $(".modal-services a").on("click", function () {
    closeModal($(this).closest(".modal"));
  });

  // ---------------------------------------------------------------------------
  // Справочник подуслуг для окна «Подробнее об услуге»
  // ---------------------------------------------------------------------------
  const serviceSubitems = {
    "Свидетельства государственной регистрации (СГР)": [
      "СГР на косметическую и парфюмерную продукцию",
      "СГР на бытовую химию и дезинфицирующие средства",
      "СГР на специализированную пищевую продукцию и БАД",
      "СГР на товары для детей до 3 лет",
      "Экспертное заключение Роспотребнадзора",
      "Внесение изменений в действующее СГР"
    ],
    "Добровольная сертификация": [
      "Добровольный сертификат в системе ГОСТ Р",
      "Добровольный сертификат соответствия пожарной безопасности",
      "Сертификат ЭКО / БИО / Органик",
      "Сертификат «Сделано в России»",
      "Сертификат на услуги и работы",
      "Оценка деловой репутации организации"
    ],
    "Сертификаты соответствия": [
      "Сертификат соответствия техническим регламентам Таможенного союза",
      "Сертификат соответствия в системе ГОСТ Р",
      "Добровольная сертификация ГОСТ Р",
      "Сертификат происхождения товара СТ-1",
      "Сертификат пожарной безопасности",
      "Добровольный сертификат соответствия пожарной безопасности"
    ],
    "Техническая документация": [
      "Разработка технических условий (ТУ)",
      "Паспорт безопасности химической продукции (ПБ / MSDS)",
      "Паспорт изделия и руководство по эксплуатации",
      "Обоснование безопасности машин и оборудования",
      "Технологическая инструкция и рецептура",
      "Регистрация каталожного листа продукции"
    ],
    "Декларации о соответствии": [
      "Декларация о соответствии ТР ТС / ТР ЕАЭС",
      "Декларация о соответствии ГОСТ Р",
      "Декларация пожарной безопасности",
      "Декларация о соответствии на пищевую продукцию",
      "Декларация о соответствии на косметику и парфюмерию",
      "Помощь в регистрации декларации через сервис ФСА"
    ],
    "Сертификаты ИСО (ISO)": [
      "Сертификат ISO 9001 (система менеджмента качества)",
      "Сертификат ISO 22000 / ХАССП (пищевая безопасность)",
      "Сертификат ISO 14001 (экологический менеджмент)",
      "Сертификат ISO 45001 (охрана труда и безопасность)",
      "Интегрированная система менеджмента (ИСМ)",
      "Подготовка к инспекционному контролю"
    ],
    "Сертификационные испытания": [
      "Испытания продукции в аккредитованной лаборатории",
      "Протокол испытаний на соответствие ТР ТС",
      "Протокол испытаний на сроки годности и КБЖУ",
      "Испытания на пожарную безопасность и токсичность",
      "Радиологические и микробиологические исследования",
      "Отбор образцов и оформление акта отбора"
    ]
  };

  // Открытие списка подуслуг из аккордеона услуг.
  $(".service-accordion-item > button.service-item").on("click", function (event) {

    event.preventDefault();
    const title = $(this).find("span").first().text().trim();
    const items = serviceSubitems[title] || serviceSubitems["Сертификаты соответствия"];

    $("#service-detail-title").text(title);

    const listHtml = items
      .map(function (text) {
        return (
          '<li><a href="#consultation" data-close-modal>' +
          '<img class="sublist-doc-icon" src="assets/icons/document-blue-small.svg" alt="" aria-hidden="true" />' +
          "<span>" + text + "</span>" +
          '<img class="sublist-arrow-icon" src="assets/icons/arrow-right-blue.svg" alt="" aria-hidden="true" />' +
          "</a></li>"
        );
      })
      .join("");

    $("#service-detail-list").html(listHtml);
    openModal("service-detail-modal");
  });

  $(document).on("click", "#service-detail-list a", function () {
    closeModal($("#service-detail-modal"));
  });

  // FAQ: одновременно раскрыт только один вопрос.
  $(".accordion-item > button").on("click", function () {
    const $button = $(this);
    const $item = $button.closest(".accordion-item");
    const willOpen = !$item.hasClass("open");

    $(".accordion-item")
      .removeClass("open")
      .find("> button")
      .attr("aria-expanded", "false")
      .find("span")
      .text("+");

    if (willOpen) {
      $item.addClass("open");
      $button.attr("aria-expanded", "true").find("span").text("−");
    }
  });

  // Обработка форм интерфейса. Отправку на сервер нужно подключить отдельно.
  $("[data-contact-form]").on("submit", function (event) {
    event.preventDefault();

    const $form = $(this);
    const $modal = $form.closest("#application-modal, #question-modal");
    this.reset();

    if ($modal.length) {
      $modal.find(".application-form-wrap, .question-form-wrap").prop("hidden", true);
      $modal.find(".form-success").prop("hidden", false);
      return;
    }

    const $button = $form.find('button[type="submit"]');
    const initialText = $button.text();
    $button.text("Заявка отправлена").prop("disabled", true);

    window.setTimeout(function () {
      $button.text(initialText).prop("disabled", false);
    }, 3000);
  });

  // ---------------------------------------------------------------------------
  // Данные и построение десктопного и мобильного меню
  // ---------------------------------------------------------------------------
  const megaMenuData = {
    services: [
      {
        title: "Сертификаты о соответствии",
        short: "Сертификаты",
        url: "#services",
        items: [
          { title: "Сертификат ТР ТС", url: "#services", children: ["Серийный выпуск", "Партия товаров"] },
          { title: "Сертификат ГОСТ Р", url: "#services", children: ["Обязательный", "Добровольный"] }
        ]
      },
      {
        title: "Декларации о соответствии",
        short: "Декларации",
        url: "#services",
        items: [
          { title: "Декларация ТР ТС", url: "#services", children: ["Через сервис ФСА", "С протоколом испытаний"] },
          { title: "Декларация ГОСТ Р", url: "#services", children: ["По Постановлению № 2425", "Российская и импортная"] }
        ]
      },
      {
        title: "Свидетельства государственной регистрации (СГР)",
        short: "СГР",
        url: "#services",
        items: [
          { title: "СГР продукции", url: "#services", children: ["Косметика и химия", "БАДы и детское питание"] },
          { title: "Экспертное заключение", url: "#services", children: ["Санитарно-эпидемиологическая оценка", "СГР Таможенного союза"] }
        ]
      },
      {
        title: "Сертификационные испытания",
        short: "Испытания",
        url: "#process",
        items: [
          { title: "Протокол ТР ТС", url: "#process", children: ["Аккредитованная лаборатория", "Отбор образцов"] },
          { title: "Испытания сроков годности", url: "#process", children: ["Микробиология", "Токсикология и радиология"] }
        ]
      },
      {
        title: "Техническая документация",
        short: "Техдокументация",
        url: "#services",
        items: [
          { title: "Разработка ТУ", url: "#services", children: ["Регистрация ТУ", "Стандарт организации СТО"] },
          { title: "Паспорт безопасности MSDS", url: "#services", children: ["Обоснование безопасности", "Руководство по эксплуатации"] }
        ]
      },
      {
        title: "Сертификаты ИСО (ISO)",
        short: "ИСО (ISO)",
        url: "#services",
        items: [
          { title: "ГОСТ Р ИСО 9001", url: "#services", children: ["Система менеджмента качества", "Инспекционный контроль"] },
          { title: "ХАССП ISO 22000", url: "#services", children: ["Пищевая безопасность", "Внедрение на производстве"] }
        ]
      },
      {
        title: "Дополнительные услуги",
        short: "Доп. услуги",
        url: "#services",
        items: [
          { title: "Отказное письмо", url: "#services", children: ["Для маркетплейсов", "Для таможни"] },
          { title: "Оформление СБКТС", url: "#services", children: ["ОТТС", "ЭПСМ"] }
        ]
      }
    ],
    industries: [
      { title: "Пищевая промышленность", url: "industries.html#industries" },
      { title: "Парфюмерно-косметическая продукция", url: "industries.html#industries" },
      { title: "Легкая промышленность", url: "industries.html#industries" },
      { title: "Игрушки и детские товары", url: "industries.html#industries" },
      { title: "Электроника", url: "industries.html#industries" },
      { title: "Упаковка", url: "industries.html#industries" },
      { title: "Машины и оборудование", url: "industries.html#industries" },
      { title: "Химическая промышленность", url: "industries.html#industries" }
    ]
  };

  const $deskCats = $("#desktop-service-cats");
  const $deskSub = $("#desktop-service-sub");
  const $mobCats = $("#mobile-service-cats");
  const $deskIndustries = $("#desktop-industries-list");
  const $mobIndustries = $("#mobile-industries-list");

  // Заполняем обе версии меню из одного набора данных.
  megaMenuData.services.forEach(function (category, index) {
    $deskCats.append(
      '<li><a href="' + category.url + '" data-cat-idx="' + index + '"' +
      (index === 0 ? ' class="active"' : "") + ">" + category.title + "</a></li>"
    );

    const subItems = category.items
      .flatMap(function (item) {
        return [item.title].concat(item.children || []).map(function (title) {
          return '<a class="mega-sub-link" href="' + item.url + '">' + title + "</a>";
        });
      })
      .join("");

    $deskSub.append(
      '<div class="mega-sub-pane' + (index === 0 ? " active" : "") +
      '" data-pane-idx="' + index + '">' + subItems + "</div>"
    );

    $mobCats.append(
      '<li><button type="button" data-open-sub="' + index + '">' +
      category.title + '<i class="m-arr">→</i></button></li>'
    );
  });

  megaMenuData.industries.forEach(function (industry) {
    $deskIndustries.append(
      '<li><a href="' + industry.url + '">' + industry.title + "</a></li>"
    );
    $mobIndustries.append(
      '<li><a href="' + industry.url + '" data-close-drawer>' +
      industry.title + "</a></li>"
    );
  });

  // ---------------------------------------------------------------------------
  // Поведение десктопного мега-меню
  // ---------------------------------------------------------------------------
  let closeMegaTimer = null;

  function showMega(name) {
    window.clearTimeout(closeMegaTimer);
    $(".mega-panel").removeClass("visible").attr("aria-hidden", "true");
    $(".nav-mega-trigger").removeClass("active");

    if (!name) return;

    $("#mega-" + name).addClass("visible").attr("aria-hidden", "false");
    $('.nav-mega-trigger[data-mega="' + name + '"]').addClass("active");
  }

  $(".nav-mega-trigger").on("mouseenter", function () {
    if (window.innerWidth > 1100) {
      showMega($(this).data("mega"));
    }
  });

  $(".main-nav").on("mouseleave", function () {
    closeMegaTimer = window.setTimeout(function () {
      showMega(null);
    }, 180);
  });

  $(".mega-menus-wrap").on("mouseenter", function () {
    window.clearTimeout(closeMegaTimer);
  });

  $(".mega-close, .mega-menus-wrap a").on("click", function () {
    showMega(null);
  });

  $(document).on("mouseenter", "#desktop-service-cats a", function () {
    const index = $(this).data("cat-idx");
    $("#desktop-service-cats a").removeClass("active");
    $(this).addClass("active");
    $(".mega-sub-pane").removeClass("active");
    $('.mega-sub-pane[data-pane-idx="' + index + '"]').addClass("active");
  });

  // ---------------------------------------------------------------------------
  // Единое мобильное меню для верхней и фиксированной кнопок
  // ---------------------------------------------------------------------------
  const $menuButtons = $(".mobile-menu-button");
  const $drawer = $("#mobile-drawer");

  function showDrawerLevel(level) {
    $(".mobile-level")
      .prop("hidden", true)
      .removeClass("active");

    $('.mobile-level[data-level="' + level + '"]')
      .prop("hidden", false)
      .addClass("active");
  }

  function setDrawerOpen(open) {
    $menuButtons
      .toggleClass("open", open)
      .attr("aria-expanded", String(open));

    $drawer
      .toggleClass("open", open)
      .attr("aria-hidden", String(!open));

    $body.toggleClass("drawer-open", open);

    if (!open) {
      showDrawerLevel("root");
    }
  }

  // Переключение уровней меню.
  $(document).on("click", "[data-go], [data-back]", function () {
    const level = $(this).data("go") || $(this).data("back");
    showDrawerLevel(level);
  });

  // Открытие подуслуг выбранной категории.
  $(document).on("click", "[data-open-sub]", function () {
    const category = megaMenuData.services[$(this).data("open-sub")];
    if (!category) return;

    $("#mobile-sub-title").text("/ " + category.short);

    const itemsHtml = category.items
      .flatMap(function (item) {
        return [item.title].concat(item.children || []).map(function (title) {
          return '<li><a href="' + item.url + '" data-close-drawer>' +
            title + "</a></li>";
        });
      })
      .join("");

    $("#mobile-service-sub").html(itemsHtml);
    showDrawerLevel("service-sub");
  });

  $(document).on("click", "[data-close-drawer]", function () {
    setDrawerOpen(false);
  });

  // Обе кнопки «Меню» управляют одним и тем же drawer.
  $menuButtons.on("click", function () {
    const willOpen = !$drawer.hasClass("open");

    if (willOpen) {
      showMega(null);
    }

    setDrawerOpen(willOpen);
  });

  // В компактной шапке кнопки «Все услуги» и «Отрасли» открывают
  // соответствующий уровень общего мобильного меню.
  $(document).on(
    "click",
    '.nav-mega-trigger[data-mega="services"] .services-button, ' +
    '.nav-mega-trigger[data-mega="industries"] .nav-pill',
    function (event) {
      if (window.innerWidth > 1100) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      const level = $(this).closest(".nav-mega-trigger").data("mega");
      showMega(null);

      if (!$drawer.hasClass("open")) {
        setDrawerOpen(true);
      }

      showDrawerLevel(level);
    }
  );

  // ---------------------------------------------------------------------------
  // Дополнительные категории экспертов и слайдер
  // ---------------------------------------------------------------------------
  // Expand and collapse the additional expert specialties.
  $(document).on("click", ".expert-more", function () {
    const $button = $(this);
    const $card = $button.closest(".expert-card");
    const expanded = !$card.hasClass("expanded");
    $card.toggleClass("expanded", expanded);
    $card.find(".expert-extra").prop("hidden", !expanded);
    $button.attr("aria-expanded", String(expanded));
    $button.contents().filter(function () { return this.nodeType === 3; }).first()
      .replaceWith(expanded ? "− скрыть категории " : "+ ещё 3 категории ");

    // Recalculate slide heights so every visible card stretches with the expanded one.
    if ($.fn.slick && $(".expert-slider").hasClass("slick-initialized")) {
      $(".expert-slider").slick("setPosition");
    }
  });

  // Slick carousel for six expert cards; cards remain available if the CDN is unavailable.
  if ($.fn.slick && $(".expert-slider").length) {
    $(".expert-slider").slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      infinite: false,
      arrows: true,
      prevArrow: $(".expert-prev"),
      nextArrow: $(".expert-next"),
      dots: false,
      responsive: [
        { breakpoint: 1280, settings: { slidesToShow: 3 } },
        { breakpoint: 1024, settings: { slidesToShow: 2 } },
        { breakpoint: 640, settings: { slidesToShow: 1 } }
      ]

    });
  }

  
  // ---------------------------------------------------------------------------
  // Поиск, дополнительные модальные окна и фиксированная шапка
  // ---------------------------------------------------------------------------
  // Поиск в шапке и мобильном меню направляет к подходящему разделу.
  $(".header-search-form, .mobile-search-form").on("submit", function (event) {
    event.preventDefault();

    const query = String($(this).find('input[type="search"]').val() || "")
      .trim()
      .toLocaleLowerCase("ru");

    if (!query) return;

    const sectionId = query.includes("отрасл") ? "industries" : "services";
    const target = document.getElementById(sectionId);

    if (target) {
      setDrawerOpen(false);
      closeAllModals();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
  
  $("[data-open-question]").on("click", function () {
    const $modal = $("#question-modal");
    $modal.find(".question-form-wrap").prop("hidden", false);
    $modal.find(".form-success").prop("hidden", true);
    openModal("question-modal");
  });
  
  $("[data-open-review-text]").on("click", function () {
    openModal("review-text-modal");
  });

  $("[data-open-review-letter]").on("click", function () {
    openModal("review-letter-modal");
  });

  
  const $header = $(".site-header");
  const $topbar = $header.find(".topbar");
  const $mainNav = $header.find(".main-nav");

  function updateFixedHeader() {
    const isMobile = window.innerWidth <= 640;
    const scrollTop = $(window).scrollTop();
    const triggerPoint = isMobile ? 20 : ($topbar.outerHeight() || 78);
    const shouldFix = scrollTop > triggerPoint;

    if (!shouldFix) {
      document.documentElement.style.setProperty("--fixed-header-offset", "0px");
      $header.removeClass("is-fixed");
      $body.removeClass("header-fixed");
      return;
    }

    const fixedHeight = isMobile
      ? ($topbar.outerHeight() || 70)
      : ($mainNav.outerHeight() || 68);

    document.documentElement.style.setProperty(
      "--fixed-header-offset",
      fixedHeight + "px"
    );
    $header.addClass("is-fixed");
    $body.addClass("header-fixed");
  }

  $(window).on("scroll resize", updateFixedHeader);
  updateFixedHeader();



});
