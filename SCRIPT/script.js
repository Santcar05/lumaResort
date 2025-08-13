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
    autoSlideInterval = setInterval(nextSlide, 5000); // 8 segundos
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
