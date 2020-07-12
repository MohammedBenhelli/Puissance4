$.fn.puissance_4 = function (x, y, player1Color, player2Color, difficulty = "none", difficulty1 = "none") {
    let turn = 0;
    let tab;
    let tmpHtml;
    let td = "";
    let play = true;

    if (player1Color === player2Color) $(this).append("<h2 style='color: red'>The players haves the same colors!</h2>");
    else {
        $(this).parent().parent().append("<button id='back' class='btn'>Back</button>");
        $(this).parent().parent().parent().append("    <div>\n" +
            "        <h3>\n" +
            "            Player 1: <a style='color: lightgreen' id='player1win'>0</a> wins\n" +
            "        </h3>\n" +
            "    </div>\n" +
            "    <div>\n" +
            "        <h3>\n" +
            "            Player 2: <a style='color: lightgreen' id='player2win'>0</a> wins\n" +
            "        </h3>\n" +
            "    </div>\n" +
            "    <div style='color: indianred' id='error'></div>\n" +
            "    <div id='playerTurn'>player 1 turn</div>");
        for (i = 0; i < x; i++)
            td += "<td><button class='button' dataX='" + i + "'></button></td>";
        for (i = 0; i < y; i++)
            $(this).append("<tr dataY='" + i + "'>" + td + "</tr>");

        tab = getValues(x, y);
        const reset = $("#board").html();
        $(document).on("click", ".button", async function () {
                console.log(difficulty1);
                if (play) {
                    play = false;
                    $("#error").text("");
                    let color = "";
                    let cord;
                    turn % 2 === 0 ? color = player1Color : color = player2Color;
                    let mouvX = $(this).attr("dataX");
                    let marque = 0;
                    if (tab[0][mouvX] === "rgb(250, 250, 210)") {
                        localStorage.setItem("computer", JSON.stringify(tab));
                        localStorage.setItem("back", JSON.stringify(tab));
                        tmpHtml = $("#board").html();
                        if (difficulty === "none") {
                            for (let i = 0; i < tab.length; i++) {
                                if (tab[i][mouvX] === "rgb(250, 250, 210)" && i === tab.length - 1 && marque === 0) {
                                    marque++;
                                    tab[i][mouvX] = color;
                                    cord = {i, j: parseInt(mouvX)};
                                }
                                if (tab[i][mouvX] !== "rgb(250, 250, 210)" && marque === 0) {
                                    marque++;
                                    tab[i - 1][mouvX] = color;
                                    cord = {i: i - 1, j: parseInt(mouvX)};
                                }
                            }
                            let animation = $("[dataX='" + cord.j + "']").get();
                            for (let count = 0; count < cord.i + 1; count++) {
                                $(animation[count]).css("background-color", color);
                                await sleep(250);
                                $(animation[count]).css("background-color", "rgb(250, 250, 210)");

                            }
                            toValues(tab, x, y);
                        }
                        if (difficulty === "hard") {
                            let tmp = monteCarlo(tab, player2Color, player1Color, 2500);
                            tab = tmp.tab;
                            cord = tmp.choice;
                            let animation = $("[dataX='" + cord.j + "']").get();
                            for (let count = 0; count < cord.i + 1; count++) {
                                $(animation[count]).css("background-color", player2Color);
                                await sleep(250);
                                $(animation[count]).css("background-color", "rgb(250, 250, 210)");
                            }
                            toValues(tab, x, y);
                        }
                        if (difficulty === "normal") {

                            let tmp = getMove(tab, player2Color, player1Color);
                            tab = tmp.tab;
                            cord = tmp.move;
                            let animation = $("[dataX='" + cord.j + "']").get();
                            for (let count = 0; count < cord.i + 1; count++) {
                                $(animation[count]).css("background-color", player2Color);
                                await sleep(250);
                                $(animation[count]).css("background-color", "rgb(250, 250, 210)");
                            }
                            toValues(tab, x, y);
                        }

                        if (difficulty === "easy") {
                            let mouvX = computer(player2Color, player1Color);
                            let marque = 0;
                            if (tab[0][mouvX] === "rgb(250, 250, 210)") {
                                localStorage.setItem("back", JSON.stringify(tab));
                                tmpHtml = $("#board").html();
                                for (let i = 0; i < tab.length; i++) {
                                    if (tab[i][mouvX] === "rgb(250, 250, 210)" && i === tab.length - 1 && marque === 0) {
                                        marque++;
                                        tab[i][mouvX] = color;
                                        cord = { i, j:mouvX};
                                    }
                                    if (tab[i][mouvX] !== "rgb(250, 250, 210)" && marque === 0) {
                                        marque++;
                                        tab[i - 1][mouvX] = color;
                                        cord = { i: i-1, j:mouvX};

                                    }
                                }
                                let animation = $("[dataX='" + mouvX + "']").get();
                                for (let count = 0; count < cord.i + 1; count++) {
                                    $(animation[count]).css("background-color", player2Color);
                                    await sleep(250);
                                    $(animation[count]).css("background-color", "rgb(250, 250, 210)");

                                }
                                toValues(tab, x, y);
                            }
                        }
                        if (horizontalCheck(tab, cord.i, cord.j) || verticalCheck(tab, cord.i, cord.j) || diagonalCheck(tab, cord.i, cord.j)) {
                            localStorage.setItem("back", "");
                            turn % 2 === 0 ? alert("Player 1 win!") : alert("Player 2 win!");
                            turn % 2 === 0 ? $("#player1win").text(parseInt($("#player1win").text()) + 1) : $("#player2win").text(parseInt($("#player2win").text()) + 1);
                            tab = getValues(x, y);
                            turn = 0;
                            $("#board").html(reset);
                        } else if (checkNull(tab)) {
                            localStorage.setItem("back", "");
                            alert("Null win!");
                            tab = getValues(x, y);
                            turn = 0;
                            $("#board").html(reset);
                        } else {
                            localStorage.setItem("computer", JSON.stringify(tab));
                            turn++;
                            turn % 2 === 0 ? color = player1Color : color = player2Color;

                            if (difficulty1 === "hard") {
                                let tmp = monteCarlo(tab, player1Color, player2Color, 2500);
                                tab = tmp.tab;
                                cord = tmp.choice;
                                let animation = $("[dataX='" + cord.j + "']").get();
                                for (let count = 0; count < cord.i + 1; count++) {
                                    $(animation[count]).css("background-color", player2Color);
                                    await sleep(250);
                                    $(animation[count]).css("background-color", "rgb(250, 250, 210)");
                                }
                                toValues(tab, x, y);
                            }
                            if (difficulty1 === "normal") {
                                let tmp = getMove(tab, player1Color, player2Color);
                                tab = tmp.tab;
                                cord = tmp.move;
                                let animation = $("[dataX='" + cord.j + "']").get();
                                for (let count = 0; count < cord.i + 1; count++) {
                                    $(animation[count]).css("background-color", player2Color);
                                    await sleep(250);
                                    $(animation[count]).css("background-color", "rgb(250, 250, 210)");
                                }
                                toValues(tab, x, y);
                            }

                            if (difficulty1 === "easy") {
                                let mouvX = computer(player1Color, player2Color);
                                let marque = 0;
                                if (tab[0][mouvX] === "rgb(250, 250, 210)") {
                                    localStorage.setItem("back", JSON.stringify(tab));
                                    tmpHtml = $("#board").html();
                                    for (let i = 0; i < tab.length; i++) {
                                        if (tab[i][mouvX] === "rgb(250, 250, 210)" && i === tab.length - 1 && marque === 0) {
                                            marque++;
                                            tab[i][mouvX] = color;
                                        }
                                        if (tab[i][mouvX] !== "rgb(250, 250, 210)" && marque === 0) {
                                            marque++;
                                            tab[i - 1][mouvX] = color;
                                        }
                                    }
                                    let animation = $("[dataX='" + mouvX + "']").get();
                                    for (let count = 0; count < cord.i + 1; count++) {
                                        $(animation[count]).css("background-color", player2Color);
                                        await sleep(250);
                                        $(animation[count]).css("background-color", "rgb(250, 250, 210)");
                                    }
                                    toValues(tab, x, y);
                                }
                            }
                            if (horizontalCheck(tab, cord.i, cord.j) || verticalCheck(tab, cord.i, cord.j) || diagonalCheck(tab, cord.i, cord.j)) {
                                console.table(tab);
                                localStorage.setItem("back", "");
                                turn % 2 === 0 ? alert("Player 1 win!") : alert("Player 2 win!");
                                turn % 2 === 0 ? $("#player1win").text(parseInt($("#player1win").text()) + 1) : $("#player2win").text(parseInt($("#player2win").text()) + 1);
                                tab = getValues(x, y);
                                turn = 0;
                                $("#board").html(reset);
                            } else if (checkNull(tab)) {
                                localStorage.setItem("back", "");
                                alert("Null win!");
                                tab = getValues(x, y);
                                turn = 0;
                                $("#board").html(reset);
                            } else if (difficulty1 !== "none") {
                                turn++;
                                turn % 2 === 0 ? $("#playerTurn").text("player 1 turn") : $("#playerTurn").text("player 2 turn");
                            }
                            if (difficulty1 === "none") turn % 2 === 0 ? $("#playerTurn").text("player 1 turn") : $("#playerTurn").text("player 2 turn");

                        }
                    } else $("#error").html("<h5>Placement Impossible!</h5>");
                    play = true;
                }
            }
        );
        $(document).on("click", "#back", function () {
            $("#error").text("");
            if (JSON.parse(localStorage.getItem("back")) !== tab && localStorage.getItem("back") !== "") {
                tab = JSON.parse(localStorage.getItem("back"));
                console.table(tab);
                $("#board").html(tmpHtml);
                if (turn > 0) {
                    if (difficulty !== "none") turn -= 2;
                    else turn--;
                }
            }
        });
    }
};

