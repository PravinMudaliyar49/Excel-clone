//STORAGE -> 2D matrix (basic needed):
let collectedGraphComponent = [];

let graphComponentMatrix = [];

// for (let i = 0; i < rows; i++) {
//     let row = [];
//     for (let j = 0; j < cols; j++) {
//         //Why array ? ====> More than 1 child relation (dependency) can be achieved.
//         row.push([]);
//     }

//     graphComponentMatrix.push(row);
// }

function isGraphCyclic(graphComponentMatrix) {
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

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (!visited[i][j]) {
                if (dfsCycleDetection(graphComponentMatrix, i, j, visited, dfsVisited)) {
                    return [i, j];
                }
            }
        }
    }

    return null;
}

function dfsCycleDetection(graphComponentMatrix, sr, sc, visited, dfsVisited) {
    visited[sr][sc] = true;
    dfsVisited[sr][sc] = true;

    for (let children = 0; children < graphComponentMatrix[sr][sc].length; children++) {
        let [nrid, ncid] = graphComponentMatrix[sr][sc][children];

        if (visited[nrid][ncid] === false) {
            if (dfsCycleDetection(graphComponentMatrix, nrid, ncid, visited, dfsVisited)) {
                return true;
            }
        } else if (visited[nrid][ncid] && dfsVisited[nrid][ncid]) {
            return true;
        }
    }

    dfsVisited[sr][sc] = false;
    return false;
}