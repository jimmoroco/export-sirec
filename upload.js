let excelFile;
let matrizError = [];
let indexOfSheet;
let indexOfError = 0;
let headersOfError = ["Id", "Valor evaluado", "Descripcion del error"];

// let lowerLimit = 5;
// let upperLimit = 10;

const FILE_UPLOAD_ACCEPT = "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
//const HEADER_OF_FILE = "CODIGO DE SEDE|NRO DE RECLAMO(000000001)|AÑO DE RECLAMO(YYYY)|FECHA(YYYY-MMDD)|NOMBRES O RAZON SOCIAL|DIRECCION|NRO DOCUMENTO|TELEFONO|EMAIL|PADRE O MADRE(MENORES DE EDAD)|TIPO DEL BIEN(PRODUCTO=P O SERVICIO=S O AMBOS=PS)|MONTO RECLAMADO(TEXTO)|DESCRIPCION|TIPO DE RECLAMO(RECLAMO=R O QUEJA=Q)|DETALLE|PEDIDO|FECHA DE RESPUESTA(YYYY-MM-DD)|DESCRIPCION DE LA RESPUESTA";
const NEW_LINE_HTML = "<br />";

const DEFAULT_ADDRESS = "SIN DIRECCIÓN";
const DEFAULT_DOCUMENT = "00000000";
const DEFAULT_PHONE = "999999999"
const DEFAULT_MAIL = "sincorreo@correo.com";
const DEFAULT_PARENTS = "";
const DEFAULT_CLAIM_AMOUNT = 0.00;
const DEFAULT_CLAIM_REQUEST = "";
const DEFAULT_CLAIM_RESPONSE = "";

const GOOD_TYPE = "S";
const CLAIM_TYPE = "R";

const EMPTY = "";

window.onload = function () {
    validateTheme();
    fupload.accept = FILE_UPLOAD_ACCEPT;
    fupload.onchange = function () {
        readFile(this);
    };
    aExportFile.onclick = function () {
        exportFile(this);
    }
    btnReload.onclick = function () {
        reloadPage();
    }
    btnExportAgencies.onclick = function () {
        exportAgencies();
    }
    chkDarkTheme.onchange = function () {
        if (document.getElementById("chkDarkTheme").checked) {
            darkMode(true);
        }
        else {
            darkMode(false);
        }
    }
}

function validateTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        darkMode(true);
    }
    else {
        darkMode(false);
    }
}

function darkMode(_active) {
    const myButtonList = _active ? document.querySelectorAll(".btn") : document.querySelectorAll(".btn-dark-mode");
    for (let i = 0; i < myButtonList.length; i++) {
        if (_active) {
            myButtonList[i].classList.remove("btn");
            myButtonList[i].classList.add("btn-dark-mode");
        }
        else {
            myButtonList[i].classList.add("btn");
            myButtonList[i].classList.remove("btn-dark-mode");
        }
    }
    if (_active) {
        document.body.classList.add("dark-mode");
    }
    else {
        document.body.classList.remove("dark-mode");
    }
    document.getElementById("chkDarkTheme").checked = _active;
}

function exportAgencies() {
    let _agencies = getDataAgencies();
    let worksheet = XLSX.utils.json_to_sheet(_agencies);
    let workbook = XLSX.utils.book_new();
    let max_width = _agencies.reduce((w, r) => Math.max(w, r.agencyName.length), 1);
    worksheet["!cols"] = [{ wch: max_width }];
    XLSX.utils.book_append_sheet(workbook, worksheet, "Agencias");
    XLSX.utils.sheet_add_aoa(worksheet, [["Agencia", "Código"]], { origin: "A1" });
    XLSX.writeFile(workbook, "agencies.xlsx");
}

function getDataAgencies() {
    let agency = {};
    let _agencies = [];
    for (let [key, value] of Object.entries(agencies)) {
        agency.agencyName = key;
        agency.agencyCode = value;
        _agencies.push({ ...agency });
    }
    return _agencies;
}

function showSheets() {
    let html = "";
    for (var i = 0; i < excelFile.SheetNames.length; i++) {
        html += "<a href='#' onclick='executeAction(";
        html += i;
        html += ");'>";
        html += "<img src='sheet.ico' alt='";
        html += "Hoja " + excelFile.SheetNames[i];
        html += "'>";
        html += excelFile.SheetNames[i];
        html += "</a>";
        html += "&nbsp;&nbsp;&nbsp;";
    }
    divDataSheet.innerHTML = html;
    fsExcelSheets.classList.remove("hidden");
}

