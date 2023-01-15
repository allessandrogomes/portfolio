const homeScroll = document.querySelector("#link-lists-home");
const teckstack = document.querySelector("#teckstack");
const teckstackBtn = document.querySelector("#link-lists-teckstack");
const projectsBtn = document.querySelector("#link-lists-projects");
const projects = document.querySelector("#projects");
const aboutBtn = document.querySelector("#link-lists-about");
const about = document.querySelector("#about");
const contactScroll = document.querySelector("#link-lists-contact");

homeScroll.addEventListener("click", () => {
    window.scroll({
        top: 0,
        behavior: 'smooth'
    });
})

teckstackBtn.addEventListener("click", () => {
    teckstack.scrollIntoView({behavior: "smooth", block: "center"});
})

projectsBtn.addEventListener("click", () => {
    projects.scrollIntoView({behavior: "smooth", block: "center"})
})

aboutBtn.addEventListener("click", () => {
    about.scrollIntoView({behavior: "smooth", block: "center"})
})

contactScroll.addEventListener("click", () => {
    window.scroll({
        top: 50000,
        behavior: 'smooth'
    });
})