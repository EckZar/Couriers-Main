//===================================================
//====Скрипт создает UUID для каждой строки ИЗИ======
//===================================================
function fillUUID(){ 

  let main = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Оформление_V.2");

  let params = main.getRange(2, 1, main.getLastRow()-1, 15).getValues(); // Берем список имен для проверки по наличию

  params = params.map(function(arr, i)
                      { 
                        return [arr[2], // Поле Рекрутер - have to return true
                                arr[3], // Поле "ФИО кандидата" - have to return true
                                arr[11], // Поле ЛК/ИЗИ - have to return true
                                arr[14], // Поле UUID - have to return false
                                "O"+(i+2)];
                      })
                  .filter(function(e)
                          { 
                            return e[0] != "" && e[1] !="" && e[2] != "" && e[3] === ""; 
                          })
                  .forEach(function(item)
                          {
                            Logger.log(item);
                            main.getRange(item[4]).setValue(Utilities.getUuid());
                          })
 
}

//===================================================
//=====Скрипт переноса новых строк в таблицу ИЗИ=====
//===================================================
function transferIsi(){
  let newSheet = SpreadsheetApp.openById(isiSheetId).getSheetByName("Оформление_V.2");
  let uuids = newSheet.getRange(2, 15, newSheet.getLastRow()-1, 1).getValues().map(function(arr){return arr[0]});

  let range = main.getRange(2, 1, main.getLastRow()-1, 15).getValues();

  range = range.filter(function(e){ return e[14] != "" && e[11].indexOf("ИЗИ")>=0; })
               .filter(function(e){ return uuids.indexOf(e[14])<0; })
               .forEach(function(item){newSheet.getRange(getPos(item[1], isiSheetId, "Оформление_V.2"), 1, 1, 15).setValues([item]); }) 
}

//===================================================
//=========Скрипт удаления дубликатов UUID===========
//===================================================
function removeUUIDDuplicates(){

  let main = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Оформление_V.2");
  let range = main.getRange(2, 15, main.getLastRow()-1, 1).getValues().filter(function(e){ return e[0] != ""});
  let posses = main.getRange(2, 15, main.getLastRow()-1, 1).getValues().map(function(arr, i){ return [arr[0], i+2]}).filter(function(e){ return e[0] != ""});
  let inLine = range.map(function(arr){ return arr[0]});

  let duplicates = inLine.filter(onlyUnique) // Возвращаем массив объектов с параметрами uuid и строкой в таблице для uuid которые повторяются в positions более одного раза
                    .map(function(arr){                    
                      return {
                        "uuid": arr,
                        "count": inLine.filter(function(e){return e === arr}).length
                      }
                    })
                    .filter(function(e){
                      return e.count>1;
                    })
                    .forEach(function(item, i)
                    {                      
                      posses.filter(function(e)
                      {
                        return e[0] == item.uuid
                      })
                      .forEach(function(jtem, j)
                      {
                        main.getRange(jtem[1], 15).setValue("");
                      })
                    });  

  
}


//=========================================================================
//====Скрипт проверки статуса из ИЗИ и ЛК в основной таблице===============
//=========================================================================
function checks(){
  check(isiSheetId); // ИЗИ
  check("18ivjv9-ueqfF6CZl82mChEh0_JCHNHe79bwswBh7fZA"); // ЛК
}
function check(sheetId){

  let main = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Оформление_V.2");  
  let sheet = SpreadsheetApp.openById(sheetId).getSheetByName("Оформление_V.2");

  let mRange = main.getRange(2, 12, main.getLastRow()-1, 4).getValues();
  let sRange = sheet.getRange(2, 12, sheet.getLastRow()-1, 4).getValues();  

  for(let i = 0 ; i<sRange.length ; i++)
  {
    for(let j = 0 ; j<mRange.length ; j++)
    {
      if(sRange[i][3] === mRange[j][3] && mRange[j][1] != sRange[i][1])
      {
        Logger.log(sRange[i][3] + " <> " + mRange[j][3]);
        Logger.log(sRange[i][1] + " <> " + mRange[j][1]);
        Logger.log("=================================================================");
        main.getRange(j+2, 13).setValue(sRange[i][1]);
        break;
      }
    }
  }
}

