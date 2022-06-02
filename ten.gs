function ten() {

  if(getPropStatus("insertNewRows")==1)
  {
    Logger.log("updateSheet() function still working");
    return;
  } 

  setProp("insertNewRows", 1);

  try{
    let lock = LockService.getScriptLock();
    lock.tryLock(5000);
    Logger.log("Добавляем строки");
    transferIsi(); // Переносим строки
    lock.tryLock(5000);    
    Logger.log("Синхронизируем уже перенесенные строки");
    syncWithIsi(); // Синхронизируем уже перенесенные строки
    lock.tryLock(5000);
    Logger.log("Удаляем из ИЗИ UUID которых нет в главной таблице");
    removeUnrecognizedUUID(); // Удаляем из ИЗИ UUID которых нет в главной таблице
    lock.tryLock(5000);
    Logger.log("Удаляем строки ЛК из ИЗИ");
    deleteLKRows(); // Удаляем строки ЛК из ИЗИ
    lock.tryLock(5000);
    Logger.log("Удаляем повторяющиеся UUID");
    removeDuplicatesByUUID(); // Удаляем повторяющиеся UUID
    lock.tryLock(5000);
    Logger.log("Сортируем по датам, по столбцу B");
    checkDatesQueue(); // Сортируем по датам, по столбцу B
  }
  catch(e){
    Logger.log(e);
  }
  finally{
    setProp("insertNewRows", 0);
  }
  
}