function executeAction(i) {
    indexOfSheet = i;
    if (chkHideOriginData.checked) {
        document.getElementById("aExportFile").click();
    }
    else {
        showDataFromExcel(i);
        fsExcelDataOfSheet.classList.remove("hidden");
        // programar
    }
}



function readFile(obj) {
    clearPage();
    if (!obj.files) {
        return;
    }
    let f = obj.files[0];
    if (!(f)) {
        return;
    }
    let reader = new FileReader();
    reader.readAsBinaryString(f);
    reader.onload = function (e) {
        let data = e.target.result;
        excelFile = XLSX.read(data, {
            type: 'binary'
        });
    }
    reader.onloadend = function () {
        showSheets();
        loadEnd(f);
    };
}

function loadEnd(f) {
    fileName.innerHTML = `¡Se cargó el archivo <b>${f.name}</b>!`;
    fupload.classList.add("hidden");
    btnReload.classList.remove("hidden");
}
function showDataFromExcel() {
    let dataTable = "";
    let headers = new Array();
    let str = XLSX.utils.sheet_to_json(excelFile.Sheets[excelFile.SheetNames[indexOfSheet]]);
    dataTable += "<table border='1'><tr>";
    for (var key in str[0]) {
        headers.push(key);
        dataTable += "<th>" + key + "</th>";
    }
    let numberOfHeaders = headers.length;
    dataTable += "</tr>";

    let index = 0;
    while (str[index]) {
        dataTable += "<tr>";
        var json = str[index];
        for (var j = 0; j < numberOfHeaders; j++) {
            dataTable += "<td>" + json[headers[j]] + "</td>";
        }
        dataTable += "</tr>";
        index++;
    }
    dataTable += "</table>";
    divExcelFile.innerHTML = dataTable;
}

function clearPage() {
    divExcelFile.innerHTML = "";
    divDataSheet.innerHTML = "";
}

function exportFile(link) {
    let texto = getData();
    if (texto != "") {
        let blob = new Blob([texto], { "type": "text/plain" });
        link.download = "SIREC.txt";
        link.href = URL.createObjectURL(blob);
    }
}

function addMatrizError(id, value, errorMessage) {
    matrizError[indexOfError] = [];
    matrizError[indexOfError][0] = id;
    matrizError[indexOfError][1] = value;
    matrizError[indexOfError][2] = errorMessage;
    indexOfError++;
}

function getData() {
    const radioButtons = document.querySelectorAll('input[name="rbsTemplate"]');
    let selectedTemplate;
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            selectedTemplate = radioButton.value;
            break;
        }
    }
    switch (selectedTemplate) {
        case "templateSGR":
            return getDataTemplateSGR();
        case "templateMan":
            return getDataTemplateMan();
        default:
            return "";
    }
}

