var breakGrids = [{
    name: 'Desktop',
    breakpoint: '(min-width:768px){',
    widthUnit: 'px',
    trackGutterRowHeight: 37,
    trackGutterColumnWidth: 37,
    contentWidth: 306,
    contentHeight: 480,
    positionArray: []
}, {
    name: 'Tablet',
    breakpoint: '(min-width:768px) and (max-width:991px){',
    widthUnit: 'vw',
    trackGutterRowHeight: 37,
    trackGutterColumnWidth: 37,
    contentWidth: 306,
    contentHeight: 480,
    positionArray: []
}, {
    name: 'Mobile',
    breakpoint: '(max-width:767px){',
    widthUnit: 'vw',
    trackGutterRowHeight: 37,
    trackGutterColumnWidth: 37,
    contentWidth: 306,
    contentHeight: 480,
    positionArray: []
}],
gridParentStyles,
gapColWidthPercent,
gapRowHeightPercent,
gridColWidthPercent,
gridRowHeightPercent,
gridColWidth,
gridRowHeight,
gridChildPropsNonIE = '',
gridChildPropsIE = '',
maxColumns = 12,
gridObject = new Object(),
target = document.getElementById('app'),
initialize,
name;

var test1 = '.grid_tl';

function process(breakGrid, name) {
    initialize = document.createElement('div');
    initialize.innerHTML += '<div class="row toolbar header"><button class="' + name + ' col-xs-1" style="display:block;" onClick="reset(this,\'' + name + '\');">' + name + ' Reset</button></div><article class="' + name + ' row"><div class="col-xs-12"><div class="row"><div class="col-xs-1"></div><div class="col-xs-11"><div class="' + name + ' row cols_index_container"></div></div></div><div class="row"><div class="' + name + ' col-xs-1 rows_index_container"></div><form class="' + name + ' col-xs-11 rows_grid_container" target="_self"></form></div><div class="row toolbar footer"><button class="' + name + ' col-xs-offset-11 col-xs-1" type="submit" onClick="saveGrid(this,\'' + name + '\');">' + name + ' Save Grid</button><button class="' + name + ' col-xs-offset-11 col-xs-1" type="submit" onClick="saveZone(this,\'' + name + '\');">' + name + ' Save Zone</button><button class="' + name + ' col-xs-offset-11 col-xs-1" type="submit" onClick="finish(this,\'' + name + '\');">' + name + ' Finished?</button></div></div></article>';
target.appendChild(initialize);

var saveGridButton = document.querySelector('.' + name + '[onClick="saveGrid(this,\'' + name + '\');"]'),
    saveZoneButton = document.querySelector('.' + name + '[onClick="saveZone(this,\'' + name + '\');"]'),
    finishedButton = document.querySelector('.' + name + '[onClick="finish(this,\'' + name + '\');"]');

finishedButton.setAttribute('style', 'display:none;');
saveZoneButton.setAttribute('style', 'display:none;');
saveGridButton.setAttribute('style', 'display:block;');

firstCell(0, name);
}

// Initial row/col indexes and grid cell rendered after 'build inital' is triggered
function firstCell(index, el) {
var gridContainer = document.querySelector('article.' + el);
var rowsContainer = gridContainer.querySelector('.' + el + '.col-xs-11.rows_grid_container');
var colIndexContainer = gridContainer.querySelector('.' + el + '.row.cols_index_container');
var rowsIndexContainer = gridContainer.querySelector('.' + el + '.col-xs-1.rows_index_container');

rowsContainer.innerHTML += gridRowHtml(index);
colIndexContainer.innerHTML += colsIndexHtml(index);
rowsIndexContainer.innerHTML += rowsIndexHtml(index);

buildOptionalRow(0, el);
buildOptionalCol(0, el);
rowAddRemoveOnclicks(el);
colAddRemoveOnclicks(el);
}

// With defined arguments for the object, build row index cell
function rowsIndexHtml(el) {
var cellCode = '<div row="' + (el + 1) + '" class="row index"><div class="col-xs-12 cell">' + (el + 1) + '</div></div>';
return cellCode;
}

// With defined arguments for the object, build column index cell
function colsIndexHtml(el) {
var cellCode = '<div col="' + (el + 1) + '" class="col-xs-1 cell">' + (el + 1) + '</div>';
return cellCode;
}

// With defined arguments for the object, build row grid cell
function gridRowHtml(el) {
var cellCode = '<div class="row cells" row="' + el + '">' + gridColHtml(el) + '</div>';
return cellCode;
}

// With defined arguments for the object, build column grid cell
function gridColHtml(el) {
var cellCode = '<div row="' + el + '" col="' + (el + 1) + '" class="col-xs-1 cell"></div>';
return cellCode;
}

