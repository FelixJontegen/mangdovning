var Fraction = algebra.Fraction;
var Expression = algebra.Expression;
var Equation = algebra.Equation;
var round = algebra.round;
var row_id = 0;
var corrCounter = 1;
var wrongCounter = 0;
var streak = 0;
var ratio = (corrCounter/(wrongCounter+corrCounter));
console.log(ratio);
function roundNr(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}
function generateRandom(min, max) {
    var num = Math.floor(Math.random() * (max - min)) + min;
    //console.log("rand int",num);
    return (num === 0 || num === -1) ? generateRandom(min, max) : num;
}

function testEquation(id,power,low,high){
  var a = new Expression("x").add(generateRandom(low,high));
  var b = new Expression("x").add(generateRandom(low,high));
  var n1 = algebra.parse(a.toString());
  var n2 = algebra.parse(b.toString());
  var quad = new Equation(n1.multiply(n2), 0);
  var answers = quad.solveFor("x");
}

function newEquation(id,power,low,high){
    var tmp = "myEquation";
    var tmp1 = "mySolutionFrac";
    var tmp2 = "mySolutionDec";
    var tmp3 = "answerkey";
    var tmp4 = "x";
    var eqId = "myEquation".concat(id);
    var solutionFrac = tmp1.concat(id);
    var solutionDec = tmp2.concat(id);
    var answerkey = tmp3.concat(id);
    var xid = tmp4.concat(id);

  if (power == 1){
    var a = new Expression("x").pow(power);
    var b = new Expression("x").multiply(generateRandom(low,high));
    var c = generateRandom(low,high);
    var expr = a.add(b).add(c);
    var quad = new Equation(expr, 0);
    console.log(quad.toString());
    var answers = quad.solveFor("x");
    katex.render(algebra.toTex(quad), eval(eqId)); //insert equuation to table.
    var decAnsRounded = roundNr(answers,2)
    var fracAns = answers.toString();
    katex.render("x_{br\\text{\\aa}k}\=" + algebra.toTex(answers) + "\\enspace\\footnotesize", eval(solutionFrac));
    katex.render("x_{dec}\=" + decAnsRounded, eval(solutionDec));
    var userInputElement = $('#userAnswer'+id);
    userInputElement.data('fracAns', fracAns);
    userInputElement.data('decAns', decAnsRounded);

    katex.render("x\=\\enspace", eval(xid));
  }else if (power == 2) {
    var a = new Expression("x").add(generateRandom(low,high));
    var b = new Expression("x").add(generateRandom(low,high));
    var n1 = algebra.parse(a.toString());
    var n2 = algebra.parse(b.toString());
    var quad = new Equation(n1.multiply(n2), 0);
    var answers = quad.solveFor("x");
    katex.render(algebra.toTex(quad), eval(eqId)); //insert equuation to table.
    var decAnsRounded = roundNr(answers,2)
    var fracAns = answers.toString();

    katex.render("x_{1;2}\=" + algebra.toTex(answers) + "\\enspace\\footnotesize", eval(solutionFrac));
    var userInputElement = $('#userAnswer'+id);
    userInputElement.data('fracAns', fracAns);

    katex.render("x_{1;2}\=\\enspace\\enspace\\enspace", eval(xid));
  }else{
    var a = new Expression("x").add(generateRandom(low,high));
    var b = new Expression("x").add(generateRandom(low,high));
    var c = new Expression("x").add(generateRandom(low,high));
    var n1 = algebra.parse(a.toString());
    var n2 = algebra.parse(b.toString());
    var n3 = algebra.parse(c.toString());

    var cubic = new Equation(n1.multiply(n2).multiply(n3), 0);
    console.log(cubic.toString());
    var answers = cubic.solveFor("x");
    console.log("x = " + answers.toString());
  }

  return;
}


