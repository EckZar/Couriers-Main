//==========================================================================
function syncWithIsi(){ // Функция синхронизации массива данных строк ИЗИ из главной таблицы, в таблице ИЗИ
  
  isiRangeFromMain = main.getRange(2, 1, main.getLastRow()-1, 15).getValues(); // Заходим в отдельну таблицу ИЗИ региона
  let rangeInIsiSheet = isi.getRange(2, 1, isi.getLastRow()-1, 15).getValues(); // Берем все данные что там есть

  for(let i = 0; i<isiRangeFromMain.length; i++) // начинаем обход по массиву данных ИЗИ из главной таблицы
  {
    for(let j = 0; j<rangeInIsiSheet.length; j++) // начинаем обход по массиву данных ИЗИ из отдельной таблицы для ИЗИ
    {
      if(isiRangeFromMain[i][14] === rangeInIsiSheet[j][14]) // Отдельно сравниваем UUID из каждой строки. If TRUE Идем ниже и делавем полную проверку строк
      { 
        let arrOne = isiRangeFromMain[i].slice(0,-3);
        let arrTwo = rangeInIsiSheet[j].slice(0,-3);
        let diff = compareArrsV2(arrOne, arrTwo);
        if(diff) // проверка расхождений в ячейках строки
        { 
          Logger.log("ISI - " + " " + isiRangeFromMain[i][14] + " <> " + rangeInIsiSheet[j][14] + enterString +
          "fromMain - " + isiRangeFromMain[i] + enterString +
          "fromIsi - " + rangeInIsiSheet[j] + enterString +
          "wrongCell - " + diff + enterString +
          "row - " + (j+2) + enterString +
          "==========================================================================================================");
          isi.getRange(j+2, 1, 1, arrOne.length).setValues([arrOne]); // Если есть отличия, заменяем на новую строку из общей таблицы  
        }
        break;
      }
    }
  }
}

