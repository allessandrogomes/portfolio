class MobileNavbar {
    constructor(mobileMenu,navList, navLinks, navLinksIcons) {
        this.mobileMenu = document.querySelector(mobileMenu);
        this.navList = document.querySelector(navList);
        this.navLinks = document.querySelectorAll(navLinks);
        this.navLinksIcons = document.querySelectorAll(navLinksIcons);
        this.activeClass = "active";
        

        this.handleClick = this.handleClick.bind(this);
    }

    animateLinks () {
        this.navLinks.forEach((link) => {
            link.style.animation
            ? (link.style.animation = "")
            : (link.style.animation = `navLinkFade 0.5s ease forwards 0.3s`);
        });
        this.navLinksIcons.forEach((link) => {
            link.style.animation
            ? (link.style.animation = "")
            : (link.style.animation = `navLinkFade 0.5s ease forwards 0.3s`);
        });
    }

    handleClick() {
        this.navList.classList.toggle(this.activeClass);
        this.mobileMenu.classList.toggle(this.activeClass);
        this.animateLinks();
    }

    addClickEvent () {
        this.mobileMenu.addEventListener("click", this.handleClick);
    }

    init() {
        if (this.mobileMenu) {
            this.addClickEvent();
        }
        return this;
    }
}



const mobileNavbar = new MobileNavbar (
    ".mobile__menu", 
    ".lists__header",
    ".link__lists___header",
    ".img__lists___header"
);
mobileNavbar.init();

const listsHeader = document.querySelector(".lists__header");
const mobileMenu = document.querySelector(".mobile__menu");
const navLinks = document.querySelectorAll(".link__lists___header");
const navIcons = document.querySelector(".img__lists___header");

navLinks.forEach(item => {
    item.addEventListener('click', event => {
        listsHeader.classList.remove("active");
        mobileMenu.classList.remove("active");
        navLinks.forEach(item => {
            item.style.animation = null;
        })
        navIcons.style.animation = null;
    })
})