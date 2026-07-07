// Selalu mulai dari atas
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};

window.addEventListener('load', () => {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
    });
});



// =========================
// OPEN INVITATION
// =========================
document.body.classList.add("lock-scroll");

const openBtn = document.getElementById("openInvitation");
const opening = document.getElementById("opening");
const music = document.getElementById("music");

const bottomNav = document.getElementById("bottomNav");
const musicBtn = document.getElementById("musicToggle");

openBtn.addEventListener("click", () => {

    if(document.documentElement.requestFullscreen){
        document.documentElement.requestFullscreen();
    }

    opening.style.transition = "1.2s ease";
    opening.style.transform = "translateY(-100%)";

    document.body.classList.remove("lock-scroll");

    if(music){
        music.play();
    }

    if(bottomNav){
        bottomNav.classList.add("show");
    }

    if(musicBtn){
        musicBtn.classList.add("show");
        musicBtn.classList.add("playing");
    }

});

// =========================
// NAMA TAMU DARI URL
// contoh:
// index.html?to=Rafik
// =========================

const urlParams = new URLSearchParams(window.location.search);

const guest = urlParams.get("to");

const guestName = document.getElementById("guestName");

if (guest) {
    guestName.innerHTML = guest;
}

// =========================
// COUNTDOWN
// =========================

const weddingDate = new Date(
    "December 12, 2026 09:00:00"
).getTime();

setInterval(() => {

    const now = new Date().getTime();

    const distance = weddingDate - now;

    const days = Math.floor(
        distance / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24))
        /
        (1000 * 60 * 60)
    );

    const minutes = Math.floor(
        (distance % (1000 * 60 * 60))
        /
        (1000 * 60)
    );

    const seconds = Math.floor(
        (distance % (1000 * 60))
        /
        1000
    );

    document.getElementById("days").innerHTML = days;
    document.getElementById("hours").innerHTML = hours;
    document.getElementById("minutes").innerHTML = minutes;
    document.getElementById("seconds").innerHTML = seconds;

}, 1000);

// =========================
// SCROLL ANIMATION
// =========================

const reveals = document.querySelectorAll(
    ".reveal-left,.reveal-right,.fade-up,.slide-up"
);

function revealElements() {

    const windowHeight = window.innerHeight;

    reveals.forEach((el) => {

        const elementTop = el.getBoundingClientRect().top;
        const elementBottom = el.getBoundingClientRect().bottom;

        // MASUK VIEWPORT
        if (elementTop < windowHeight - 100 && elementBottom > 0) {
            el.classList.add("show");
        }

        // KELUAR VIEWPORT (scroll ke atas/bawah lagi)
        else {
            el.classList.remove("show");
        }

    });

}

window.addEventListener("scroll", revealElements);
revealElements();

// gift

const showGiftBtn = document.getElementById("showGiftBtn");
const giftWrapper = document.getElementById("giftWrapper");

if(showGiftBtn && giftWrapper){

    giftWrapper.classList.add("hidden");

    showGiftBtn.addEventListener("click", () => {

        giftWrapper.classList.remove("hidden");
        giftWrapper.classList.add("show-gift");

        showGiftBtn.style.display = "none";

    });

}

// =========================
// COPY REKENING
// =========================

document.addEventListener("click", async function(e){

    const btn = e.target.closest(".copy-btn");

    if(!btn) return;

    const rekening = btn.dataset.rekening;

    try{

        await navigator.clipboard.writeText(rekening);

        const original = btn.innerHTML;

        btn.innerHTML = "✓ Berhasil Disalin";

        btn.disabled = true;

        setTimeout(()=>{

            btn.innerHTML = original;

            btn.disabled = false;

        },2000);

    }catch(err){

        console.error(err);

        alert("Browser tidak mengizinkan menyalin.");

    }

});

// =========================
// NAVBAR ACTIVE
// =========================

const sections =
document.querySelectorAll("section");

const navLinks =
document.querySelectorAll("#bottomNav a");

window.addEventListener("scroll",()=>{

    let current = "";

    sections.forEach(section=>{

        const sectionTop =
        section.offsetTop - 150;

        if(
            pageYOffset >= sectionTop
        ){
            current = section.getAttribute("id");
        }

    });

    navLinks.forEach(link=>{

        link.classList.remove("active");

        if(
            link.getAttribute("href")
            ===
            "#" + current
        ){
            link.classList.add("active");
        }

    });

});

// =========================
// GOOGLE SHEETS
// GANTI URL APPS SCRIPT
// =========================

const scriptURL =
"https://script.google.com/macros/s/AKfycbxYsrU_YaTBPaNtRcS3PWXY0lG8ADQxM14Rd367RM176zGUfiGGykgOzVUjopJWhj6V/exec";

const form =
document.getElementById("rsvpForm");

