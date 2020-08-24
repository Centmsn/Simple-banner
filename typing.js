const typeSpace = document.querySelector('header p');
const text = ['Cześć :)', 'Jak Ci mija dzień?'];
let charIndex = 0;
let textIndex = 0;

function addLetter() {
    if (textIndex > text.length) clearTimeout(addLetterInterval);
    else {
        if (charIndex < text[textIndex].length) {
            typeSpace.textContent += text[textIndex][charIndex];
            charIndex++
        } else {
            textIndex++
        }
    }
    addLetter();
}

let addLetterInterval = setTimeout(addLetter, 1000)