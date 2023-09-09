class Calculator {
  static buttons = document.querySelectorAll(".tecla");
  static display = document.getElementById("display") as HTMLSpanElement;

  static displayValue: string = "0";
  static previousValue: string;
  static operator: string | null = null;
  static waitingForSecondOperand: boolean = false;
  static decimalEntered: boolean = false;

  static updateDisplay = () => {
    Calculator.display.textContent = Calculator.displayValue;
  };

  static inputDisplay = (digit: string) => {
    if (Calculator.displayValue.length >= 8) {
      return;
    }

    if (Calculator.displayValue === "0" || Calculator.operator === "=") {
      Calculator.displayValue = "";
      Calculator.operator = null;
    }

    Calculator.displayValue += digit;
    Calculator.updateDisplay();
  };

  static inputDecimal = () => {
    if (!Calculator.decimalEntered) {
      Calculator.displayValue += ".";
      Calculator.decimalEntered = true;
    }
    Calculator.updateDisplay();
  };

  //Não existe o botão de porcentagem na calculadora, mas o código está aqui.
  static percentage = () => {
    const currentValue = parseFloat(Calculator.displayValue);
    if (!isNaN(currentValue)) {
      Calculator.displayValue = (currentValue / 100).toString();
      Calculator.updateDisplay();
    }
  };

  static squareRoot = () => {
    const currentValue = parseFloat(Calculator.displayValue);
    if (!isNaN(currentValue)) {
      Calculator.displayValue = Math.sqrt(currentValue).toString();
      Calculator.updateDisplay();
    }
  };

  static changeSign = () => {
    Calculator.displayValue = (-parseFloat(Calculator.displayValue)).toString();
    Calculator.updateDisplay();
  };

  static evaluateExpression = () => {
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
  };

  static clearResult = () => {
    Calculator.displayValue = "0";
    Calculator.previousValue = "";
    Calculator.operator = null;
    Calculator.waitingForSecondOperand = false;
    Calculator.decimalEntered = false;
    Calculator.updateDisplay();
  };

  static setOperator = (operator: string) => {
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

  static performOperation = () => {
    if (Calculator.previousValue !== "" && Calculator.displayValue !== "") {
      const prev = parseFloat(Calculator.previousValue);
      const current = parseFloat(Calculator.displayValue);

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
          } else {
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

  static start = () => {
    Calculator.buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const buttonText = button.getAttribute("id");

        if (
          buttonText === "mais" ||
          buttonText === "menos" ||
          buttonText === "por" ||
          buttonText === "dividido"
        ) {
          Calculator.setOperator(buttonText);
        } else if (buttonText === "igual") {
          Calculator.performOperation();
        } else if (buttonText === "igual") {
          Calculator.evaluateExpression();
        } else if (buttonText === "porcentagem") {
          Calculator.percentage();
        } else if (buttonText === "signo") {
          Calculator.changeSign();
        } else if (buttonText === "raiz") {
          Calculator.squareRoot();
        } else if (buttonText === ".") {
          Calculator.inputDecimal();
        } else if (buttonText === "on") {
          Calculator.clearResult();
        } else {
          Calculator.inputDisplay(buttonText!);
        }
      });
    });
  };
}

Calculator.start();
