let matrizTmp, containerTmp, tBodyTmp, sortIndex, sortType;
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
    matrizTmp = matriz;
    containerTmp = container;
    tBodyTmp = tBody;
}

function createTable(container, headers, tBody, opts) {
    let countOfHeaders = headers.length;

    let sort, columnSort;
    let o = opts || {};
    if (o.sort == null) sort = null;
    else sort = o.sort;

    if (sort) columnSort = o.columnSort.split('|');

    console.log(columnSort);

    let html = "<table class='center-table'>";
    html += "<thead>";
    html += "<tr class='header-of-table'>";
    for (let j = 0; j < countOfHeaders; j++) {
        if (columnSort.includes(String(j))) {
            html += "<th onclick = 'javascript:sortTable(";//this);'>";
            html += j;
            html += ", this);'>";
        }
        else {
            html += "<th>";
        }
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

function sortTable(j, th) {
    let thInnerHTML = th.innerHTML;
    sortIndex = j;
    if (thInnerHTML.includes('▼')) {
        thInnerHTML = thInnerHTML.substring(0, thInnerHTML.length - 1) + '▲';
        sortType = 'A';
    } else if (thInnerHTML.includes('▲')) {
        thInnerHTML = thInnerHTML.substring(0, thInnerHTML.length - 1) + '▼';
        sortType = 'D';
    } else {
        thInnerHTML += '▼';
        sortType = 'D';
    }
    matrizTmp.sort(sortFunction);
    th.innerHTML = thInnerHTML;
    showData(containerTmp, matrizTmp, tBodyTmp, false);
}

function sortFunction(a, b) {
    if (a[sortIndex] === b[sortIndex]) {
        return 0;
    }
    else {
        if (sortType == 'A') {
            return (a[sortIndex] > b[sortIndex]) ? -1 : 1;
        }
        else {
            return (a[sortIndex] < b[sortIndex]) ? -1 : 1;
        }

    }
}