function getValues(x, y) {
    let tab = $(".button").get().map(x => (x = $(x).css("background-color")));
    let count = 0;
    let traitement = [];
    for (i = 0; i < y; i++) {
        traitement[i] = [];
        for (j = 0; j < x; j++)
            traitement[i][j] = tab[count];
    }
    return traitement;
}

function toValues(tab, x, y) {
    let count = 0;
    for (i = 0; i < y; i++) {
        for (j = 0; j < x; j++)
            $($(".button")[count++]).css("background-color", tab[i][j]);
    }
}

function horizontalCheck(tab, y, x) {
    let previous = 0;
    let count = 0;
    if (tab[y] !== undefined) {
        for (j = 0; j < tab[y].length; j++) {
            if (tab[y][j] === previous && tab[y][j] !== "rgb(250, 250, 210)")
                count++;
            else count = 0;
            previous = tab[y][j];
            if (count === 3) return previous;
        }
    }
    return false;
}

function verticalCheck(tab, y, x) {
    let previous = 0;
    let count = 0;
    for (j = 0; j < tab.length; j++) {
        if (tab[j][x] === previous && tab[j][x] !== "rgb(250, 250, 210)")
            count++;
        else count = 0;
        previous = tab[j][x];
        if (count === 3)
            return previous;
    }
    return false;
}

