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
    tBody.innerHTML = "";
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
        if (document.getElementById("spanSummary")) container.parentNode.removeChild(document.getElementById("spanSummary"));
        let spanSummary = document.createElement("span");
        spanSummary.id = "spanSummary";
        let spanDetail = "";
        spanDetail += "Cantidad de registros: <b>";
        spanDetail += n;
        spanDetail += "</b>";
        spanSummary.innerHTML = spanDetail;
        container.insertAdjacentElement("beforebegin", spanSummary);
    }
    matrizTmp = matriz;
    containerTmp = container;
    tBodyTmp = tBody;
}

function createTable(container, headers, tBody, opts) {
    container.innerHTML = "";
    if (opts.sort) opts.columnSort = opts.columnSort ? opts.columnSort.split('|') : '';
    //if (opts.pages) opts.pages.page = opts.columnSort ? opts.columnSort.split('|') : '';
    let countOfHeaders = headers.length;
    let html = "<table class='center-table'>";
    html += "<thead>";
    html += "<tr class='header-of-table'>";
    for (let j = 0; j < countOfHeaders; j++) {
        if ((opts.sort && opts.columnSort.includes(String(j))) || (opts.sort && opts.columnSort == '')) {
            html += "<th onclick = 'javascript:sortTable(";
            html += j;
            html += ", this);' class='cursor-pointer'>";
            html += headers[j];
            html += "</th>";
        }
        else {
            html += "<th>";
            html += headers[j];
            html += "</th>";
        }
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
    if (a[sortIndex] === b[sortIndex]) return 0;
    if (sortType == 'A') return (a[sortIndex] > b[sortIndex]) ? -1 : 1;
    if (sortType == 'D') return (a[sortIndex] < b[sortIndex]) ? -1 : 1;
}