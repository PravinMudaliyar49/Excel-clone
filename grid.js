let rows = 100;
let cols = 26;

let cellsCont = document.querySelector(".cells-cont");
let addressBar = document.querySelector(".address-bar");
let addressColCont = document.querySelector(".address-col-cont");
let addressRowCont = document.querySelector(".address-row-cont");

for (let i = 0; i < rows; i++) {
    let addressCol = document.createElement("div");
    addressCol.innerText = i + 1;
    addressCol.setAttribute("class", "address-col");
    addressColCont.appendChild(addressCol);
}

for (let i = 0; i < cols; i++) {
    let addressRow = document.createElement("div");
    addressRow.innerText = String.fromCharCode(65 + i);
    addressRow.setAttribute("class", "address-row");
    addressRowCont.appendChild(addressRow);
}

for (let i = 0; i < rows; i++) {
    let rowCont = document.createElement("div");
    rowCont.setAttribute("class", "row-cont-flex");

    for (let j = 0; j < cols; j++) {
        let cell = document.createElement("div");
        cell.setAttribute("class", "address-cell");
        cell.setAttribute("contenteditable", true);
        cell.setAttribute("spellcheck", false);

        //For cell and storage identification:
        cell.setAttribute("rid", i);
        cell.setAttribute("cid", j);

        rowCont.appendChild(cell);
        addListenerForAddressBarDisplay(cell, i, j);
    }

    cellsCont.appendChild(rowCont);
}

function addListenerForAddressBarDisplay(cell, i, j) {
    cell.addEventListener("click", (event) => {
        let rowID = i + 1;
        let colID = String.fromCharCode(65 + j);

        addressBar.value = `${colID}${rowID}`;
    });
}

//The first cell needs to be by-default clicked via DOM:
let firstCell = document.querySelector(".address-cell");
firstCell.click();


