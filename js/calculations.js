var myVar;
var startTime;
var stopTime;
var period = 29.5305882; // lunar period in days
function toRadians(angle) {
  // convert angle in degrees to radians
  return angle * (Math.PI / 180);
}

function waningPhaseName(svgVal) {
  var currentPhase;
  if (svgVal <= 4) {
    currentPhase = "New Moon";
  } else if (svgVal >= 96) {
    currentPhase = "Full Moon";
  } else if (svgVal >= 46 && svgVal <= 54) {
    currentPhase = "Third Quarter";
  } else if (svgVal > 4 && svgVal < 46) {
    currentPhase = "Waning Crescent";
  } else {
    currentPhase = "Waning Gibbous";
  }
  return currentPhase;
}

function waxingPhaseName(svgVal) {
  var currentPhase;
  if (svgVal <= 4) {
    currentPhase = "New Moon";
  } else if (svgVal >= 96) {
    currentPhase = "Full Moon";
  } else if (svgVal >= 46 && svgVal <= 54) {
    currentPhase = "First Quarter";
  } else if (svgVal > 0 && svgVal < 50) {
    currentPhase = "Waxing Crescent";
  } else {
    currentPhase = "Waxing Gibbous";
  }
  return currentPhase;
}

function percentIlluminated(percent) {
  var E_s = toRadians((percent / 200.0) * 360);
  var lum = (1 + Math.cos(E_s)) / 2.0;
  lum = Math.round(lum * 10000) / 100;
  return lum;
}

function addSvgValToString(sourceString, svgVal) {
  if (svgVal < 10) {
    sourceString += "00";
  } else if (svgVal < 100) {
    sourceString += "0";
  }
  sourceString += svgVal.toString();
  sourceString += ".svg";
  return sourceString;
}

function showPhase() {
  /*
  Calculate the phase based on the 20 second animation time
  (right now the animation time is fixed)
  */

  var now = $.now();
  var diff = now - startTime;
  var rep = Math.floor(diff / 20000.0); // number of repetitions

  // percent will be X out of 200
  var doublePercent = Math.round(((diff / 20000.0) - rep) * 200);

  var sourceString, svgVal, currentPhase, days, lum;

  if (doublePercent <= 100 && doublePercent >= 0) {
    // waning phases
    sourceString = "Lunar_Phase_Diagrams/Moon-waning-";
    svgVal = 100 - doublePercent;
    currentPhase = waningPhaseName(svgVal);
    days = period * ((100 + doublePercent) / 200.0);
  } else {
    // waxing phases
    sourceString = "Lunar_Phase_Diagrams/Moon-waxing-";
    svgVal = doublePercent - 100;
    currentPhase = waxingPhaseName(svgVal);
    days = period * ((doublePercent - 100) / 200.0);
  }
  sourceString = addSvgValToString(sourceString, svgVal);
  days = Math.round(days * 100) / 100;
  lum = percentIlluminated(doublePercent);

  // insert results into the web page
  $("#phase").attr("src", sourceString); // img source for Lunar Phase Diagram
  $("#current span").html("Current Phase: " + currentPhase);
  $("#daysSince span").html("Days Since New Moon: " + days);
  $("#illuminated span").html("Fraction Illuminated: " + lum + " %");
}

function stopFunction() {
  clearInterval(myVar); // stop the timer
  stopTime = $.now();
  $("#earth .orbit").css("-webkit-animation-play-state", "paused");
  $("#moonDiv1").css("-webkit-animation-play-state", "paused");
  $("#moonDiv2").css("-webkit-animation-play-state", "paused");
  $("#stop").prop("disabled", true);
  $("#start").prop("disabled", false);
}

function startFunction() {
  myVar = setInterval("showPhase()", 100); // restart the timer
  startTime = $.now() - (stopTime - startTime);
  $("#earth .orbit").css("-webkit-animation-play-state", "running");
  $("#moonDiv1").css("-webkit-animation-play-state", "running");
  $("#moonDiv2").css("-webkit-animation-play-state", "running");
  $("#stop").prop("disabled", false);
  $("#start").prop("disabled", true);
}

$(document).ready(function() {
  // start phase calculations on page load
  myVar = setInterval("showPhase()", 100);
  startTime = $.now();
});
