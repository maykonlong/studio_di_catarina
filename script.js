// Contact links and content remain available without JavaScript.
document.documentElement.classList.add("js");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#main-nav");
function closeMenu() {
  navigation.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
  document.body.classList.remove("menu-open");
}
menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  navigation.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  document.body.classList.toggle("menu-open", open);
});
navigation
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("click", (event) => {
  if (!event.target.closest(".header")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navigation.classList.contains("open")) {
    closeMenu();
    menuToggle.focus();
  }
});
window.matchMedia("(min-width: 901px)").addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});
const filters = document.querySelectorAll("[data-filter]");
const serviceGrid = document.querySelector(".service-grid");
filters.forEach((button) =>
  button.addEventListener("click", () => {
    const category = button.dataset.filter;
    filters.forEach((filter) => {
      const selected = button === filter;
      filter.classList.toggle("active", selected);
      filter.setAttribute("aria-pressed", String(selected));
    });
    document.querySelectorAll("[data-category]").forEach((card) => {
      card.hidden = category !== "all" && card.dataset.category !== category;
    });
    serviceGrid.classList.toggle("is-filtered", category !== "all");
  }),
);
const dialog = document.querySelector("#booking-dialog");
const bookingForm = document.querySelector("#booking-form");
const serviceSelect = document.querySelector("#booking-service");
const nameInput = document.querySelector("#booking-name");
const continueLink = document.querySelector("#booking-continue");
const referenceNote = document.querySelector("#booking-reference");
let bookingReference = "";
function updateBookingLink() {
  const name = nameInput.value.trim();
  const greeting = name ? `Olá! Meu nome é ${name}.` : "Olá!";
  const message = `${greeting} Vim pelo site do Studio Di Catarina e gostaria de consultar valores e horários. Serviço: ${serviceSelect.value}.${bookingReference ? ` Referência do visual: ${bookingReference}` : ""}`;
  referenceNote.hidden = !bookingReference;
  continueLink.href = `https://wa.me/5511910618237?text=${encodeURIComponent(message)}`;
}
document.querySelectorAll("[data-booking]").forEach((link) =>
  link.addEventListener("click", (event) => {
    if (
      typeof dialog.showModal !== "function" ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    event.preventDefault();
    closeMenu();
    serviceSelect.value =
      link.dataset.service || "Quero ajuda para escolher meu cuidado";
    bookingReference = link.dataset.reference || "";
    updateBookingLink();
    dialog.showModal();
    document.body.classList.add("dialog-open");
  }),
);
dialog.addEventListener("close", () =>
  document.body.classList.remove("dialog-open"),
);
if (location.hash === "#agendar" && typeof dialog.showModal === "function") {
  updateBookingLink();
  dialog.showModal();
  document.body.classList.add("dialog-open");
}
document
  .querySelector(".dialog-close")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target !== dialog) return;
  const r = dialog.getBoundingClientRect();
  if (
    event.clientX < r.left ||
    event.clientX > r.right ||
    event.clientY < r.top ||
    event.clientY > r.bottom
  )
    dialog.close();
});
bookingForm.addEventListener("input", updateBookingLink);
serviceSelect.addEventListener("change", () => {
  bookingReference = "";
  updateBookingLink();
});
bookingForm.addEventListener("change", updateBookingLink);
bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  updateBookingLink();
  continueLink.click();
});
continueLink.addEventListener("click", () => dialog.close());
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting)
          document
            .querySelectorAll(".nav-link")
            .forEach((link) =>
              link.classList.toggle(
                "active",
                link.hash === `#${entry.target.id}`,
              ),
            );
      });
    },
    { rootMargin: "-15% 0px -55% 0px", threshold: 0 },
  );
  document
    .querySelectorAll("main section[id]")
    .forEach((section) => observer.observe(section));
}
document.querySelector("#year").textContent = new Date().getFullYear();
let installPrompt;
const installButton = document.querySelector("#install-app");
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
  installButton.hidden = false;
});
installButton.addEventListener("click", async () => {
  if (!installPrompt) return;
  await installPrompt.prompt();
  await installPrompt.userChoice;
  installPrompt = null;
  installButton.hidden = true;
});
window.addEventListener("appinstalled", () => {
  installPrompt = null;
  installButton.hidden = true;
});
if ("serviceWorker" in navigator && window.isSecureContext)
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js", { updateViaCache: "none" })
      .catch((error) =>
        console.warn("Não foi possível ativar o modo offline.", error),
      );
  });
