const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

let typingHistory = [];
let commandIndex = 0;

function openTerminal() {
    $(".active").innerText = "Terminal";
    terminal.style.display = "block";
    
    let lastLog = new Date();
    let line = document.createElement("div");
    line.setAttribute("class", "line");
    line.innerText = "Last login: "
        + weekday[lastLog.getDay()] + " "
        + month[lastLog.getMonth()] + " "
        + lastLog.getDate() + " "
        + lastLog.toLocaleTimeString() + " "
        + "on ttys000";
        
        $("#editor").insertBefore(line, $("#command").parentNode);
    }
    
    function KeyPress(e) {
    var evtobj = window.event;
    if (evtobj.ctrlKey && evtobj.key == 'Enter') $("#macbook").classList.toggle("clicked");
    if(evtobj.ctrlKey && evtobj.altKey && evtobj.key == 't') {
        openTerminal();
    }

    // Ajouter un événement sur les touches du pavé directionnel comme raccourci
    // pour utiliser les commandes enregistrées dans l'historique

    if(evtobj.key == 'ArrowUp') {
        if(commandIndex < typingHistory.length) commandIndex++;
        $("#command").value = typingHistory[typingHistory.length - commandIndex];
    }

    if(evtobj.key == 'ArrowDown') {
        if(commandIndex > 1) commandIndex--;
        $("#command").value = typingHistory[typingHistory.length - commandIndex];
    }
}

document.onkeydown = KeyPress;

$$(".window").forEach((window) => {
    window.children[0].children[0].addEventListener("click", function() {
        window.style.display = "none";
        if(this.parentNode.parentNode.id == "terminal") $$(".line:not(.line.command)").forEach(line => line.remove());
    });
  
    window.children[0].children[1].addEventListener("click", function() {
        window.classList.remove("fullScreen");
    });
    
    window.children[0].children[2].addEventListener("click", function() {
        window.classList.add("fullScreen");
    });
});

$(".active").addEventListener("click", function() {
    if(this.innerText === "Terminal") openTerminal();
    else $("#" + this.innerText.toLowerCase()).style.display = "block";
});



const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const availableCommand = [
    {
        "name": "clear",
        "info": "..........Clear terminal screen"
    },
    {
        "name": "date",
        "info": "...........Display or change the date & time"
    },
    {
        "name": "echo",
        "info": "...........Display text on screen"
    },
    {
        "name": "history",
        "info": "..........Show the command history"
    },
    {
        "name": "exit",
        "info": "...........Exit the shell"
    },
    {
        "name": "info",
        "info": "...........Help info"
    },
    {
        "name": "open",
        "info": "...........Open a file/folder/URL/Application"
    }
];

$("#editor").addEventListener("keydown", function() {
    if (window.event.which == 13){
        let commandLine = $("#command");
        let command = commandLine.value;
        
        typingHistory.push(command);
        
        let line = document.createElement("div");
        line.setAttribute("class", "line");
        line.innerText = "$ " + command;
        
        this.insertBefore(line, commandLine.parentNode);
        commandLine.value = "";
        
        let splitCommand = command.split(' ');
        let commandName = splitCommand[0];
        splitCommand.shift();
        let args = splitCommand.join(' ');
        
        runCommand(commandName, args);
      }
});

const isValidUrl = urlString => {
    try {
        return Boolean(new URL(urlString));
    } catch(e) {
        return false;
    }
}

let commandHistory = [];

function runCommand(commandName, args){
    let output = "";
    commandIndex = 0;

    switch (commandName.toLowerCase()) {
        case "":
            break;
        case "clear":
            $$(".line:not(.line.command)").forEach(line => line.remove());
            commandHistory.push("clear");
            break;
        case "date":
            date = new Date();
            output = "The actual date is : " + date.toDateString() + " " + date.toLocaleTimeString();
            commandHistory.push("date");
            break;
        case "echo":
            output = args;
            commandHistory.push("echo " + args);
            break;
        case "open":
            if(isValidUrl(args)) window.open(args);
            else output = "This is not a correct URL";           
            commandHistory.push("open " + args);
            break;
        case "exit":
            $$(".line:not(.line.command)").forEach(line => line.remove());
            terminal.style.display = "none";
            commandHistory.push("exit");
            break;
        case "history":
            if(args === "-c") commandHistory.splice(0, commandHistory.length);
            else {
                let index = 0;
                commandHistory.forEach((command) => {
                    output += "" + index + " " + command + "\n";
                    index++;
                });
                commandHistory.push("history");
            }
            break;
        case "info":
            output = "Available Commands:\n";
            availableCommand.forEach((command) => {
                output += command.name.toUpperCase() + command.info + "\n";
            });
            commandHistory.push("info");
            break;
        default:
            output = commandName + " : The term or expression '" + commandName + "' is not recognized. Check the spelling and try again. If you don't know what command are recognized, type INFO.";
    }

    if (output.length) {
        let line = document.createElement("div");
        line.setAttribute("class", "line");
        line.innerText = output;

        $("#editor").insertBefore(line, $("#command").parentNode);
    }
  }

function clock() {
	clockTimer = setInterval(function() {
		let data = new Date();
        let d = weekday[data.getDay()];
		let h = data.getHours();
		let m = data.getMinutes();
    
		if(h < 10) h = "0" + h;
		if(m < 10) m = "0" + m;

        $("#command").focus();
    
		$("#localDateTime").innerText = d + " " + h + ":" + m;
	}, 1000);
}

clock();





