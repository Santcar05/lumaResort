document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('.Slider');
  const slides = document.querySelectorAll('.SlideContainer');
  const dots = document.querySelectorAll('.SliderNav a');
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
  currentIndex++;
  const totalSlides = slides.length;

  slider.scrollTo({
    left: slider.offsetWidth * currentIndex,
    behavior: 'smooth',
  });

  // Reinicio al llegar a la mitad (porque duplicamos slides)
  if (currentIndex >= totalSlides / 2) {
    setTimeout(() => {
      slider.scrollLeft = 0; // volvemos al inicio sin animación
      currentIndex = 0;
    }, 500); // espera a que termine la transición
  }

  updateDots(currentIndex % (totalSlides / 2)); // actualizar puntos
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

//------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  const logo = document.querySelector('.LogoImg');
  const themeDuration = 700; // Duración en milisegundos (0.7 segundos)

  // Verificar preferencia del usuario
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Cambiar tema al hacer clic en el logo
  logo.addEventListener('click', function () {
    // Deshabilitar múltiples clics durante la transición
    if (logo.classList.contains('theme-changing')) return;
    logo.classList.add('theme-changing', 'logo-active');

    // 1. Animación de pulsación mediante clases CSS
    logo.classList.add('logo-click-animation');

    // 2. Efecto de partículas/brillo
    createRippleEffect(logo);

    // 3. Cambiar tema después de un pequeño retraso
    setTimeout(() => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';

      document.body.classList.add('theme-transition-active');
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);

      // 4. Restaurar estado del logo
      setTimeout(() => {
        logo.classList.remove('logo-click-animation', 'theme-changing');
        document.body.classList.remove('theme-transition-active');

        // Eliminar la clase active después de la transición
        setTimeout(() => {
          logo.classList.remove('logo-active');
        }, 100);
      }, themeDuration);
    }, 150);
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

  function createRippleEffect(element) {
    const ripple = document.createElement('div');
    ripple.className = 'theme-ripple-effect';
    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), themeDuration);
  }
});
<script>
document.addEventListener('DOMContentLoaded', () => {
  const sliderTrack = document.getElementById('sliderTrack');

  // Duplicar todas las tarjetas para scroll infinito
  sliderTrack.innerHTML += sliderTrack.innerHTML;

  // Si quieres velocidad controlada con requestAnimationFrame:
  let position = 0;
  const speed = 0.5; // px por frame
  const sliderWidth = sliderTrack.scrollWidth / 2; // mitad porque duplicamos

  function animate() {
    position += speed;
    if (position >= sliderWidth) position = 0; // reset para infinito
    sliderTrack.style.transform = `translateX(${-position}px)`;
    requestAnimationFrame(animate);
  }

  animate();
});
