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

class Calculator {
  // 생성자를 통해 여러 상태들이 인스턴스로 만들어질 때 생성된다
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.clear();
  }

  clear() {
    this.currentOperand = '';
    this.previousOperand = '';
    this.operation = undefined;
  }

  // currentOperand를 싹 날리는게 아니라 뒤 꽁무니부터 하나씩 날리는 기능
  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  // 숫자 버튼을 누를 때마다 실행되는 메서드
  appendNumber(number) {
    if (number === '.' && this.currentOperand.includes('.')) return;
    this.currentOperand = this.currentOperand + number;
  }
  // operator가 클릭되면, currentOperand는 previousOperand로 올라가고
  // currrentOperand는 빈 상태가 된다
  chooseOperation(operation) {
    // 이미 previousOperand에 데이터가 올라간 상태에서 연산자를 눌르면 그냥 무시되어야 함
    if (this.currentOperand === '') return;

    // 그러면 compute() 메서드가 실행됨
    if (this.previousOperand !== '') {
      this.compute();
    }
    // 첫 if문에 걸리지 않는다면 아래의 코드는 꼭 실행됩니다
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
  }

  // 계산 시에 이전 이후 operand와 opreation의 변화가 핵심
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

    // 아래의 내용은 chooseOperation의 아랫쪽 코드와 연결됩니다 -> previousOperand가 currentOperand가 된다는 의미
    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = '';
  }
  // 숫자를 포맷팅 해주는 함수
  getDisplayNumber(number) {
    const stringNumber = number.toString();
    // 문자열의 split 메서드를 통해서 정수부와 소수부로 나눠줌
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1]; // decimal은 소수라는 의미를 가짐
    let integerDisplay;

    if (isNaN(integerDigits)) {
      integerDisplay = '';
    } else {
      integerDisplay = integerDigits.toLocaleString('en', {
        maximumFractionDigits: 0,
      });
    }

    // 얕은 비교를 해줘야 제대로 작동함. 즉 undefined와 null을 같다고 판별할 수 있어야 됨
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  // 메모리 상에만 존재하는 previous&currentOperand를 DOM 요소에 적용하는 메서드
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
