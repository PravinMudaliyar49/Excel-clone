let ctrlKey;

document.addEventListener("keydown", (event) => {
    ctrlKey = event.ctrlKey;
});

document.addEventListener("keyup", (event) => {
    ctrlKey = event.ctrlKey;
});

for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        let cell = document.querySelector(`.address-cell[rid="${i}"][cid="${j}"]`);
        handleSelectedCells(cell);
    }
}

let copyBtn = document.querySelector(".copy");
let cutBtn = document.querySelector(".cut");
let pasteBtn = document.querySelector(".paste");

let rangeStorage = [];
function handleSelectedCells(cell) {
    cell.addEventListener("click", (event) => {
        //Select the range of cells.
        if (!ctrlKey) {
            return;
        }

        if (rangeStorage.length >= 2) {
            defaultSelectedCellUI();
            rangeStorage = [];
        }

        cell.style.border = "3px solid #008000";

        let rid = Number(cell.getAttribute("rid"));
        let cid = Number(cell.getAttribute("cid"));

        rangeStorage.push([rid, cid]);

    });
}

function defaultSelectedCellUI() {
    for (let i = 0; i < rangeStorage.length; i++) {
        let cell = document.querySelector(`.address-cell[rid="${rangeStorage[i][0]}"][cid="${rangeStorage[i][1]}"]`);
        cell.style.border = "1px solid lightgray";
    }
}

let copiedData = [];
copyBtn.addEventListener("click", (event) => {
    if (rangeStorage.length < 2) {
        return;
    }

    myFunction();

    copiedData = [];

    for (let i = rangeStorage[0][0]; i <= rangeStorage[1][0]; i++) {
        let copyRow = [];

        for (let j = rangeStorage[0][1]; j <= rangeStorage[1][1]; j++) {
            let cellProp = sheetDB[i][j];
            copyRow.push(cellProp);
        }

        copiedData.push(copyRow);
    }

    defaultSelectedCellUI();
});

pasteBtn.addEventListener("click", (event) => {

    if (rangeStorage.length < 2) {
        return;
    }

    let rowDiff = Math.abs(rangeStorage[0][0] - rangeStorage[1][0]);
    let colDiff = Math.abs(rangeStorage[0][1] - rangeStorage[1][1]);

    let address = addressBar.value;
    let [srow, scol] = decodeRIDCIDFromAddress(address);

    //r -> copiedData's row and c -> copiedData's col.
    for (let i = srow, r = 0; i <= srow + rowDiff; i++, r++) {
        for (let j = scol, c = 0; j <= scol + colDiff; j++, c++) {
            let cell = document.querySelector(`.address-cell[rid="${i}"][cid="${j}"]`);
            if (!cell) {
                continue;
            }

            let cellProp = sheetDB[i][j];
            cellProp.value = copiedData[r][c].value;
            cellProp.bold = copiedData[r][c].bold;
            cellProp.italic = copiedData[r][c].italic;
            cellProp.underline = copiedData[r][c].underline;
            cellProp.fontSize = copiedData[r][c].fontSize;
            cellProp.fontFamily = copiedData[r][c].fontFamily;
            cellProp.fontColor = copiedData[r][c].fontColor;
            cellProp.bgColor = copiedData[r][c].bgColor;
            cellProp.alignment = copiedData[r][c].alignment;

            cell.click();

        }
    }

});

cutBtn.addEventListener("click", (event) => {
    if (rangeStorage.length < 2) {
        return;
    }

    for (let i = rangeStorage[0][0]; i <= rangeStorage[1][0]; i++) {
        for (let j = rangeStorage[0][1]; j <= rangeStorage[1][1]; j++) {
            let cell = document.querySelector(`.address-cell[rid="${i}"][cid="${j}"]`);

            //DB change
            let cellProp = sheetDB[i][j];

            cellProp.value = "";
            cellProp.bold = false;
            cellProp.italic = false;
            cellProp.underline = false;
            cellProp.fontSize = 14;
            cellProp.fontFamily = "monospace";
            cellProp.fontColor = "#000000";
            cellProp.bgColor = "#000000";
            cellProp.alignment = "left";

            //UI change
            cell.click();

        }

    }

    defaultSelectedCellUI();
});

function myFunction() {
    // Get the snackbar DIV

    var x = document.getElementById("snackbar");

    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(() => {
        x.className = x.className.replace("show", "");
    }, 3000);
}