function testAnswer(element){
  bulmaToast.setDoc(window.document);

  var tempCounter;
  var row = $(element).closest("tr");
  var inputTd = row.find("[id*='userAnswer']");
  var answer = inputTd.data();
  var inputElement = $(element).closest("tr").find("input");
  var userAnswer = inputElement.val();
  userAnswer = userAnswer.replace(";", ",");
  //console.log(userAnswer);
  if(userAnswer == answer.fracAns || inputElement.val() == answer.decAns){ // RÄTT SVAR
    streak++;
    if (streak >= 5){
      bulmaToast.toast({
      message: "<h1 class='has-text-white has-text-centered'><strong>5 avklarade i rad på första försöket!<br> Bra Jobbat! :D</strong></h1>",
      type: "is-warning",
      duration: 3000,
      position: "center",
      closeOnClick: true,
      opacity: 0.90,
      dismissible: true,
      pauseOnHover: true,
      animate: { in: "jackInTheBox", out: "fadeOutUpBig" }
    });
  }else{
    bulmaToast.toast({
      message: "<p class='has-text-white'><b>Rätt svar! :D</b></p>",
      type: "is-success",
      duration: 5000,
      position: "top-center",
      closeOnClick: true,
      opacity: 0.90,
      animate: { in: "bounceInDown", out: "backOutUp" }
    });
  }
    tempCounter = corrCounter++;
    console.log("corrCounter",corrCounter);
    $('span#nrofcorrect').text(tempCounter + " st");
    console.log("ratio",ratio);
    $('span#ratio').text(ratio + " %");
    inputElement.addClass('is-success');
    inputElement.removeClass('is-danger');
    //row.attr("disabled", "disabled");
    row
        .children('td')
        .animate({ padding: 0 })
        .wrapInner('<div />')
        .children()
        .slideUp(function() {$(this).closest('tr').remove();
    });
    addRow('master_table');
    console.log(streak);
  }else{                                                            // FEL SVAR

    wrongCounter++;
    console.log("wrong",wrongCounter);
    inputElement.addClass('is-danger');
    //$('span#nrofwrong').text(wrongCounter + " försök");
        $('span#ratio').text(ratio + " %");
    bulmaToast.toast({
      message: "<p class='has-text-white'><b>Fel svar. Försök igen!</b></p>",
      type: "is-danger",
      duration: 3000,
      position: "top-center",
      closeOnClick: true,
      opacity: 0.90,
      animate: { in: "slideInDown", out: "fadeOut" }
    });
    streak = 0;
  }

}

function showAnswer(element){
    //$(element).closest("td").find("[id*='mySolution']").toggle(300);
    $(element).closest("td").find("[id*='solutionParrent']").toggleClass('is-active');
}



