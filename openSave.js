let downloadBtn = document.querySelector(".download");
let openBtn = document.querySelector(".open");

downloadBtn.addEventListener("click", (event) => {
    let jsonData = JSON.stringify([sheetDB, graphComponentMatrix]);
    let file = new Blob([jsonData], { type: "application/json" });

    let a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = "Sheet_data.json";
    a.click();
});

openBtn.addEventListener("click", (event) => {
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change", (event) => {
        let fr = new FileReader();
        let files = input.files;

        let fileObj = files[0];
        fr.readAsText(fileObj);

        fr.addEventListener("load", (event) => {
            let readSheetData = JSON.parse(fr.result);
            addSheetBtn.click();

            sheetDB = readSheetData[0];
            graphComponentMatrix = readSheetData[1];
            collectedSheetDB[collectedSheetDB.length - 1] = sheetDB;
            collectedGraphComponent[collectedGraphComponent.length - 1] = graphComponentMatrix;

            handleSheetProperties();
        });

    });
});