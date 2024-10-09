const texts = [
  "Ustedes pueden",
  "El éxito es posible",
  "Juntos hacia adelante",
  "Aprendiendo cada día",
];

let currentIndex = 0;
const h1Element = document.querySelector(".hero h1");

function changeText() {
  currentIndex = (currentIndex + 1) % texts.length; 
  h1Element.textContent = texts[currentIndex]; 
}

setInterval(changeText, 2000); 
