console.log("JavaScript has loaded");
var easterEggs = ["otter-heart-ascii", "konami-code", "bird-egg", "404-found", "mascot-images", "lutri-the-spellchaser", "read-and-find-out", "shaking-rock"];
var foundEasterEggs = [];
//give rocks functions
function giveRocks(easterEggNum) {
    var egg = easterEggs[easterEggNum];
    foundEasterEggs = JSON.parse(sessionStorage.getItem("easter-eggs")) || [];
    if (egg === undefined) {
        return;
    }
    var alreadyHas = foundEasterEggs.indexOf(egg) !== -1;
    if (alreadyHas) {
        return;
    }
    foundEasterEggs.push(egg);
    sessionStorage.setItem("easter-eggs", JSON.stringify(foundEasterEggs));
}
var lutriText = "Companion — Each nonland card in your starting deck has a different name. (If this card is your chosen companion, you may put it into your hand from outside the game for {3} as a sorcery.)\nFlash\nWhen Lutri enters, if you cast it, copy target instant or sorcery spell you control. You may choose new targets for the copy.";
//easter egg 1, otter heart ascii
var otterHeartAscii = "-------------------------------=%@@*=---------------------------------------------------------------\n" +
    "----##%%%###+=----------------+%:+##@%@@@%%%%@@@%*=-------------------------------------------------\n" +
    "-------------=+#@@%#=:--------%*..#%*#************#@@%=---------------------------------------------\n" +
    "---------------------+@@%=--+%@*%%#***+*************+*#@@+------------------------------------------\n" +
    "-------------------------+@@@#*****+*+++**+**************%@#----------------------------------------\n" +
    "-------------===------=%@%*+++#@@#**+*@##*+***************+%@*--------------------------------------\n" +
    "--------=%##*++=++**%@@@@@%#****=-#%-.-=#@@#*****************%@=------------------------------------\n" +
    "------------------*@%*+*****##%@#=..-@*...#@#*****************#@*-----------------------------------\n" +
    "--------=#%%@@@%@@@%%%@@@@@@%*:..:#@#:=@-.=@#*******************@*----------------------------------\n" +
    "----+@@*=------@%#+********:.::+@@%@#%+:@--@%%*******************@=---------------------------------\n" +
    "--+@=--------#@#**********:......=@%@-:......:+**##**************@%+--------------------------------\n" +
    "-----------=@%*********+*:......::@+-%:........#@@@@@@%**********@#*@=------------------------------\n" +
    "----------#@#***********=....:::+@@@*:::.......+@@@@@@@@%*@%@@@%*@#*@+------------------------------\n" +
    "---------%@**+*******+*+..:::*@@@#**@%-:::......:%@@@@@@@-%+-::#@@#+====----------------------------\n" +
    "--------@%*+*********+#@=::*@@*++++++*%@+:::::.....-#%%*:......*@@*++===++*#@@%##%#+=---------------\n" +
    "-------%%************+%@=-@@#+++++++++++#@@%=::::::.............:@**#%%%%@@@@@@%%%@@@@@%+-----------\n" +
    "------%%**+***********%@*@@*+++++++++++++++#@@@@@@@+::.........:#@=--*@@%*++==++++==+++%@@#---------\n" +
    "-----#@***************#@@@+++++++++===+++++++++++*@@@=::::.:.:*%@%@@@%+=+=+++==-----=====*@@*-------\n" +
    "----*@#****************@@#++++++++===========+++++++%@@%*++==*@%*@@#=+=+=+=+=-----------==+%@%------\n" +
    "---=@#******************%@@@@@@@@@%##@*==+======+++++++*####**@@@*=+====+=++-------------=++#@#-----\n" +
    "---%@********************************%%++==========+++++++=+===+++=+=====++==-------------=+=#@+----\n" +
    "--+@#******************+****************#@#=========+===++++=+====+======+=+=--------------=+=%%----\n" +
    "--%%******#%*****************************@#===================================--------------+++@+---\n" +
    "-+@#******#@#***************************%%+===================================--------------===%%---\n" +
    "-%@********%@*****************************@+=================================+---------------=+#@---\n" +
    "-@%*********@@**************************@#*=+================================+=--------------==#@=--\n" +
    "=@#**********%@%**************#%%#***#%@%=+====================================--------------==#@---\n" +
    "+@#************%@@*********#@@#*+#@@@@#==+===================================+=--------------==#@---\n" +
    "*@*************-:=%@@@@@@@@*+++=====+=+======================================+=-------------==+%@---\n" +
    "*@*************::::::::-@@+++++**+=+===+=====================================+=------------==++@%---\n" +
    "*@*************:::::::::%@#***@%#@+++=+======================================+++=----------===#@*---\n" +
    "+@#************:..::::::+@@#%@#**%%##@+=======================================+=+=-------===++@@=---\n" +
    "=@#************=...:::::-@%**********@+====+=====================================+===---=+=+++@#----\n" +
    "-@%*************:...::::+@************#@+=+======================================++===++=+==+@@=----\n" +
    "-%@*************+....:::+@************%@++++================================================#@*-----\n" +
    "-+@#*************+=%@@@@%@***********#@*=+=+===========================================+=+=#@@------\n" +
    "--%@***********%@@#*****************#@+++=============================================+++=*@@=------\n" +
    "--=@%*********@@#******************%@+================================================+++*@@+-------\n" +
    "---*@#*******%@#******************%%+++===============================================+=*@@+--------\n" +
    "----%@#****#*%@******************@%+*++==+========================================+++++#@@=---------\n" +
    "-----%@#*****%@*****************%@#++++++==+=====================================+==+=%@@=----------\n" +
    "------#@#****#@#****************#@@@*++++++======================================+==+@@%------------\n" +
    "-------*@%*#**#@*****************@@@@%*++++++==================================+===#@@*-------------\n" +
    "--------=@@#***#@#***************%@*#@@#++++++==+============================++==+@@@=--------------\n" +
    "----------#@@********************%@***%@@#++++++===========================++=++#@@*----------------\n" +
    "-----------=%@@#****************#@#***#*%@@%+++**+++====================+=++=+*@@#------------------\n" +
    "--------------%@@#*************#@#******#*%@@%*+++++++==================+=+=+@@%--------------------\n" +
    "----------------*@@@##*#******##*#*********##@@@*++++++++=+++======++=+==+*@@#----------------------\n" +
    "------------------=#@@@#**********************#%@@%+++++++++++=====++==+#@@*------------------------\n" +
    "----------------------*%@@@%#********************%@@@#*+++++++++++==++%@%=--------------------------\n" +
    "--------------------------=*@@@@@%%##*************##@@@@#+++++++++*%@@*-----------------------------\n" +
    "--------------------------------=++#%@@@@@@@@@@@%#*+==+%@@@%***#@@@*--------------------------------\n" +
    " __          __    _   _     _       _                        _                               \n" +
    " \\ \\        / /   | | | |   (_)     | |                      ( )                              \n" +
    "  \\ \\  /\\  / /__  | |_| |__  _ _ __ | | __  _   _  ___  _   _|/ _ __ ___                      \n" +
    "   \\ \\/  \\/ / _ \\ | __| '_ \\| | '_ \\| |/ / | | | |/ _ \\| | | | | '__/ _ \\                     \n" +
    "    \\  /\\  /  __/ | |_| | | | | | | |   <  | |_| | (_) | |_| | | | |  __/                     \n" +
    "     \\/  \\/ \\___|  \\__|_| |_|_|_| |_|_|\\_\\  \\__, |\\___/ \\__,_| |_|  \\___|                     \n" +
    "                                             __/ |                                            \n" +
    "   ____ _______ _______ ______ _____  _  __ |___/_                            _             _ \n" +
    "  / __ \\__   __|__   __|  ____|  __ \\| | \\ \\   / /                           (_)           | |\n" +
    " | |  | | | |     | |  | |__  | |__) | |  \\ \\_/ /    __ _ _ __ ___   __ _ _____ _ __   __ _| |\n" +
    " | |  | | | |     | |  |  __| |  _  /| |   \\   /    / _` | '_ ` _ \\ / _` |_  / | '_ \\ / _` | |\n" +
    " | |__| | | |     | |  | |____| | \\ \\| |____| |    | (_| | | | | | | (_| |/ /| | | | | (_| |_|\n" +
    "  \\____/  |_|     |_|  |______|_|  \\_\\______|_|     \\__,_|_| |_| |_|\\__,_/___|_|_| |_|\\__, (_)\n" +
    "                                                                                       __/ |  \n" +
    "                                                                                      |___/   \n";