// This will render the indicator button to add another row, then calls the function to relocate onclick handlers (ONLY on the INDEX cells). This also creates a PHANTOM row that is rendered ONLY when the user opts to create another row.
function buildOptionalRow(el, el1) {

if (el1 !== undefined) {
    var article=document.querySelector('article.' + el1),
    rowsIndexContainer = article.querySelector('.' + el1 + '.col-xs-1.rows_index_container'),
        rowsContainer = document.querySelector('.' + el1 + '.col-xs-11.rows_grid_container'),
        totalRowsIndex = rowsIndexContainer.children,
        totalRowsCells = rowsContainer.children,
        totalRowsCellsLastRow = totalRowsCells.length - 1,
        rowsCellsNext = totalRowsCells[totalRowsCellsLastRow].cloneNode(true);

} else {
    var article=document.querySelector('article.' + el1),
    rowsIndexContainer = article.querySelector('.' + el1 + '.col-xs-1.rows_index_container'),
        rowsContainer = document.querySelector('.' + el1 + '.col-xs-11.rows_grid_container'),
        totalRowsIndex = rowsIndexContainer.children,
        totalRowsCells = rowsContainer.children,
        totalRowsCellsLastRow = totalRowsCells.length - 1,
        rowsCellsNext = totalRowsCells[totalRowsCellsLastRow].cloneNode(true);
}

for (var j = 0; j < totalRowsIndex.length; j++) {
    if (j == totalRowsIndex.length - 1) {
        var rowsIndexNext = totalRowsIndex[j].cloneNode(true);
        rowsIndexNext.setAttribute('class', 'row index optional');
        totalRowsIndex[totalRowsIndex.length - 1].setAttribute('class', 'row index removable');
    } else {
        totalRowsIndex[j].setAttribute('class', 'row index');
    }
}

rowsCellsNext.setAttribute('class', 'row cells optional');
totalRowsCells[totalRowsCellsLastRow].setAttribute('class', 'row cells');

rowsIndexContainer.innerHTML += rowsIndexNext.outerHTML;
rowsContainer.innerHTML += rowsCellsNext.outerHTML;

// Relocate onclick handlers (ONLY on the INDEX cells)
rowAddRemoveOnclicks(el1);

// Adjust the meta and values of the current INDEX row series
reIndexRow(el1);
};

