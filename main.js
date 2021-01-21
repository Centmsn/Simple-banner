/**
 * Renders banner in the root element
 */
class Banner {
  /**
   * Creates banner
   * @param {Object} config - configuration object
   * @param {string} config.rootElement - a class selector for root element. Do not use . (dot) before class name
   * @param {number} [config.startSlide = 0] - first slide to be displayed
   * @param {number} config.timer - times between slide change. Use ms only
   * @param {Object[]} config.slides - slide details
   * @param {string} config.slides.img - path to image
   * @param {string} config.slides.header - slide header
   * @param {string} config.slides.link - header link
   */
  constructor(config) {
    /**@private */
    this._config = config;
    /**@private */
    this._root = document.querySelector(`.${config.rootElement}`);
    /**@private */
    this._activeSlide = this._config.startSlide || 0;

    this.createBanner();
  }

  /**
   * Determines which slide should be visible
   * @type {number}
   */
  set activeSlide(id) {
    const length = this._config.slides.length - 1;

    if (id > length) id = 0;
    else if (id < 0) id = length;

    this._activeSlide = id;

    this.changeSlide(id);
  }

  /**
   * Setup function - creates HTML structure for banner, adds listeners to HTML elements
   * @return {undefined}
   */
  createBanner = () => {
    const { slides, timer } = this._config;

    if (slides.length === 0) {
      throw new Error(
        "Config error: slides must containt at least one element"
      );
    } else if (
      this._activeSlide < 0 ||
      this._activeSlide > this._activeSlide.length
    ) {
      throw new Error("Config error: incorrect startSlide number");
    } else if (timer < 100) {
      throw new Error(
        `Config error: incorrect timer number. Number must be > 100 but got ${timer}`
      );
    } else {
      const bannerBase = document.createElement("div");
      bannerBase.classList.add("banner");

      const bannerCentralBox = document.createElement("div");
      bannerCentralBox.classList.add("banner__central-box");

      const bannerTitle = document.createElement("div");
      bannerTitle.classList.add("banner__title");

      const bannerNavigation = document.createElement("div");
      bannerNavigation.classList.add("banner__navigation");

      const bannerLeftArrow = document.createElement("div");
      bannerLeftArrow.classList.add("banner__arrow");
      bannerLeftArrow.dataset.direction = "left";
      bannerLeftArrow.innerHTML = "&lt;";
      bannerLeftArrow.addEventListener(
        "click",
        () => (this.activeSlide = this._activeSlide - 1)
      );

      const bannerRightArrow = document.createElement("div");
      bannerRightArrow.classList.add("banner__arrow");
      bannerRightArrow.dataset.direction = "right";
      bannerRightArrow.innerHTML = "&gt;";
      bannerRightArrow.addEventListener(
        "click",
        () => (this.activeSlide = this._activeSlide + 1)
      );

      bannerCentralBox.append(bannerLeftArrow, bannerTitle, bannerRightArrow);
      bannerBase.append(bannerCentralBox, bannerNavigation);

      this._root.append(bannerBase);

      let dot;
      for (let i = 0; i < slides.length; i++) {
        dot = document.createElement("span");
        dot.addEventListener("click", () => (this.activeSlide = i));
        dot.classList.add("banner__dots");
        i === this._activeSlide
          ? dot.classList.add("banner__dots--active")
          : null;
        document.querySelector(".banner__navigation").appendChild(dot);
      }

      this.dots = [...this._root.querySelectorAll(".banner__dots")];

      this.changeSlide(this._activeSlide);
    }
  };

  /**
   * Changes current header
   * @param {number} index - slide index in the config.slides
   * @return {undefined}
   */
  changeHeader = (index) => {
    // TODO: refactor - do not create new element every time slide changes
    const bannerHeader = document.querySelector(".banner__title");
    bannerHeader.innerHTML = "";
    const header = document.createElement("a");
    header.classList.add("banner__desc");
    header.setAttribute("href", this._config.slides[index]["link"]);
    header.setAttribute("target", "_blank");
    header.textContent = this._config.slides[index]["header"];
    bannerHeader.appendChild(header);
  };

  /**
   * Changes current image
   * @param {number} index - slide index in the config.slides
   * @return {undefined}
   */
  changeImg = (index) => {
    this._root.querySelector(
      ".banner"
    ).style.backgroundImage = `url(${this._config.slides[index]["img"]})`;
  };

  /**
   * Removes active class from nav dots, then adds it to current dot
   * @param {number} index - slide index in the config.slides
   * @return {undefined}
   */
  changeDot = (index) => {
    this.dots.forEach((dot) => dot.classList.remove("banner__dots--active"));
    this.dots[index].classList.add("banner__dots--active");
  };

  /**
   * Changes active image, nav dot, and header
   * @param {number} index - slide index
   * @return {undefined}
   */
  changeSlide = (index) => {
    clearTimeout(this.timeoutId);

    this.changeImg(index);
    this.changeHeader(index);
    this.changeDot(index);

    this.timeoutId = setTimeout(
      () => (this.activeSlide = index + 1),
      this._config.timer
    );
  };
}

//config object
const bannerConfig = {
  rootElement: "banner-container", // class name of root element
  startSlide: 0, // first image to be displayed - optional
  timer: 2500, //time beetwen each slide change / use ms only
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

document.addEventListener("DOMContentLoaded", () => new Banner(bannerConfig));
