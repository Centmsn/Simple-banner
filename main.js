class Banner {
  constructor(config) {
    this.config = config;
    this.setter = "";
    this.dots = "";

    this.createBanner();
  }

  createBanner = () => {
    if (
      this.config.startSlide < 0 ||
      this.config.startSlide > this.config.startSlide.length
    ) {
      throw new Error("Incorrect startSlide number");
    } else if (this.config.timer < 100) {
      throw new Error("Incorrect timer number. Please use number > 100");
    } else {
      let dot = "";
      for (let i = 0; i < this.config.slides.length; i++) {
        dot = document.createElement("span");
        dot.addEventListener("click", this.clickDot);
        dot.classList.add("banner__dots");
        i === this.config.startSlide
          ? dot.classList.add("banner__dots--active")
          : null;
        document.querySelector(".banner__navigation").appendChild(dot);
      }

      document
        .querySelectorAll(".banner__arrow")
        .forEach((arrow) => arrow.addEventListener("click", this.clickArrow));

      this.dots = [...document.querySelectorAll(".banner__dots")];
      this.changeHeader();
      this.changeImg();
      this.changeDot();
    }
  };

  changeHeader = () => {
    const bannerHeader = document.querySelector(".banner__title");
    bannerHeader.innerHTML = "";
    const header = document.createElement("a");
    header.classList.add("banner__desc");
    header.setAttribute(
      "href",
      this.config.slides[this.config.startSlide]["link"]
    );
    header.setAttribute("target", "_blank");
    header.textContent = this.config.slides[this.config.startSlide]["header"];
    bannerHeader.appendChild(header);
  };

  changeImg = () => {
    document.querySelector(".banner").style.backgroundImage = `url(${
      this.config.slides[this.config.startSlide]["img"]
    })`;
  };

  changeDot = () => {
    let activeIndex = this.dots.findIndex((dot) =>
      dot.classList.contains("banner__dots--active")
    );
    this.dots[activeIndex].classList.remove("banner__dots--active");
    this.dots[this.config.startSlide].classList.add("banner__dots--active");
  };

  changeSlide = () => {
    if (this.config.startSlide >= this.config.slides.length) {
      this.config.startSlide = 0;
    } else if (this.config.startSlide < 0) {
      this.config.startSlide = this.config.slides.length - 1;
    }
    this.changeImg();
    this.changeHeader();
    this.changeDot();
    this.config.startSlide++;
  };

  clickDot = () => {
    clearInterval(this.setter);
    if (event.target.classList.contains("banner__dots--active")) {
      this.setter = setInterval(this.changeSlide, this.config.timer);
    } else {
      this.config.startSlide = this.dots.indexOf(event.target);
      this.changeSlide();
      this.setter = setInterval(this.changeSlide, this.config.timer);
    }
  };

  clickArrow = () => {
    clearInterval(this.setter);
    const activeDot = this.dots.findIndex((dot) =>
      dot.classList.contains("banner__dots--active")
    );
    if (event.target.dataset.direction === "left") {
      if (activeDot > 0) {
        this.config.startSlide = activeDot - 1;
      } else {
        this.config.startSlide = this.config.slides.length - 1;
      }
    } else {
      if (activeDot < this.config.slides.length - 1) {
        this.config.startSlide = activeDot + 1;
      } else {
        this.config.startSlide = 0;
      }
    }
    this.changeSlide();
    this.setter = setInterval(this.changeSlide, this.config.timer);
  };
}

//config object
const config = {
  startSlide: 2, // first image to be displayed
  timer: 2000, //time beetwen each slide change in ms
  slides: [
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
  ],
};

// refactor config object to contain all parameters
window.addEventListener("DOMContentLoaded", () => new Banner(config));
