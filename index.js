var numClicks = 0;
var numPairs;
var numPairsMatched = 0;
var totalPairs;
var timer = 0;
var totalTime;
var firstCard;
var secondCard;
var incrementTimer;
var mode = "easy";
var width;
var theme = "light";
var powerTime = 500;

const setup = async () => {
    $("#start").on(("click"), function () {
        start();
    });
    $(".mode").on(("click"), function () {
        $(`#${mode}`).toggleClass("active");
        $(this).toggleClass("active");
        mode = $(this).attr("id");
    });
    $(".theme").on(("click"), function () {
        $(`#${theme}`).toggleClass("active");
        $(this).toggleClass("active");
        theme = $(this).attr("id");
        if (theme === "light") {
            $("body").css("background-color", "white");
            $("body").css("color", "black");
            $("#game_grid").css("background-color", "white");
        } else if (theme === "dark") {
            $("body").css("background-color", "#424242");
            $("body").css("color", "white");
            $("#game_grid").css("background-color", "#424242");
        }
    });
};

$(document).ready(setup);

function reset() {
    $("#start").toggleClass("hidden");
    $(".flip").each(function (i, obj) {
        $(this).toggleClass("flip");
    });
    $(".gameCard").each(function (i, obj) {
        $(this).off("click");
    });
    $("#game_grid").css("display", "none");
    $("#game_grid").empty();
    clearInterval(incrementTimer);
    $("#reset").off("click");
    $("#header").empty();
    numClicks = 0;
    numPairs = totalPairs;
    numPairsMatched = 0;
    timer = 0;
    firstCard = undefined;
    secondCard = undefined;
};

async function start() {
    modeSelect();
    await createGrid();
    const power = totalPairs * 2;
    $("#start").toggleClass("hidden");
    $("#game_grid").css("display", "flex");
    headerUpdate();
    incrementTimer = setInterval(function () {
        timer++;
        headerUpdate();
        if (timer === totalTime) {
            $(".gameCard").each(function (i, obj) {
                $(this).off("click");
            });
            clearInterval(incrementTimer);
            setTimeout(() => {
                window.alert("Time out. Try again!");
            }, 500);
        }
    }, 1000);
    $("#reset").on(("click"), function () {
        reset();
    });
    $(".gameCard").on(("click"), function () {
        if ($(this).find(".front_face")[0] != firstCard && secondCard == undefined) {
            numClicks++;
            flipACard($(this));
            headerUpdate();
            if (numClicks === power) {
                setTimeout(() => {
                    powerUp();
                }, 1000);
            }
        }
    });
};

function headerUpdate() {
    $("#header").empty();
    $("#header").append(`<h2>Total numer of pairs: ${totalPairs}</h2>
    <h2>Number of matches: ${numPairsMatched}</h2>
    <h2>Pairs left: ${numPairs}</h2>
    <h2>Number of clicks: ${numClicks}</h2>
    <h2>You have ${totalTime} seconds. Time passed: ${timer}</h2>`);
};

function modeSelect() {
    if (mode === "easy") {
        totalPairs = 3;
        totalTime = 100;
        powerTime = 600;
        $("#game_grid").css("width", "600px");
        $("#game_grid").css("height", "400px");
        width = "33.3%";
    } else if (mode === "medium") {
        totalPairs = 6;
        totalTime = 200;
        powerTime = 1100;
        $("#game_grid").css("width", "800px");
        $("#game_grid").css("height", "600px");
        width = "25%";
    } else if (mode === "hard") {
        totalPairs = 12;
        totalTime = 300;
        powerTime = 2200;
        $("#game_grid").css("width", "1200px");
        $("#game_grid").css("height", "800px");
        width = "16.6%";
    }
    numPairs = totalPairs;
};

function flipACard(card) {
    card.toggleClass("flip");
    if (!firstCard) {
        firstCard = card.find(".front_face")[0];
    } else {
        secondCard = card.find(".front_face")[0];
        if (firstCard.src === secondCard.src ) {
            $(`#${firstCard.id}`).parent().off("click");
            $(`#${secondCard.id}`).parent().off("click");
            firstCard = undefined;
            secondCard = undefined;
            numPairs--;
            numPairsMatched++;
            if (numPairs === 0) {
                clearInterval(incrementTimer);
                setTimeout(() => {
                    window.alert("You win!");
                }, 500);
            }
        } else {
            setTimeout(() => {
                $(`#${firstCard.id}`).parent().toggleClass("flip");
                $(`#${secondCard.id}`).parent().toggleClass("flip");
                firstCard = undefined;
                secondCard = undefined;
            }, 1000);
        }
    }
};

async function createGrid() {
    var imageUrls = [];
    var pokeNums = [undefined];
    var temp;
    for (let i = 0; i < totalPairs; i++) {
        while (pokeNums.includes(temp)) {
            temp = Math.floor(Math.random() * 810);
        }
        pokeNums.push(temp);
        let res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${temp}`);
        let src = res.data.sprites.other['official-artwork'].front_default;
        imageUrls.push(src);
    }
    imageUrls = shuffleArray(imageUrls.concat(imageUrls));
    for (let i = 0; i < imageUrls.length; i++) {
        $("#game_grid").append(`<div class="gameCard" style="width: ${width};">
            <img id="img${i}" class="front_face" src="${imageUrls[i]}" alt="">
            <img class="back_face" src="back.webp" alt="">
        </div>`);
    }
};

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

function powerUp() {
    window.alert("Power Up!");
    $(".gameCard").each(function (i, obj) {
        if (!$(this).hasClass("flip")) {
            $(this).toggleClass("flip");   
            setTimeout(() => {
                $(this).toggleClass("flip");
            }, powerTime);
        }
    });
};
