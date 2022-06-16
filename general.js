Number.prototype.toJSDate = function () {
    const daysBeforeUnixEpoch = 70 * 365 + 19;
    const hour = 60 * 60 * 1000;
    return new Date(Math.round((this - daysBeforeUnixEpoch) * 24 * hour) + 12 * hour);
};

Date.prototype.isDate = function () {
    return this.getTime() === this.getTime();
};

String.prototype.isDate = function () {
    return (new Date(this)).getTime() === (new Date(this)).getTime();
};

function hasWhiteSpaces(s) {
    return s.match(/\s+/g);
}

function reloadPage() {
    window.location.href = getURL();
}

// function randomNumber() {
//     return parseInt(lowerLimit) + (Math.floor(Math.random() * (upperLimit - lowerLimit)));
// }

function createCombo(cbo, arrayList, firstItem) {
    let html = "";
    if (firstItem != null) {
        html += "<option value=''>";
        html += primerItem;
        html += "</option>";
    }
    let lengthArray = arrayList.length;
    for (var i = 0; i < lengthArray; i++) {
        html += "<option value='";
        html += arrayList[i];
        html += "'>";
        html += arrayList[i];
        html += "</option>";
    }
    cbo.innerHTML = html;
}

function showData(container, matriz, tBody, summary) {
    let html = "";
    let n = matriz.length;
    let countOfHeaders = matriz[0].length;
    if (n > 0) {
        for (let i = 0; i < n; i++) {
            html += "<tr class='row-of-table'>";
            for (let j = 0; j < countOfHeaders; j++) {
                html += "<td>";
                html += matriz[i][j];
                html += "</td>";
            }
            html += "</tr>";
        }
    } else {
        html += "<tr class='without-data'>";
        html += "<td colspan='";
        html += countOfHeaders.length.toString();
        html += "'>";
        html += "No existen registros.";
        html += "</td>";
        html += "</tr>";
    }
    tBody.innerHTML = html;
    if (summary) {
        let detailData = `Cantidad de registros: <b>${n}</b>`;
        container.insertAdjacentHTML("beforebegin", detailData);
    }
}

function createTable(container, headers, tBody) {
    let countOfHeaders = headers.length;
    let html = "<table class='center-table'>";
    html += "<thead>";
    html += "<tr class='header-of-table'>";
    for (let j = 0; j < countOfHeaders; j++) {
        html += "<th>";
        html += headers[j];
        html += "</th>";
    }
    html += "</tr>";
    html += "</thead>";
    html += "<tbody id='";
    html += tBody;
    html += "'>";
    html += "</tbody>";
    html += "</table>";
    container.innerHTML = html;
}