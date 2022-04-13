(() => {

  "use strict";

  const mainSection = document.querySelector("#main-section");
  for (let rc = 0; rc <= 5; rc++) {
    const newRow = document.createElement("div");
    newRow.className = "wordle-row";
    newRow.id = "row-" + rc;
    for (let cc = 0; cc <= 4; cc++) {
      const newBox = document.createElement("div");
      newBox.className = "wordle-box";
      newBox.id = `row${rc}box${cc}`;
      newRow.appendChild(newBox);
    }
    mainSection.appendChild(newRow);
  }

  const rows = document.querySelectorAll("wordle-row");
  const buttons = document.querySelectorAll(".keyboard-button");

  const wordleWord = "MARIO";
  const totalTries = 6;
  let remainingTries = totalTries;
  let thisTry = [];
  let nextLetter = 0;

  buttons.forEach(button => {
    button.addEventListener("click", (e) => {
      if (remainingTries === 0) {
        return;
      }
      let keyTap = e.target.innerText;
      if (keyTap === "DEL") {
        deleteOne();
        return;
      } else if (keyTap === "ENTER") {
        verify();
        return;
      } else {
        if (thisTry.length >= 5) {
          return;
        }
        placeLetter(keyTap);
      }
    });
  });

  function placeLetter(entry) {
    if (nextLetter > 4) {
      return;
    }
    let row = totalTries - remainingTries;
    let box = nextLetter;
    document.querySelector(`#row${row}box${box}`).innerText = entry;
    thisTry.push(entry);
    nextLetter++;
  }

  function deleteOne() {
    if (nextLetter <= 0) {
      return;
    }
    let row = totalTries - remainingTries;
    let box = nextLetter - 1;
    document.querySelector(`#row${row}box${box}`).innerText = "";
    nextLetter--;
    thisTry.pop();
  }

  function verify() {
    checkWord();
    let answer = Array.from(wordleWord);
    if (thisTry.length < 5) {
      tooShort();
      return;
    } else { //  VERIFY MAIN PART START
      let row = totalTries - remainingTries
      for (let place = 0; place < thisTry.length; place++) {
        let box = document.querySelector(`#row${row}box${place}`);
        let boxText = box.textContent;
        let resultClass;
        if (thisTry[place] === answer[place]) {
          resultClass = "spot-on";
        } else if (answer.includes(thisTry[place])) {
          resultClass = "almost";
        } else {
          resultClass = "wrong";
        }

          let delay = 500 * place;
          setTimeout(() => {
            box.classList.add(resultClass);
            for (const keyButton of document.querySelectorAll(".keyboard-button")) {
              if (keyButton.innerText === boxText) {
                keyButton.classList.add(resultClass);
                break;
              }
            }
          }, delay);

      } // end for-loop
    } // VERIFY MAIN PART END
    nextTry();

      function nextTry() {
        if (
          thisTry.every((val, index) => val === answer[index])
        ) {
          youWin();
          return;
        } else if (remainingTries === 1) {
          gameOver();
        } else {
          remainingTries--;
          console.log(`${remainingTries} tries are left!`);
          thisTry = [];
          nextLetter = 0;
        }
      }
  } // VERIFY END

  function checkWord() {
    const theWord = thisTry.join("").toLocaleLowerCase();
    const wordResult = fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${theWord}`);
      wordResult.then( response => {
        if (response) {
          console.log(response.json());
        } else {
          console.log(`no response`);
        }
      });
  }

  const modal = document.querySelector(".modal");
  const shortModal = document.createElement("div");
  shortModal.className = "shortModal";
  shortModal.innerText = "Too Short";
  const closer = document.createElement("button");
  closer.classList.add("keyboard-button", "short-closer");
  shortModal.appendChild(closer);
  closer.innerText = "OK";

  function tooShort() {
    modal.classList.add("flex");
    modal.appendChild(shortModal);
    closer.addEventListener("click", () => {
      modal.removeChild(shortModal);
      modal.classList.remove("flex");
    });
  }

  function youWin() {
    modal.classList.add("flex");
  }

  function gameOver() {
    console.log("game over")
  }

})();
