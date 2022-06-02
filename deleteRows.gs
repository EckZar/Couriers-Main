//=============================================================================
//========Функция удаления сотрудников ЛК из таблиц ИЗИ========================
//=============================================================================
function deleteLKRows(){ 
  
  let range = isi.getRange(2, 12, isi.getLastRow()-1, 1).getValues();
  for(let i = range.length-1; i >= 0 ; i--)
  { 
    if(range[i][0].indexOf("ЛК")>=0)
    {
      Logger.log(isi.getRange(i+2, 1, 1, 15).getValues());
      isi.deleteRow(i+2);
    }
  }
     
}

//==================================================================================================
//================================фуникция удаления дубликатов======================================
//==================================================================================================
function removeDuplicatesByUUID(){  
  Logger.log("Удаляем дубликаты строк");
  isi.getRange(2, 1, isi.getLastRow()-1, isi.getLastColumn()).removeDuplicates([15]);
}


//============================================================================================
//================фуникция проверки строк по UUID и удаление не совпадений====================
//============================================================================================
function removeUnrecognizedUUID(){
  
  let mainUUIDs = main.getRange(2, 15, main.getLastRow()-1, 1).getValues();

  mainUUIDs = mainUUIDs.filter(function(e){ return e[0] !=""}).map(function(arr){ return arr[0] });
 
  let isiUUIDs = isi.getRange(2, 15, isi.getLastRow()-1, 1).getValues();

  isiUUIDs = isiUUIDs.map(function(arr, i) // Для каждого UUID возвращаем UUID и номер строки
                          { 
                            return [arr[0], i+2]
                          })
                    .filter(function(e) // Для каждого UUID из ИЗИ фильтруем по отсутствию в списке UUIDs из главной таблицы
                          { 
                            return mainUUIDs.indexOf(e[0])<0 
                          });
  
  for(let i = isiUUIDs.length-1; i >= 0 ; i--)
  { 
    Logger.log(isi.getRange(isiUUIDs[i][1], 1, 1, 15).getValues());
    isi.deleteRow(isiUUIDs[i][1]);
  }

}
