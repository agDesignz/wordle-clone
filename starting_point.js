const wordle = "MARIO";

  const mainSection = document.querySelector("#main-section");
for (let rc = 0; rc <= 5; rc++) {
  const newRow = document.createElement("div");
  newRow.className = "wordle-row";
  newRow.id = "row-" + rc;
  for (let cc = 0; cc <= 4; cc++) {
    const newBox = document.createElement("div");
    newBox.className = "wordle-box";
    newRow.appendChild(newBox);
  }
  mainSection.appendChild(newRow);
}

const rows = document.querySelectorAll(".wordle-row");
let rowCount = 0;

function guess() {
  const thisGuess = [];
  const boxes = document.querySelectorAll(`#row-${rowCount} > .wordle-box`);
  const buttons = document.querySelectorAll(".keyboard-button");
  buttons.forEach( button => {
    button.addEventListener("click", (e) => {
      const letter = e.target.innerHTML.toUpperCase();
      if(letter == "DEL") {
        // DEAL WITH THE DELETE AND ENTER BUTTONS
        thisGuess.pop();
      } else if (letter == "ENTER"){
        // THE BIG REVEAL!!!
        const myWord = thisGuess.join("");
        finalGuess(myWord);
      } else {
        if (thisGuess.length < wordle.length) {
          thisGuess.push(letter);
        }
      }
      for(let i = 0; i < boxes.length; i++){
        if (thisGuess[i]) {
          boxes[i].innerHTML = `<h3>${thisGuess[i]}`;
        } else {
          boxes[i].innerHTML = "";
        }
      }

    });
  });

  /////////////////  finalGuess funtion
  function finalGuess(myGuess){
    for (let i = 0; i < myGuess.length; i++) {
      if (myGuess[i] === wordle[i]) {
        boxes[i].classList.add("spot-on");
      } else if (wordle.includes(myGuess[i])) {
        boxes[i].classList.add("almost");
      } else {
        boxes[i].classList.add("wrong");
      }
    }
  }


///////////////////   END OF finalGuess function

}

guess();
