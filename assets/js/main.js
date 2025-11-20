document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".course-carousel__track");
  const slides = Array.from(track.children);
  const prevBtn = document.querySelector(".carousel__btn--prev");
  const nextBtn = document.querySelector(".carousel__btn--next");

  let currentIndex = 0;

  function updateSlidePosition() {
    const offset = -currentIndex * 100;
    track.style.transform = `translateX(${offset}%)`;
  }

  function goToNext() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlidePosition();
  }

  function goToPrev() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlidePosition();
  }

  nextBtn.addEventListener("click", goToNext);
  prevBtn.addEventListener("click", goToPrev);
});
