let sheetsFolderCont = document.querySelector(".sheets-folder-cont");
let addSheetBtn = document.querySelector(".sheet-add-icon");

let activeSheetColor = "#ced6e0";

addSheetBtn.addEventListener("click", (event) => {
    let sheet = document.createElement("div");
    sheet.setAttribute("class", "sheet-folder");

    let allSheetsFolder = document.querySelectorAll(".sheet-folder");
    sheet.setAttribute("id", allSheetsFolder.length);

    sheet.innerHTML = `
        <div class="sheet-content">Sheet ${allSheetsFolder.length + 1}</div>
    `;

    sheetsFolderCont.appendChild(sheet);
    sheet.scrollIntoView();

    createSheetDB();
    createGraphComponentMatrix();
    handleSheetActiveness(sheet);
    handleSheetRemoval(sheet);
    sheet.click();
});

function handleSheetActiveness(sheet) {
    sheet.addEventListener("click", (event) => {
        let sheetIdx = Number(sheet.getAttribute("id"));
        handleSheetDB(sheetIdx);
        handleSheetProperties();
        handleSheetUI(sheet);
    });
}

function handleSheetDB(sheetIdx) {
    sheetDB = collectedSheetDB[sheetIdx];
    graphComponentMatrix = collectedGraphComponent[sheetIdx];
}

function handleSheetProperties() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let cell = document.querySelector(`.address-cell[rid="${i}"][cid="${j}"]`);
            cell.click();
        }
    }

    //The first cell of each sheet needs to be by-default clicked via DOM:
    let firstCell = document.querySelector(".address-cell");
    firstCell.click();
}

function createSheetDB() {
    let sheetDB = [];

    for (let i = 0; i < rows; i++) {
        let sheetRow = [];

        for (let j = 0; j < cols; j++) {
            let cellProp = {
                bold: false,
                italic: false,
                underline: false,
                alignment: "left",
                fontFamily: "monospace",
                fontSize: "14",
                fontColor: "#000000",
                bgColor: "#000000",     //Just for the sake of indication.
                value: "",
                formula: "",
                children: []
            };

            sheetRow.push(cellProp);
        }

        sheetDB.push(sheetRow);
    }

    collectedSheetDB.push(sheetDB);
}

function createGraphComponentMatrix() {
    let graphComponentMatrix = [];

    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < cols; j++) {
            //Why array ? ====> More than 1 child relation (dependency) can be achieved.
            row.push([]);
        }

        graphComponentMatrix.push(row);
    }

    collectedGraphComponent.push(graphComponentMatrix);
}

function handleSheetUI(sheet) {
    let allSheetsFolder = document.querySelectorAll(".sheet-folder");

    allSheetsFolder.forEach((sheetFolder) => {
        sheetFolder.style.backgroundColor = "transparent";
    });

    sheet.style.backgroundColor = activeSheetColor;
}

function handleSheetRemoval(sheet) {
    sheet.addEventListener("mousedown", (event) => {
        //Detect right click:

        if (event.button !== 2) {
            return;
        }

        let allSheetsFolder = document.querySelectorAll(".sheet-folder");
        if (allSheetsFolder.length === 1) {
            alert("You need to have atleast one sheet!!!!!");
            return;
        }

        let response = confirm("Your sheet will be removed permanently. Are you sure you still want to remove it?");
        if (!response) {
            return;
        }

        let sheetIdx = Number(sheet.getAttribute("id"));

        //DB removal:
        collectedSheetDB.splice(sheetIdx, 1);
        collectedGraphComponent.splice(sheetIdx, 1);

        //UI removal:
        handleSheetUIRemoval(sheet);

        //By default, bring sheet1 to active:
        sheetDB = collectedSheetDB[0];
        graphComponentMatrix = collectedGraphComponent[0];
        handleSheetProperties();
    });
}

function handleSheetUIRemoval(sheet) {
    sheet.remove();

    let allSheetsFolder = document.querySelectorAll(".sheet-folder");

    allSheetsFolder.forEach((sheetFolder, idx) => {
        sheetFolder.setAttribute("id", idx);

        let sheetContent = sheetFolder.querySelector(".sheet-content");
        sheetContent.innerText = `Sheet ${idx + 1}`;
        sheetFolder.style.backgroundColor = "transparent";
    });

    allSheetsFolder[0].style.backgroundColor = activeSheetColor;

}