function getDataTemplateSGR() {
    matrizError = [];
    indexOfError = 0;
    let idOfData = 0;
    let index = 0;
    let json = "";
    let errorMessage = "";

    let excelDate, jsDate;

    let texto;
    let FILE_00, FILE_01, FILE_02, FILE_03, FILE_04, FILE_05, FILE_06, FILE_07, FILE_08;
    let FILE_09, FILE_10, FILE_11, FILE_12, FILE_13, FILE_14, FILE_15, FILE_16, FILE_17;

    let headers = new Array();
    let str = XLSX.utils.sheet_to_json(excelFile.Sheets[excelFile.SheetNames[indexOfSheet]]);
    for (let key in str[0]) headers.push(key);
    let numberOfHeaders = headers.length;

    while (str[index]) {
        json = str[index];
        idOfData = json[headers[0]]; // ID
        for (var j = 0; j < numberOfHeaders; j++) {
            errorMessage = "";
            excelDate = "";
            jsDate = "";
            switch (j) {
                case 19: //AGENCIA                    
                    FILE_00 = agencies[json[headers[j]]];
                    if (FILE_00 == undefined) {
                        errorMessage = `Agencia no encontrada.`;
                        addMatrizError(idOfData, json[headers[j]], errorMessage);
                    }
                    break;
                case 3: // # RECLAMO
                    FILE_01 = String(json[headers[j]]);
                    if (hasWhiteSpaces(FILE_01)) {
                        errorMessage += `El # de reclamo contiene espacios en blanco.`;
                    }
                    if (FILE_01.length != 10) {
                        errorMessage += `${errorMessage ? NEW_LINE_HTML : EMPTY}El # de reclamo no contiene 10 caracteres.`;
                    }
                    if (errorMessage) addMatrizError(idOfData, FILE_01, errorMessage);
                    break;
                case 4: // # Año y Fecha del reclamo
                    excelDate = json[headers[j]];
                    if (String(excelDate).trim() == EMPTY) {
                        errorMessage += `Ingresar la fecha del reclamo.`;
                        addMatrizError(idOfData, excelDate, errorMessage);
                        break;
                    }
                    if (isNaN(excelDate)) {
                        errorMessage += `La fecha del reclamo es incorrecta.`;
                        addMatrizError(idOfData, excelDate, errorMessage);
                        break;
                    }
                    jsDate = excelDate.toJSDate();
                    FILE_03 = jsDate.toISOString().substring(0, 10);
                    FILE_02 = jsDate.getFullYear();
                    break;
                case 21: // "NOMBRES O RAZÓN SOCIAL"
                    FILE_04 = json[headers[j]];
                    break;
                case 0:
                    FILE_05 = DEFAULT_ADDRESS;
                    FILE_06 = DEFAULT_DOCUMENT;
                    FILE_07 = DEFAULT_PHONE;
                    FILE_08 = DEFAULT_MAIL;
                    FILE_09 = DEFAULT_PARENTS;
                    FILE_10 = GOOD_TYPE;
                    FILE_11 = DEFAULT_CLAIM_AMOUNT;
                    FILE_13 = CLAIM_TYPE;
                    FILE_15 = DEFAULT_CLAIM_REQUEST;
                    FILE_17 = DEFAULT_CLAIM_RESPONSE;
                    break;
                case 1: // DESCRIPCION
                    FILE_12 = json[headers[j]];
                    break;
                case 15: // DETALLE
                    FILE_14 = json[headers[j]];
                    FILE_14 = FILE_14.replace(/(\r\n|\n|\r)/gm, "");
                    break;
                case 6: // FECHA DE RESPUESTA
                    excelDate = json[headers[j]];
                    if (String(excelDate).trim() == EMPTY) {
                        FILE_16 = "";
                        break;
                    }
                    if (isNaN(excelDate)) {
                        errorMessage += `La fecha de la respuesta es incorrecta.`;
                        addMatrizError(idOfData, excelDate, errorMessage);
                        break;
                    }
                    jsDate = excelDate.toJSDate();
                    FILE_16 = jsDate.toISOString().substring(0, 10);
                    break;
                default:
                    break;
            }
        }
        /**
         * FILE_00	CODIGO DE SEDE
FILE_01	NRO DE RECLAMO
FILE_02	AÑO DE RECLAMO
FILE_03	FECHA
FILE_04	"NOMBRES O RAZÓN SOCIAL"
FILE_05	DIRECCIÓN
FILE_06	NRO DOCUMENTO
FILE_07	TELEFONO
FILE_08	EMAIL
FILE_09	PADRE O MADRE (MENORES DE EDAD)
FILE_10	TIPO DEL BIEN
FILE_11	MONTO RECLAMADO
FILE_12	DESCRIPCION
FILE_13	TIPO DE RECLAMO(RECLAMO=R O QUEJA=Q)
FILE_14	DETALLE
FILE_15	PEDIDO
FILE_16	FECHA DE RESPUESTA(YYYY-MMDD)
FILE_17	DESCRIPCION DE LA RESPUESTA

        */
        if (indexOfError == 0) {
            texto += FILE_00 + "|" + FILE_01 + "|" + FILE_02 + "|" + FILE_03 + "|" + FILE_04 + "|";
            texto += FILE_05 + "|" + FILE_06 + "|" + FILE_07 + "|" + FILE_08 + "|" + FILE_09 + "|";
            texto += FILE_10 + "|" + FILE_11 + "|" + FILE_12 + "|" + FILE_13 + "|" + FILE_14 + "|";
            texto += FILE_15 + "|" + FILE_16 + "|" + FILE_17;
        }
        index++;
        if (str[index]) texto += "\r\n";
    }
    if (indexOfError > 0) {
        let opts = { sort: true, columnSort: '0|2', pages: { pageOfRows: 10 } };
        createTable(divError, headersOfError, "tbData", opts);
        showData(divError, matrizError, tbData, true);
        divExcelFile.innerHTML = "";
        fsExcelError.classList.remove("hidden");
        return "";
    }
    return texto;
}

