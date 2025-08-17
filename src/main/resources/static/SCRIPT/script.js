document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slide-container');
  const dots = document.querySelectorAll('.slider-nav a');
  let currentIndex = 0;
  let autoSlideInterval;

  // Función para ir a un slide específico
  function goToSlide(index) {
    currentIndex = index;
    slider.scrollTo({
      left: slider.offsetWidth * index,
      behavior: 'smooth',
    });
    updateDots(index);
  }

  // Función para actualizar los puntos activos
  function updateDots(index) {
    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  // Función para avanzar al siguiente slide
  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    goToSlide(currentIndex);
  }

  // Iniciar el auto-desplazamiento
  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 4000); // 8 segundos
  }

  // Detener el auto-desplazamiento cuando el usuario interactúa
  function pauseAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  // Configurar eventos para los puntos de navegación
  dots.forEach((dot, index) => {
    dot.addEventListener('click', e => {
      e.preventDefault();
      pauseAutoSlide();
      goToSlide(index);
      // Reanudar después de un tiempo si se desea
      setTimeout(startAutoSlide, 15000);
    });
  });

  // Pausar cuando el mouse está sobre el slider
  slider.addEventListener('mouseenter', pauseAutoSlide);
  slider.addEventListener('mouseleave', startAutoSlide);

  // Actualizar puntos al hacer scroll manual
  slider.addEventListener('scroll', () => {
    const index = Math.round(slider.scrollLeft / slider.offsetWidth);
    if (index !== currentIndex) {
      currentIndex = index;
      updateDots(index);
    }
  });

  // Inicialización
  goToSlide(0);
  startAutoSlide();
});
document.addEventListener('DOMContentLoaded', function () {
  const logo = document.querySelector('.LogoImg');
  const themeDuration = 700; // Duración en milisegundos (0.7 segundos)

  // Agregar clase de animación inicial al logo
  logo.classList.add('theme-transition-logo');

  // Verificar preferencia del usuario
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Cambiar tema al hacer clic en el logo
  logo.addEventListener('click', function () {
    // Deshabilitar múltiples clics durante la transición
    if (logo.classList.contains('theme-changing')) return;
    logo.classList.add('theme-changing');

    // 1. Animación de pulsación mejorada
    logo.style.transform = 'scale(0.85) rotate(10deg)';
    logo.style.filter = 'brightness(1.2)';

    // 2. Efecto de partículas/brillo (puedes personalizar)
    createRippleEffect(logo);

    // 3. Cambiar tema después de un pequeño retraso para mejor feedback
    setTimeout(() => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';

      // Agregar clase de transición al body
      document.body.classList.add('theme-transition-active');

      // Cambiar tema
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);

      // 4. Restaurar estado del logo después de la animación
      setTimeout(() => {
        logo.style.transform = 'scale(1) rotate(0)';
        logo.style.filter = 'brightness(1)';
        document.body.classList.remove('theme-transition-active');
        logo.classList.remove('theme-changing');
      }, themeDuration);
    }, 150); // Pequeño retraso antes de cambiar el tema
  });

  // Respeta la preferencia del sistema
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  if (prefersDark.matches && !localStorage.getItem('theme')) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  prefersDark.addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
  });

  // Función para crear efecto de partículas/brillo
  function createRippleEffect(element) {
    const ripple = document.createElement('div');
    ripple.className = 'theme-ripple-effect';

    // Posicionar en el centro del logo
    const rect = element.getBoundingClientRect();
    ripple.style.left = `${rect.width / 2}px`;
    ripple.style.top = `${rect.height / 2}px`;

    element.appendChild(ripple);

    // Animación completa
    setTimeout(() => {
      ripple.remove();
    }, themeDuration);
  }
});
