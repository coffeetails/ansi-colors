const bodyElem = document.querySelector("body");
const buttonElem = document.querySelector(".toggleLayout");
const escapeCodesWrapperElem = document.querySelector(".escapeCodesWrapper");
const headerElem = document.querySelector("header");

const cardboxElem = document.querySelector("#cardbox");
const cardElems = document.querySelectorAll(".card");

const colorscaleGrayElem = document.querySelector(".colorscaleGray");
const colorscaleDarkElem = document.querySelector(".colorscaleDark");
const colorscaleLightElem = document.querySelector(".colorscaleLight");
const colorscaleElems = document.querySelectorAll(".colorscale");


const viewportSize = {"x": bodyElem.clientWidth, "y": bodyElem.clientHeight};
const viewportMiddle = {"x": bodyElem.clientWidth/2, "y": bodyElem.clientHeight/2};
const perspective = 1400;
let card3D = false;
const standardTransitionTime = 0.75;


cardsAnimateFlat();
colorscaleAnimateVisible();
setupColorRows(colorscaleDarkElem, colorRows[0], false);
setupColorRows(colorscaleLightElem, colorRows[1], false);
setupColorRows(colorscaleGrayElem, colorRows[2], true);

for(let i = 0; i < cardElems.length; i++) {
    for(let color of colorSections[i]) {
        const newDivElem = document.createElement("div");
        newDivElem.classList = "colorBox";
        newDivElem.id = color.number;
        newDivElem.dataset.hex = color.hex;
        newDivElem.textContent = color.number;
        newDivElem.style.backgroundColor = color.hex;
        cardElems[i].appendChild(newDivElem);
    }
}

function setupColorRows(parentElem, colorRange, halfWhiteText) {
    let whiteBoxes = colorRange.length / 2;
    for(let color of colorRange) {
        const newDivElem = document.createElement("div");
        newDivElem.classList = "colorBox";
        newDivElem.id = color.number;
        newDivElem.dataset.hex = color.hex;
        newDivElem.textContent = color.number;
        newDivElem.style.backgroundColor = color.hex;
        if(whiteBoxes > 0 && halfWhiteText) {
            newDivElem.style.color = "white";
            --whiteBoxes;
        }
        parentElem.appendChild(newDivElem);
    }
}


cardboxElem.addEventListener("mousemove", (event) => {
    if(card3D) {
        const rotaionMultplyer = 0.1;    
        const rotationX = -((event.clientY - viewportMiddle.y)*rotaionMultplyer);
        const rotationY = ((event.clientX - viewportMiddle.x)*rotaionMultplyer);

        cardsAnimate3D(rotationX, rotationY, 0, 0);
    }
});
cardboxElem.addEventListener("touchmove", (event) => {
    if(card3D) {
        const rotaionMultplyer = 0.1;    
        const rotationX = -((event.touches[0].clientY - viewportMiddle.y)*rotaionMultplyer);
        const rotationY = ((event.touches[0].clientX - viewportMiddle.x)*rotaionMultplyer);

        cardsAnimate3D(rotationX, rotationY, 0, 0);
    }
});
    
cardboxElem.addEventListener("mouseleave", (event) => {
    if(card3D) {
        setTransitionTime(standardTransitionTime, cardElems);
        cardsAnimate3D(0, 0, 0, 0);
    }
});
cardboxElem.addEventListener("touchend", (event) => {
    if(card3D) {
        setTransitionTime(standardTransitionTime, cardElems);
        cardsAnimate3D(0, 0, 0, 0);
    }
});

