function createElt(tagName) {return document.createElement(tagName)};
const calculatorDisplayer = document.getElementById('displayer');
const currentElt = createElt('div');

const currentOperationElt = createElt('span');
currentOperationElt.setAttribute('id', 'operation');
currentElt.append(currentOperationElt);

const currentNumElt = createElt('p');
currentNumElt.setAttribute('id', 'current');
currentElt.append(currentNumElt);


const currentResElt = createElt('p');
currentResElt.setAttribute('id', 'result');

// ------------- ENUM ------------- //
const actionType = {
    Input: "Input",
    Operation: "Operation",
    Erase: "Erase",
    EraseAll: "Erase All",
    Float: "Float",
    Result: "Result",
}

// ------------- CLASS ------------- //

// Operation Manager
class OperationManager {
    constructor(currentValueDisplay, resultValueDisplay, operationDisplay) {
        this.currentValueElt = currentValueDisplay;
        this.operation = operationDisplay;
        this.currentResultElt = resultValueDisplay;
        this.currentResultElt.innerText = "0";
        this.isFloat = false;
    }

    eraseCurrent() {
        this.currentValueElt.innerText = "";
        this.operation.innerText = "";
        this.isFloat = false;
    }

    eraseAll() {
        this.currentValueElt.innerText = "";
        this.operation.innerText = "";
        this.currentResultElt.innerText = "0";
        this.isFloat = false;
    }

    addInput(inputValue) {
        this.currentValueElt.innerText += inputValue;
    }

    setFloat() {
        if(!this.isFloat) {
            this.isFloat = true;
            this.addInput('.');
        }
    }

    setOperation(value) {
        if(this.operation.innerText.length !== 0 && this.currentValueElt.innerText.length !== 0) {
            this.makeResult();
        }
        this.operation.innerText = value;
    }

    doOperation() {
        let value = parseFloat(this.currentValueElt.innerText);
        let result = parseFloat(this.currentResultElt.innerText);

        if (isNaN(value)) return;

        switch(this.operation.innerText){
            case '+':
                result += value;
                break;

            case '-':
                result -= value;
                break;

            case 'x':
                result *= value;
                break;

            case '/':
                result /= value;
                break;
            
            default:
                result = value;
                break;
        }

        this.currentValueElt.innerText = "";
        this.currentResultElt.innerText = result.toString();
    }

    makeResult(){
        if(this.currentValueElt.innerText.length !== 0) {
            this.doOperation();
            this.operation.innerText = "";
        }

    }

    manageEntry(entry) {
        let action = entry[0];
        let value = entry[1];

        switch(action) {
            case actionType.EraseAll:
                this.eraseAll();
                break;
            
            case actionType.Erase:
                this.eraseCurrent();
                break;

            case actionType.Float:
                this.setFloat();
                break;

            case actionType.Operation:
                this.makeResult();
                this.setOperation(value);
                break;

            case actionType.Input:
                this.addInput(value);
                break;

            case actionType.Result:
                this.makeResult();
                break;

            default:
                break;
        }

        // if(this.currentValueElt.innerText === "" && entry[0] === actionType.Operation){
        //     this.addInput(entry[1]);
        // } else if (entry[0] === actionType.Input) {
        //     this.addInput(entry[1]);
        // }

        // Switch to using these arrays if a problem occurs
        // let entryKeysArray = Object.keys(entry);
        // let entryValuesArray = Object.values(entry);

        // To continue....
        // for(let )
    }
}

// Calculator 
class Calculator {
    constructor(inputDisplayElt, resultDisplayElt, operationDisplayElt){
        this.table = createElt('table');
        this.table.setAttribute('id', 'calcuator-inputs');
        this.calculatorInputValues = [
            [[actionType.Input, '7'],[actionType.Input, '8'],[actionType.Input, '9'], [actionType.Erase, 'CE'], [actionType.EraseAll, 'C']],
            [[actionType.Input, '4'],[actionType.Input, '5'],[actionType.Input, '6'], [actionType.Operation, '/'], [actionType.Operation, 'x']],
            [[actionType.Input, '1'],[actionType.Input, '2'],[actionType.Input, '3'], [actionType.Operation, '-'], [actionType.Operation, '+']],
            [[actionType.Input, '0'],[actionType.Float, '.'],[actionType.Result, '=']]
        ];

        this.operationManager = new OperationManager(inputDisplayElt, resultDisplayElt, operationDisplayElt);
    }

    createCalculatorCellInput(value, attributesObj) {
        let arrayTest = Object.entries(attributesObj);
        let currentCell = createElt('td');
    
        currentCell.innerText = value[1];
        for(let i = 0; i < arrayTest.length; i++) {
            currentCell.setAttribute(arrayTest[i][0], arrayTest[i][1]);
        }

        currentCell.addEventListener('click', (e) => {
            this.operationManager.manageEntry(value);
        })

        return currentCell;
    }

    createCalculatorTableInput () {
        for (let row = 0; row < 3; row++){
            let currentRow = createElt('tr');
    
            for (let col = 0; col < 5; col++){
                let attributesToAdd = {};
                if(row === 2 && col === 4) attributesToAdd = {"rowspan" : "2"};
                currentRow.append(this.createCalculatorCellInput(this.calculatorInputValues[row][col], attributesToAdd));
            }
            this.table.append(currentRow);
        }
    
        let lastRow = createElt('tr');
        for (let i = 0; i < 3; i++){
            let attributesToAdd = {};
            if(i === 0) attributesToAdd['colspan']= "2";
            lastRow.append(this.createCalculatorCellInput(this.calculatorInputValues[3][i], attributesToAdd));
        }
        this.table.append(lastRow);
    }

    initTable() {
        this.createCalculatorTableInput();
    }
}

// Creation of a cell in the calculator
// function createCalculatorCellInput(value, attributesObj) {
//     let currentCell = createElt('td');
    
//     currentCell.innerText = value;
//     for([attributeName, attributeValue] of Object.entries(attributesObj)){
//         currentCell.setAttribute(attributeName, attributeValue);
//     }

//     return currentCell;
// }

// Creation of the calculator
// function createCalculatorTableInput(){
//     let calcInput = createElt('table');
//     calcInput.setAttribute('id', 'calcuator-inputs');
//     let inputValues = [
//         ['7','8','9', 'CE', 'C'],
//         ['4','5','6', '/', 'x'],
//         ['1','2','3', '-', '+'],
//         ['0','.','=']
//     ]

//     for (let row = 0; row < 3; row++){
//         let currentRow = createElt('tr');

//         for (let col = 0; col < 5; col++){
//             let attributesToAdd = {};
//             if(row === 2 && col === 4) attributesToAdd['rowspan']= "2";
//             currentRow.append(createCalculatorCellInput(inputValues[row][col], attributesToAdd));
//         }
//         calcInput.append(currentRow);
//     }

//     let lastRow = createElt('tr');
//     for (let i = 0; i < 3; i++){
//         let attributesToAdd = {};
//         if(i === 0) attributesToAdd['colspan']= "2";
//         lastRow.append(createCalculatorCellInput(inputValues[3][i], attributesToAdd));
//     }
//     calcInput.append(lastRow);

//     return calcInput;
// }

// Add the current num displayer
calculatorDisplayer.append(currentElt);

// Add the current result displayer
calculatorDisplayer.append(currentResElt);

// Add the calculator input to the displayer
const calcuatorTable = new Calculator(currentNumElt, currentResElt, currentOperationElt);
calcuatorTable.initTable();
calculatorDisplayer.append(calcuatorTable.table);
// calculatorDisplayer.append(createCalculatorTableInput());