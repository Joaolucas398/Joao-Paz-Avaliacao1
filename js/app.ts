class Calculator {
  static buttons = document.querySelectorAll(".tecla");
  static display = document.getElementById("display") as HTMLSpanElement;

  static displayValue = "0";
  static previousValue = "";
  static operator: string | null = null;
  static waitingForSecondOperand = false;
  static decimalEntered = false;
  static pendingOperator: string | null = null;

  static updateDisplay() {
    Calculator.display.textContent = Calculator.displayValue;
  }

  static inputDisplay(digit: string) {
    const regex = /^[0-9]$/;
    if (Calculator.displayValue.length >= 8 || !regex.test(digit)) {
      return;
    }

    if (Calculator.displayValue === "0" || Calculator.operator === "=") {
      Calculator.displayValue = "";
      Calculator.operator = null;
    }

    Calculator.displayValue += digit;
    Calculator.updateDisplay();
  }

  static inputDecimal() {
    if (!Calculator.decimalEntered) {
      Calculator.displayValue += ".";
      Calculator.decimalEntered = true;
    }
    Calculator.updateDisplay();
  }

  static percentage() {
    const currentValue = parseFloat(Calculator.displayValue);
    if (!isNaN(currentValue)) {
      Calculator.displayValue = (currentValue / 100).toString();
      Calculator.updateDisplay();
    }
  }

  static squareRoot() {
    const currentValue = parseFloat(Calculator.displayValue);
    if (!isNaN(currentValue)) {
      Calculator.displayValue = Math.sqrt(currentValue).toString();
      Calculator.updateDisplay();
    }
  }

  static changeSign() {
    Calculator.displayValue = (-parseFloat(Calculator.displayValue)).toString();
    Calculator.updateDisplay();
  }

  static evaluateExpression() {
    try {
      const expression = Calculator.displayValue;
      const result = Function(`"use strict"; return (${expression});`)();

      if (!isNaN(result)) {
        Calculator.displayValue = result.toString();
        Calculator.updateDisplay();
      }
    } catch (error) {
      Calculator.displayValue = "Erro";
      Calculator.updateDisplay();
    }
  }

  static clearResult() {
    Calculator.displayValue = "0";
    Calculator.previousValue = "";
    Calculator.operator = null;
    Calculator.waitingForSecondOperand = false;
    Calculator.decimalEntered = false;
    Calculator.pendingOperator = null;
    Calculator.updateDisplay();
  }

  static setOperator(operator: string) {
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
  }

  static performOperation() {
    if (Calculator.previousValue !== "" && Calculator.displayValue !== "") {
      const previousValue = parseFloat(Calculator.previousValue);
      const currentValue = parseFloat(Calculator.displayValue);

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
  }

  static start() {
    Calculator.buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const buttonText = button.getAttribute("id");

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
            Calculator.inputDisplay(buttonText!);
            break;
        }
      });
    });
  }
}

Calculator.start();
