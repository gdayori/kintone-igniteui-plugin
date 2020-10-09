//KintoneのRecordsをフラットなjsonData構造に変換して返す。
function createJsonDatasetsFromKintoneRecords(records){
    var jsonData = [];
    for(var recordKey in records){
        var addedRecord = {};
        for(var key in records[recordKey]){
            //各セル単位の情報の取得
            var targetObject = records[recordKey][key];

            //列の属性に合わせてスキップ有無や格納するコンテンツを変える
            switch (targetObject["type"]){
              case "SUBTABLE":
                break;
              case "__ID__":  //ID及びリビジョンは$マークを変換する(igGridの仕様のため$マークを使わない)
              case "__REVISION__":
                addedRecord[key.replace("$","__")] = targetObject["value"];
                break;
              case "DATE":  //日付項目はスラッシュ区切りに変換
                addedRecord[key] = new Date(targetObject["value"].split("-").join("/"));
                break;
              case "NUMBER":  //数値項目は数値として格納
              case "CALC":
                addedRecord[key] = Number(targetObject["value"]);
                break;
              case "USER_SELECT":  //ユーザ選択(複数あり得る？先頭だけ取得)
                addedRecord[key] = (targetObject["value"].length > 0) ? targetObject["value"][0]["name"]: "";
                break;
              case "MODIFIER":  //更新者、作成者はname属性から値を取得
              case "CREATOR":
                addedRecord[key] = targetObject["value"]["name"];
                break;
              default:   //上記以外のケースはvalueをそのまま格納:
                addedRecord[key] = targetObject["value"];
                break;
            }
        };
        //jsonデータとして蓄積する。
        jsonData.push(addedRecord);
    };
    return jsonData;
}

//日付をKintoneの形式にして返す。
function formatDateToKintoneDate(igDate){
    var num = Number(igDate.match(/\d/g).join(""));
    var date = new Date(num);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
      
    if ( month < 10 ) month = '0' + month;
    if ( day < 10 ) day = '0' + day;
      
    return year + '-' + month + '-' + day;
}

//KintoneのRecordsをフラットなjsonData構造に変換して返す。
function createColumnsFromKintoneRecords(records){
  var columns = [];
  var firstRecord = records[0];
  for(var key in firstRecord){
    var column = {headerText: key, key: key, dataType: "string", width: "100px", hidden: false};

    var field = firstRecord[key];

    console.log(field["type"]);
    // ************************************************
    // ***重要***　ここはすべての列属性を精査する必要あり。
    // ************************************************
    switch (field["type"]){
      case "SUBTABLE":
        continue;
      case "__REVISION__":
        column.headerText = "Revision";
        column.key = "__revision";
        column.hidden = true;
        break;

      case "__ID__":  //ID列は非表示で保持
      column.headerText = "ID";
      column.key = "__id";
      column.hidden = true;
        break;
      case "DATE":  //日付項目
      case "UPDATED_TIME":  //更新日
      case "CREATED_TIME":   //作成日
        column.dataType = "date";
        column.width = "110px";
        column.format = "yyyy-MM-dd";
        break;
      case "NUMBER":  //数値項目は数値として格納
      case "CALC":
        column.dateType = "number";
        column.width = "70px";
        break;
      case "USER_SELECT":  //ユーザ選択
      case "MODIFIER":  //更新者
      case "CREATOR":   //作成者
        break;
      default:
        break;
    }
    columns.push(column);
  };
  return columns;
}