function diagonalCheck(tab, y, x) {
    let xTmp = null;
    let yTmp = null;
    let previous = 0;
    let count = 0;
    for (i = 0; i < tab[0].length; i++) {
        xTmp = i;
        yTmp = 0;
        while (xTmp < tab[0].length && yTmp < tab.length) {
            if (tab[yTmp][xTmp] === previous && tab[yTmp][xTmp] !== "rgb(250, 250, 210)")
                count++;
            else count = 0;
            previous = tab[yTmp++][xTmp++];
            if (count === 3) {
                return previous;
            }
        }
        count = 0;
        previous = 0;
    }
    for (i = 0; i < tab[0].length; i++) {
        xTmp = i;
        yTmp = 0;
        while (xTmp > -1 && yTmp < tab.length) {
            if (tab[yTmp][xTmp] === previous && tab[yTmp][xTmp] !== "rgb(250, 250, 210)")
                count++;
            else count = 0;
            previous = tab[yTmp++][xTmp--];
            if (count === 3) {
                return previous;
            }
        }
        count = 0;
        previous = 0;
    }
    for (i = 0; i < tab.length; i++) {
        xTmp = 0;
        yTmp = i;
        while (xTmp < tab[0].length && yTmp < tab.length) {
            if (tab[yTmp][xTmp] === previous && tab[yTmp][xTmp] !== "rgb(250, 250, 210)")
                count++;
            else count = 0;
            previous = tab[yTmp++][xTmp++];
            if (count === 3) {
                return previous;
            }
        }
        count = 0;
        previous = 0;
    }
    for (i = 0; i < tab.length; i++) {
        xTmp = tab[0].length;
        yTmp = i;
        while (xTmp > -1 && yTmp < tab.length) {
            if (tab[yTmp][xTmp] === previous && tab[yTmp][xTmp] !== "rgb(250, 250, 210)")
                count++;
            else count = 0;
            previous = tab[yTmp++][xTmp--];
            if (count === 3) {
                return previous;
            }
        }
        count = 0;
        previous = 0;
    }
}

