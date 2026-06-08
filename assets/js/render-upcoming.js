(function () {
  function createTextElement(tag, text, className) {
    var element = document.createElement(tag);
    element.textContent = text;

    if (className) {
      element.className = className;
    }

    return element;
  }

  function createUpcomingCard(item) {
    var article = document.createElement("article");
    article.className = "event-card";

    var date = document.createElement("div");
    date.className = "event-date";
    date.appendChild(createTextElement("span", item.day || "", "day"));
    date.appendChild(createTextElement("span", item.month || "", "month"));
    article.appendChild(date);

    var content = document.createElement("div");
    content.className = "event-content";
    content.appendChild(createTextElement("h4", item.title || ""));

    if (item.meta) {
      content.appendChild(createTextElement("p", item.meta, "event-meta"));
    }

    if (item.online && item.online.href) {
      var online = document.createElement("p");
      online.className = "event-online";

      var onlineLink = document.createElement("a");
      onlineLink.href = item.online.href;
      onlineLink.target = "_blank";
      onlineLink.rel = "noopener";
      onlineLink.textContent = item.online.label || "Participate online";

      online.appendChild(onlineLink);
      content.appendChild(online);
    }

    (item.paragraphs || []).forEach(function (paragraph) {
      content.appendChild(createTextElement("p", paragraph));
    });

    article.appendChild(content);

    if (item.flyer && item.flyer.image) {
      var flyer = document.createElement("a");
      flyer.className = "event-flyer";
      flyer.href = item.flyer.href || item.flyer.image;
      flyer.target = "_blank";
      flyer.rel = "noopener";
      flyer.setAttribute("aria-label", item.flyer.label || "Open flyer");

      var image = document.createElement("img");
      image.src = item.flyer.image;
      image.alt = item.flyer.alt || "";
      flyer.appendChild(image);
      article.appendChild(flyer);
    } else {
      article.classList.add("no-flyer");
    }

    return article;
  }

  function renderUpcoming(container) {
    var source = container.getAttribute("data-upcoming");
    var events = window.UPCOMING_EVENTS || [];
    var seminars = window.UPCOMING_SEMINARS || [];
    var items = [];

    if (source === "events") {
      items = events;
    } else if (source === "seminars") {
      items = seminars;
    } else {
      items = events.concat(seminars);
    }

    container.innerHTML = "";

    if (!items.length) {
      var empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = container.getAttribute("data-empty") || "To add.";
      container.appendChild(empty);
      return;
    }

    items.forEach(function (item) {
      container.appendChild(createUpcomingCard(item));
    });
  }

  document.querySelectorAll("[data-upcoming]").forEach(renderUpcoming);
})();
