$(function () {
  const serviceData = {
    declaration: {
      title: "Декларации соответствия",
      description:
        "Подтверждаем соответствие продукции требованиям технических регламентов ЕАЭС. Помогаем определить схему декларирования, провести испытания и зарегистрировать документ.",
      image: "public/assets/6a87c.png",
    },
    certificate: {
      title: "Сертификаты соответствия",
      description:
        "Организуем сертификационные испытания, готовим комплект документов и сопровождаем оформление сертификата на серийный выпуск или партию продукции.",
      image: "public/assets/c2197.png",
    },
    registration: {
      title: "Свидетельства государственной регистрации",
      description:
        "Проверяем состав и маркировку, организуем необходимые исследования и сопровождаем государственную регистрацию продукции.",
      image: "public/assets/bb6ee.png",
    },
    marketplace: {
      title: "Документы для маркетплейсов",
      description:
        "Определяем обязательные документы для карточки товара и помогаем подготовить подтверждение соответствия требованиям площадок.",
      image: "public/assets/9d2e8.png",
    },
    technical: {
      title: "Техническая документация",
      description:
        "Разрабатываем технические условия, паспорта, руководства по эксплуатации, обоснования безопасности и другую документацию.",
      image: "public/assets/3f29d.png",
    },
  };

  const $body = $("body");

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
    if (event.key === "Escape") {
      closeAllModals();
    }
  });

  $(".modal-services a").on("click", function () {
    closeModal($(this).closest(".modal"));
  });

  $(".service-item").on("click", function () {
    const $button = $(this);
    const data = serviceData[$button.data("service")];
    if (!data) return;

    $(".service-item").removeClass("active").find("b").text("+");
    $button.addClass("active").find("b").text("−");

    $("#service-title").text(data.title);
    $("#service-description").text(data.description);
    $("#service-image").attr({
      src: data.image,
      alt: data.title,
    });
  });

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

  $("[data-contact-form]").on("submit", function (event) {
    event.preventDefault();

    const $form = $(this);
    const $modal = $form.closest("#application-modal");
    this.reset();

    if ($modal.length) {
      $modal.find(".application-form-wrap").prop("hidden", true);
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

  $(".search-form").on("submit", function (event) {
    event.preventDefault();

    const query = $(this).find("input").val().trim().toLowerCase();
    closeModal($(this).closest(".modal"));

    const sectionId = query.includes("отрасл") ? "industries" : "services";
    document.getElementById(sectionId).scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });

  const $menuButton = $(".mobile-menu-button");
  const $navigation = $(".main-nav");

  $menuButton.on("click", function () {
    const isOpen = $navigation.toggleClass("open").hasClass("open");
    $menuButton.attr("aria-expanded", String(isOpen));
  });

  $navigation.find("a").on("click", function () {
    $navigation.removeClass("open");
    $menuButton.attr("aria-expanded", "false");
  });
});
