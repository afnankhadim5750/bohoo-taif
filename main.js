(function () {
  "use strict";

  /* ---------- Language toggle (EN <-> AR, full RTL) ---------- */
  var langToggle = document.getElementById("langToggle");
  var currentLang = "en";
  function setLang(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-en]").forEach(function (el) {
      var txt = el.getAttribute("data-" + lang);
      if (txt !== null) el.textContent = txt;
    });
    document.querySelectorAll("[data-en-ph]").forEach(function (el) {
      var txt = el.getAttribute("data-" + lang + "-ph");
      if (txt !== null) el.setAttribute("placeholder", txt);
    });
    langToggle.querySelector("span").textContent = lang === "ar" ? "EN" : "عربي";
    langToggle.setAttribute("aria-label", lang === "ar" ? "Switch to English" : "التبديل إلى العربية");
  }
  langToggle.addEventListener("click", function () {
    setLang(currentLang === "en" ? "ar" : "en");
  });

  /* ---------- Mobile menu: instant toggle, no transition ---------- */
  var menuToggle = document.getElementById("menuToggle");
  var mobileMenu = document.getElementById("mobileMenu");
  function setMenu(open) {
    mobileMenu.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menuToggle.querySelector("i").className = open ? "bi bi-x" : "bi bi-list";
  }
  menuToggle.addEventListener("click", function () {
    setMenu(!mobileMenu.classList.contains("open"));
  });
  mobileMenu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mobileMenu.classList.contains("open")) setMenu(false);
  });

  /* ---------- Scroll-spy ---------- */
  var navLinks = document.querySelectorAll(".main-nav a");
  var spyMap = {};
  navLinks.forEach(function (a) { spyMap[a.getAttribute("href").slice(1)] = a; });
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (a) { a.classList.remove("active"); });
          var link = spyMap[entry.target.id];
          if (link) link.classList.add("active");
        }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    ["story", "menu", "visit", "gallery", "faq"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("in"); ro.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { ro.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Menu tabs ---------- */
  var tabs = document.querySelectorAll(".tab");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) { t.classList.remove("active"); t.setAttribute("aria-selected", "false"); });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      document.querySelectorAll(".tab-panel").forEach(function (p) { p.classList.remove("active"); p.hidden = true; });
      var panel = document.getElementById(tab.getAttribute("data-tab"));
      panel.hidden = false;
      panel.classList.add("active");
    });
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".acc-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".acc-item");
      var wasOpen = item.classList.contains("open");
      document.querySelectorAll(".acc-item").forEach(function (i) {
        i.classList.remove("open");
        i.querySelector(".acc-btn").setAttribute("aria-expanded", "false");
      });
      if (!wasOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- Lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImg");
  var items = Array.prototype.slice.call(document.querySelectorAll(".g-item"));
  var current = 0;
  function showLb(i) {
    current = (i + items.length) % items.length;
    lbImg.src = items[current].getAttribute("data-full");
    lbImg.alt = items[current].getAttribute("data-alt") || "";
  }
  function openLb(i) {
    showLb(i);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightbox.querySelector(".lb-close").focus();
  }
  function closeLb() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
  }
  items.forEach(function (item, i) {
    item.addEventListener("click", function () { openLb(i); });
  });
  lightbox.querySelector(".lb-close").addEventListener("click", closeLb);
  lightbox.querySelector(".lb-prev").addEventListener("click", function () { showLb(current - 1); });
  lightbox.querySelector(".lb-next").addEventListener("click", function () { showLb(current + 1); });
  lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLb(); });
  document.addEventListener("keydown", function (e) {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") showLb(current - 1);
    if (e.key === "ArrowRight") showLb(current + 1);
  });

  /* ---------- Booking form: opens an email to Bohoo ---------- */
  var form = document.getElementById("bookForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = form.name.value.trim();
    var phone = form.phone.value.trim();
    var msg = form.message.value.trim();
    var subject = encodeURIComponent("Table booking — Bohoo Taif");
    var body = encodeURIComponent(
      "Hello Bohoo team,\n\nI would like to book a table.\n\nName: " + name +
      "\nPhone: " + phone + "\n\n" + msg + "\n\nThank you."
    );
    window.location.href = "mailto:info@nahez.sa?subject=" + subject + "&body=" + body;
  });
})();