//==========================================================================
//========Вспомогательная функция сравнения двух массивов===================
//==========================================================================
function compareArrs(arrOne, arrTwo){

  for(let i = 0; i<arrOne.length; i++)
  { 
    if(i == 12 || i == "12"){ break;} // Сравнение по статусу не будет проверятся.
    
    try{
      var a = arrOne[i].toString().replace(/\s/g,"").toLowerCase();
      var b = arrTwo[i].toString().replace(/\s/g,"").toLowerCase();
    }
    catch(e)
    { 
      var a = arrOne[i];
      var b = arrTwo[i];

      Logger.log(e);
      Logger.log(a);
      Logger.log(b);
      Logger.log("====================================================");
    }
    if(a != b)
    { 
      return false;
    }
    
  }
  return true;
}

function compareArrsV2(arrOne, arrTwo){

  for(let i = 0; i<arrOne.length; i++)
  { 
    if(i == 12 || i == "12"){ break;} // Сравнение по статусу не будет проверятся и обрываем проверку на этому месте что бы не проверять комментарии
    
    try{
      var a = arrOne[i].toString().replace(/\s/g,"").toLowerCase();
      var b = arrTwo[i].toString().replace(/\s/g,"").toLowerCase();
    }
    catch(e)
    { 
      var a = arrOne[i];
      var b = arrTwo[i];

      Logger.log(e);
      Logger.log(a);
      Logger.log(b);
      Logger.log("====================================================");
    }
    if(a != b)
    { 
      return i+1; // Возвращаем номер столбца который надо заменить
    }
    
  }
  return false;
}

//==================================================================================================
//====фуникция проверки статуса и отправки такого статуса в общую таблицу ЛК========================
//==================================================================================================
function checkStatus(e){
  let cell = e.range.getA1Notation();  
  Logger.log(cell)
  ~cell.indexOf("M") ? transferStatus(e) : "";
}

function transferStatus(object){
  let row = object.range.getRow();
  Logger.log(row);
  let range = main.getRange(row, 12, 1, 4).getValues();
  Logger.log(range)
  return range[0][0].indexOf("ЛК")>=0 ? ttl(range) : range[0][0].indexOf("ИЗИ")>=0 ? tti(range) : Logger.log(range[0][0] + " notFound");
}

function ttl(range){
  lk.getRange(2, 15, lk.getLastRow()-1, 1)
  .getValues()
  .map(function(arr, i){return [arr[0], i+2]})
  .filter(function(e){return e[0]===range[0][3]})
  .forEach(function(item){Logger.log(item);lk.getRange(item[1], 13).setValue(range[0][1])}); // lk.getRange(item[1], 13).setValue(range[0][1])
}

function tti(range){
  isi.getRange(2, 15, isi.getLastRow()-1, 1)
  .getValues()
  .map(function(arr, i){return [arr[0], i+2]})
  .filter(function(e){return e[0]===range[0][3]})
  .forEach(function(item){Logger.log(item);isi.getRange(item[1], 13).setValue(range[0][1])}); // lk.getRange(item[1], 13).setValue(range[0][1])
}

//=============================================================================
//========Вспомогательные функции поиска позиции для сортировки по дате========
//=============================================================================
function getPos(date, sheetId, sheetName){

  date = new Date(date).getTime();


  let isiSheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
  let dates = isiSheet.getRange(2, 2, isiSheet.getLastRow()-1, 1).getValues();

  for(let i = 0; i<dates.length; i++)
  {
    let a = new Date(dates[i]).getTime();
    if(date <= a)
    {
      isiSheet.insertRows(i+2, 1);
      return i+2;
    }
  }
  
  return isiSheet.getLastRow()+1;
}

function getPosTwo(date){

  date = new Date(date).getTime();


  let isiSheet = SpreadsheetApp.openById(isiSheetId).getSheetByName("Оформление");
  let dates = isiSheet.getRange(2, 1, isiSheet.getLastRow()-1, 1).getValues();

  for(let i = 0; i<dates.length; i++)
  {
    let a = new Date(dates[i]).getTime();
    if(date <= a)
    {
      return i+2;
    }
  }
  
  return isiSheet.getLastRow()+1;
}


//=============================================================================
//========Вспомогательные функции поиска дубликатов в массиве==================
//=============================================================================
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}