function addRow(tableID) {
  if(document.getElementById('grad1').checked) {
    power = 1;
  }else if(document.getElementById('grad2').checked) {
    power = 2;
  }
  let tableRef = document.getElementById(tableID);
  var rowCount = tableRef.rows.length;
  let newRow = tableRef.insertRow(rowCount);

  newRow.id = 'id' + row_id; // ID is 'id#' because valid ID can't start with a number
  // Insert a cell in the row at index 0
  //let status = newRow.insertCell(0);
  newRow.className ="animate__animated animate__fadeIn";

  let equation = newRow.insertCell(0);
  equation.id = 'myEquation' + row_id;
  equation.className="is-size-6-mobile is-size-5-tablet is-size-4-desktop is-size-3-widescreen has-text-centered pl-6 is-narrow";

  //let userAnswer = newRow.insertCell(2);
   //userAnswer.id = 'userAnswer' + row_id;
   //userAnswer.className = "is-size-7-mobile is-size-6-touch is-size-4-widescreen is-clipped";
   //userAnswer.innerHTML +='<div class="field has-addons"><div class="control"><input class="input" type="text" placeholder="Ditt svar... "></div><div class="control"><a class="button is-warning" onclick="testAnswer(this)"><span class="icon is-large"><ion-icon name="arrow-forward-circle-outline"></ion-icon></span></a></div></div>';


  let userAnswer = newRow.insertCell(1);
  userAnswer.id = 'userAnswer' + row_id;
  userAnswer.className = "is-size-7-mobile is-size-6-tablet is-size-4-widescreen ";

  userAnswer.innerHTML +='<div class="control has-icons-left has-icons-right"><input class="input is-large is-static answer" type="text" placeholder="Svar"><span id="x'+row_id+'" class="icon is-left mx-2 is-hidden-mobile"></span></div>';
  // userAnswer.innerHTML +='<div class="field is-horizontal"><div class="field-label is-normal"><label class="label">To</label></div><div class="field-body"><div class="field"><p class="control"><input class="input" type="email" placeholder="Recipient email"></p></div></div></div>';
  //userAnswer.innerHTML +='<div class="field is-grouped"><p class="control is-expanded"><label>x =</label><input class="input answer is-rounded" type="text" placeholder="Ditt svar..."></p></div>';
  let submitbutton = newRow.insertCell(2);
  submitbutton.id = 'submitbutton' + row_id;
  submitbutton.className = "is-size-7-mobile is-size-6-tablet is-size-4-widescreen is-narrow"
  submitbutton.innerHTML += '<p class="control"><button type="button" class="button has-text-white is-success is-rounded has-text-centered" onclick="testAnswer(this)"><span class="is-hidden-mobile has-text-weight-semibold">Svara</span><span class="icon"><i class="fas fa-check"></i></span></button></p>';

  let solutions = newRow.insertCell(3);
  solutions.id = 'solutions' + row_id;
  solutions.className = 'is-narrow pr-6';
  //solutions.className ="is-size-7-mobile is-size-6-touch is-size-4-widescreen columns";

  //let solutionParrent = solutions.appendChild(document.createElement("div"));
  //solutionParrent.className ="column is-narrow";
  //let solutionButton = solutions.appendChild(document.createElement("p"));
  //solutionButton.className ="control column is-narrow";
  //solutionParrent.appendChild(document.createElement("span")).id = "mySolutionFrac" + row_id;
  //solutionParrent.appendChild(document.createElement("span")).id = "mySolutionDec" + row_id;
  //document.getElementById("mySolutionFrac" + row_id).setAttribute("hidden", true);
  //document.getElementById("mySolutionDec" + row_id).setAttribute("hidden", true);
  //solutionButton.innerHTML += '<button type="button" class="button is-info is-rounded" onclick="showAnswer(this)"><span class="icon is-small"><i class="fas fa-chevron-circle-left"></i></span><span>Facit</span></button>';
  let solutionParrent = solutions.appendChild(document.createElement("div"));
  solutionParrent.className ="dropdown is-right";
  solutionParrent.id ='solutionParrent' + row_id;
  solutionParrent.innerHTML += '<div class="dropdown-trigger"><button class="button is-rounded is-dark is-outlined" onclick="showAnswer(this)" aria-haspopup="true" aria-controls="dropdown-menu6"><span class="is-hidden-mobile has-text-weight-bold">Facit</span><span class="icon "><i class="fas fa-eye" aria-hidden="true"></i></span></button></div><div class="dropdown-menu" id="dropdown-menu6" role="menu"><div class="dropdown-content animate__animated animate__fadeIn"><div class="dropdown-item is-size-5 is-size-6-mobile"><span id="mySolutionFrac'+row_id+'"><br></span><span id="mySolutionDec'+row_id+'"></span></div></div></div>';



  //solutionButton.innerHTML += '<div class="field"><input id="switchRoundedOutlinedDefault" type="checkbox" name="switchRoundedOutlinedDefault" class="switch is-rounded is-outlined" onclick="showAnswer(this)"><label for="switchRoundedOutlinedDefault">Visa Svar?</label></div>'
  newEquation(row_id,power,-10,20);

  //testEquation(row_id,2,-50,50);
  row_id++;

}
