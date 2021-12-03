//STORAGE:
let collectedSheetDB = [];  //Contains all the sheets.

let sheetDB = [];

// {
//     let addSheetBtn = document.querySelector(".sheet-add-icon");
//     addSheetBtn.click();
// }

addSheetBtn.click();

// for (let i = 0; i < rows; i++) {
//     let sheetRow = [];

//     for (let j = 0; j < cols; j++) {
//         let cellProp = {
//             bold: false,
//             italic: false,
//             underline: false,
//             alignment: "left",
//             fontFamily: "monospace",
//             fontSize: "14",
//             fontColor: "#000000",
//             bgColor: "#000000",     //Just for the sake of indication.
//             value: "",
//             formula: "",
//             children: []
//         };

//         sheetRow.push(cellProp);
//     }

//     sheetDB.push(sheetRow);
// }

//Selectors for cell properties:
let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let fontFamily = document.querySelector(".font-family-prop");
let fontSize = document.querySelector(".font-size-prop");
let fontColor = document.querySelector(".font-color-prop");
let bgColor = document.querySelector(".bg-color-prop");
let alignment = document.querySelectorAll(".alignment");

let addressRow = document.querySelectorAll(".address-row");
let addressCol = document.querySelectorAll(".address-col");

let leftAlign = alignment[0];
let centerAlign = alignment[1];
let rightAlign = alignment[2];

let activeColorProp = "#c8d6e5";
let inactiveColorProp = "#ecf0f1";

//APPLICATION OF TWO-WAY BINDING :-

//Attach property listeners:
bold.addEventListener("click", (event) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    //We need cell as well as cellProp to achieve two-way binding. "cell" is for UI change and "cellProp" for DB change.

    //MODIFICATION:
    cellProp.bold = !cellProp.bold;     //Data change.
    cell.style.fontWeight = cellProp.bold ? "bold" : "normal";  //UI change-I.
    bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp;  //UI change-II.

});

italic.addEventListener("click", (event) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    //MODIFICATION:
    cellProp.italic = !cellProp.italic;     //Data change.
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal";  //UI change-I.
    italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp;  //UI change-II.

});

underline.addEventListener("click", (event) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    //MODIFICATION:
    cellProp.underline = !cellProp.underline;     //Data change.
    cell.style.textDecoration = cellProp.underline ? "underline" : "none";  //UI change-I.
    underline.style.backgroundColor = cellProp.underline ? activeColorProp : inactiveColorProp;  //UI change-II.

});

fontSize.addEventListener("change", (event) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    cellProp.fontSize = fontSize.value;     //Data change.
    cell.style.fontSize = cellProp.fontSize + "px";    //UI change - I.
    fontSize.value = cellProp.fontSize;     //UI change-II

});

fontFamily.addEventListener("change", (event) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    cellProp.fontFamily = fontFamily.value;     //Data change.
    cell.style.fontFamily = cellProp.fontFamily;    //UI change - I.
    fontFamily.value = cellProp.fontFamily;     //UI change-II

});

fontColor.addEventListener("change", (event) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    cellProp.fontColor = fontColor.value;     //Data change.
    cell.style.color = cellProp.fontColor;    //UI change - I.
    fontColor.value = cellProp.fontColor;       //UI change-II
});

bgColor.addEventListener("change", (event) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    cellProp.bgColor = bgColor.value;     //Data change.
    cell.style.backgroundColor = cellProp.bgColor;    //UI change - I.
    bgColor.value = cellProp.bgColor;       //UI change-II
});

alignment.forEach((alignElem) => {
    alignElem.addEventListener("click", (event) => {
        let address = addressBar.value;
        let [cell, cellProp] = getCellAndCellProp(address);

        let alignValue = event.target.classList[0];
        cellProp.alignment = alignValue;        //Data change.
        cell.style.textAlign = cellProp.alignment;      //UI change - I.

        //UI change - II.
        switch (alignValue) {
            case "left":
                leftAlign.style.backgroundColor = activeColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;

            case "center":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = activeColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;

            case "right":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = activeColorProp;
                break;
        }

    });
});

function getCellAndCellProp(address) {
    let [rid, cid] = decodeRIDCIDFromAddress(address);

    //Access cell and storage object.
    let cell = document.querySelector(`.address-cell[rid="${rid}"][cid="${cid}"]`);
    let cellProp = sheetDB[rid][cid];
    return [cell, cellProp];
}

function decodeRIDCIDFromAddress(address) {
    //Example address: "A1".

    let rowID = Number(address.slice(1) - 1);  //Extractes 1 and make it 0-indexed.
    let colID = Number(address.charCodeAt(0)) - 65;    //Extract A and make it 0-indexed.

    return [rowID, colID];
}

let allCells = document.querySelectorAll(".address-cell");
for (let i = 0; i < allCells.length; i++) {
    addListenerToAttachedCellProps(allCells[i]);
}

function addListenerToAttachedCellProps(cell) {
    cell.addEventListener("click", (event) => {
        let address = addressBar.value;
        let [rid, cid] = decodeRIDCIDFromAddress(address);

        addressCol.forEach((col) => {
            col.style.removeProperty("background-color");
        });

        addressRow.forEach((row) => {
            row.style.removeProperty("background-color");
        });

        let rowCell = document.querySelector(`.address-col[ccid="${rid}"]`);
        let colCell = document.querySelector(`.address-row[crid="${cid}"]`);

        rowCell.style.backgroundColor = activeColorProp;
        colCell.style.backgroundColor = activeColorProp;

        let cellProp = sheetDB[rid][cid];

        //Apply cell properties:
        cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
        cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
        cell.style.textDecoration = cellProp.underline ? "underline" : "none";
        cell.style.fontSize = cellProp.fontSize + "px";
        cell.style.fontFamily = cellProp.fontFamily;
        cell.style.color = cellProp.fontColor;
        cell.style.backgroundColor = cellProp.bgColor === "#000000" ? "transparent" : cellProp.bgColor;
        cell.style.textAlign = cellProp.alignment;

        //Apply properties to the UI buttons:
        bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp;
        italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp;
        underline.style.backgroundColor = cellProp.underline ? activeColorProp : inactiveColorProp;
        fontColor.value = cellProp.fontColor;
        fontSize.value = cellProp.fontSize;
        fontFamily.value = cellProp.fontFamily;
        bgColor.value = cellProp.bgColor;

        switch (cellProp.alignment) {
            case "left":
                leftAlign.style.backgroundColor = activeColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;

            case "center":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = activeColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;

            case "right":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = activeColorProp;
                break;
        }

        let formulaBar = document.querySelector(".formula-bar");
        formulaBar.value = cellProp.formula;
        cell.innerText = cellProp.value;

    });



}