function getDataTemplateMan() {
    matrizError = [];
    indexOfError = 0;
    let idOfData = 0;
    let index = 0;
    let json = "";
    let errorMessage = "";

    let excelDate, jsDate;

    let texto = "";
    let FILE_00, FILE_01, FILE_02, FILE_03, FILE_04, FILE_05, FILE_06, FILE_07, FILE_08;
    let FILE_09, FILE_10, FILE_11, FILE_12, FILE_13, FILE_14, FILE_15, FILE_16, FILE_17;

    let headers = new Array();
    let str = XLSX.utils.sheet_to_json(excelFile.Sheets[excelFile.SheetNames[indexOfSheet]]);
    for (let key in str[0]) headers.push(key);
    let numberOfHeaders = headers.length;
    while (str[index]) {
        json = str[index];
        idOfData = json[headers[1]]; // # del reclamo
        for (var j = 0; j < numberOfHeaders; j++) {
            errorMessage = "";
            excelDate = "";
            jsDate = "";
            switch (j) {
                case 0:
                    if (String(json[headers[j]]).trim() == EMPTY) {
                        errorMessage += `Ingresar el código de sede.`;
                        addMatrizError(idOfData, json[headers[j]], errorMessage);
                        break;
                    }
                    FILE_00 = json[headers[j]];
                    break;
                case 1:
                    if (String(json[headers[j]]).trim() == EMPTY) {
                        errorMessage += `Ingresar el número de reclamo.`;
                        addMatrizError(idOfData, json[headers[j]], errorMessage);
                        break;
                    }
                    FILE_01 = json[headers[j]];
                    break;
                case 2:
                    if (String(json[headers[j]]).trim() == EMPTY) {
                        errorMessage += `Ingresar el año del reclamo.`;
                        addMatrizError(idOfData, json[headers[j]], errorMessage);
                        break;
                    }
                    FILE_02 = json[headers[j]];
                    break;
                case 3:
                    excelDate = json[headers[j]];
                    if (String(excelDate).trim() == EMPTY) {
                        errorMessage += `Ingresar la fecha del reclamo.`;
                        addMatrizError(idOfData, excelDate, errorMessage);
                        break;
                    }
                    if (isNaN(excelDate)) {
                        errorMessage += `La fecha del reclamo es incorrecta.`;
                        addMatrizError(idOfData, excelDate, errorMessage);
                        break;
                    }
                    jsDate = excelDate.toJSDate();
                    FILE_03 = jsDate.toISOString().substring(0, 10);
                    break;
                case 4:
                    if (String(json[headers[j]]).trim() == EMPTY) {
                        errorMessage += `Ingresar el nombre del reclamate.`;
                        addMatrizError(idOfData, json[headers[j]], errorMessage);
                        break;
                    }
                    FILE_04 = json[headers[j]];
                    break;
                case 5:
                    if (String(json[headers[j]]).trim() == EMPTY) {
                        errorMessage += `Ingresar la dirección del reclamante.`;
                        addMatrizError(idOfData, json[headers[j]], errorMessage);
                        break;
                    }
                    FILE_05 = json[headers[j]];
                    break;
                case 6:
                    if (String(json[headers[j]]).trim() == EMPTY) {
                        errorMessage += `Ingresar el número de documento.`;
                        addMatrizError(idOfData, json[headers[j]], errorMessage);
                        break;
                    }
                    FILE_06 = json[headers[j]];
                    break;
                case 7: FILE_07 = json[headers[j]]; break;
                case 8:
                    let expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                    try {
                        if (!String(json[headers[j]]).trim() == EMPTY) {
                            if (!expr.test(json[headers[j]].trim())) {
                                errorMessage += `Formato de correo incorrecto.`;
                                addMatrizError(idOfData, json[headers[j]], errorMessage);
                                break;
                            }
                        }
                    } catch (error) {
                        errorMessage += `Revise el formato del EMAIL, sí es vacío, reemplácelo.`;
                        addMatrizError(idOfData, json[headers[j]], errorMessage);
                        break;
                    }
                    FILE_08 = json[headers[j]].trim();
                    break;
                case 9: FILE_09 = json[headers[j]]; break;
                case 10:
                    if (String(json[headers[j]]).trim() == EMPTY) {
                        errorMessage += `Ingresar el tipo del bien (P=PRODUCTO, S=SERVICIO, PS= PRODUCTO Y SERVICIO).`;
                        addMatrizError(idOfData, json[headers[j]], errorMessage);
                        break;
                    }
                    FILE_10 = json[headers[j]];
                    break;
                case 11:
                    if (String(json[headers[j]]).trim() == EMPTY) {
                        errorMessage += `Ingresar el monto reclamado.`;
                        addMatrizError(idOfData, json[headers[j]], errorMessage);
                        break;
                    }
                    FILE_11 = json[headers[j]];
                    break;
                case 12:
                    if (String(json[headers[j]]).trim() == EMPTY) {
                        errorMessage += `Ingresar la descripción del producto o servicio reclamado.`;
                        addMatrizError(idOfData, json[headers[j]], errorMessage);
                        break;
                    }
                    FILE_12 = json[headers[j]];
                    FILE_12 = FILE_12.replace(/(\r\n|\n|\r)/gm, " ");
                    break;
                case 13:
                    if (String(json[headers[j]]).trim() == EMPTY) {
                        errorMessage += `Ingresar el tipo de reclamo (R=RECLAMO, Q=QUEJA).`;
                        addMatrizError(idOfData, json[headers[j]], errorMessage);
                        break;
                    }
                    FILE_13 = json[headers[j]];
                    break;
                case 14:
                    if (String(json[headers[j]]).trim() == EMPTY) {
                        errorMessage += `Ingresar el detalle del reclamo.`;
                        addMatrizError(idOfData, json[headers[j]], errorMessage);
                        break;
                    }
                    FILE_14 = json[headers[j]]; FILE_14 = FILE_14.replace(/(\r\n|\n|\r)/gm, " ");
                    break;
                case 15:
                    if (String(json[headers[j]]).trim() == EMPTY) {
                        errorMessage += `Ingresar el pedido del reclamante.`;
                        addMatrizError(idOfData, json[headers[j]], errorMessage);
                        break;
                    }
                    FILE_15 = json[headers[j]];
                    if (!FILE_15.replace) {
                        errorMessage += `El pedido tiene un formato incorrecto.`;
                        addMatrizError(idOfData, json[headers[j]], errorMessage);
                        break;
                    }
                    FILE_15 = FILE_15.replace(/(\r\n|\n|\r)/gm, " ");
                    break;
                case 16:
                    excelDate = json[headers[j]];
                    if (String(excelDate).trim() == EMPTY) {
                        FILE_16 = "";
                        break;
                    }
                    if (isNaN(excelDate)) {
                        errorMessage += `La fecha de la respuesta del reclamo es incorrecta.`;
                        addMatrizError(idOfData, excelDate, errorMessage);
                        break;
                    }
                    jsDate = excelDate.toJSDate();
                    FILE_16 = jsDate.toISOString().substring(0, 10);
                    break;
                case 17: FILE_17 = json[headers[j]]; FILE_17 = FILE_17.replace(/(\r\n|\n|\r)/gm, " "); break;
                default: break;
            }
        }
        if (indexOfError == 0) {
            texto += FILE_00 + "|" + FILE_01 + "|" + FILE_02 + "|" + FILE_03 + "|" + FILE_04 + "|";
            texto += FILE_05 + "|" + FILE_06 + "|" + FILE_07 + "|" + FILE_08 + "|" + FILE_09 + "|";
            texto += FILE_10 + "|" + FILE_11 + "|" + FILE_12 + "|" + FILE_13 + "|" + FILE_14 + "|";
            texto += FILE_15 + "|" + FILE_16 + "|" + FILE_17;
        }
        index++;
        if (str[index]) texto += "\r\n";
    }
    if (indexOfError > 0) {
        let opts = { sort: true, columnSort: '0|2', pages: { pageOfRows: 10 } };
        createTable(divError, headersOfError, "tbData", opts);
        showData(divError, matrizError, tbData, true);
        divExcelFile.innerHTML = "";
        fsExcelError.classList.remove("hidden");
        return "";
    }
    return texto;
}

function queryString() {
    let today = new Date();
    return today.getYear().toString() + today.getMonth().toString() +
        today.getDate().toString() + today.getHours().toString() +
        today.getMinutes().toString() + today.getSeconds().toString();
}

function getURL() {
    return `index.html?sirec=${queryString()}`;
}
