/**
 * Html Print v 1.0
 * Author: joeycrash135
 * Inspired by AllegiantInc
 */
var HtmlPrint = function() {
    //debugmode
    var debug = false;
    //core print
    var initialized = false;
    var printStyle;
    var imageStyle;
    var pageStyle; //holding page settings for current report set to print
    var printContainer;
    var imageContainer;
    var stackCount = 0;
    var pageSize;
    var elementWidth;
    var elementHeight;
    //var orientation;
    //page settings
    var orientation;
    //defaults

    var Init = function() {
        printContainer = document.getElementById("html-print-container");
        printStyle = document.getElementById("html-print-style");
        //console.log("initializing HTML Print v 0.9");
        if(!printStyle) InitStyle();
        if(!printContainer) InitContainer();

        SetPageSize();
        initialized = true;
        return printContainer;
    };

    var InitStyle = function() {
        var head = document.getElementsByTagName('head')[0];
        printStyle = document.createElement('style');
        imageStyle = document.createElement('style');
        pageStyle = document.createElement('style');
        printStyle.id = "html-print-style";
        imageStyle.id = "html-image-style";
        pageStyle.id = "html-print-page-style";
        printStyle.setAttribute('type', 'text/css');
        imageStyle.setAttribute('type', 'text/css');
        //printStyle.setAttribute('media', 'print');
        printStyle.appendChild(document.createTextNode(
            '#html-print-container, #html-print-container * {visibility: hidden;} ' +
            '#html-print-container {position: absolute; left: 0;top: 0;}'
        ));
        printStyle.appendChild(document.createTextNode(
            '@media print { ' +
            'body .no-print {visibility: hidden; display:none !important;} ' +
            '#html-print-container, #html-print-container * {display:block; font-size: 10pt; margin:0; padding:0; visibility: visible;} ' +
            '#html-print-container > div {} ' +
            '#html-print-container > *:last-child {page-break-after: auto} ' +
            'span, strong{display:inline-flex !important; width:auto;} ' +
            '.label {display:inline-block;} ' +
            '.form-control-static{display:inline;padding:0 0 0 1mm !important;} ' +
            '.print-hr{display:block; border: 0.5mm solid black;margin-top:10mm!important;} ' +
            '@page{size: auto; margin: 10mm 10mm 10mm 10mm;}' +
            '}'));
        printStyle.appendChild(document.createTextNode(
            '@media print {' +
            '#html-print-container table{display:table; font-size: 7pt;} ' +
            '#html-print-container tbody{display:table-row-group;} ' +
            '#html-print-container tr{display:table-row;}  ' +
            '#html-print-container td,th{display:table-cell;overflow-x:hidden;white-space: nowrap;}' +
            '}'));
        imageStyle.appendChild(document.createTextNode(
            '#html-image-container .no-print {visibility: hidden; display:none !important;} ' +
            '#html-image-container {visibility: visible; background: #fff; padding:10mm;} ' +
            '#html-image-container * {visibility: visible;} ' +
            '#html-image-container, #html-image-container * {display:block; font-size: 10pt; margin:0; padding:0; visibility: visible;}' +
            '#html-image-container span, #html-image-container span strong{display:inline-flex !important; width:auto;}' +
            '#html-image-container .label {display:inline-block;} ' +
            '#html-image-container .form-control-static {display:inline;padding:0 0 0 1mm !important;} ' +
            '#html-image-container .print-hr{display:block; border: 0.5mm solid black;margin-top:10mm!important;} ' +
            '#html-image-container table{display:table; font-size: 7pt;} #html-image-container tbody{display:table-row-group;} ' +
            '#html-image-container tr{display:table-row;} #html-image-container td,th{display:table-cell;overflow-x:hidden;white-space: nowrap;}'
        ));

        if(debug) {
            printStyle.appendChild(document.createTextNode(
                '@media print { .form-control-static {outline: 0.25mm solid orange;}.control-label {outline: 0.25mm solid blue;} }'));
        }

        head.appendChild(printStyle);
        head.appendChild(imageStyle);
        head.appendChild(pageStyle);
    };

    var SetPageSize = function(_pageSize, _orientation) {
        if(!pageStyle) InitStyle();

        if(_pageSize != "Legal") _pageSize = "Letter";
        if(_orientation != "L") _orientation = "P";

        pageSize = _pageSize.toLowerCase();
        orientation = _orientation.toLowerCase();

        var s, o, w, h = "";
        var dim = [];

        switch (_pageSize) {
            case "Letter":
                s = "letter";
                dim = [8.5, 11];
                break;
            case "Legal":
                s = "legal";
                dim = [8.5, 14];
                break;
        }
        switch (_orientation) {
            case "L":
                o = "landscape";
                w = dim[1];
                h = dim[0];
                break;
            case "P":
                o = "portrait";
                w = dim[0];
                h = dim[1];
                break;
        }

        pageStyle.innerHTML = "";
        var cssRule = '@media print {@page {size:' + s + ' ' + o + '};}';
        if(w) {
            elementWidth = w + "in";
            //var containerRule = '@media print {#html-print-container {width:'+containerWidth+'}; }';
            //pageStyle.appendChild(document.createTextNode(containerRule));
        }
        if(h) {
            elementHeight = h + "in";
            //var containerRule = '@media print {#html-print-container {width:'+containerWidth+'}; }';
            //pageStyle.appendChild(document.createTextNode(containerRule));
        }

        /*@page:left{
         @bottom-left {
         content: "Page " counter(page) " of " counter(pages);
         }
         }*/

        pageStyle.appendChild(document.createTextNode(cssRule));

        //console.log("setting page size", cssRule);

    };


    var InitContainer = function() {
        printContainer = document.createElement("div");
        imageContainer = document.createElement("div");
        if(debug) printContainer.style['outline'] = '1mm solid green';
        printContainer.style['height'] = 'auto';
        printContainer.style['width'] = '100%';
        printContainer.style['page-break-before'] = 'auto';
        printContainer.style['page-break-inside'] = 'auto';
        printContainer.style['page-break-after'] = 'auto';
        printContainer.id = "html-print-container";
        imageContainer.id = "html-image-container";
        //printContainer.style["display"] = 'none';
        document.body.appendChild(printContainer);
        document.body.appendChild(imageContainer);
        //console.log("printContainer:", $(printContainer).width(), $(printContainer).height());
    };

    var PrintContent = function() {
        var lastElement = GetElementById("html-print-element-" + (stackCount - 1));
        //lastElement.style['height'] = 'auto';
        lastElement.style['page-break-before'] = 'auto';
        lastElement.style['page-break-inside'] = 'avoid';
        lastElement.style['page-break-after'] = 'auto';
        window.print();
        console.log("printing", $(printContainer).width(), $(printContainer).height());
    };

    var ImageContent = function() {
        var container = GetElementById("html-image-container");
        var lastElement = GetElementById("html-print-element-" + (stackCount - 1));
        //lastElement.style['height'] = 'auto';
        lastElement.style['page-break-before'] = 'auto';
        lastElement.style['page-break-inside'] = 'avoid';
        lastElement.style['page-break-after'] = 'auto';
        //window.print();

        if(html2canvas != undefined) {
            //var reportHTML = $("#html-print-container").clone().attr("id", "html-img-container");
            //$("body").append(reportHTML);
            //console.log(, reportHTML);
            var reportHTML = $.parseHTML($("#html-print-container").html());
            $(container).width(inch2px(elementWidth.replace("in", "")));
            container.append(reportHTML[0]);
            console.log("repHTML", reportHTML, "w:", elementWidth, "h:", elementHeight);
            //console.log($(printContainer).width(), $(printContainer).height());
            //console.log(inch2px(elementWidth.replace("in","")), inch2px(elementHeight.replace("in","")));
            //container.className = "image-output";
            //container.addClass("image-output");
            var myImage;
            html2canvas(container, {
                onrendered: function(canvas) {
                    // canvas is the final rendered <canvas> element
                    //myImage = canvas.toDataURL("image/png");

                    var img = new Image();
                    img.src = canvas.toDataURL("image/png");
                    img.width = inch2px(elementWidth.replace("in", ""));
                    /*var link = $("<a></a>");
                     link.attr("href", myImage).attr("download", "test-report");
                     link.appendTo("#html-print-container");
                     link.click();
                     console.log(link);*/

                    //Construct the a element
                    var link = document.createElement("a");
                    link.download = "comps-report.png";
                    link.target = "_blank";

                    // Construct the uri
                    link.href = img.src;
                    document.body.appendChild(link);
                    link.click();
                },
                background: "#FFF",
                width: inch2px(elementWidth.replace("in", "")),
                height: inch2px(elementHeight.replace("in", ""))

            });

            $(container).html("").height(0);
            //container.className = "";
        } else {
            alert("Unable to create image. See console");
            console.log("html2canvas library required for image output");
        }
        console.log("ImageContent", html2canvas != undefined);
        //console.log("printing", $(printContainer).width(), $(printContainer).height());
    };

    var ClearContainers = function() {
        $(printContainer).html("").height(0);
        $(imageContainer).html("").height(0);
    };

    var GetElementById = function(id) {
        return document.getElementById(id);
    };

    var AddElementByID = function(elementId, pageBreak) {
        if(!initialized) {
            console.log("HTML Print not initialized!");
            return false;
        }
        var pageWrapper = document.createElement("div");
        var elementToCopy = document.getElementById(elementId);
        var elementToPrint = elementToCopy.cloneNode(true);
        pageWrapper.id = "html-print-element-" + stackCount;
        elementToPrint.id = "element" + stackCount;
        if(debug) pageWrapper.style['outline'] = '1px solid red';
        pageWrapper.style['height'] = '98%';
        pageWrapper.style['width'] = '100%';
        pageWrapper.style['display'] = 'block';
        /*elementToPrint.style['margin'] = '0';
         elementToPrint.style['padding'] = '0';*/
        //pageWrapper.style['height'] = '100%';
        //elementToPrint.className
        if(pageBreak) {
            pageWrapper.style['page-break-before'] = 'always';
            pageWrapper.style['page-break-inside'] = 'avoid';
            pageWrapper.style['page-break-after'] = 'always';
        }

        pageWrapper.appendChild(elementToPrint);
        printContainer.appendChild(pageWrapper);
        ++stackCount;
        //console.log("HTML Print add() - stackCount:", stackCount);
        //console.log("HTML Print - elementToPrint info:", $(elementToPrint).width(), $(elementToPrint).height());
        //console.log("HTML Print - container:", printContainer, $(printContainer).width(), $(printContainer).height());
    };

    var AddHTMLObject = function(element, pageBreak, divider) {
        if(!initialized) {
            console.log("HTML Print not initialized!");
            return false;
        }
        var pageWrapper = document.createElement("div");
        var elementToPrint = element;
        console.log("AddHTMLObject", elementToPrint, element, divider);
        pageWrapper.id = "html-print-element-" + stackCount;
        elementToPrint.id = "element" + stackCount;
        if(debug) pageWrapper.style['outline'] = '1px solid red';
        pageWrapper.style['width'] = '100%';
        pageWrapper.style['height'] = 'auto';
        pageWrapper.style['display'] = 'block';

        if(pageBreak) {
            pageWrapper.style['page-break-before'] = 'always';
            pageWrapper.style['page-break-inside'] = 'avoid';
            pageWrapper.style['page-break-after'] = 'always';
            //pageWrapper.style['width'] = '99%';
        } else {
            pageWrapper.style['page-break-inside'] = 'auto';
            pageWrapper.style['page-break-before'] = 'auto';
            pageWrapper.style['page-break-after'] = 'auto';
        }

        $(pageWrapper).append(elementToPrint);

        if(divider) {
            var div = $("<div></div>");
            div.addClass("print-hr");
            $(pageWrapper).append(div);
        }

        $(printContainer).append(pageWrapper);
        ++stackCount;
        console.log("HTML Print addHTMLObject() - stackCount:", stackCount);
        console.log("HTML Print - elementToPrint info:", $(elementToPrint).width(), $(elementToPrint).height());
        console.log("HTML Print - container:", printContainer, $(printContainer).width(), $(printContainer).height());
        return true;
    };

    var AddHTMLObjectAsPage = function(element) {
        if(!initialized) {
            console.log("HTML Print not initialized!");
            return false;
        }

        var pageWrapper = document.createElement("div");
        var elementToPrint = element;

        console.log("AddHTMLObjectAsPage", elementToPrint);
        pageWrapper.id = "html-print-element-" + stackCount;

        elementToPrint.id = "element-" + stackCount;
        if(debug) pageWrapper.style['outline'] = '1px solid red';
        printContainer.style['margin'] = "0 !important";
        pageWrapper.style['width'] = "8.5in";
        pageWrapper.style['height'] = "11in";
        pageWrapper.style['display'] = 'block';
        pageWrapper.style['page-break-inside'] = 'auto';
        pageWrapper.style['page-break-before'] = 'auto';
        pageWrapper.style['page-break-after'] = 'always';

        /*if(pageBreak) {
         pageWrapper.style['page-break-after'] = 'always';
         //pageWrapper.style['width'] = '99%';
         } else {

         }*/

        $(pageWrapper).append(elementToPrint);

        /*if(divider) {
         var div = $("<div></div>");
         div.addClass("print-hr");
         $(pageWrapper).append(div);
         }*/

        $(printContainer).append(pageWrapper);
        ++stackCount;
        console.log("HTML Print addHTMLObjectAsPage() - stackCount:", stackCount);
        //console.log("HTML Print - elementToPrint info:", $(elementToPrint).width(), $(elementToPrint).height());
        //console.log("HTML Print - container:", printContainer, $(printContainer).width(), $(printContainer).height());
        return true;
    };

    //* CREATE TABLE *//
    var CreatePrintTable = function(headerArray, rowArray, widthsArray, repeatHeaderEveryNthRow) {
        //for now page setup will be hardcoded here
        SetPageSize("Letter", "L"); //default for table pages, set swap later
        var headerCount = headerArray.length;
        var totalRows = rowArray.length;
        var columnCount = rowArray[0].length;
        var rowLoopCount = 0;
        var tempTbody;

        if(isNaN(repeatHeaderEveryNthRow) || repeatHeaderEveryNthRow < 1) repeatHeaderEveryNthRow = 0;

        console.log("making a table", headerCount, columnCount, headerCount != columnCount);
        if(headerCount != columnCount) return false;

        //make the table
        var table = document.createElement("table");
        if(debug) table.style['border'] = '1px solid blue';
        table.id = "html-print-table";

        //loop through each row
        rowArray.forEach(function(cells, rowIndex) {
            if(rowLoopCount == 0 && rowIndex > 0) {
                tempTbody = table.appendChild(document.createElement('tbody'));
                if(debug) tempTbody.style['border'] = '1px solid red';
                //tempTbody.id = "tbody-" + rowIndex;
                tempTbody.className = "html-print-break";
                CreatePrintHeaderAsRow(tempTbody, headerArray);
            }

            var row = table.insertRow();
            //loop to create cells
            cells.forEach(function(value, cellIndex) {
                //console.log("Cells info", value, cellIndex);
                var cell = row.insertCell(cellIndex);
                cell.innerHTML = value;
            });

            if(repeatHeaderEveryNthRow && repeatHeaderEveryNthRow > 0) {
                if(rowLoopCount == repeatHeaderEveryNthRow - 1) {
                    rowLoopCount = 0;
                    //table.appendChild(tbody);
                } else {
                    rowLoopCount++;
                }
            }

        });

        //make the header
        CreatePrintHeader(table, headerArray, widthsArray);
        return table;

        //console.log("HTML Print CreatePrintTable() - columnCount:", columnCount);
        //console.log("HTML Print - container:", printContainer, $(printContainer).width(), $(printContainer).height());
    };

    var CreatePrintMultiTable = function(headerArray, rowArray, widthsArray, maxRowsPerTable, tableStyle) {
        var headerCount = headerArray.length;
        var totalRows = rowArray.length;
        var columnCount = rowArray[0].length;
        var rowLoopCount = 0;
        var tableCount = 0;
        //var pageHeight = getPageMaxHeight();

        if(isNaN(maxRowsPerTable) || maxRowsPerTable < 1) maxRowsPerTable = 0;

        console.log("making a table", headerCount, columnCount, headerCount != columnCount);
        if(headerCount != columnCount) return false;

        //make the table
        var table, wrapper, container;
        container = document.createElement("div");

        //make the header
        rowArray.forEach(function(cells, rowIndex) {
            if(rowLoopCount == 0) {
                wrapper = document.createElement("div");
                table = document.createElement("table");

                wrapper.appendChild(table);
                container.appendChild(wrapper);

                if(debug) table.style['border'] = '1px solid blue';
                if(debug) wrapper.style['border'] = '1px solid #FF0';

                table.className = "html-print-table";
                if(tableStyle == "striped") {
                    table.className = "html-print-table striped";
                } else {
                    table.className = "html-print-table";
                }
                table.id = "html-print-multi-table-" + tableCount;
                if(tableCount > 0) wrapper.className = "html-print-break";
                tableCount++;
                CreatePrintHeaderAsRow(table, headerArray);
            }

            var row = table.insertRow();
            cells.forEach(function(value, cellIndex) {
                var cell = row.insertCell(cellIndex);
                cell.innerHTML = value;
            });

            if(maxRowsPerTable && maxRowsPerTable > 0) {
                if(rowLoopCount == maxRowsPerTable - 1) {
                    rowLoopCount = 0;
                } else {
                    rowLoopCount++;
                }
            }

        });

        return container;
    };

    var CreateDualRowPrintMultiTable = function(headerArray, rowArray, widthsArray, maxRowsPerTable) {
        var headerCount = headerArray.length;
        var totalRows = rowArray.length;
        var columnCount = rowArray[0].length;
        var rowLoopCount = 0;
        var tableCount = 0;
        //var pageHeight = getPageMaxHeight();

        if(isNaN(maxRowsPerTable) || maxRowsPerTable < 1) maxRowsPerTable = 0;

        console.log("making a table", headerCount, columnCount, headerCount != columnCount);
        if(headerCount != columnCount) return false;

        var splitHeaders = SplitRowData(headerArray);

        //make the table
        var table, wrapper, container, tbody;
        container = document.createElement("div");
        rowArray.forEach(function(cells, rowIndex) {
            if(rowLoopCount == 0) {
                wrapper = document.createElement("div");
                table = document.createElement("table");
                wrapper.style['border'] = '1pt solid #000';
                wrapper.appendChild(table);
                container.appendChild(wrapper);

                if(debug) table.style['border'] = '1px solid blue';
                if(debug) wrapper.style['border'] = '1px solid #FF0';

                table.className = "html-print-table extras";
                table.id = "html-print-multi-table-" + tableCount;
                if(tableCount > 0) wrapper.className = "html-print-break";

                tableCount++;
            }

            var splitRows = SplitRowData(cells);
            tbody = document.createElement('tbody');
            splitRows.forEach(function(cells, cellIndex) {
                CreatePrintHeaderAsRow(tbody, splitHeaders[cellIndex % 2]);
                var row = tbody.insertRow();
                cells.forEach(function(value, cellIndex) {
                    var cell = row.insertCell(cellIndex);
                    cell.innerHTML = value;
                });

            });
            table.appendChild(tbody);

            if(maxRowsPerTable && maxRowsPerTable > 0) {
                if(rowLoopCount == maxRowsPerTable - 1) {
                    rowLoopCount = 0;
                } else {
                    rowLoopCount++;
                }
            }

        });

        return container;
    };

    //$(row).css({'position':'absolute','visibility':'hidden', 'display':'block'});
    //$(row).removeAttr('style');

    function getPageMaxWidth() {
        var _width = 0;
        switch (pageSize) {
            case "Letter":
                _width = orientation == "P" ? 196 : 259;
                break;
            case "Legal":
                _width = orientation == "P" ? 190 : 277;
                break;
        }
        console.log("MAX PAGE WIDTH", _width, pageSize, orientation);
        return _width;
    }

    function inch2px(inches) {
        $("body").append("<div id='inch2px' style='width:1in;height:1in;display:hidden;'></div>");
        var pixels = $("#inch2px").width();
        $("#inch2px").remove();

        return inches * pixels;
    }

    function px2inch(px) {
        $("body").append("<div id='inch2px' style='width:1in;height:1in;display:hidden'></div>");
        var pixels = $("#inch2px").width();
        $("#inch2px").remove();
        return px / pixels;
    }

    function px2mm(px) {
        return px2inch(px) * 25.4;
    }

    function getPageMaxHeight() {
        var _height = 0;
        switch (pageSize) {
            case "Letter":
                //_height = orientation == "P" ? 280 : 216;
                var w = 8.5;
                var h = 11;
                _height = orientation == "P" ? inch2px(h) : inch2px(w);
                break;
            case "Legal":
                //_height = orientation == "P" ? 297 : 210;
                var w = 8.5;
                var h = 14;
                _height = orientation == "P" ? inch2px(h) : inch2px(w);
                break;
        }
        console.log("MAX PAGE HEIGHT", _height, pageSize, orientation);
        return _height;
    }

    function getSize(element) {
        var $wrap = $("<div />").appendTo($("body"));
        $wrap.css({
            "position": "absolute !important",
            "visibility": "hidden !important",
            "display": "block !important"
        });

        $clone = $(element).clone().appendTo($wrap);
        sizes = {
            "width": $clone.width(),
            "height": $clone.height()
        };

        $wrap.remove();

        return sizes;
    }

    var SplitRowData = function(rowData) {
        var rowCount = rowData.length;
        if(rowCount < 1) return false; //if no data, return false
        if(rowCount % 2 != 0) rowData.push(""); //if count is uneven, add a blank value
        var rowDataB = rowData.splice(0, rowData.length / 2); //split the rowData into 2 parts

        //console.log("SplitRowData(rowData)", rowData);
        //console.log("rowCount less than 1", rowCount < 1);
        //console.log("rowCount is uneven?", rowCount % 2 != 0, rowCount);
        //console.log("rowDataB count:", rowDataB.length, rowDataB);
        //console.log("rowData count:", rowData.length, rowData);
        return [rowDataB, rowData]; //return the rowData separated, for some reason I had to flip the arrays or else they show up in the wrong order
    };

    var CreatePrintHeader = function(table, headerArray, widthsArray) {
        var header = table.createTHead();
        var headerRow = header.insertRow();

        headerArray.forEach(function(value, index) {
            var cell = headerRow.insertCell(index);
            cell.innerHTML = value;
            cell.style.width = (widthsArray[index] != undefined) ? widthsArray[index] : "auto";
            console.log("CreatePrintTable header:", value);
        });

        return header;
    };

    var CreateDualPrintHeader = function(table, headerArray, widthsArray) {
        var header = table.createTHead();
        var rowHeaders = SplitRowData(headerArray);
        //loop through each row to add the cells
        rowHeaders.forEach(function(rowData) {
            var headerRow = header.insertRow();
            rowData.forEach(function(value, index) {
                var cell = headerRow.insertCell(index);
                cell.innerHTML = value;
                cell.style.width = (widthsArray[index] != undefined) ? widthsArray[index] : "auto";
            });
        });

        return header;
    };

    var CreatePrintHeaderAsRow = function(tableElement, headerArray) {
        var row = tableElement.insertRow();
        row.className = "html-print-theader";
        headerArray.forEach(function(value, index) {
            var cell = row.insertCell(index);
            cell.innerHTML = value;
        });

        return row;
    };

    //todo remove or repurpose
    var CreatePrintDualHeaderAsRow = function(tableElement, headerArray) {
        var splitData = SplitRowData(headerArray);
        var rows = "";
        splitData.forEach(function(rowData) {
            var row = tableElement.insertRow();
            row.className = "html-print-theader";
            rowData.forEach(function(value, index) {
                var cell = row.insertCell(index);
                cell.innerHTML = value;
            });
            rows = rows + row;
        });

        return rows;
    };

    //* PAGE SIZE SET *//
    var Clear = function() {
        printContainer.innerHTML = "";
        //SetPageSize("Letter", "P");
        stackCount = 0;
        return true;
    };
    //* END:CORE HANDLERS *//

    return {
        output: function(type) {
            if(!type || type == "print") {
                return PrintContent();
            } else if(type == "png") {
                return ImageContent();
                console.log("HTML PRINT AS PNG");
            } else if(type == "pdf") {
                console.log("HTML PRINT AS PDF DOWNLOAD");
            }
            return false;
        },
        print: function() {
            if(!printContainer) return false;
            return PrintContent();
        },
        addByID: function(elementID, pageBreak) {
            if(!elementID) return false;
            return AddElementByID(elementID, pageBreak);
        },
        addHTMLObject: function(htmlObject, pageBreak, divider) {
            if(!htmlObject) return false;
            return AddHTMLObject(htmlObject, pageBreak, divider);
        },
        addHTMLObjectAsPage: function(htmlObject) {
            if(!htmlObject) return false;
            return AddHTMLObjectAsPage(htmlObject);
        },
        createTable: function(headerArray, rowArray, widthsArray, repeatHeaderEveryNthRow) {
            if(!headerArray || !rowArray) return false;
            return CreatePrintTable(headerArray, rowArray, widthsArray, repeatHeaderEveryNthRow);
        },
        createMultiTable: function(headerArray, rowArray, widthsArray, maxRowsPerTable, tableStyle) {
            if(!headerArray || !rowArray) return false;
            return CreatePrintMultiTable(headerArray, rowArray, widthsArray, maxRowsPerTable, tableStyle);
        },
        createDualRowMultiTable: function(headerArray, rowArray, widthsArray, maxRowsPerTable, tableStyle) {
            if(!headerArray || !rowArray) return false;
            return CreateDualRowPrintMultiTable(headerArray, rowArray, widthsArray, maxRowsPerTable, tableStyle);
        },
        setPageSize: function(pageSize, orientation) {
            if(!pageSize || !orientation) return false;
            return SetPageSize(pageSize, orientation);
        },
        clear: function() {
            return Clear();
        },
        clearContainers: function() {
            return ClearContainers();
        },
        test: function() {
            return CreateDualPrintHeader();
        },
        /**
         * Initialize the HTMLPrint container element.
         * @constructor
         *
         */
        init: function(containerId) {
            return Init(containerId);
        },
        count: function() {
            return stackCount;
        }

    };

}();
