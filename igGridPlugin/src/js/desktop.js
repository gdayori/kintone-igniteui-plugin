jQuery.noConflict();

(function($, PLUGIN_ID) {
  'use strict';

  kintone.events.on('app.record.index.show', function(event) {
    var config = kintone.plugin.app.getConfig(PLUGIN_ID);

    if (!($("#grid").length)) {
        return;
    }
    
    //データ取得
    var jsonData = createJsonDatasetsFromKintoneRecords(event.records);

    //グリッド生成
    $("#grid").igGrid({
        primaryKey: "__id",
        width: "100%",
        height: "600px",
        dataSource: jsonData,   
        autoGenerateColumns: false,
        autofitLastColumn : false,
        columns: JSON.parse(config.columns),
        features : [
            {
                name: "Updating",
                editMode: "cell",
                enableAddRow: false,
                enableDeleteRow: false,
                excelNavigationMode: false,
            },
            {
                name : "ColumnMoving"
            },
            {
                name: "Resizing"
            },
            {
                name: "Filtering"
            },
            {
                name: "Sorting"
            }
        ]
    });

    // var spaceElement = kintone.app.getHeaderSpaceElement();
    // var fragment = document.createDocumentFragment();
    // var headingEl = document.createElement('h3');
    // var messageEl = document.createElement('p');

    // messageEl.classList.add('plugin-space-message');
    // messageEl.textContent = config.message;
    // headingEl.classList.add('plugin-space-heading');
    // headingEl.textContent = 'Hello kintone plugin!';

    // fragment.appendChild(headingEl);
    // fragment.appendChild(messageEl);
    // spaceElement.appendChild(fragment);
  });

})(jQuery, kintone.$PLUGIN_ID);
