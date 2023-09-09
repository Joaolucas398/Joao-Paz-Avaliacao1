var Calculator = /** @class */ (function () {
    function Calculator() {
    }
    Calculator.buttons = document.querySelectorAll(".tecla");
    Calculator.display = document.getElementById("display");
    Calculator.displayValue = "0";
    Calculator.operator = null;
    Calculator.waitingForSecondOperand = false;
    Calculator.decimalEntered = false;
    Calculator.updateDisplay = function () {
        Calculator.display.textContent = Calculator.displayValue;
    };
    Calculator.inputDisplay = function (digit) {
        if (Calculator.displayValue.length >= 9) {
            return;
        }
        if (Calculator.displayValue === "0" || Calculator.operator === "=") {
            Calculator.displayValue = "";
            Calculator.operator = null;
        }
        Calculator.displayValue += digit;
        Calculator.updateDisplay();
    };
    Calculator.clearResult = function () {
        Calculator.displayValue = "0";
        Calculator.previousValue = "";
        Calculator.operator = null;
        Calculator.waitingForSecondOperand = false;
        Calculator.decimalEntered = false;
        Calculator.updateDisplay();
    };
    Calculator.setOperator = function (operator) {
        if (Calculator.operator === "=") {
            Calculator.previousValue = Calculator.displayValue;
            Calculator.displayValue = "";
            Calculator.operator = null;
        }
        if (!Calculator.waitingForSecondOperand) {
            Calculator.waitingForSecondOperand = true;
            Calculator.previousValue = Calculator.displayValue;
            Calculator.displayValue = "";
        }
        Calculator.operator = operator;
    };
    Calculator.performOperation = function () {
        if (Calculator.previousValue !== "" && Calculator.displayValue !== "") {
            var prev = parseFloat(Calculator.previousValue);
            var current = parseFloat(Calculator.displayValue);
            switch (Calculator.operator) {
                case "mais":
                    Calculator.displayValue = (prev + current).toString();
                    break;
                case "menos":
                    Calculator.displayValue = (prev - current).toString();
                    break;
                case "por":
                    Calculator.displayValue = (prev * current).toString();
                    break;
                case "dividido":
                    if (current !== 0) {
                        Calculator.displayValue = (prev / current).toString();
                    }
                    else {
                        Calculator.displayValue = "Erro";
                    }
                    break;
                default:
                    break;
            }
            Calculator.operator = "=";
            Calculator.waitingForSecondOperand = false;
        }
        Calculator.updateDisplay();
    };
    Calculator.start = function () {
        Calculator.buttons.forEach(function (button) {
            button.addEventListener("click", function () {
                var buttonText = button.getAttribute("id");
                if (buttonText === "mais" ||
                    buttonText === "menos" ||
                    buttonText === "por" ||
                    buttonText === "dividido") {
                    Calculator.setOperator(buttonText);
                }
                else if (buttonText === "igual") {
                    Calculator.performOperation();
                }
                else if (buttonText === "on") {
                    Calculator.clearResult();
                }
                else {
                    Calculator.inputDisplay(buttonText);
                }
            });
        });
    };
    return Calculator;
}());
Calculator.start();
