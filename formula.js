
for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        let cell = document.querySelector(`.address-cell[rid="${i}"][cid="${j}"]`);
        cell.addEventListener("blur", (event) => {
            let address = addressBar.value;
            let [activeCell, cellProp] = getCellAndCellProp(address);
            let enteredData = activeCell.innerText;

            if (enteredData === cellProp.value) {
                return;
            }

            cellProp.value = enteredData;

            //If data in the currCell is modified, remove the parent-child relation of currCell with all the children. 
            //Also update all the children with the new entered value.
            removeChildFromParent(cellProp.formula);
            cellProp.formula = "";
            updateChildrenCells(address);

        });
    }
}

let formulaBar = document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown", async (event) => {
    let inputFormula = formulaBar.value;
    if (event.key === "Enter" && inputFormula) {

        //If there's any change in the formula for currentCell, remove the old parent-child releation and create a new one.
        let address = addressBar.value;
        let [cell, cellProp] = getCellAndCellProp(address);
        if (inputFormula !== cellProp.formula) {
            removeChildFromParent(cellProp.formula);
        }

        addChildToGraphComponent(inputFormula, address);
        //Check if the formula is creating a cycle. If not, only then evaluate below.

        let cycleResponse = isGraphCyclic(graphComponentMatrix);
        if (cycleResponse) {
            // alert("The formula you've entered is leading to a cycle");
            let response = confirm("The formula you've entered is leading to a cycle. Do you want to trace it");
            while (response) {
                //Keep on tracking color until user is satisfied.
                await isGraphCyclicTracePath(graphComponentMatrix, cycleResponse);        //We need to wait here, until an iteration of color tracing isn't completed. Use promises here as well.

                response = confirm("The formula you've entered is leading to a cycle. Do you want to trace it");
            }

            removeChildFromGraphComponent(inputFormula, address);
            return;
        }

        let evaluatedValue = evaluateFormula(inputFormula);


        setCellUIAndCellProp(evaluatedValue, inputFormula, address);

        addChildToParent(inputFormula);
        updateChildrenCells(address);
    }
});

function addChildToParent(formula) {
    let encodedFormula = formula.split(" ");
    let childAddress = addressBar.value;

    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiVal = encodedFormula[i].charCodeAt(0);

        //encodedFormula[i] is similar to what is shown in the address-bar. Hence using this, get the cell's address.
        if (asciiVal >= 65 && asciiVal <= 90) {
            let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
            parentCellProp.children.push(childAddress);
        }

    }
}

function removeChildFromParent(oldFormula) {
    let encodedFormula = oldFormula.split(" ");
    let childAddress = addressBar.value;

    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiVal = encodedFormula[i].charCodeAt(0);

        if (asciiVal >= 65 && asciiVal <= 90) {
            let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
            let idx = parentCellProp.children.indexOf(childAddress);
            parentCellProp.children.splice(idx, 1);
        }

    }
}

function updateChildrenCells(parentAddress) {
    let [parentCell, parentCellProp] = getCellAndCellProp(parentAddress);
    let children = parentCellProp.children;

    for (let i = 0; i < children.length; i++) {
        let [childCell, childCellProp] = getCellAndCellProp(children[i]);
        let childFormula = childCellProp.formula;

        let evaluatedValue = evaluateFormula(childFormula);
        setCellUIAndCellProp(evaluatedValue, childFormula, children[i]);

        updateChildrenCells(children[i]);
    }

}

function evaluateFormula(formula) {
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiVal = encodedFormula[i].charCodeAt(0);

        //encodedFormula[i] is similar to what is shown in the address-bar. Hence using this, get the cell's address.
        if (asciiVal >= 65 && asciiVal <= 90) {
            let [cell, cellProp] = getCellAndCellProp(encodedFormula[i]);
            encodedFormula[i] = cellProp.value;
        }

    }

    let decodedFormula = encodedFormula.join(" ");
    return eval(decodedFormula);
}


function setCellUIAndCellProp(evaluatedValue, formula, address) {
    let [cell, cellProp] = getCellAndCellProp(address);

    cell.innerText = evaluatedValue;        //UI update.

    //DB update:
    cellProp.value = evaluatedValue;
    cellProp.formula = formula;
}

function addChildToGraphComponent(formula, childAddress) {
    let [crid, ccid] = decodeRIDCIDFromAddress(childAddress);
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiVal = encodedFormula[i].charCodeAt(0);

        if (asciiVal >= 65 && asciiVal <= 90) {
            let [prid, pcid] = decodeRIDCIDFromAddress(encodedFormula[i]);
            graphComponentMatrix[prid][pcid].push([crid, ccid]);
        }

    }

}

function removeChildFromGraphComponent(formula, childAddress) {
    let [crid, ccid] = decodeRIDCIDFromAddress(childAddress);
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiVal = encodedFormula[i].charCodeAt(0);

        if (asciiVal >= 65 && asciiVal <= 90) {
            let [prid, pcid] = decodeRIDCIDFromAddress(encodedFormula[i]);
            graphComponentMatrix[prid][pcid].pop();
        }

    }

}