let apps = $$(".dock-container > li");

apps.forEach((app) => {
    app.addEventListener("click", function() {
        let appName = this.children[0].textContent;

        $(".active").innerText = appName;
        $("#" + appName.toLowerCase()).style.display = "block";
    });
});




let icons = $$(".ico");

icons.forEach((item, index) => {
  item.addEventListener("mouseover", (e) => {
    focus(e.target, index);
  });
  item.addEventListener("mouseleave", (e) => {
    icons.forEach((item) => {
      item.style.transform = "scale(1)  translateY(0px)";
    });
  });
});

const focus = (elem, index) => {
  let previous = index - 1;
  let previous2 = index - 2;
  let next = index + 1;
  let next2 = index + 2;

  if (previous == -1) {
    elem.style.transform = "scale(1.5)  translateY(-10px)";
    icons[next].style.transform = "scale(1.2) translateY(-6px)";
    icons[next2].style.transform = "scale(1.1)";
  } else if(previous2 == -1) {
    elem.style.transform = "scale(1.5)  translateY(-10px)";
    icons[previous].style.transform = "scale(1.2) translateY(-6px)";
    icons[next].style.transform = "scale(1.2) translateY(-6px)";
    icons[next2].style.transform = "scale(1.1)";
  } else if (next2 == icons.length) {
    elem.style.transform = "scale(1.5)  translateY(-10px)";
    icons[previous].style.transform = "scale(1.2) translateY(-6px)";
    icons[previous2].style.transform = "scale(1.1)";
    icons[next].style.transform = "scale(1.2) translateY(-6px)";
  } else if (next == icons.length) {
    elem.style.transform = "scale(1.5)  translateY(-10px)";
    icons[previous].style.transform = "scale(1.2) translateY(-6px)";
    icons[previous2].style.transform = "scale(1.1)";
  } else {
    elem.style.transform = "scale(1.5)  translateY(-10px)";
    icons[previous].style.transform = "scale(1.2) translateY(-6px)";
    icons[previous2].style.transform = "scale(1.1)";
    icons[next].style.transform = "scale(1.2) translateY(-6px)";
    icons[next2].style.transform = "scale(1.1)";
  }
};






















const mainCalc = $("#calculator");
const RESULT = $(".result");

// Buttons
const OPERATORS = $$("[data-opt]");
const NUMBERS = $$("[data-number]");
const CLEAR = $("[data-clear]");
const SIGN = $("[data-sign]");
const DECIMAL = $("[data-decimal]");
const EQUAL = $("[data-equal]");

// Listeners
OPERATORS.forEach((operator) => operator.addEventListener("click", operate));
NUMBERS.forEach((button) => button.addEventListener("click", getClick));
CLEAR.addEventListener("click", clearState);
SIGN.addEventListener("click", changeSign);
DECIMAL.addEventListener("click", addDecimal);
EQUAL.addEventListener("click", equalOp);
document.addEventListener("keyup", getKey);

// Main State
const STATE = {
	oldValue: 0,
	value: 0,
    integer_part: 0,
    comma: false,
    decimal_part: 0,
	sign: 1,
	operator: 0,
	add: () => {
		return STATE.oldValue + STATE.value;
	},
	subtract: () => {
		return STATE.oldValue - STATE.value;
	},
	multiply: () => {
		return STATE.oldValue * STATE.value;
	},
	divide: () => {
		return Number((STATE.oldValue / STATE.value).toFixed(3));
	}
};

// Special Operations
function clearState() {
	STATE.oldValue = 0;
	STATE.value = 0;
    STATE.integer_part = 0;
    STATE.comma = false;
    STATE.decimal_part = 0;
	STATE.sign = 1;
    STATE.operator = "";
	setResult();
}

function changeSign() {
	STATE.sign *= -1;
	setResult();
}

function setValue(number) {
    if(STATE.comma) {
        STATE.decimal_part = STATE.decimal_part * 10 + number;
        STATE.value = parseFloat(STATE.integer_part.toString() + "." + STATE.decimal_part.toString());
    } else {
        STATE.integer_part = STATE.integer_part * 10 + number;
        STATE.value = STATE.integer_part;
    }

	setResult();
}

function setResult() {
    RESULT.innerText = (STATE.sign * STATE.value);
	//RESULT.innerText = formatNumber(STATE.sign * STATE.value);
}

function addDecimal() {
    STATE.comma = true;
}

// Arithmetic Operations
function equalOp() {
    STATE.comma = false;

	switch (STATE.operator) {
		case "+":
			STATE.value = STATE.add();
			break;
		case "-":
			STATE.value = STATE.subtract();
			break;
		case "*":
			STATE.value = STATE.multiply();
			break;
		case "/":
			STATE.value = STATE.divide();
			break;
	}
	setResult();
}

function operate({ target }) {
	const operator = target.dataset.opt;
	STATE.operator = operator;
	STATE.oldValue = STATE.sign * STATE.value;
	STATE.value = 0;
    STATE.integer_part = 0;
    STATE.comma = false;
    STATE.decimal_part = 0;
	STATE.sign = 1;
	setResult();
}

// Utilities
function formatNumber(number) {
	const regex = /(?<=\d)(?=(\d\d\d)+(?!\d))/g;
	return `${number}`.replace(regex, ".");
}

function getClick({ target }) {
	const number = Number(target.dataset.number);
	setValue(number);
}

function getKey({ key }) {
	const num = Number(key);
	const isNum = !Number.isNaN(num);
	if (isNum) setValue(num);
}