const textElement = document.getElementById("logoText");
const text = "Compra ahora";
let index = 0;
let repeatCount = 0;
const maxRepeats = Infinity; 

function typeText() {
  if (index < text.length) {
    textElement.innerHTML += text.charAt(index);
    index++;
    setTimeout(typeText, 100); 
  } else {
    setTimeout(resetText, 1000); 
  }
}

function resetText() {
  if (repeatCount < maxRepeats) {
    textElement.innerHTML = ""; 
    index = 0; 
    repeatCount++; 
    setTimeout(typeText, 0); 
  }
}


setTimeout(typeText, 1000);
