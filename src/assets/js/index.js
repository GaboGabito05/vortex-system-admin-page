// Chart creation and animations
const createChart = () => {
  const ctx = document.getElementById("performanceChart")?.getContext("2d");

  if (!ctx) return;

  // Enhanced gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 200);
  gradient.addColorStop(0, "rgba(0, 102, 255, 0.3)");
  gradient.addColorStop(0.5, "rgba(0, 102, 255, 0.1)");
  gradient.addColorStop(1, "rgba(0, 102, 255, 0)");

  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const performanceData = [65, 78, 90, 85, 92, 88];

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Performance",
        data: performanceData,
        fill: true,
        backgroundColor: gradient,
        borderColor: "#0066FF",
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: "#FFFFFF",
        pointBorderColor: "#0066FF",
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 4,
      },
    ],
  };

  const config = {
    type: "line",
    data: data,
    options: getChartOptions(),
  };

  window.chart = new Chart(ctx, config);
};

// Enhanced Mobile Menu
const mobileMenu = {
  init() {
    const button = document.querySelector(".mobile-menu-btn");
    const nav = document.querySelector(".nav-links");
    let isAnimating = false;

    const toggleMenu = () => {
      if (isAnimating) return;
      isAnimating = true;

      button.classList.toggle("active");
      nav.classList.toggle("active");

      // Prevent scroll when menu is open
      document.body.style.overflow = nav.classList.contains("active")
        ? "hidden"
        : "";

      setTimeout(() => {
        isAnimating = false;
      }, 300);
    };

    button.addEventListener("click", toggleMenu);

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !e.target.closest(".nav-container") &&
        nav.classList.contains("active")
      ) {
        toggleMenu();
      }
    });

    // Close menu when clicking a link
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (nav.classList.contains("active")) {
          toggleMenu();
        }
      });
    });

    // Handle resize
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768) {
          button.classList.remove("active");
          nav.classList.remove("active");
          document.body.style.overflow = "";
        }
      }, 250);
    });
  },
};

// Enhanced Touch Carousel
const touchCarousel = {
  init() {
    const container = document.querySelector(".review-cards");
    if (!container) return;

    let startX, moveX;
    let isDown = false;

    const handleTouchStart = (e) => {
      isDown = true;
      startX = e.type === "mousedown" ? e.pageX : e.touches[0].pageX;
      container.style.cursor = "grabbing";
    };

    const handleTouchMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      moveX = e.type === "mousemove" ? e.pageX : e.touches[0].pageX;
      const walk = (startX - moveX) * 2;
      container.scrollLeft += walk;
      startX = moveX;
    };

    const handleTouchEnd = () => {
      isDown = false;
      container.style.cursor = "grab";
    };

    // Touch events
    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd);

    // Mouse events for tablet/desktop
    container.addEventListener("mousedown", handleTouchStart);
    container.addEventListener("mousemove", handleTouchMove);
    container.addEventListener("mouseup", handleTouchEnd);
    container.addEventListener("mouseleave", handleTouchEnd);
  },
};

// Stats counter animation
const statsAnimation = {
  init() {
    this.animateNumbers();
  },

  animateNumbers() {
    const counters = document.querySelectorAll(".metric .value");
    counters.forEach((counter) => {
      const target = parseInt(counter.innerText.replace(/[^0-9]/g, ""));
      let current = 0;
      const increment = target / 100;
      const animate = () => {
        if (current < target) {
          current += increment;
          counter.innerText = `$${Math.floor(current).toLocaleString()}`;
          requestAnimationFrame(animate);
        } else {
          counter.innerText = `$${target.toLocaleString()}`;
        }
      };
      animate();
    });
  },
};

// Add stats animation
const updateStats = () => {
  const statsData = [
    { label: "Revenue", value: 123456, prefix: "$", suffix: "" },
    { label: "Growth", value: 45, prefix: "", suffix: "%" },
    { label: "Active Users", value: 1234, prefix: "", suffix: "" },
  ];

  statsData.forEach((stat) => {
    const element = document.querySelector(`[data-stat="${stat.label}"]`);
    if (!element) return;

    const duration = 2000;
    const steps = 60;
    const stepValue = stat.value / steps;
    let current = 0;
    let step = 0;

    const updateValue = () => {
      step++;
      current += stepValue;

      if (step <= steps) {
        element.textContent = `${stat.prefix}${Math.round(
          current
        ).toLocaleString()}${stat.suffix}`;
        requestAnimationFrame(updateValue);
      } else {
        element.textContent = `${stat.prefix}${stat.value.toLocaleString()}${
          stat.suffix
        }`;
      }
    };

    updateValue();
  });
};

const initBenefitsSection = () => {
  // Animate progress bar when in view
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
        }
      });
    },
    { threshold: 0.5 }
  );

  const barFill = document.querySelector(".bar-fill");
  if (barFill) {
    observer.observe(barFill);
  }

  // Animate stats counting
  const animateValue = (element, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);

      if (element.classList.contains("stat-value")) {
        if (element.dataset.format === "currency") {
          element.textContent = `$${value.toLocaleString()}M`;
        } else if (element.dataset.format === "users") {
          element.textContent = `${value.toLocaleString()}+`;
        } else {
          element.textContent = `${value}%`;
        }
      }

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const statValue = entry.target;
          const value = parseInt(statValue.textContent.replace(/[^0-9]/g, ""));
          animateValue(statValue, 0, value, 2000);
          statsObserver.unobserve(statValue);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll(".stat-value").forEach((stat) => {
    statsObserver.observe(stat);
  });
};

