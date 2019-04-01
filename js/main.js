    "use strict";

// PORTFOLIO -------------------------------------------------->

filterSelection("all");
function filterSelection(c) {
    let x, i;
    x = document.getElementsByClassName("column");
    if (c == "all") c = "";
    for (i = 0; i < x.length; i++) {
        w3RemoveClass(x[i], "show");
        if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "show");
    }
}

function w3AddClass(element, name) {
    let i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    for (i = 0; i < arr2.length; i++) {
        if (arr1.indexOf(arr2[i]) == -1) {element.className += " " + arr2[i];}
    }
}

function w3RemoveClass(element, name) {
    let i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    for (i = 0; i < arr2.length; i++) {
        while (arr1.indexOf(arr2[i]) > -1) {
            arr1.splice(arr1.indexOf(arr2[i]), 1);
        }
    }
    element.className = arr1.join(" ");
}

// Add active class to the current button (highlight it)
    let btnContainer = document.getElementById("myBtnContainer");
    let btns = btnContainer.getElementsByClassName("btn");
    for (let i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function(){
            let current = document.getElementsByClassName("active");
            current[0].className = current[0].className.replace(" active", "");
            this.className += " active";
        });
    }

// BUTTON TO TOP AND MENU-------------------------------------------------->
// When the user scrolls down 600px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};
function scrollFunction() {
    if (document.body.scrollTop > 600 || document.documentElement.scrollTop > 600) {
        document.getElementById("myBtn").style.display = "block";
        document.getElementById("header_scroll").style.top = "0";
    } else {
        document.getElementById("myBtn").style.display = "none";
        document.getElementById("header_scroll").style.top = "-100px";
        document.getElementById("header").style.top = "0";
    }
}
// // When the user clicks on the button, scroll to the top of the document
    let timeOut;
    function scrollToTop() {
        if (document.body.scrollTop!=0 || document.documentElement.scrollTop!=0){
            window.scrollBy(0,-50);
            timeOut=setTimeout('scrollToTop()',10);
        }
        else clearTimeout(timeOut);
    }
// TEXT EFFECT -------------------------------------------------->
let TxtRotate = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 15) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

TxtRotate.prototype.tick = function() {
    let i = this.loopNum % this.toRotate.length;
    let fullTxt = this.toRotate[i];

    if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

    let that = this;
    let delta = 100 - Math.random() * 100;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
    }

    setTimeout(function() {
        that.tick();
    }, delta);
};

window.onload = function() {
    let elements = document.getElementsByClassName('txt-rotate');
    for (let i=0; i<elements.length; i++) {
        let toRotate = elements[i].getAttribute('data-rotate');
        let period = elements[i].getAttribute('data-period');
        if (toRotate) {
            new TxtRotate(elements[i], JSON.parse(toRotate), period);
        }
    }
    // INJECT CSS
    let css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".txt-rotate > .wrap";
    document.body.appendChild(css);
};

