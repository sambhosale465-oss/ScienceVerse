const enterButton = document.getElementById("enterButton");

if (enterButton) {
    enterButton.addEventListener("click", () => {
        document.getElementById("timeline").scrollIntoView({
            behavior: "smooth"
        });
    });
}

let scientists = [];
let currentIndex = 0;
let isAnimating = false;
const timelineSlider = document.getElementById("timelineSlider");
const timelineYear = document.getElementById("timelineYear");

async function loadScientists() {

    const response = await fetch("/scientists");

    const data = await response.json();

    scientists = data.scientists;

    showScientist(currentIndex);
}

function showScientist(index) {

    const scientist = scientists[index];

    document.getElementById("legendCard").innerHTML = `

        <img class="scientist-portrait"
             src="/static/images/${scientist.portrait}"
             alt="${scientist.name}">

        <h3>${scientist.name}</h3>

        <p><strong>Country:</strong> ${scientist.country}</p>

        <p><strong>Years:</strong> ${scientist.birth} - ${scientist.death}</p>

        <p><strong>Field:</strong> ${scientist.field.join(", ")}</p>

        <p><strong>Main Discovery:</strong> ${scientist.discoveries[0]}</p>

        <p>${scientist.description}</p>

    `;
}
function createMapCard(scientist) {

    return `

        <div class="map-card">

            <img
                src="/static/images/${scientist.portrait}"
                alt="${scientist.name}">

            <h3>${scientist.name}</h3>

            <p><strong>Country:</strong> ${scientist.country}</p>

            <p><strong>Years:</strong> ${scientist.birth} - ${scientist.death}</p>

            <p><strong>Field:</strong> ${scientist.field.join(", ")}</p>

            <p><strong>Discovery:</strong> ${scientist.discoveries[0]}</p>

        </div>

    `;

}
function createMapDots() {

    const mapDots = document.getElementById("mapDots");

    mapDots.innerHTML = "";

    scientists.forEach((scientist) => {

        const dot = document.createElement("div");

        dot.className = "scientist-dot";
        switch (scientist.primaryField) {

            case "Physics":
                dot.classList.add("physics");
                break;

            case "Chemistry":
                dot.classList.add("chemistry");
                break;

            case "Biology":
                dot.classList.add("biology");
                break;

            case "Mathematics":
                dot.classList.add("mathematics");
                break;

            case "Astronomy":
                dot.classList.add("astronomy");
                break;

            case "Electrical Engineering":
                dot.classList.add("engineering");
                break;

        }

        dot.style.left = scientist.mapPosition.left;
        dot.style.top = scientist.mapPosition.top;
        dot.innerHTML = createMapCard(scientist);
        dot.dataset.birth = scientist.birth;

        dot.addEventListener("click", () => {

            currentIndex = scientists.findIndex(
                s => s.id === scientist.id
            );

            showScientist(currentIndex);

        });

        mapDots.appendChild(dot);

            });

}

function nextScientist() {

    if(isAnimating) return;

    isAnimating = true;

    const card = document.getElementById("legendCard");

    card.classList.add("slide-left");

    setTimeout(() => {

        currentIndex++;

        if(currentIndex >= scientists.length){

            currentIndex = 0;

        }

        showScientist(currentIndex);

        card.classList.remove("slide-left");

        card.classList.add("slide-right");

        setTimeout(()=>{

            card.classList.remove("slide-right");

            isAnimating = false;

        },300);

    },300);

}

function previousScientist(){

    if(isAnimating) return;

    isAnimating = true;

    const card = document.getElementById("legendCard");

    card.classList.add("slide-right");

    setTimeout(()=>{

        currentIndex--;

        if(currentIndex < 0){

            currentIndex = scientists.length-1;

        }

        showScientist(currentIndex);

        card.classList.remove("slide-right");

        card.classList.add("slide-left");

        setTimeout(()=>{

            card.classList.remove("slide-left");

            isAnimating=false;

        },300);

    },300);

}

document.getElementById("nextBtn").addEventListener("click",nextScientist);

document.getElementById("prevBtn").addEventListener("click",previousScientist);

loadScientists().then(() => {
    createMapDots();
});
if (timelineSlider) {

    timelineSlider.addEventListener("input", () => {

        const selectedYear = Number(timelineSlider.value);

        if (selectedYear < 0) {

            timelineYear.textContent = `${Math.abs(selectedYear)} BC`;

        }
        else {

            timelineYear.textContent = selectedYear;

        }        timelineYear.classList.remove("timeline-boop");

        void timelineYear.offsetWidth;

        timelineYear.classList.add("timeline-boop");
        const timelineEra = document.getElementById("timelineEra");

        if (selectedYear < 500) {

            timelineEra.textContent = "Ancient World";

        }
        else if (selectedYear < 1400) {

            timelineEra.textContent = "Middle Ages";

        }
        else if (selectedYear < 1700) {

            timelineEra.textContent = "Scientific Revolution";

        }
        else if (selectedYear < 1800) {

            timelineEra.textContent = "Age of Enlightenment";

        }
        else if (selectedYear < 1900) {

            timelineEra.textContent = "Industrial Revolution";

        }
        else if (selectedYear < 1950) {

            timelineEra.textContent = "Modern Physics";

        }
        else {

            timelineEra.textContent = "Modern Era";

        }
        const availableScientists = scientists.filter(scientist => scientist.birth <= selectedYear);

        if (availableScientists.length > 0) {

            const newestScientist = availableScientists[availableScientists.length - 1];

            currentIndex = scientists.findIndex(
                scientist => scientist.id === newestScientist.id
            );

            showScientist(currentIndex);

        }

        const dots = document.querySelectorAll(".scientist-dot");

        dots.forEach(dot => {

            const birthYear = Number(dot.dataset.birth);

            if (selectedYear >= birthYear) {

                dot.style.display = "block";

            }
            else {

                dot.style.display = "none";

            }

        });

    });

}
timelineSlider.dispatchEvent(new Event("input"));
/* ===========================
   Archivist
=========================== */

const sendButton = document.getElementById("sendButton");

if (sendButton) {

    sendButton.addEventListener("click", sendQuestion);

}

async function sendQuestion() {

    const input = document.getElementById("userInput");

    const question = input.value.trim();

    if (question === "") {

        return;

    }

    const response = await fetch("/search", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            name: question

        })

    });

const data = await response.json();

const chatWindow = document.getElementById("chatWindow");

chatWindow.style.display = "block";

if (data.error) {

    chatWindow.innerHTML = `

        <h2>The Archivist</h2>

        <p>${data.error}</p>

    `;

}
else{

    chatWindow.innerHTML = `

        <h2>${data.name}</h2>

        <p><strong>Country:</strong> ${data.country}</p>

        <p><strong>Years:</strong> ${data.birth} - ${data.death}</p>

        <p><strong>Field:</strong> ${data.field.join(", ")}</p>

        <p><strong>Main Discovery:</strong> ${data.discoveries[0]}</p>

        <p>${data.description}</p>

        <br>

        <hr>

        <p><strong>Further Reading</strong></p>

        <a href="${data.wikipedia}" target="_blank">
            📖 Wikipedia
        </a>

        <br><br>

        ${data.papers.map(paper => `
            <a href="${paper.url}" target="_blank">
                📄 ${paper.title}
            </a><br>
        `).join("")}

    `;

}

input.value = "";

input.focus();
}