//console.log(otterHeartAscii);
// const site_heading: HTMLElement = document.getElementById("site-heading");
//
// site_heading.addEventListener("click", function () {
//     console.log(otterHeartAscii);
//
//     //give player rocks!
//     giveRocks(0);
// });
document.addEventListener("keyup", function (event) {
    //console.log("stuff and things, key up, etc.");
    if (event.defaultPrevented) {
        return;
    }
    konamiCode(event);
    switch (event.key) {
    }
});
//konami code stuff
var konamiCodeKeys = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
var konamiCodeNum = 0;
function konamiCode(event) {
    if (event.key === konamiCodeKeys[konamiCodeNum]) {
        if (event.key === konamiCodeKeys[konamiCodeKeys.length - 1]) {
            //console.log("Konami Code test complete");
            konamiCodeNum = 0;
            giveRocks(1);
        }
        else {
            //console.log("Konami Code test" + konamiCodeNum);
            konamiCodeNum++;
        }
    }
    else {
        konamiCodeNum = 0;
    }
}
//easter egg 2
//triple-click on the bird
// const bird: HTMLElement = document.getElementById("bird");
// bird.addEventListener("click", function (event: MouseEvent) {
//     if (event.detail === 3) {
//         giveRocks(2);
//     }
// });
//easter egg 3 is 404 not found
//easter eggs 4 and 5
//select text for a photo to pop up
document.addEventListener('mouseup', function () {
    //console.log("fired");
    var selection = document.getSelection();
    var selectedText = selection ? selection.toString() : null;
    //console.log(selectedText);
    if ((selectedText) === "Lulu" || selectedText === "Lutri Lutri") {
        // Add if you selected my name
        //mainIntro.appendChild(profileImage);
        var luluArray = ["Lulu-Bria-hug.jpg", "Lulu-Bria-table.jpg", "Lulu-sit.jpg"];
        displayMascotImg(luluArray);
        giveRocks(4);
    }
    else if (selectedText === "Bria") {
        var briaArray = ["Lulu-Bria-hug.jpg", "Lulu-Bria-table.jpg"];
        displayMascotImg(briaArray);
        giveRocks(4);
    }
    else if (selectedText === "Lutri" || selectedText === "Lutri ") {
        //console.log("Lutri the spellchaser?");
        var lutriArray = ["lutri-the-spellchaser.webp", "lutri-the-spellchaser-alt.jpg"];
        displayMascotImg(lutriArray);
        giveRocks(5);
    }
});
var isMascotImg = false;
function displayMascotImg(imgSourceArray) {
    isMascotImg = true;
    var imgSource = "/otters/" + imgSourceArray[Math.floor(Math.random() * imgSourceArray.length)];
    var img = document.createElement("img");
    img.src = imgSource;
    img.classList.add("mascot-img");
    //scale, random rotation, and random offset
    var rotation = Math.random() * 360;
    img.style.width = "60%";
    img.style.transform = "translate(-50%, -50%) rotate(".concat(rotation, "deg)");
    document.body.appendChild(img);
}
window.addEventListener("scroll", function () {
    if (isMascotImg) {
        isMascotImg = false;
        var mascots = document.querySelectorAll(".mascot-img");
        mascots.forEach(function (img) {
            img.remove();
        });
    }
});
//easter egg 7, triple click a shaking rock
var shakingRock = document.getElementById("shaking-rock");
shakingRock.addEventListener("click", function (event) {
    //console.log("clicked");
    if (event.detail === 3) {
        //console.log("shakingRock");
        shakingRock.classList.toggle('paused');
        giveRocks(7);
        var container = document.body;
        container.classList.remove('apply-shake');
        void container.offsetWidth; // force reflow to restart animation
        container.classList.add('apply-shake');
    }
});
//easter egg 8 move something for dark mode
// tsc src/scripts/easter-eggs.ts
