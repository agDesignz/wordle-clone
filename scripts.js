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
    const modal = document.querySelector(".modal");


    const wordleWord = "PLACE";
    const totalTries = 6;
    let remainingTries = totalTries;
    let thisTry = [];
    let nextLetter = 0;

    function guessWord() {

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
            if (thisTry.length < 5) {
              let shortMsg = "Too Short";
              showModal(shortMsg, rowReset);
              return;
            } else {
              checkWord();
              return;
            }

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

      function checkWord() {
        const theWord = thisTry.join("").toLocaleLowerCase();
        const wordPromise = fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${theWord}`)
          // .then(res => console.log(res.ok));
          .then(res => {
            if (res.ok) {
              verify();
            } else {
              console.log("Not a Word");
              let noWordMsg = "This word is not in our list";
              showModal(noWordMsg, rowReset);
            }
          });
      }

      function verify() {
        let answer = Array.from(wordleWord);
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
          setTimeout(nextTry, 3000);

          function nextTry() {
            if (
              thisTry.every((val, index) => val === answer[index])
            ) {
              let winMsg = "You Win. Play Again?"
              showModal(winMsg, totalReset);
              return;
            } else if (remainingTries === 1) {
              let loseMsg = "Sorry, no more tries.";
              showModal(loseMsg, totalReset)
            } else {
              remainingTries--;
              console.log(`${remainingTries} tries are left!`);
              thisTry = [];
              nextLetter = 0;
            }
          }
        } // VERIFY END


              function showModal(labelMessage, daFunc) {
                modal.classList.add("flex");
                const shortModal = document.querySelector(".inner-modal");
                shortModal.classList.add("flex");
                const modalLabel = document.querySelector(".inner-modal > h4");
                modalLabel.innerText = labelMessage;
                const closer = document.querySelector(".short-closer");
                closer.addEventListener("click", () => {
                  modalLabel.innerText = "";
                  shortModal.classList.remove("flex");
                  modal.classList.remove("flex");
                  daFunc();



                      });
              }

              function rowReset(){
                let row = totalTries - remainingTries;
                const boxes = document.querySelectorAll(`#row-${row} > .wordle-box`);
                boxes.forEach( box => {
                  box.innerText = "";
                  nextLetter = 0;
                  thisTry = [];
                });
              }

              function totalReset() {
                const boxes = document.querySelectorAll(".wordle-box");
                boxes.forEach(box => {
                  box.innerText = "";
                  box.className = "wordle-box";
                });
                remainingTries = totalTries;
                thisTry = [];
                nextLetter = 0;
                document.querySelectorAll(".keyboard-button").forEach(keyButton => {
                  keyButton.className = "keyboard-button";
                });
                //
                ////////////////////  NEW WORDLE WORD
                //
              }

      }

      guessWord();

    })();
