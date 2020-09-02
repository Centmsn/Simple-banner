class Banner {
  constructor(active, timer, config) {
    this.active = active; // slide number to start from
    this.timer = timer; //time between slide change
    this.config = config; //configuration object
    this.setter = setInterval(this.changeSlide, timer);
    this.dots = "";

    this.createBanner();
  }

  createBanner = () => {
    let dot = "";
    for (let i = 0; i < this.config.length; i++) {
      dot = document.createElement("span");
      dot.addEventListener("click", this.clickDot);
      dot.classList.add("banner__dots");
      i === this.active ? dot.classList.add("banner__dots--active") : null;
      document.querySelector(".banner__navigation").appendChild(dot);
    }

    document
      .querySelectorAll(".banner__arrow")
      .forEach((arrow) => arrow.addEventListener("click", this.clickArrow));

    this.dots = [...document.querySelectorAll(".banner__dots")];
    this.changeHeader();
    this.changeImg();
    this.changeDot();
  };

  changeHeader = () => {
    const bannerHeader = document.querySelector(".banner__title");
    bannerHeader.innerHTML = "";
    const header = document.createElement("a");
    header.classList.add("banner__desc");
    header.setAttribute("href", this.config[this.active]["link"]);
    header.setAttribute("target", "_blank");
    header.textContent = this.config[this.active]["header"];
    bannerHeader.appendChild(header);
  };

  changeImg = () => {
    document.querySelector(".banner").style.backgroundImage = `url(${
      this.config[this.active]["img"]
    })`;
  };

  //sets active class for dot span
  changeDot = () => {
    let activeIndex = this.dots.findIndex((dot) =>
      dot.classList.contains("banner__dots--active")
    );
    this.dots[activeIndex].classList.remove("banner__dots--active");
    this.dots[this.active].classList.add("banner__dots--active");
  };

  changeSlide = () => {
    if (this.active >= this.config.length) {
      this.active = 0;
    } else if (this.active < 0) {
      this.active = this.config.length - 1;
    }
    this.changeImg();
    this.changeHeader();
    this.changeDot();
    this.active++;
  };

  clickDot = () => {
    clearInterval(this.setter);
    if (event.target.classList.contains("banner__dots--active")) {
      this.setter = setInterval(this.changeSlide, this.timer);
    } else {
      this.active = this.dots.indexOf(event.target);
      this.changeSlide();
      this.setter = setInterval(this.changeSlide, this.timer);
    }
  };

  clickArrow = () => {
    clearInterval(this.setter);
    const activeDot = this.dots.findIndex((dot) =>
      dot.classList.contains("banner__dots--active")
    );
    if (event.target.dataset.direction === "left") {
      if (activeDot > 0) {
        this.active = activeDot - 1;
      } else {
        this.active = this.config.length - 1;
      }
    } else {
      if (activeDot < this.config.length - 1) {
        this.active = activeDot + 1;
      } else {
        this.active = 0;
      }
    }
    this.changeSlide();
    this.setter = setInterval(this.changeSlide, this.timer);
  };
}

//config object
const config = [
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
  //   img: "path",
  //   header: "description",
  //   link: "link",
  // },
];

window.addEventListener("DOMContentLoaded", () => new Banner(2, 4000, config));
