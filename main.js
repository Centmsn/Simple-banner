//banner info
const banner = [
  {
    img: "./20190210_120856.jpg", //0
    header: "First forest photo",
    link: "https://github.com",
  },
  {
    img: "./IMG_20161030_105321.jpg", //1
    header: "Second Forest photo",
    link: "https://github.com",
  },
  {
    img: "./IMG_20161030_115455.jpg", //2
    header: "Third forest photo",
    link: "https://github.com",
  },
  // add more slides
  // {
  //   img: "./IMG_20161030_115455.jpg",
  //   header: "Czwarta fotka lasu",
  // },
];

const bannerBackground = document.querySelector(".banner");
const bannerHeader = document.querySelector(".banner__title");
const arrows = [...document.querySelectorAll(".banner__arrow")];
//interface
let active = 0; //start img num
let timer = 4000; //time between img change

window.addEventListener("DOMContentLoaded", () => {
  const changeSlide = () => {
    if (active >= banner.length) {
      active = 0;
    } else if (active < 0) {
      active = banner.length - 1;
    }
    bannerBackground.style.backgroundImage = `url(${banner[active]["img"]})`;
    changeHeader();
    changeDot();
    active++;
  };
  //sets active class for dot span
  const changeDot = () => {
    let activeIndex = dots.findIndex((dot) =>
      dot.classList.contains("banner__dots--active")
    );
    dots[activeIndex].classList.remove("banner__dots--active");
    dots[active].classList.add("banner__dots--active");
  };

  function changeHeader() {
    bannerHeader.innerHTML = "";
    const header = document.createElement("a");
    header.classList.add("banner__desc");
    header.setAttribute("href", banner[active]["link"]);
    header.textContent = banner[active]["header"];
    bannerHeader.appendChild(header);
  }
  //dots are clickable
  function clickDot() {
    clearInterval(setter);
    if (this.classList.contains("banner__dots--active")) {
      setter = setInterval(changeSlide, timer);
    } else {
      active = dots.indexOf(this);
      changeSlide();
      setter = setInterval(changeSlide, timer);
    }
  }
  //side arrows
  function clickArrow() {
    clearInterval(setter); //reset interval
    const activeDot = dots.findIndex((dot) =>
      dot.classList.contains("banner__dots--active")
    ); //index of active dot
    if (this.dataset.direction === "left") {
      //if left arrow
      if (activeDot > 0) {
        active = activeDot - 1;
      } else {
        active = banner.length - 1;
      }
    } else {
      //if right arrow
      if (activeDot < banner.length - 1) {
        active = activeDot + 1;
      } else {
        active = 0;
      }
    }
    changeSlide();
    setter = setInterval(changeSlide, timer); // setInterval
  }

  const createDots = () => {
    let dot = "";
    for (let i = 0; i < banner.length; i++) {
      dot = document.createElement("span");
      dot.addEventListener("click", clickDot);
      dot.classList.add("banner__dots");
      i === active ? dot.classList.add("banner__dots--active") : null;
      document.querySelector(".banner__navigation").appendChild(dot);
    }
    changeHeader();
  };
  createDots();
  const dots = [...document.querySelectorAll(".banner__dots")];
  let setter = setInterval(changeSlide, timer);
  arrows.forEach((arrow) => arrow.addEventListener("click", clickArrow));
});