function checkNull(tab) {
    let count = 0;
    for (let i = 0; i < tab[0].length; i++) {
        if (tab[0][i] !== "rgb(250, 250, 210)")
            count++;
    }
    if (count === tab[0].length) return true;
    else return false;
}

function computer(player1Color, player2Color) {
    let test = JSON.parse(localStorage.getItem("computer"));
    let options = [];
    options[0] = []; //cpu win
    options[1] = []; //block player win
    options[2] = []; //neutral move
    options[3] = []; //lose

    for (let i = 0; i < test.length; i++) {
        for (let j = 0; j < test[0].length; j++) {
            test = JSON.parse(localStorage.getItem("computer"));
            test[i][j] = player2Color;
            if ((horizontalCheck(test, i, j) || verticalCheck(test, i, j) || diagonalCheck(test, i, j)) && isPlayable(i, j))
                options[0].push([i, j, 1000]);
            else {
                test[i][j] = player1Color;
                if ((horizontalCheck(test, i, j) || verticalCheck(test, i, j) || diagonalCheck(test, i, j)) && isPlayable(i, j))
                    options[1].push([i, j, 50]);
                else {
                    test[i][j] = player2Color;
                    if (i > 0) {
                        test[i - 1][j] = player1Color;
                        if ((horizontalCheck(test, i, j) || verticalCheck(test, i, j) || diagonalCheck(test, i, j)) && isPlayable(i, j))
                            options[3].push([i, j, -1000]);
                        else if (isPlayable(i, j)) options[2].push([i, j, 0]);
                    } else if (isPlayable(i, j)) options[2].push([i, j, 0]);
                }
            }
        }
    }

    let choice;
    if (options[0].length > 0) choice = options[0][Math.floor(Math.random() * options[0].length)];
    else if (options[1].length > 0) choice = options[1][Math.floor(Math.random() * options[1].length)];
    else if (options[2].length > 0) choice = options[2][Math.floor(Math.random() * options[2].length)];
    else if (options[3].length > 0) choice = options[3][Math.floor(Math.random() * options[3].length)];
    console.log(choice);
    return choice[1];
}

function isPlayable(i, j, test = JSON.parse(localStorage.getItem("computer"))) {
    if (test[i][j] === "rgb(250, 250, 210)" && i === test.length - 1) return true;
    else if (test[i][j] === "rgb(250, 250, 210)" && test[i + 1][j] !== "rgb(250, 250, 210)") return true;
    else return false;
}

