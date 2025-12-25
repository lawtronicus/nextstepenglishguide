document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".course-carousel__track");
  if (!track) return;

  const slides = Array.from(track.children);
  if (!slides.length) return;

  const prevBtn = document.querySelector(".carousel__btn--prev");
  const nextBtn = document.querySelector(".carousel__btn--next");

  let currentIndex = 0;
  let pointerActive = false;
  let startX = 0;
  let startY = 0;

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

  if (nextBtn) nextBtn.addEventListener("click", goToNext);
  if (prevBtn) prevBtn.addEventListener("click", goToPrev);

  // Simple swipe handling for touch/mobile
  const SWIPE_THRESHOLD = 50; // px

  track.addEventListener("pointerdown", (e) => {
    pointerActive = true;
    startX = e.clientX;
    startY = e.clientY;
    track.setPointerCapture(e.pointerId);
  });

  track.addEventListener("pointermove", (e) => {
    if (!pointerActive) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal swipe: prevent scrolling
      e.preventDefault();
    }
  });

  const endSwipe = (e) => {
    if (!pointerActive) return;
    pointerActive = false;
    track.releasePointerCapture(e.pointerId);

    const dx = e.clientX - startX;
    if (Math.abs(dx) >= SWIPE_THRESHOLD) {
      if (dx < 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  };

  track.addEventListener("pointerup", endSwipe);
  track.addEventListener("pointercancel", endSwipe);
});
