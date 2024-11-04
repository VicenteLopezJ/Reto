const productCards = document.querySelectorAll('.product-card');
let currentIndex = 0;

function showProduct(index) {
    productCards.forEach((card, i) => {
        card.classList.remove('active'); 
        if (i === index) {
            card.classList.add('active'); 
        }
    });
}

document.querySelector('.next').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % productCards.length; 
    showProduct(currentIndex);
});

document.querySelector('.prev').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + productCards.length) % productCards.length; 
    showProduct(currentIndex);
});


showProduct(currentIndex);