buttonElem.addEventListener("click", (event) => {
    setTransitionTime(standardTransitionTime, cardElems);

    for(let card of cardElems) {
        if(card.className == "card card3D") {
            card.classList = "card cardFlat";
            card3D = false;
            cardsAnimateFlat();
            buttonElem.innerHTML = "Animate";
            cardboxElem.classList = "hidden";
            colorscaleAnimateVisible();

            headerElem.style.transform = `translate3d(0px,0px,0px)`;
            escapeCodesWrapperElem.style.transform = `perspective(${perspective}px) rotateX(0deg)`;
        } else {
            card.classList = "card card3D";
            card3D = true;
            cardsAnimate3D(0, 0, 0, 0);
            colorscaleAnimateHidden();
            buttonElem.innerHTML = "Flatten";
            cardboxElem.classList = "cardbox";

            headerElem.style.transform = `translate3d(0px,-2rem,0px)`;
            escapeCodesWrapperElem.style.transform = `perspective(${perspective}px) rotateX(-180deg)`;
        }
    }
});


function colorscaleAnimateVisible() {
    setTransitionTime(standardTransitionTime, colorscaleElems)
    for(let colors of colorscaleElems) {
        colors.style.opacity = 1;
    }
    colorscaleGrayElem.style.transform = `perspective(${perspective}px) rotateY(0deg) rotateX(0deg) translate3d(0px,-75px,0px)`;
    colorscaleDarkElem.style.transform = `perspective(${perspective}px) rotateY(0deg) rotateX(0deg) translate3d(0px,75px,0px)`;
    colorscaleLightElem.style.transform = `perspective(${perspective}px) rotateY(0deg) rotateX(0deg) translate3d(0px,75px,0px)`;
}
function colorscaleAnimateHidden() {
    setTransitionTime(standardTransitionTime, colorscaleElems);
    for(let colors of colorscaleElems) {
        colors.style.opacity = 0;
    }
    colorscaleGrayElem.style.transform = `perspective(${perspective}px) rotateY(0deg) rotateX(0deg) translate3d(0px,-500px,-1000px)`;
    colorscaleDarkElem.style.transform = `perspective(${perspective}px) rotateY(0deg) rotateX(0deg) translate3d(100px,500px,-1000px)`;
    colorscaleLightElem.style.transform = `perspective(${perspective}px) rotateY(0deg) rotateX(0deg) translate3d(-100px,500px,-1000px)`;
}

function cardsAnimateFlat() {
    const cardWidth = 12.5;
    let cardstackWidth = (cardElems.length-1) * cardWidth;

    for(let i = 0; i < cardElems.length; i++) {
        let cardPosition = (i*cardWidth)-(cardstackWidth/2);
        cardElems[i].style.transform = `perspective(${perspective}px) rotateY(0deg) rotateX(0deg) translate3d(${cardPosition}rem,0px,0px)`;
    }
}

function cardsAnimate3D(rotateX, rotateY, translateX, translateY) {
    let depth = -200;
    const depthSpaceing = 85;

    for(let card of cardElems) {
        card.style.transform = `perspective(${perspective}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) translate3d(${translateY}px,${translateX}px,${depth}px)`;
        depth += depthSpaceing;
    }
    removeTrasitionTime(300, cardElems);
}


function setTransitionTime(seconds, elements) {
    for(let element of elements) {
        element.style.transitionDuration = seconds+"s";
    }
    removeTrasitionTime(800, elements);
}
function removeTrasitionTime(milliseconds, elements) {
    setTimeout(() => {
        for(let element of elements) {
            element.style.transitionDuration = "0.1s";
        }
    }, milliseconds);
}


const colorBoxElems = document.querySelectorAll(".colorBox");
const bgCodeElem = document.querySelector("#bgCode");
const fgCodeElem = document.querySelector("#fgCode");
const bgHexElem = document.querySelector("#bgHex");
const fgHexElem = document.querySelector("#fgHex");
for(let colorBox of colorBoxElems) {
    colorBox.addEventListener("click", (event) => {
        if(!card3D) {
            console.log("color click: ", colorBox);
            bgCodeElem.innerHTML = colorBox.id;
            fgCodeElem.innerHTML = colorBox.id;
            bgHexElem.innerHTML = colorBox.dataset.hex;
            fgHexElem.innerHTML = colorBox.dataset.hex;
        }
    });
}
