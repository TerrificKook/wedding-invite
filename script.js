(function () {
  const hero = document.querySelector(".hero[data-hero-image]");

  if (hero) {
    const heroImagePath = hero.dataset.heroImage;
    const heroImage = new Image();

    heroImage.onload = function () {
      hero.style.setProperty("--hero-image", "url('" + heroImagePath + "')");
      hero.classList.add("has-hero-image");
    };

    heroImage.src = heroImagePath;
  }

  const optionalImages = document.querySelectorAll(".optional-image[data-fallback]");

  optionalImages.forEach(function (image) {
    const slot = image.closest(".image-slot");

    function showFallback() {
      if (!slot || slot.classList.contains("is-missing")) {
        return;
      }

      const fallback = document.createElement("span");
      fallback.className = "image-fallback";
      fallback.textContent = image.dataset.fallback;

      slot.classList.add("is-missing");
      image.setAttribute("aria-hidden", "true");
      slot.appendChild(fallback);
    }

    image.addEventListener("error", showFallback, { once: true });

    if (image.complete && image.naturalWidth === 0) {
      showFallback();
    }
  });

  const coordinateButtons = document.querySelectorAll("[data-copy-coordinates]");

  coordinateButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const coordinates = button.dataset.copyCoordinates;
      const card = button.closest(".direction-card");
      const status = card ? card.querySelector(".copy-status") : null;

      function setStatus(message) {
        if (status) {
          status.textContent = message;
        }
      }

      if (!coordinates) {
        setStatus("Координаты указаны выше.");
        return;
      }

      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        setStatus("Координаты указаны выше, их можно скопировать вручную.");
        return;
      }

      navigator.clipboard
        .writeText(coordinates)
        .then(function () {
          setStatus("Координаты скопированы.");
        })
        .catch(function () {
          setStatus("Координаты указаны выше, их можно скопировать вручную.");
        });
    });
  });

  const revealItems = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealItems.forEach(function (item) {
    observer.observe(item);
  });
})();