// This will render the indicator button to add another column, then calls the function to relocate onclick handlers (ONLY on the INDEX cells)
function buildOptionalCol(el, el1) {
var article=document.querySelector('article.' + el1),
colsIndexContainer = article.querySelector('.' + el1 + '.row.cols_index_container'),
    gridRowsContainers = article.querySelectorAll('.row.cells'),
    totalColsIndex = colsIndexContainer.children,
    gridRowChildren,
    gridRowChildrenUpdate;

for (var j = 0; j < totalColsIndex.length; j++) {
    if (j == totalColsIndex.length - 1) {

        var colsIndexNext = totalColsIndex[j].cloneNode(true);
        colsIndexNext.setAttribute('class', 'col-xs-1 cell col index optional');
        totalColsIndex[totalColsIndex.length - 1].setAttribute('class', 'col-xs-1 cell col index removable');
    } else {
        totalColsIndex[j].setAttribute('class', 'col-xs-1 cell col index');
    }
}

colsIndexContainer.innerHTML += colsIndexNext.outerHTML;

if (typeof NodeList.prototype.forEach !== 'function') {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

gridRowsContainers.forEach(function(item) {
    gridRowChildren = item.querySelectorAll('.col-xs-1.cell');
    var totalColsCellsLastCol = gridRowChildren.length - 1,
        colsCellsNext = gridRowChildren[totalColsCellsLastCol].cloneNode(true),
        colsCellsNextColValue = colsCellsNext.getAttribute('col');

    item.innerHTML += colsCellsNext.outerHTML;

    gridRowChildrenUpdate = item.children;

    for (var i = 0; i < gridRowChildrenUpdate.length; i++) {

        var gridRowChildColValue = gridRowChildrenUpdate[i].getAttribute('col');

        if (i == gridRowChildrenUpdate.length - 1) {
            gridRowChildrenUpdate[i].setAttribute('class', 'col-xs-1 cell optional');
        } else {
            gridRowChildrenUpdate[i].setAttribute('class', 'col-xs-1 cell');
        }
    }
});

// Relocate onclick handlers (ONLY on the INDEX cells)
colAddRemoveOnclicks(el1);

// Adjust the meta and values of the current column series
reIndexCol(el1);
};

// This relocates onclick handlers, then calls the function to adjust the meta and values of the current INDEX row series
function rowAddRemoveOnclicks(el) {
var rowsIndexContainer = document.querySelector('.' + el + '.col-xs-1.rows_index_container'),
    totalRowsIndex = rowsIndexContainer.querySelectorAll('.row.index');

for (var i = 0; i < totalRowsIndex.length; i++) {
    if (totalRowsIndex.length > 1) {
        if (i == totalRowsIndex.length - 1) {
            totalRowsIndex[i].setAttribute('onClick', 'buildOptionalRow(this,\'' + el + '\');');
        } else if (i == totalRowsIndex.length - 2) {
            totalRowsIndex[i].setAttribute('onClick', 'removeRowIndex(this,\'' + el + '\');');
            totalRowsIndex[i].setAttribute('class', 'row index removable');
        } else {
            totalRowsIndex[i].removeAttribute('onClick');
        }
    }
}
reIndexRow(el);
}

// This relocates onclick handlers, then calls the function to adjust the meta and values of the current column series
function colAddRemoveOnclicks(el) {

var colsIndexContainer = document.querySelector('.' + el + '.row.cols_index_container'),
    totalColsIndex = colsIndexContainer.querySelectorAll('.col-xs-1.col.index');

for (var i = 0; i < totalColsIndex.length; i++) {
    if (i != maxColumns - 1) {
        if (totalColsIndex.length > 1) {
            if (i == totalColsIndex.length - 1) {
                totalColsIndex[i].setAttribute('onClick', 'buildOptionalCol(this,\'' + el + '\');');
            } else if (i == totalColsIndex.length - 2) {
                totalColsIndex[i].setAttribute('onClick', 'removeColIndex(this,\'' + el + '\');');
                totalColsIndex[i].setAttribute('class', 'col-xs-1 cell col index removable');
            } else {
                totalColsIndex[i].removeAttribute('onClick');
            }
        }
    } else {
        totalColsIndex[totalColsIndex.length - 1].setAttribute('onClick', 'buildOptionalColLast(this,\'' + el + '\');');
        totalColsIndex[totalColsIndex.length - 1].setAttribute('class', 'col-xs-1 cell col index optional');
        totalColsIndex[totalColsIndex.length - 2].setAttribute('onClick', 'removeColIndex(this,\'' + el + '\');');
        totalColsIndex[totalColsIndex.length - 2].setAttribute('class', 'col-xs-1 cell col index removable');
    }
}
reIndexCol(el);
}

// This will NOT render the indicator button to add another column, then calls the function to relocate onclick handlers (ONLY on the INDEX cells)
function buildOptionalColLast(el, el1) {
    var article=document.querySelector('article.' + el1),
    colsIndexContainer = article.querySelectorAll('.row.cols_index_container')[0],
    gridRowsContainers = article.querySelectorAll('.row.cells'),
    totalColsIndex = colsIndexContainer.children,
    gridRowChildren;


totalColsIndex[totalColsIndex.length - 1].setAttribute('class', 'col-xs-1 cell col index removable');
totalColsIndex[totalColsIndex.length - 1].setAttribute('onClick', 'removeColIndexLast(this,\'' + el1 + '\');');
totalColsIndex[totalColsIndex.length - 2].setAttribute('class', 'col-xs-1 cell col index');
totalColsIndex[totalColsIndex.length - 2].removeAttribute('onClick');

gridRowsContainers.forEach(function(item) {
    gridRowChildrenUpdate = item.children;
    for (var i = 0; i < gridRowChildrenUpdate.length; i++) {

        var gridRowChildColValue = gridRowChildrenUpdate[i].getAttribute('col');

        if (i == gridRowChildrenUpdate.length - 1) {
            gridRowChildrenUpdate[i].setAttribute('class', 'col-xs-1 cell last');
        } else {
            gridRowChildrenUpdate[i].setAttribute('class', 'col-xs-1 cell');
        }
    }
});
};

// Adjust the meta and values of the current INDEX row and respective CELLS row series
function reIndexRow(el1) {
var article=document.querySelector('article.' + el1),
totalRowsIndexContainer = article.querySelector('.' + el1 + '.col-xs-1.rows_index_container'),
totalRowsCellsContainer = article.querySelector('.' + el1 + '.col-xs-11.rows_grid_container'),
totalRowsIndex = totalRowsIndexContainer.querySelectorAll('.row.index'),
totalRowsCells = totalRowsCellsContainer.querySelectorAll('.row.cells');

for (var i = 0; i < totalRowsIndex.length; i++) {
    totalRowsIndex[i].setAttribute('row', i + 1);
    totalRowsIndex[i].querySelector('.col-xs-12.cell').innerHTML = i + 1;
}

for (var i = 0; i < totalRowsCells.length; i++) {
    var totalRowsCellsChildren = totalRowsCells[i].children;
    totalRowsCells[i].setAttribute('row', i + 1);
    for (var j = 0; j < totalRowsCellsChildren.length; j++) {
        totalRowsCellsChildren[j].setAttribute('row', i + 1);
    }
}
}

// Adjust the meta and values of the current INDEX column and respective CELLS column series
function reIndexCol(el1) {
var article=document.querySelector('article.' + el1),
colsIndexContainer = article.querySelector('.' + el1 + '.row.cols_index_container'),
    gridRowsContainers = article.querySelectorAll('.row.cells'),
    totalColsIndex = colsIndexContainer.querySelectorAll('.col-xs-1.cell.col.index');

for (var i = 0; i < totalColsIndex.length; i++) {
    totalColsIndex[i].setAttribute('col', i + 1);
    totalColsIndex[i].innerHTML = i + 1;
}

gridRowsContainers.forEach(function(item) {

    var rowCellsChildren = item.querySelectorAll('.col-xs-1.cell');

    for (var i = 0; i < rowCellsChildren.length; i++) {
        rowCellsChildren[i].setAttribute('col', i + 1);
    }
});
}

// Inline click handler to remove current index row and respective grid row, then call function to relocate onclick handlers and update meta
function removeRowIndex(el,el1) {
var removeRow = el.getAttribute('row');
el.outerHTML = '';
removeRowCells(removeRow,el1);
rowAddRemoveOnclicks(el1);
}

// Inline click handler to remove current index column and respective grid column, then call function to relocate onclick handlers and update meta
function removeColIndex(el,el1) {


var removeCol = el.getAttribute('col');

el.outerHTML = '';
removeColCells(removeCol,el1)
colAddRemoveOnclicks(el1);
}

// Inline click handler to NOT remove current index column and respective grid column, then call function to relocate onclick handlers and update meta
function removeColIndexLast(el,el1) {
var removeCol = el.getAttribute('col');
//el.outerHTML = '';
removeColCells(removeCol,el1)
colAddRemoveOnclicks(el1);
}

// This is invoked by removal of row index cells to remove the matching grid row
function removeRowCells(el,el1) {
var article=document.querySelector('article.' + el1),
rowsContainer = article.querySelectorAll('.col-xs-11.rows_grid_container')[0],
    totalRowsCells = rowsContainer.querySelectorAll('.row.cells');
totalRowsCells[el - 1].outerHTML = '';
}

// This is invoked by removal of column index cells to remove the matching grid column
function removeColCells(el,el1) {


var article=document.querySelector('article.' + el1),
gridRowsContainers = article.querySelectorAll('.row.cells');

gridRowsContainers.forEach(function(item) {
    var rowCellsChildren = item.querySelectorAll('.col-xs-1.cell');
    if (el == rowCellsChildren.length) {
        rowCellsChildren[el - 1].setAttribute('class', 'col-xs-1 cell optional');
    } else {
        for (var i = 0; i < rowCellsChildren.length; i++) {
            if (i == rowCellsChildren.length - 1) {
                rowCellsChildren[i].outerHTML = '';
            } else if (i == rowCellsChildren.length - 2) {
                rowCellsChildren[i].setAttribute('class', 'col-xs-1 cell optional');
            } else {
                rowCellsChildren[i].setAttribute('class', 'col-xs-1 cell');
            }
        }
    }

});

}

// Removes the entire article element and reverts the display settings of the Init/Reset buttons
function reset(el,el1) {
var targetContent = target.querySelector('article.' + el1);
targetContent.innerHTML = '<div class="col-xs-12"><div class="row"><div class="col-xs-1"></div><div class="col-xs-11"><div class="' + el1 + ' row cols_index_container"></div></div></div><div class="row"><div class="' + el1 + ' col-xs-1 rows_index_container"></div><form class="' + el1 + ' col-xs-11 rows_grid_container" target="_self"></form></div><div class="row toolbar footer"><button class="' + el1 + ' col-xs-offset-11 col-xs-1" type="submit" onClick="saveGrid(this,\'' + el1 + '\');">' + el1 + ' Save Grid</button><button class="' + el1 + ' col-xs-offset-11 col-xs-1" type="submit" onClick="saveZone(this,\'' + el1 + '\');">' + el1 + ' Save Zone</button><button class="' + el1 + ' col-xs-offset-11 col-xs-1" type="submit" onClick="finish(this,\'' + el1 + '\');">' + el1 + ' Finished?</button></div></div>',
gridElement=document.querySelectorAll('.grid_tl')[0];

var saveGridButton = document.querySelector('.' + el1 + '[onClick="saveGrid(this,\'' + el1 + '\');"]'),
    saveZoneButton = document.querySelector('.' + el1 + '[onClick="saveZone(this,\'' + el1 + '\');"]'),
    finishedButton = document.querySelector('.' + el1 + '[onClick="finish(this,\'' + el1 + '\');"]');

finishedButton.setAttribute('style', 'display:none;');
saveZoneButton.setAttribute('style', 'display:none;');
saveGridButton.setAttribute('style', 'display:block;');

gridElement.innerHTML='';

firstCell(0, el1);
}

function saveGrid(el, el1) {
    var article=document.querySelector('article.' + el1),
    // Get this parent Article of THIS saveGrid button

    colsGridContainer = article.querySelector('.col-xs-11.rows_grid_container'),
// Get this grid parent

    rowCellsChildren = colsGridContainer.querySelectorAll('.col-xs-1.cell'),
    // Get all child cells of THIS parent Article - including index

    rowCells = colsGridContainer.querySelectorAll('.row.cells'),
    // Get all the grid rows of THIS parent Article

    rowIndexContainer = article.querySelector('.' + el1 + '.col-xs-1.rows_index_container'),
    // Get the parent of the row indexes

    colIndexContainer = article.querySelector('.' + el1 + '.row.cols_index_container'),
    // Get the parent of the col indexes

    rowIndexLast = rowIndexContainer.lastChild.getAttribute('row'),
    colIndexLast = colIndexContainer.lastChild.getAttribute('col'),
    saveGridButton = article.querySelector('.' + el1 + '[onClick="saveGrid(this,\'' + el1 + '\');"]'),
    saveZoneButton = article.querySelector('.' + el1 + '[onClick="saveZone(this,\'' + el1 + '\');"]');

    rowIndexContainer.children[rowIndexContainer.children.length-2].setAttribute('class','row index');
    colIndexContainer.children[colIndexContainer.children.length-2].setAttribute('class','col-xs-1 cell col index');
    rowIndexContainer.children[rowIndexContainer.children.length-2].removeAttribute('onClick');
    colIndexContainer.children[colIndexContainer.children.length-2].removeAttribute('onClick');
    rowIndexContainer.children[rowIndexContainer.children.length-1].outerHTML='';
    colIndexContainer.children[colIndexContainer.children.length-1].outerHTML='';

saveGridButton.setAttribute('style', 'display:none;');
saveZoneButton.setAttribute('style', 'display:block;');

for(var z=0;z<breakGrids.length;z++){
if(breakGrids[z].name==el1){
breakGrids[z].trackContentRowQty = rowIndexLast - 1;
breakGrids[z].trackContentColumnQty = colIndexLast - 1;
breakGrids[z].trackGutterRowQty = rowIndexLast - 2;
breakGrids[z].trackGutterColumnQty = colIndexLast - 2;
}

}



for (var i = 0; i < rowCellsChildren.length; i++) {
    var rowCellsChildrenClass = rowCellsChildren[i].getAttribute('class');
    if (rowCellsChildrenClass != 'col-xs-1 cell optional') {
        rowCellsChildren[i].setAttribute('class', 'col-xs-1 cell grid');
    } else {
        rowCellsChildren[i].outerHTML = '';
    }
}

for (var j = 0; j < rowCells.length; j++) {
    var rowCellsClass = rowCells[j].getAttribute('class');
    if (rowCellsClass == 'row cells optional') {
        rowCells[j].outerHTML = '';
    }
}

createZone(el1);
}

function createZone(el) {
var article=document.querySelector('article.' + el),
allGridCellsParent = article.querySelector('.col-xs-11.rows_grid_container'),
    allGridCells = allGridCellsParent.querySelectorAll('.col-xs-1.cell.grid');

allGridCells.forEach(function(item) {
    item.addEventListener('mousedown', initHighLight);
});
}

function initHighLight(el) {
    console.log(el);
    var allGridCellsParent = el.target.parentNode.parentNode,
    allGridCells = allGridCellsParent.querySelectorAll('.col-xs-1.cell.grid');

    el.target.setAttribute('class', 'col-xs-1 cell grid selected');

allGridCells.forEach(function(item) {
    item.addEventListener('mouseover', continueHighLight);
    document.addEventListener('mouseup', function() {
        item.removeEventListener('mouseover', continueHighLight);
    });
});
}

function continueHighLight(el) {
    el.target.setAttribute('class', 'col-xs-1 cell grid selected');
}

function saveZone(el, el1) {
var allGridCellsSelectedParent = document.querySelector('article.' + el1 + ' .col-xs-11.rows_grid_container'),
    allGridCellsSelected = allGridCellsSelectedParent.querySelectorAll('.col-xs-1.cell.grid.selected'),
    allGridCellsNotSelected = allGridCellsSelectedParent.querySelectorAll('.col-xs-1.cell.grid'),
    classRandomSuffix = Math.random().toString(16).slice(2, 8).toUpperCase();

//https://www.paulirish.com/2009/random-hex-color-code-snippets/
allGridCellsSelected.forEach(function(item) {
    item.setAttribute('class', 'col-xs-1 cell grid zone_' + classRandomSuffix);
    item.setAttribute('style', 'background-color: #' + classRandomSuffix);
});

checkIfFinished(el1);
}

function checkIfFinished(el) {
var allGridCellsSelectedParent = document.querySelector('article.' + el + ' .col-xs-11.rows_grid_container'),
    allGridCellsSelectedParentChildren = allGridCellsSelectedParent.querySelectorAll('.col-xs-1.cell'),
    allGridCellsSelected = allGridCellsSelectedParent.querySelectorAll('[class*="zone"]'),
    finishButton = document.querySelector('.' + el + '[onClick="finish(this,\'' + el + '\');"]'),
    saveZoneButton = document.querySelector('.' + el + '[onClick="saveZone(this,\'' + el + '\');"]');

saveZoneButton.setAttribute('style', 'display:block;');
finishButton.setAttribute('style', 'display:block;');
}

function finish(el, el1) {

var article=document.querySelector('article.' + el1),
allGridCellsParent = article.querySelector('.col-xs-11.rows_grid_container'),
    allGridCells = allGridCellsParent.querySelectorAll('.col-xs-1.cell'),
    zonesClassArray = [],
    firstLastArrays = [];

allGridCells.forEach(function(item) {
    item.removeEventListener('mousedown', initHighLight);
});

var finishButton = document.querySelector('.' + el1 + '[onClick="finish(this,\'' + el1 + '\');"]'),
    saveZoneButton = document.querySelector('.' + el1 + '[onClick="saveZone(this,\'' + el1 + '\');"]');

finishButton.setAttribute('style', 'display:none;');
saveZoneButton.setAttribute('style', 'display:none;');

for (var i = 0; i < allGridCells.length; i++) {
    var cellClass = allGridCells[i].getAttribute('class');
    if (cellClass.indexOf('zone') > -1)
        zonesClassArray.push(cellClass);
}


var x = function x(zonesClassArray) {
    return zonesClassArray.filter(function(v, i) {
        return zonesClassArray.indexOf(v) === i;
    });
};

x(zonesClassArray).forEach(function(item) {
    firstLastArrays.push(processElements(item, allGridCells));
});
//https://wsvincent.com/javascript-remove-duplicates-array/

createObjectsProps(firstLastArrays,el1);

for(var z=0;z<breakGrids.length;z++){
    if(breakGrids[z].name==el1){
gridLayoutCSSBuilder(test1, breakGrids[z]);
    }
}


}

// Dedup elements that share the same hex-specific class string and return new array of first/last row/col values.
function processElements(el1, el2) {

var firstLastArray = [],
    commonClassesArray = [];

for (var i = 0; i < el2.length; i++) {
    var thisClass = el2[i].getAttribute('class');

    if (thisClass == el1) {

        var row1 = el2[i].getAttribute('row');
        var col1 = el2[i].getAttribute('col');

        commonClassesArray.push(row1);
        commonClassesArray.push(col1);
    }
}

if (commonClassesArray.length > 2) {

    firstLastArray.push(
        commonClassesArray[0],
        commonClassesArray[1],
        commonClassesArray[commonClassesArray.length - 2] - commonClassesArray[0] + 1,
        commonClassesArray[commonClassesArray.length - 1] - commonClassesArray[1] + 1
    );
} else {

    firstLastArray.push(
        commonClassesArray[0],
        commonClassesArray[1],
        "1",
        "1");
}

return firstLastArray;
}

function GridObject(name, rowStart, rowSpan, colStart, colSpan, bgImg) {
this.name = name;
this.rowStart = rowStart;
this.rowSpan = rowSpan;
this.colStart = colStart;
this.colSpan = colSpan;
this.bgImg = bgImg;
};

var bgImageArray=[
    'https://www.thelook.fashion/text/hpDynamicContent/look-homepage/L02/L02Bottom/images/tunics-crop-u1881.jpg',
'https://www.thelook.fashion/text/hpDynamicContent/look-homepage/L02/L02Bottom/images/clearance-crop-u1641.jpg',
'https://www.thelook.fashion/text/hpDynamicContent/look-homepage/L02/L02Bottom/images/skirts.jpg',
'https://www.thelook.fashion/text/hpDynamicContent/look-homepage/L02/L02Bottom/images/sale-crop-u1631.jpg',
'https://www.thelook.fashion/text/hpDynamicContent/look-homepage/L02/L02Bottom/images/jackets.jpg',
'https://www.thelook.fashion/text/hpDynamicContent/look-homepage/L02/L02Bottom/images/pants-crop-u2890.jpg',
'https://www.thelook.fashion/text/hpDynamicContent/look-homepage/L02/L02Bottom/images/clearance2-crop-u1601.jpg'
];
console.log(bgImageArray);

//Take in new array of first/last row/col values and push to breakGrids position array
function createObjectsProps(arrays,el) {

arrays.forEach(function(item, index) {
    var newGridObject = new GridObject('gridzone_' + index, item[0], item[2], item[1], item[3], bgImageArray[index]);

    for(var z=0;z<breakGrids.length;z++){
        if(breakGrids[z].name==el){
            breakGrids[z].positionArray.push(newGridObject);
        }
    }

});
}

// OUTPUT CSS SCRIPTS

// <!-- FUNCTIONS -->
function gridLayoutCSSBuilder(target, breakpointObjects) {

// <!-- ASSIGN IDS TO ALL CHILD ELEMENTS -->
gridContentAssignIds(target, breakpointObjects);

// <!-- CREATE STYLESHEET -->
var gridStyleSheet = document.createElement('style');
gridStyleSheet.setAttribute('id', target);
document.head.appendChild(gridStyleSheet);

var gridStyleSheetParent = '';
var gridStyleSheetChildren = '';
var gridStyles = '';

// <!-- CONFIGURE GRID PARENT PROPERTIES -->
gridStyleSheetParent += gridParentStyleBuilder(target, breakpointObjects, breakpointObjects.positionArray);

gridStyleSheet.innerHTML += gridStyleSheetParent;


}

function gridContentAssignIds(target, breakpointObjects) {
// <!-- Capture all content elements -->
var breakpointObjectspositionArray = breakpointObjects.positionArray,
gridContentElsParent = document.querySelector(target);

// <!-- Assign unique IDs -->
for (var k = 0; k < breakpointObjectspositionArray.length; k++) {
    var gridContentElsChild=document.getElementById('gridzone_' + k);
    if(!gridContentElsChild){
        gridContentElsParent.innerHTML += '<a href="#" id="gridzone_' + k + '"></a>';
    }
}
}

function gridParentStyleBuilder(target, obj, test) {
// <!-- CALCULATE HEIGHT DIMENSIONS OF PARENT -->
var contentHeightTotal = (obj.contentHeight * obj.trackContentRowQty) + (obj.trackGutterRowHeight * obj.trackGutterRowQty),
    contentWidthTotal = (obj.contentWidth * obj.trackContentColumnQty) + (obj.trackGutterColumnWidth * obj.trackGutterColumnQty),
    gridParentStyles = '',
    contentHeightVw = (contentHeightTotal / contentWidthTotal) * 100,
    gridColsRowsProps = '';

obj.gridColsRowsProps = gridColsRowsCalcProps(obj.trackContentColumnQty, obj.trackContentRowQty, contentWidthTotal, contentHeightTotal, obj.trackGutterRowHeight, obj.trackGutterColumnWidth);

if (obj.widthUnit == 'vw') {
    gridParentStyles += '@media screen and ' + obj.breakpoint + target + '{display:-ms-grid;display:grid;width:' + 100 + obj.widthUnit + ';height: ' + contentHeightVw + obj.widthUnit + ';' + obj.gridColsRowsProps + ';}' + gridColRowStyler(test) + '}';
} else {
    gridParentStyles += '@media screen and ' + obj.breakpoint + target + '{display:-ms-grid;display:grid;max-width:' + contentWidthTotal + obj.widthUnit + ';height: ' + contentHeightTotal + obj.widthUnit + ';' + obj.gridColsRowsProps + ';}' + gridColRowStyler(test) + '}';

}

return gridParentStyles;
}

function gridColsRowsCalcProps(gridColQty, gridRowQty, parentWidthPx, parentHeightPx, gapColWidthPx, gapRowHeightPx) {

gapColWidthPercent = (gapColWidthPx / parentWidthPx) * 100 + '%';
gapRowHeightPercent = (gapRowHeightPx / parentHeightPx) * 100 + '%';

var gapColWidthPxTotal = gapColWidthPx * (gridColQty - 1),
    gapRowHeightPxTotal = gapRowHeightPx * (gridRowQty - 1),
    childrenWidthPxTotal = parentWidthPx - gapColWidthPxTotal,
    childrenHeightPxTotal = parentHeightPx - gapRowHeightPxTotal,
    gridColsRowsProps = gridTemplateColumnsCssStringBuilder(childrenWidthPxTotal, gridColQty, parentWidthPx) + gridTemplateRowsCssStringBuilder(childrenHeightPxTotal, gridRowQty, parentHeightPx);

return gridColsRowsProps;
};

function gridTemplateColumnsCssStringBuilder(e1, e2, e3) {
var gridColParentPropsNonIE = 'grid-template-columns:',
    gridColParentPropsIE = '-ms-grid-columns:',
    gridColWidthPercent = ((e1 / e2) / e3) * 100 + '%';

for (var i = 0; i < e2; i++) {
    if (i != e2 - 1) {
        gridColParentPropsNonIE += ' ' + gridColWidthPercent + ' ' + gapColWidthPercent;
        gridColParentPropsIE += ' ' + gridColWidthPercent + ' ' + gapColWidthPercent;
    } else {
        gridColParentPropsNonIE += ' ' + gridColWidthPercent;
        gridColParentPropsIE += ' ' + gridColWidthPercent;
    }
}
var gridColProperty = gridColParentPropsIE + ';' + gridColParentPropsNonIE + ';';

return gridColProperty;
};

function gridTemplateRowsCssStringBuilder(e4, e5, e6) {
var gridRowParentPropsNonIE = 'grid-template-rows:',
    gridRowParentPropsIE = '-ms-grid-rows:',
    gridRowProperty = '',
    gridRowHeightPercent = ((e4 / e5) / e6) * 100 + '%';

for (var j = 0; j < e5; j++) {
    if (j != e5 - 1) {
        gridRowParentPropsNonIE += ' ' + gridRowHeightPercent + ' ' + gapRowHeightPercent;
        gridRowParentPropsIE += ' ' + gridRowHeightPercent + ' ' + gapRowHeightPercent;
    } else {
        gridRowParentPropsNonIE += ' ' + gridRowHeightPercent;
        gridRowParentPropsIE += ' ' + gridRowHeightPercent;
    }
}
gridRowProperty = gridRowParentPropsIE + ';' + gridRowParentPropsNonIE;

return gridRowProperty;
};

function gridColRowStyler(gridChildDefinitionsArray) {

// <!-- CONFIGURE STYLES FOR EACH GRID CHILD -->
var colStartingTrackNumber = '',
    colSpanNumber = '',
    rowStartingTrackNumber = '',
    rowSpanNumber = '',
    gridChildProps = '';

for (var b = 0; b < gridChildDefinitionsArray.length; b++) {

    if (gridChildDefinitionsArray[b].colStart > 1) {
        colStartingTrackNumber = (gridChildDefinitionsArray[b].colStart - 1) * 2 + 1;
    } else {
        colStartingTrackNumber = 1;
    }

    if (gridChildDefinitionsArray[b].colSpan > 1) {
        colSpanNumber = (gridChildDefinitionsArray[b].colSpan - 1) * 2 + 1;
    } else {
        colSpanNumber = 1;
    }

    if (gridChildDefinitionsArray[b].rowStart > 1) {
        rowStartingTrackNumber = (gridChildDefinitionsArray[b].rowStart - 1) * 2 + 1;
    } else {
        rowStartingTrackNumber = 1;
    }

    if (gridChildDefinitionsArray[b].rowSpan > 1) {
        rowSpanNumber = (gridChildDefinitionsArray[b].rowSpan - 1) * 2 + 1;
    } else {
        rowSpanNumber = 1;
    }

    gridChildProps += '#' + gridChildDefinitionsArray[b].name + '{background-image: url("' + gridChildDefinitionsArray[b].bgImg + '");background-size: cover;background-position:left top;background-repeat:no-repeat;overflow:hidden;-ms-grid-column:' + colStartingTrackNumber + ';-ms-grid-column-span:' + colSpanNumber + ';-ms-grid-row:' + rowStartingTrackNumber + ';-ms-grid-row-span:' + rowSpanNumber + ';grid-column:' + colStartingTrackNumber + ' / span ' + colSpanNumber + ';grid-row:' + rowStartingTrackNumber + ' / span ' + rowSpanNumber + ';}';

}

return (gridChildProps);
}


for (var i = 0; i < breakGrids.length; i++) {
process(breakGrids[i], breakGrids[i].name);
}