// HAMBURGER  -------------------------------------------------->

    document.getElementById("jsBurger")
        .addEventListener("click", function () {

            document.getElementById('header')
                .classList.toggle('header__mobile');
        });

    // GALLERY  -------------------------------------------------->
    class SliderPlugin {
        constructor(settings) {
            this.sliderContainer = document.querySelector(settings ? settings.sliderContainer || '.slider' : '.slider');
            this.dotsWrapper = document.createElement('ul');
            this.arrowLeftBtn = document.createElement('button');
            this.arrowRightBtn = document.createElement('button');
            this.totalSlides = this.sliderContainer.querySelectorAll('.slide').length;
            this.slideWidth = parseInt(this.sliderContainer.querySelector('.slide').offsetWidth);
            this.currentSlide = 1;
            this.transitionSpeed = settings ? settings.speed || 300 : 300;
        };

        init() {
            let newHtml = this.sliderContainer.innerHTML;
            this.sliderContainer.innerHTML = `<div class="slider__inner">${newHtml}</div>`;
            this.sliderInner = this.sliderContainer.querySelector('.slider__inner');

            let cloneFirst = this.sliderContainer.querySelectorAll('.slide')[0].cloneNode(true);
            this.sliderInner.appendChild(cloneFirst);

            let cloneLast = this.sliderContainer.querySelectorAll('.slide')[this.totalSlides - 1].cloneNode(true);
            this.sliderInner.insertBefore(cloneLast, this.sliderInner.firstChild);

            this.arrowLeftBtn.className = 'slider__left';
            this.arrowRightBtn.className = 'slider__right';
            this.dotsWrapper.className = 'slider__dots-wrapper';
            this.sliderContainer.appendChild(this.arrowLeftBtn);
            this.sliderContainer.appendChild(this.arrowRightBtn);
            this.sliderContainer.appendChild(this.dotsWrapper);
            this.arrowLeftBtn = this.sliderContainer.querySelector('.slider__left');
            this.arrowRightBtn = this.sliderContainer.querySelector('.slider__right');
            this.dotsWrapper = this.sliderContainer.querySelector('.slider__dots-wrapper');

            this.allSlides = this.sliderContainer.querySelectorAll('.slide');
            this.sliderInner.style.width = (this.totalSlides + 2) * 100 + '%';
            for (let i = 0; i < this.totalSlides + 2; i++) {
                this.allSlides[i].style.width = 100 / (this.totalSlides + 2) + '%';
            }

            this.buildDots();
            this.setDot();
            this.initArrows();

            window.addEventListener('resize', this.debounce(this.updateSliderDimension.bind(this), 100), false);
        }

        initArrows() {
            if (this.arrowLeftBtn !== '') {
                this.arrowLeftBtn.addEventListener('click', () => {
                    if (!this.sliderContainer.classList.contains('isAnimating')) {
                        if (this.currentSlide === 1) {
                            this.currentSlide = this.totalSlides + 1;
                            this.sliderInner.style.left = -this.currentSlide * this.slideWidth + 'px';
                        }
                        this.currentSlide--;
                        setTimeout(() => {
                            this.goToSlide();
                        }, 20);
                    }
                }, false);
            }

            if (this.arrowRightBtn !== '') {
                this.arrowRightBtn.addEventListener('click', () => {
                    if (!this.sliderContainer.classList.contains('isAnimating')) {
                        if (this.currentSlide === this.totalSlides) {
                            this.currentSlide = 0;
                            this.sliderInner.style.left = -this.currentSlide * this.slideWidth + 'px';
                        }
                        this.currentSlide++;
                        setTimeout(() => {
                            this.goToSlide();
                        }, 20);
                    }
                }, false);
            }
        };

        goToSlide() {
            this.sliderInner.style.transition = 'left ' + this.transitionSpeed / 1000 + 's ' + 'ease';
            this.sliderInner.style.left = -this.currentSlide * this.slideWidth + 'px';
            this.sliderContainer.classList.add('isAnimating');

            setTimeout(() => {
                this.sliderInner.style.transition = '';
                this.sliderContainer.classList.remove('isAnimating');
            }, this.transitionSpeed);

            this.setDot();
        };

        buildDots() {
            for (let i = 0; i < this.totalSlides; i++) {
                let dot = document.createElement('li');
                dot.setAttribute('data-slide', i + 1);
                this.dotsWrapper.appendChild(dot);
            }

            this.dotsWrapper.addEventListener('click', (e) => {
                if (e.target && e.target.nodeName === 'LI') {
                    this.currentSlide = e.target.getAttribute('data-slide');
                    this.goToSlide();
                }
            }, false);
        };

        setDot() {
            let targetDot = this.currentSlide - 1;

            for (let j = 0; j < this.totalSlides; j++) {
                this.dotsWrapper.querySelectorAll('li')[j].classList.remove('active');
            }

            if (this.currentSlide - 1 < 0) {
                targetDot = this.totalSlides - 1;
            } else if (this.currentSlide - 1 > this.totalSlides - 1) {
                targetDot = 0;
            }

            this.dotsWrapper.querySelectorAll('li')[targetDot].classList.add('active');
        };

        updateSliderDimension() {
            console.log('something');
            this.slideWidth = parseInt(this.sliderContainer.querySelectorAll('.slide')[0].offsetWidth);
            this.sliderInner.style.left = -this.slideWidth * this.currentSlide + 'px';

            for (let i = 0; i < this.totalSlides + 2; i++) {
                if (this.allSlides[i].offsetHeight > this.sliderContainer.offsetHeight) {
                    this.sliderContainer.style.height = this.allSlides[i].offsetHeight + 'px';
                }
            }
        };

        debounce(f, ms) {

            let timer = null;

            return (...args) => {
                const onComplete = () => {
                    f.apply(this, args);
                    timer = null;
                };

                if (timer) {
                    clearTimeout(timer);
                }

                timer = setTimeout(onComplete, ms);
            };
        }
    }

    new SliderPlugin().init();

