function colorPromise() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });
}

async function isGraphCyclicTracePath(graphComponentMatrix, cycleResponse) {
    let [sr, sc] = cycleResponse;
    let visited = [];
    let dfsVisited = [];

    for (let i = 0; i < rows; i++) {
        let visitedRow = [];
        let dfsVisitedRow = [];
        for (let j = 0; j < cols; j++) {
            visitedRow.push(false);
            dfsVisitedRow.push(false);
        }

        visited.push(visitedRow);
        dfsVisited.push(dfsVisitedRow);
    }

    if (await dfsCycleDetectionTracePath(graphComponentMatrix, sr, sc, visited, dfsVisited)) {
        return Promise.resolve(true);
    }

    return Promise.resolve(false);;
}


//Coloring of the cells while tracing the cyclic path.
async function dfsCycleDetectionTracePath(graphComponentMatrix, sr, sc, visited, dfsVisited) {
    visited[sr][sc] = true;
    dfsVisited[sr][sc] = true;

    let cell = document.querySelector(`.address-cell[rid="${sr}"][cid="${sc}"]`);

    cell.style.backgroundColor = "lightblue";
    await colorPromise();       //Program will pause for 1 sec here.

    for (let children = 0; children < graphComponentMatrix[sr][sc].length; children++) {
        let [nrid, ncid] = graphComponentMatrix[sr][sc][children];

        if (!visited[nrid][ncid]) {
            if (await dfsCycleDetectionTracePath(graphComponentMatrix, nrid, ncid, visited, dfsVisited)) {
                cell.style.backgroundColor = "transparent";
                await colorPromise();

                return Promise.resolve(true);
            }
        } else if (visited[nrid][ncid] && dfsVisited[nrid][ncid]) {
            let cyclicCell = document.querySelector(`.address-cell[rid="${nrid}"][cid="${ncid}"]`);
            
            cyclicCell.style.backgroundColor = "lightsalmon";
            await colorPromise();
            cyclicCell.style.backgroundColor = "transparent";
            
            await colorPromise();
            cell.style.backgroundColor = "transparent";
            
            return Promise.resolve(true);
        }
    }
    
    dfsVisited[sr][sc] = false;
    return Promise.resolve(false);
}