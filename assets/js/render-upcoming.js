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
    if (item.year) {
      date.appendChild(createTextElement("span", item.year, "year"));
    }
    article.appendChild(date);

    var content = document.createElement("div");
    content.className = "event-content";
    content.appendChild(createTextElement("h4", item.title || ""));

    if (item.speaker) {
      content.appendChild(createTextElement("p", item.speaker, "event-meta"));
    }

    if (item.meta) {
      content.appendChild(createTextElement("p", item.meta, "event-meta"));
    }

    if (item.website && item.website.href) {
      var website = document.createElement("p");
      website.className = "event-link";

      var websiteLink = document.createElement("a");
      websiteLink.href = item.website.href;
      websiteLink.target = "_blank";
      websiteLink.rel = "noopener";
      websiteLink.textContent = item.website.label || "Event website";

      website.appendChild(websiteLink);
      content.appendChild(website);
    }

    if (item.online && item.online.href) {
      var online = document.createElement("p");
      online.className = "event-link";

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

    if (item.abstracts && item.abstracts.length) {
      var abstracts = document.createElement("div");
      abstracts.className = "event-abstracts";
      abstracts.appendChild(createTextElement("h5", "Abstracts"));

      item.abstracts.forEach(function (abstract) {
        var abstractBlock = document.createElement("div");
        abstractBlock.className = "event-abstract";

        if (abstract.speaker) {
          abstractBlock.appendChild(createTextElement("p", abstract.speaker, "event-abstract-speaker"));
        }

        if (abstract.title) {
          abstractBlock.appendChild(createTextElement("h6", abstract.title));
        }

        if (abstract.text) {
          abstractBlock.appendChild(createTextElement("p", abstract.text));
        }

        abstracts.appendChild(abstractBlock);
      });

      content.appendChild(abstracts);
    }

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

  function createPastSeminarItem(item) {
    var li = document.createElement("li");

    // Title — bold, clickable if website available
    var titleEl = document.createElement("strong");
    if (item.website && item.website.href) {
      var a = document.createElement("a");
      a.href = item.website.href;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = item.title || "";
      titleEl.appendChild(a);
    } else {
      titleEl.textContent = item.title || "";
    }
    li.appendChild(titleEl);

    // Speaker — bold
    if (item.speaker) {
      li.appendChild(document.createTextNode(", "));
      var speakerEl = document.createElement("strong");
      speakerEl.textContent = item.speaker;
      li.appendChild(speakerEl);
    }

    // University
    if (item.university) {
      li.appendChild(document.createTextNode(", " + item.university));
    }

    // Date
    if (item.day && item.month) {
      var dateStr = item.day + " " + item.month;
      if (item.year) { dateStr += " " + item.year; }
      li.appendChild(document.createTextNode(", " + dateStr));
    }

    return li;
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
    } else if (source === "seminars-all") {
      items = seminars.concat(window.UPCOMING_AJS_SEMINARS || []);
    } else {
      items = events.concat(seminars);
    }

    container.innerHTML = "";

    if (!items.length) {
      var emptyText = container.getAttribute("data-empty");
      if (emptyText) {
        var empty = document.createElement("p");
        empty.className = "empty-state";
        empty.textContent = emptyText;
        container.appendChild(empty);
      }
      return;
    }

    items.forEach(function (item) {
      container.appendChild(createUpcomingCard(item));
    });
  }

  function renderPast(container) {
    var source = container.getAttribute("data-past");
    var items = [];

    if (source === "events") {
      items = window.PAST_EVENTS || [];
    } else if (source === "seminars") {
      items = window.PAST_SEMINARS || [];
    } else if (source === "ajs-all") {
      items = window.PAST_AJS_SEMINARS || [];
    } else {
      items = (window.PAST_EVENTS || []).concat(window.PAST_SEMINARS || []);
    }

    container.innerHTML = "";

    if (!items.length) {
      var emptyText = container.getAttribute("data-empty");
      if (emptyText) {
        var empty = document.createElement("p");
        empty.className = "empty-state";
        empty.textContent = emptyText;
        container.appendChild(empty);
      }
      return;
    }

    if (source === "events") {
      items.forEach(function (item) {
        container.appendChild(createUpcomingCard(item));
      });
    } else {
      var ul = document.createElement("ul");
      items.forEach(function (item) {
        ul.appendChild(createPastSeminarItem(item));
      });
      container.appendChild(ul);

      if (source === "ajs-all") {
        var note = document.createElement("p");
        note.className = "event-meta";
        var noteLink = document.createElement("a");
        noteLink.href = "https://www.math.sissa.it/content/ajs-seminars";
        noteLink.target = "_blank";
        noteLink.rel = "noopener";
        noteLink.textContent = "https://www.math.sissa.it/content/ajs-seminars";
        note.appendChild(document.createTextNode("Older AJS seminars can be found at "));
        note.appendChild(noteLink);
        container.appendChild(note);
      }
    }
  }

  document.querySelectorAll("[data-upcoming]").forEach(renderUpcoming);
  document.querySelectorAll("[data-past]").forEach(renderPast);
})();