// Modal functionality for Services section
const modalSystem = {
  init() {
    const modalOverlay = document.createElement("div");
    modalOverlay.className = "modal-overlay";
    document.body.appendChild(modalOverlay);

    const modal = document.createElement("div");
    modal.className = "modal";
    modalOverlay.appendChild(modal);

    const serviceInfo = {
      feature1: {
        title: "Internet de Alta Velocidad",
        description:
          "Conéctate a la velocidad del futuro con nuestro servicio de internet de alta velocidad. Ideal para hogares y negocios que necesitan un rendimiento óptimo.",
        features: [
          "Conexiones simétricas de hasta 1 Gbps",
          "Baja latencia para juegos y videollamadas",
          "Cobertura en áreas urbanas y rurales",
          "Soporte técnico 24/7",
        ],
      },
      feature2: {
        title: "Servicios en la Nube",
        description:
          "Almacena y gestiona tus datos de manera segura y eficiente con nuestros servicios en la nube. Perfecto para empresas que buscan escalabilidad y confiabilidad.",
        features: [
          "Almacenamiento seguro y escalable",
          "Acceso remoto desde cualquier dispositivo",
          "Copias de seguridad automáticas",
          "Cifrado de datos de extremo a extremo",
        ],
      },
      feature3: {
        title: "Soluciones Empresariales",
        description:
          "Potencia tu negocio con nuestras soluciones de conectividad empresarial. Ofrecemos herramientas diseñadas para maximizar la productividad y la eficiencia.",
        features: [
          "Conectividad dedicada para empresas",
          "Telefonía IP y videoconferencias",
          "Redes privadas virtuales (VPN)",
          "Soporte personalizado para empresas",
        ],
      },
    };

    document.querySelectorAll(".explore-btn").forEach((btn, index) => {
      btn.innerHTML = "More Info <span>→</span>";

      btn.addEventListener("click", () => {
        const featureKey = `feature${index + 1}`;
        const info = serviceInfo[featureKey];

        modal.innerHTML = `
          <div class="modal-header">
            <h3 class="modal-title">${info.title}</h3>
            <button class="modal-close">×</button>
          </div>
          <div class="modal-content">
            <p>${info.description}</p>
            <h4>Caracteristicas:</h4>
            <ul class="modal-features">
              ${info.features.map((feature) => `<li>${feature}</li>`).join("")}
            </ul>
          </div>
        `;

        modalOverlay.style.display = "block";
        setTimeout(() => {
          modalOverlay.classList.add("active");
          modal.classList.add("active");
        }, 10);

        const closeModal = () => {
          modalOverlay.classList.remove("active");
          modal.classList.remove("active");
          setTimeout(() => {
            modalOverlay.style.display = "none";
          }, 300);
        };

        modal
          .querySelector(".modal-close")
          .addEventListener("click", closeModal);
        modalOverlay.addEventListener("click", (e) => {
          if (e.target === modalOverlay) closeModal();
        });
      });
    });
  },
};

// Scroll animations - Updated
const scrollAnimations = {
  init() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    // Add fade-in class to elements that should animate
    document
      .querySelectorAll(".service-panel, .benefits-content, .review-card")
      .forEach((el) => {
        el.classList.add("fade-in");
        observer.observe(el);
      });

    this.setupParallax();
  },

  setupParallax() {
    window.addEventListener("scroll", () => {
      const scroll = window.pageYOffset;
      document.querySelectorAll(".parallax").forEach((el) => {
        const speed = el.dataset.speed || 0.5;
        el.style.transform = `translateY(${scroll * speed}px)`;
      });
    });
  },
};

// Responsive chart options
function getChartOptions() {
  const isMobile = window.innerWidth < 768;
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: !isMobile,
        },
        ticks: {
          font: {
            size: isMobile ? 8 : 10,
          },
          maxTicksLimit: isMobile ? 4 : 5,
          padding: isMobile ? 5 : 8,
        },
      },
      x: {
        grid: {
          display: !isMobile,
        },
        ticks: {
          font: {
            size: isMobile ? 8 : 10,
          },
          maxTicksLimit: isMobile ? 4 : 6,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: !isMobile,
      },
    },
    interaction: {
      mode: isMobile ? "nearest" : "index",
      intersect: false,
    },
  };
}

// Update chart on resize
window.addEventListener("resize", () => {
  if (window.chart) {
    window.chart.options = getChartOptions();
    window.chart.update();
  }
});

// Initialize all components
document.addEventListener("DOMContentLoaded", () => {
  mobileMenu.init();
  touchCarousel.init();
  createChart();
  modalSystem.init();
  scrollAnimations.init();
  statsAnimation.init();
  initBenefitsSection();
  updateStats();
});

const botonSistema = document.getElementById("sistema");

botonSistema.addEventListener("click", () => {
  const url = ''
  window.open(url, '_blank');
});