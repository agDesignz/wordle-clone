(() => {

  "use strict";

  const wordList = ['about','above','abuse','actor','acute','admit','adopt','adult','after','again','agent','agree','ahead','alarm','album','alert','alike','alive','allow','alone','along','alter','among','anger','Angle','angry','apart','apple','apply','arena','argue','arise','array','aside','asset','audio','audit','avoid','award','aware','badly','baker','bases','basic','basis','beach','began','begin','begun','being','below','bench','billy','birth','black','blame','blind','block','blood','board','boost','booth','bound','brain','brand','bread','break','breed','brief','bring','broad','broke','brown','build','built','buyer','cable','calif','carry','catch','cause','chain','chair','chart','chase','cheap','check','chest','chief','child','china','chose','civil','claim','class','clean','clear','click','clock','close','coach','coast','could','count','court','cover','craft','crash','cream','crime','cross','crowd','crown','curve','cycle','daily','dance','dated','dealt','death','debut','delay','depth','doing','doubt','dozen','draft','drama','drawn','dream','dress','drill','drink','drive','drove','dying','eager','early','earth','eight','elite','empty','enemy','enjoy','enter','entry','equal','error','event','every','exact','exist','extra','faith','false','fault','fiber','field','fifth','fifty','fight','final','first','fixed','flash','fleet','floor','fluid','focus','force','forth','forty','forum','found','frame','frank','fraud','fresh','front','fruit','fully','funny','giant','given','glass','globe','going','grace','grade','grand','grant','grass','great','green','gross','group','grown','guard','guess','guest','guide','happy','harry','heart','heavy','hence','henry','horse','hotel','house','human','ideal','image','index','inner','input','issue','japan','jimmy','joint','jones','judge','known','label','large','laser','later','laugh','layer','learn','lease','least','leave','legal','level','lewis','light','limit','links','lives','local','logic','loose','lower','lucky','lunch','lying','magic','major','maker','march','maria','match','maybe','mayor','meant','media','metal','might','minor','minus','mixed','model','money','month','moral','motor','mount','mouse','mouth','movie','music','needs','never','newly','night','noise','north','noted','novel','nurse','occur','ocean','offer','often','order','other','ought','paint','panel','paper','party','peace','peter','phase','phone','photo','piece','pilot','pitch','place','plain','plane','plant','plate','point','pound','power','press','price','pride','prime','print','prior','prize','proof','proud','prove','queen','quick','quiet','quite','radio','raise','range','rapid','ratio','reach','ready','refer','right','rival','river','robin','roger','roman','rough','round','route','royal','rural','scale','scene','scope','score','sense','serve','seven','shall','shape','share','sharp','sheet','shelf','shell','shift','shirt','shock','shoot','short','shown','sight','since','sixth','sixty','sized','skill','sleep','slide','small','smart','smile','smith','smoke','solid','solve','sorry','sound','south','space','spare','speak','speed','spend','spent','split','spoke','sport','staff','stage','stake','stand','start','state','steam','steel','stick','still','stock','stone','stood','store','storm','story','strip','stuck','study','stuff','style','sugar','suite','super','sweet','table','taken','taste','taxes','teach','teeth','terry','texas','thank','theft','their','theme','there','these','thick','thing','think','third','those','three','threw','throw','tight','times','tired','title','today','topic','total','touch','tough','tower','track','trade','train','treat','trend','trial','tried','tries','truck','truly','trust','truth','twice','under','undue','union','unity','until','upper','upset','urban','usage','usual','valid','value','video','virus','visit','vital','voice','waste','watch','water','wheel','where','which','while','white','whole','whose','woman','women','world','worry','worse','worst','worth','would','wound','write','wrong','wrote','yield','young','youth'];

  const rows = document.querySelectorAll("wordle-row");
  const buttons = document.querySelectorAll(".keyboard__button");
  const modal = document.querySelector(".wordle-modal");

  let wordleWord = wordList[Math.floor(Math.random()*wordList.length)].toUpperCase();
  console.log(wordleWord);
  // const wordleWord = "PLACE";
  const totalTries = 6;
  let remainingTries = totalTries;
  let thisTry = [];
  let nextLetter = 0;

  // function guessWord() {

  buttons.forEach(button => { // BUTTONS INPUT
    button.addEventListener("click", (e) => {
      if (remainingTries === 0) {
        return;
      }
      let keyTap = e.target.innerText;
      if (keyTap === "DEL") {
        deleteOne();
        return;
      } else if (keyTap === "ENTER") {
        // console.log(`row: ${row}`);
        console.log(`remainingTries: ${remainingTries}`);
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
    let box = document.querySelector(`#row${row}box${nextLetter}`);
    box.children[0].innerText = entry;
    box.children[1].innerText = entry;
    box.style.animation = "bounce .4s ease-in";
    thisTry.push(entry);
    nextLetter++;
  }

  function deleteOne() {
    if (nextLetter <= 0) {
      return;
    }
    let row = totalTries - remainingTries;
    let box = document.querySelector(`#row${row}box${nextLetter - 1}`);
    let squares = Array.from(box.children);
    squares.forEach(square => {
      square.innerText = "";
    });
    box.style.animation = "";
    nextLetter--;
    thisTry.pop();
  }

  function checkWord() {
    const theWord = thisTry.join("").toLocaleLowerCase();
    const wordPromise = fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${theWord}`)
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
      let front = box.children[0];
      let back = box.children[1];
      let resultClass;
      if (thisTry[place] === answer[place]) {
        resultClass = "spot-on";
      } else if (answer.includes(thisTry[place])) {
        resultClass = "almost";
      } else {
        resultClass = "wrong";
      }
      back.classList.add(resultClass);
      let delay = 500 * place;
      setTimeout(() => {
        front.classList.add("flipped");
        back.classList.add("flipped");
        for (const keyButton of document.querySelectorAll(".keyboard__button")) {
          if (keyButton.innerText === back.textContent) {
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
        // return;
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
    modal.classList.add("block");
    const modalLabel = document.querySelector(".wordle-modal__card > h4");
    modalLabel.innerText = labelMessage;
    const closer = document.querySelector(".btn-ok");
    closer.addEventListener("click", () => {
      modalLabel.innerText = "";
      modal.classList.remove("block");
      daFunc();
    }, {
      once: true
    });
  }

  function rowReset() {
    let row = totalTries - remainingTries;
    const boxes = document.querySelectorAll(`#row-${row} > .board__box`);
    boxes.forEach(box => {
      box.children[0].innerText = "";
      box.children[1].innerText = "";
      nextLetter = 0;
      thisTry = [];
    });
  }

  function totalReset() {
    console.log("Totally Resetting!");
    const squares = document.querySelectorAll(".board__square.flipped");
    squares.forEach(square => {
      square.innerText = "";
      square.classList.remove("flipped");
    });
    remainingTries = totalTries;
    thisTry = [];
    nextLetter = 0;
    wordleWord = wordList[Math.floor(Math.random()*wordList.length)].toUpperCase();
    console.log(wordleWord);
    document.querySelectorAll(".keyboard__button").forEach(keyButton => {
      if ( keyButton.classList.contains("spot-on")) {keyButton.classList.remove("spot-on")}
      if ( keyButton.classList.contains("almost")) {keyButton.classList.remove("almost")}
      if ( keyButton.classList.contains("wrong")) {keyButton.classList.remove("wrong")}
    });
    //
    ////////////////////  NEW WORDLE WORD
    //
  }

  // }
  //
  // guessWord();

})();


// async function checkWord() {
//   const theWord = thisTry.join("").toLocaleLowerCase();
//   const wordPromise = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${theWord}`);
//   const wordPromiseJson = await wordPromise.json();
//   const wordResult = await wordPromiseJson[0].word;
//     if (wordPromise.ok) {
//       console.log(wordPromise.ok);
//     } else {
//       console.log("Not OK");
//     }
// }
