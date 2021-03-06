/**
 * Renders banner in the root element
 */
class Banner {
  /**
   * Creates banner
   * @param {Object} config - configuration object
   * @param {string} config.rootElement - a class selector for root element. Do not use . (dot) before class name
   * @param {number} [config.startSlide = 0] - first slide to be displayed
   * @param {number} config.timer - times between slide change. Amount of milliseconds
   * @param {boolean} config.preventChangeOnMouseOver - prevents slide change if mouse is located on the banner
   * @param {Object[]} config.slides - slide details
   * @param {string} config.slides.imgPath - path to image
   * @param {string} config.slides.header - slide header
   * @param {string} [config.slides.link] - header link / if not provided header will be displayed as <h2>
   */
  constructor(config) {
    /**@private */
    this._config = config;
    /**@private */
    this._root = document.querySelector(`.${config.rootElement}`);
    /**@private */
    this._activeSlide = this._config.startSlide || 0;
  }

  /**
   * Renders banner in DOM
   * @returns {undefined}
   */
  mount = () => {
    this.createBanner();
  };

  /**
   * removes banner from DOM, clears event listeners
   * @return {undefined}
   */
  unmount = () => {
    clearTimeout(this.timeoutId);
    this._activeSlide = this._config.startSlide;
    this._root.innerHTML = "";
  };

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
   * Validates user config object - runs only one time
   * @param {Object} config - class config object
   * @returns {boolean} - true if config is OK
   */
  validateConfig = (config) => {
    const { slides, timer, rootElement } = config;

    //* validate amount of slides
    if (slides.length === 0) {
      throw new Error(
        `Config error: slides must containt at least one element`
      );
      //* validate if active slide is in range
    } else if (
      this._activeSlide < 0 ||
      this._activeSlide > this._activeSlide.length
    ) {
      throw new Error(
        `Config error: incorrect startSlide number. Num must be > 0 && < slides.length.`
      );
      //* validate if timer is >250 && time is number
    } else if (timer < 250 || typeof timer !== "number") {
      throw new Error(
        `Config error: incorrect timer number. Number must be > 250 but got ${timer}.`
      );
      //* validate if rootElement exists in DOM
    } else if (!document.querySelector(`.${rootElement}`)) {
      throw new Error(
        `Config error: rootElement not found. Check Your spelling.`
      );
    }

    slides.forEach((slide) => {
      if (!slide.header || slide.header.length === 0)
        console.warn("Warning! Slide header is empty. Check Your spelling");

      if (!slide.imgPath || typeof slide.imgPath !== "string") {
        console.warn("Warning! imgPath is not a string or is an empty string.");
      }
    });
    return true;
  };

  /**
   * Setup function - creates HTML structure for banner, adds listeners to HTML elements
   * @return {undefined}
   */
  createBanner = () => {
    const { slides } = this._config;
    const isValid = this.validateConfig(this._config);

    if (isValid) {
      //* create basic HTML structure
      const bannerBase = document.createElement("div");
      bannerBase.classList.add("banner");

      if (this._config.preventChangeOnMouseOver) {
        bannerBase.addEventListener("mouseenter", () => {
          this.preventChange = true;
          clearTimeout(this.timeoutId);
        });
        bannerBase.addEventListener("mouseleave", () => {
          this.preventChange = false;

          this.timeoutId = setTimeout(
            () => (this.activeSlide = this._activeSlide + 1),
            this._config.timer
          );
        });
      }

      const bannerCentralBox = document.createElement("div");
      bannerCentralBox.classList.add("banner__central-box");

      const bannerTitle = document.createElement("div");
      bannerTitle.classList.add("banner__title");

      const bannerNavigation = document.createElement("div");
      bannerNavigation.classList.add("banner__navigation");

      //* create left arrow
      const bannerLeftArrow = document.createElement("button");
      bannerLeftArrow.classList.add("banner__arrow");
      bannerLeftArrow.innerHTML = "&lt;";
      bannerLeftArrow.addEventListener(
        "click",
        () => (this.activeSlide = this._activeSlide - 1)
      );

      //* create right arrow
      const bannerRightArrow = document.createElement("button");
      bannerRightArrow.classList.add("banner__arrow");
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
   * Removes previous header and creates new one
   * @param {number} index - slide index in the config.slides
   * @return {undefined}
   */
  changeHeader = (index) => {
    let header;

    const bannerHeader = this._root.querySelector(".banner__title");
    bannerHeader.textContent = "";
    if (this._config.slides[index].link) {
      header = document.createElement("a");
      header.setAttribute("href", this._config.slides[index]["link"]);
      header.setAttribute("target", "_blank");
    } else {
      header = document.createElement("h2");
    }

    header.classList.add("banner__desc");
    bannerHeader.appendChild(header);
    header.textContent = this._config.slides[index]["header"];
  };

  /**
   * Changes current image
   * @param {number} index - slide index in the config.slides
   * @return {undefined}
   */
  changeImg = (index) => {
    this._root.querySelector(
      ".banner"
    ).style.backgroundImage = `url(${this._config.slides[index]["imgPath"]})`;
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

    if (this._config.preventChangeOnMouseOver && this.preventChange) return;
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
  timer: 2000, //time beetwen each slide change / use ms only
  preventChangeOnMouseOver: true, //prevents slide change when mouse is on the banner
  slides: [
    {
      imgPath: "./20190210_120856.jpg", //0
      header: "First forest photo",
      link: "https://github.com", //optional - if not provided header will be displayed as <h2>
    },
    {
      imgPath: "./IMG_20161030_105321.jpg", //1
      header: "Second Forest photo",
      link: "https://github.com",
    },
    {
      imgPath: "./IMG_20161030_115455.jpg", //2
      header: "Third forest photo",
      link: "https://github.com",
    },

    // add more slides
    // {
    //   imgPath: "path",
    //   header: "description",
    //   link: "link",
    // },
  ],
};

const HeaderBanner = new Banner(bannerConfig);
//renders banner in the DOM
HeaderBanner.mount();
