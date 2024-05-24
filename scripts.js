document.addEventListener("DOMContentLoaded", function() {
    const header = document.getElementById("main-header");
    const footer = document.getElementById("main-footer");

    window.addEventListener("scroll", function() {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
            footer.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
            footer.classList.remove("scrolled");
        }
    });

    // Carousel functionality
    const carouselImages = document.querySelector('.carousel-images');
    if (carouselImages) {
        // Si existe, ejecuta el código del carrusel de imágenes
        const images = carouselImages.querySelectorAll('img');
        let index = 0;

        function showNextImage() {
            index = (index + 1) % images.length;
            const offset = -index * 100; // Assuming each image takes 100% of the carousel width
            carouselImages.style.transform = `translateX(${offset}%)`;
        }

    setInterval(showNextImage, 5000); // Change image every 5 seconds
}
});
