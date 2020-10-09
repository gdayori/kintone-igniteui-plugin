jQuery.noConflict();

(function($, PLUGIN_ID) {
  'use strict';

  console.log("kita0");

  var $form = $('.js-submit-settings');
  var $cancelButton = $('.js-cancel-button');
  var $message = $('.js-text-message');
  var config = kintone.plugin.app.getConfig(PLUGIN_ID);
  var appId = kintone.app.getId();
  var records;
  

  console.log("kita1");

  var renderGrid = function(resp){
    records = resp.records;

    console.log("records");
    console.log(records);

    var jsonData = createJsonDatasetsFromKintoneRecords(records);
    var columns;
    if(config.columns){
      columns = JSON.parse(config.columns);
    }else{
      columns = createColumnsFromKintoneRecords(records);
    }

    console.log("jsonData");
    console.log(jsonData);
    console.log("columns");
    console.log(columns);
  
    var gridWidth = document.body.clientWidth - 350;
    var gridHeight = document.body.clientHeight - 400;

    $("#grid").igGrid({
      dataSource: jsonData,
      autoGenerateColumns: false,
      autofitLastColumn : false,
      columns: columns,
      width: gridWidth,
      height: gridHeight,
      features : [
        {
            name : "Hiding",
            columnSettings: [
              { columnKey: "__id", allowHiding: false },
              { columnKey: "__revision", allowHiding: false },
            ]
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
  };

  kintone.api(
    kintone.api.url('/k/v1/records', true),
    'GET',
    {'app': appId,
    "query": "order by __id asc limit 10",
      "size": 10},
    renderGrid,
    function(error) {
      // error
      console.log(error);
      alert("データを取得できませんでした。");
    }
  );

  $('#saveButton').click(function (e) {
    var gridColumns = JSON.stringify($('#grid').igGrid('option', 'columns'));

    kintone.plugin.app.setConfig({columns: gridColumns}, function() {
      console.log(gridColumns);
      console.log("saved");
      alert('設定を保存しました。');
      window.location.href = '../../flow?app=' + appId;
    });
  });
  


  // if (config.message) {
  //   $message.val(config.message);
  // }
  // $form.on('submit', function(e) {
  //   e.preventDefault();
  //   kintone.plugin.app.setConfig({message: $message.val()}, function() {
  //     alert('The plug-in settings have been saved. Please update the app!');
  //     window.location.href = '../../flow?app=' + kintone.app.getId();
  //   });
  // });
  // $cancelButton.on('click', function() {
  //   window.location.href = '../../' + kintone.app.getId() + '/plugin/';
  // });
})(jQuery, kintone.$PLUGIN_ID);