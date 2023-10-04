// operator와 operand를 각각 HTML element의 속성으로 넘겨 JS로 조작한다
// DOM 요소들을 집어온다. 여러개는 querySelectorAll, 하나면 그냥 querySelector

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equal]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector(
  '[data-previous-operand]'
);
const currentOperandTextElement = document.querySelector(
  '[data-current-operand]'
);

// 계산기의 기능을 구현하는 것은 클래스를 정의해놓고, 그 메서드로 진행하는 것 good!
class Calculator {
  // 처음 인스턴스가 만들어질 때 생성자 함수는 반드시 실행된다
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.clear();
  }

  // clear 메서드는 생성자에서 실행되기에 무조건 인스턴스에 존재한다
  clear() {
    // 다음 클래스의 세 멤버는 일종의 상태(state)와도 같다고 생각하면 좋다
    this.currentOperand = '';
    this.previousOperand = '';
    this.operation = undefined;
  }

  // currentOperand를 싹 날리는게 아니라 뒤 꽁무니부터 하나씩 날리는 기능
  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  appendNumber(number) {
    if (number === '.' && this.currentOperand.includes('.')) return;
    this.currentOperand = this.currentOperand.toString() + number.toString();
  }

  chooseOperation(operation) {
    // operator가 클릭되면, currentOperand는 previousOperand로 올라가고
    // currrentOperand는 빈 상태가 된다
    // 이미 previousOperand에 숫자가 올라간 상태에서 연산자를 눌르면 그냥 무시되어야 함
    if (this.currentOperand === '') return;
    // previosOperand에 뭐가 있는 상태로 연산자 버튼을 누르면
    // 이미 currentOperand에는 뭐가 있다는 확신은 얻었음
    // 그러면 compute() 메서드가 실행됨
    if (this.previousOperand !== '') {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;
    switch (this.operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '*':
        computation = prev * current;
        break;
      case '%':
        computation = prev / current;
        break;
      default:
        return;
    }

    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = '';
  }
  // 숫자를 포맷팅 해주는 함수
  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = '';
    } else {
      integerDisplay = integerDigits.toLocaleString('en', {
        maximumFractionDigits: 0,
      });
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  // output div의 내용들을 새로 렌더링 해주는 기능의 메서드임
  updateDisplay() {
    this.currentOperandTextElement.innerText = this.getDisplayNumber(
      this.currentOperand
    );
    if (this.operation != null) {
      this.previousOperandTextElement.innerText = `${this.getDisplayNumber(
        this.previousOperand
      )} ${this.operation}`;
    } else {
      this.previousOperandTextElement.innerText = '';
    }
  }
}

const calculator = new Calculator(
  previousOperandTextElement,
  currentOperandTextElement
);

// 숫자 버튼마다 이벤트를 등록해준다
numberButtons.forEach((button) => {
  button.addEventListener('click', () => {
    // 누를 수록  current operand에 추가되는 것이다
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

operationButtons.forEach((button) => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  });
});

equalsButton.addEventListener('click', () => {
  calculator.compute();
  calculator.updateDisplay();
});

allClearButton.addEventListener('click', (button) => {
  calculator.clear();
  calculator.updateDisplay();
});

deleteButton.addEventListener('click', (button) => {
  calculator.delete();
  calculator.updateDisplay();
});
