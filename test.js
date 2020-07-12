$(document).ready(() => {
    let x = 7;
    let y = 6;
    let player1Color = "#ff7329";
    let player2Color = "#47c908";
    let difficulty = "none";
    let difficulty1 = "normal";
    $("#board").puissance_4(x, y, player1Color, player2Color, difficulty, difficulty1);
});