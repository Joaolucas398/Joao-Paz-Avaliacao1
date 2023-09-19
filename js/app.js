var Calculator = /** @class */ (function () {
    function Calculator() {
    }
    Calculator.updateDisplay = function () {
        Calculator.display.textContent = Calculator.displayValue;
    };
    Calculator.inputDisplay = function (digit) {
        var regex = /^[0-9]$/;
        if (Calculator.displayValue.length >= 8 || !regex.test(digit)) {
            return;
        }
        if (Calculator.displayValue === "0" || Calculator.operator === "=") {
            Calculator.displayValue = "";
            Calculator.operator = null;
        }
        Calculator.displayValue += digit;
        Calculator.updateDisplay();
    };
    Calculator.inputDecimal = function () {
        if (!Calculator.decimalEntered) {
            Calculator.displayValue += ".";
            Calculator.decimalEntered = true;
        }
        Calculator.updateDisplay();
    };
    Calculator.percentage = function () {
        var currentValue = parseFloat(Calculator.displayValue);
        if (!isNaN(currentValue)) {
            Calculator.displayValue = (currentValue / 100).toString();
            Calculator.updateDisplay();
        }
    };
    Calculator.squareRoot = function () {
        var currentValue = parseFloat(Calculator.displayValue);
        if (!isNaN(currentValue)) {
            Calculator.displayValue = Math.sqrt(currentValue).toString();
            Calculator.updateDisplay();
        }
    };
    Calculator.changeSign = function () {
        Calculator.displayValue = (-parseFloat(Calculator.displayValue)).toString();
        Calculator.updateDisplay();
    };
    Calculator.evaluateExpression = function () {
        try {
            var expression = Calculator.displayValue;
            var result = Function("\"use strict\"; return (".concat(expression, ");"))();
            if (!isNaN(result)) {
                Calculator.displayValue = result.toString();
                Calculator.updateDisplay();
            }
        }
        catch (error) {
            Calculator.displayValue = "Erro";
            Calculator.updateDisplay();
        }
    };
    Calculator.clearResult = function () {
        Calculator.displayValue = "0";
        Calculator.previousValue = "";
        Calculator.operator = null;
        Calculator.waitingForSecondOperand = false;
        Calculator.decimalEntered = false;
        Calculator.pendingOperator = null;
        Calculator.updateDisplay();
    };
    Calculator.setOperator = function (operator) {
        if (Calculator.pendingOperator !== null) {
            Calculator.performOperation();
        }
        Calculator.operator = Calculator.operator === "=" ? null : operator;
        if (!Calculator.waitingForSecondOperand) {
            Calculator.waitingForSecondOperand = true;
            Calculator.previousValue = Calculator.displayValue;
            Calculator.displayValue = "";
        }
        Calculator.pendingOperator = operator;
    };
    Calculator.performOperation = function () {
        if (Calculator.previousValue !== "" && Calculator.displayValue !== "") {
            var previousValue = parseFloat(Calculator.previousValue);
            var currentValue = parseFloat(Calculator.displayValue);
            switch (Calculator.operator) {
                case "mais":
                    Calculator.displayValue = (previousValue + currentValue).toString();
                    break;
                case "menos":
                    Calculator.displayValue = (previousValue - currentValue).toString();
                    break;
                case "por":
                    Calculator.displayValue = (previousValue * currentValue).toString();
                    break;
                case "dividido":
                    Calculator.displayValue =
                        currentValue !== 0
                            ? (previousValue / currentValue).toString()
                            : "Erro";
                    break;
                default:
                    break;
            }
            Calculator.operator =
                Calculator.pendingOperator === "=" ? null : Calculator.pendingOperator;
            Calculator.pendingOperator = null;
            Calculator.waitingForSecondOperand = false;
        }
        Calculator.updateDisplay();
    };
    Calculator.start = function () {
        Calculator.buttons.forEach(function (button) {
            button.addEventListener("click", function () {
                var buttonText = button.getAttribute("id");
                switch (buttonText) {
                    case "mais":
                    case "menos":
                    case "por":
                    case "dividido":
                        Calculator.setOperator(buttonText);
                        break;
                    case "igual":
                        Calculator.operator === null
                            ? Calculator.evaluateExpression()
                            : Calculator.performOperation();
                        break;
                    case "porcentagem":
                        Calculator.percentage();
                        break;
                    case "signo":
                        Calculator.changeSign();
                        break;
                    case "raiz":
                        Calculator.squareRoot();
                        break;
                    case ".":
                        Calculator.inputDecimal();
                        break;
                    case "on":
                        Calculator.clearResult();
                        break;
                    default:
                        Calculator.inputDisplay(buttonText);
                        break;
                }
            });
        });
    };
    Calculator.buttons = document.querySelectorAll(".tecla");
    Calculator.display = document.getElementById("display");
    Calculator.displayValue = "0";
    Calculator.previousValue = "";
    Calculator.operator = null;
    Calculator.waitingForSecondOperand = false;
    Calculator.decimalEntered = false;
    Calculator.pendingOperator = null;
    return Calculator;
}());
Calculator.start();