if(form){

const submitBtn =
document.getElementById("submitBtn");

form.addEventListener("submit", function(e){

    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.innerHTML = "Mengirim...";

    const data = {

        nama:
        document.getElementById("nama").value,

        kehadiran:
        document.getElementById("kehadiran").value,

        pesan:
        document.getElementById("pesan").value

    };

    fetch(scriptURL,{
        method:"POST",
        body:JSON.stringify(data)
    })

    .then(res => res.text())

    .then(response => {

        form.reset();

        submitBtn.disabled = false;
        submitBtn.innerHTML = "Kirim";

        loadUcapan();

    })

    .catch(err => {

        console.log(err);

        submitBtn.disabled = false;
        submitBtn.innerHTML = "Kirim";

    });

});
}

// =========================
// LOAD UCAPAN
// =========================

function loadUcapan(){

fetch(scriptURL + "?action=get")

.then(res => res.json())

.then(data => {

    const list =
    document.getElementById("listUcapan");

    list.innerHTML = "";

    let hadir = 0;
    let tidakHadir = 0;

    data.reverse().forEach(item => {

        if(item.kehadiran === "Hadir"){
            hadir++;
        }else{
            tidakHadir++;
        }

list.innerHTML += `
<div class="ucapan-item">

    <h4 class="text-left">${item.nama}</h4>

    <small class="text-up">
        ${item.kehadiran}
    </small>

    <p class="text-right">
        ${item.pesan}
    </p>

</div>
`;
initTextAnimation();
revealText();

    });

    document.getElementById("totalHadir").innerText =
    hadir;

    document.getElementById("totalTidakHadir").innerText =
    tidakHadir;

    document.getElementById("totalSemua").innerText =
    hadir + tidakHadir;

})

.catch(err => {

    console.log(err);

});

}

loadUcapan();
// musik

const audio = document.getElementById("song");
const btn = document.getElementById("musicToggle");

btn.onclick = () => {

    if(audio.paused){

        audio.play();

        btn.classList.add("playing");

    }else{

        audio.pause();

        btn.classList.remove("playing");

    }

}

// teks
function revealText(){

    const texts = document.querySelectorAll(
        ".text-up, .text-left, .text-right"
    );

    texts.forEach(text => {

        const top =
        text.getBoundingClientRect().top;

        if(top < window.innerHeight - 100){

            text.classList.add("text-show");

        }else{

            text.classList.remove("text-show");

        }

    });

}

window.addEventListener("scroll", revealText);

revealText();

function initTextAnimation(){

    const elements = document.querySelectorAll(
        "h1,h2,h3,h4,p,span,small,.hero-text,.section-desc,.thanks-text,.event-item a,.gift-text"
    );

    elements.forEach(el => {
        el.classList.add("animate-text");
    });

}

function revealText(){

    const texts =
    document.querySelectorAll(".animate-text");

    texts.forEach(text => {

        const top =
        text.getBoundingClientRect().top;

        if(top < window.innerHeight - 80){

            text.classList.add("show");

        }else{

            text.classList.remove("show");

        }

    });

}

initTextAnimation();

window.addEventListener("scroll", revealText);

revealText();

// bunga layar
const flowers =
document.querySelectorAll(".flower-side");

function flowerAnimation(){

    const couple =
    document.getElementById("couple");

    const rect =
    couple.getBoundingClientRect();

    // Saat section terlihat
    if(
        rect.top < window.innerHeight - 100 &&
        rect.bottom > 100
    ){

        flowers.forEach(flower=>{
            flower.classList.add("show");
        });

    }

    // Saat section keluar layar
    else{

        flowers.forEach(flower=>{
            flower.classList.remove("show");
        });

    }

}

window.addEventListener("scroll", flowerAnimation);

flowerAnimation();

// bunga bawah
const bottomFlowers = document.querySelectorAll(
    ".flower-couple-left-bottom, .flower-couple-right-bottom"
);

function showBottomFlowers(){

    const coupleSection =
    document.getElementById("couple");

    const rect =
    coupleSection.getBoundingClientRect();

    if(rect.top < window.innerHeight - 200){

        bottomFlowers.forEach(flower=>{
            flower.classList.add("show");
        });

    }else{

        bottomFlowers.forEach(flower=>{
            flower.classList.remove("show");
        });

    }

}

window.addEventListener("scroll", showBottomFlowers);

showBottomFlowers();

// cover tidak bisa di scrol
document.body.classList.add("lock-scroll");

window.scrollTo(0,0);

// kalender
const items=document.querySelectorAll(".gallery-item");
const lightbox=document.querySelector(".lightbox");
const image=document.getElementById("lightboxImage");

items.forEach(item=>{

    item.onclick=(e)=>{

        e.preventDefault();

        image.src=item.querySelector("img").src;

        lightbox.style.display="flex";

    }

});

lightbox.onclick=()=>{

    lightbox.style.display="none";

}