function getMove(tab, player1Color, player2Color) {
    let test = JSON.parse(localStorage.getItem("computer"));
    let best = -Infinity;
    let move;
    for (let i = 0; i < test.length; i++) {
        for (let j = 0; j < test[0].length; j++) {
            if (isPlayable(i, j, test)) {
                test[i][j] = player2Color;
                let score = minimax(test, player1Color, player2Color, 0, false, i, j);
                console.log(score)
                test[i][j] = "rgb(250, 250, 210)";
                if (score > best) {
                    best = score;
                    move = {i, j};
                }
            }
        }
    }
    console.log(best);
    tab[move.i][move.j] = player2Color;
    return {tab, move};
}

function minimax(test, player1Color, player2Color, depth, isMaximizing, i, j) {
    if (diagonalCheck(test)) return diagonalCheck(test, i, j) === player2Color ? 100 : -100;
    else if (verticalCheck(test, i, j)) return verticalCheck(test, i, j) === player2Color ? 100 : -100;
    else if (horizontalCheck(test, i, j)) return horizontalCheck(test, i, j) === player2Color ? 100 : -100;
    else if (depth === -3) return 10;
    else if (isMaximizing) {
        let best = -Infinity;
        for (let i = 0; i < test.length; i++) {
            for (let j = 0; j < test[0].length; j++) {
                if (isPlayable(i, j, test)) {
                    test[i][j] = player2Color;
                    let score = minimax(test, player1Color, player2Color, depth - 1, false, i, j);
                    test[i][j] = "rgb(250, 250, 210)";
                    best = Math.max(score, best);
                }
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < test.length; i++) {
            for (let j = 0; j < test[0].length; j++) {
                if (isPlayable(i, j, test)) {
                    test[i][j] = player1Color;
                    let score = minimax(test, player1Color, player2Color, depth - 1, true, i, j);
                    test[i][j] = "rgb(250, 250, 210)";
                    best = Math.min(score, best);
                }
            }
        }
        return best;
    }
}

function monteCarlo(tab, player1Color, player2Color, times) {
    let test = JSON.parse(localStorage.getItem("computer"));
    let max = 0;
    let gain = 0;
    let choice;
    for (let i = 0; i < test.length; i++) {
        for (let j = 0; j < test[0].length; j++) {
            if (isPlayable(i, j, test)) {
                test = JSON.parse(localStorage.getItem("computer"));
                gain = 0;
                test[i][j] = player2Color;
                localStorage.setItem("carlos", JSON.stringify(test));
                for (let k = 0; k < times; k++) {
                    let winner = randomFinish(test, player1Color, player2Color);
                    if (winner === player2Color)
                        gain++;
                }
                console.log("Nombre de victoires cas numero " + j + ": " + gain + "/" + times);
                test[i][j] = "rgb(250, 250, 210)";
                if (gain > max) {
                    max = gain;
                    choice = {i, j};
                }
            }
        }
    }
    console.log("%cCas choisi: " + choice.j, "color: green");
    let ret = JSON.parse(localStorage.getItem("computer"));
    ret[choice.i][choice.j] = player2Color;
    return {tab: ret, choice};
}

function randomFinish(tab, player1Color, player2Color) {
    let test = JSON.parse(localStorage.getItem("carlos"));
    let count = 0;
    let color;
    while (1 === 1) {
        let i = Math.floor(Math.random() * 6);
        let j = Math.floor(Math.random() * 7);
        if (isPlayable(i, j, test)) {
            count++ % 2 === 0 ? color = player1Color : color = player2Color;
            test[i][j] = color;
            if (diagonalCheck(test)) return diagonalCheck(test, i, j);
            else if (verticalCheck(test, i, j)) return verticalCheck(test, i, j);
            else if (horizontalCheck(test, i, j)) return horizontalCheck(test, i, j);
            else if (checkNull(test)) return false;
        }
    }
}

async function sleep(ms) {
    await new Promise(resolve => setTimeout(resolve, ms));
    return true;
}