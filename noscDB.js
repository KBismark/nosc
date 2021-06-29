"use strict"
function _decache(){
    var path=_fileRequired();
    require.cache[path].exports=null;
    require.cache[path]=null;
    delete require.cache[path];
    path=null;
};
function _deport(){
    require.cache[_fileRequired()].exports=null;
};
function _fileRequired(){
    return Object.keys(require.cache).pop();
};
var reqf=_fileRequired();
var eventEmitter=require("events");
var emitter = new eventEmitter.EventEmitter();
var fs=require("fs");
const dirr_test="/test.nsc";
const db_EXT=".db";
var exported=false;
var logs=false;
const Databases={};
Databases[""]=[""];
const tablesObject={};
function nothing(){};
var mem=require("./back_tech.js").memoryNow;
//To check if a directory exists
/**
 * 
 * @param {string} dir_path The directory to check if exists
 * @param {boolean} create A boolean indicating whether to create or not to create directory if not exists
 * @param {function} callback A callback function that will be called after directory is checked
 */
 function _dirExistss(dir_path,create,callback){
    if(typeof (dir_path)==="string"&&typeof (callback)==="function"){
        if(typeof (create)!=="boolean"){
            create=false;
        }
        fs.mkdir(dir_path,function(er){
            if(er){
                fs.writeFile(dir_path+dirr_test,"",function(err){
                    if(err){
                        callback(false);
                        return;
                    }
                    callback(true);
                });
                return;
            }
           if(!create){
                fs.rmdir(dir_path,function(){
                    callback(false);
                });
           }else{
               callback(true);
           }
        });
    }
};
function _createDir(dir_path,callback){
    if(typeof (dir_path)==="string"&&typeof (callback)==="function"){
        fs.mkdir(dir_path,function(er){
            if(er){
                fs.writeFile(dir_path+dirr_test,"",function(err){
                    if(err){
                        callback("");
                        return;
                    }
                    callback(false);
                });
                return;
            }
            callback(true);
        });
    }
};
/**
 * 
 * @param {string} dir_path The directory to check if exists
 * @param {function} callback A callback function that will be called after directory is checked
 */
function _dirExists(dir_path,callback){
    if(typeof (dir_path)==="string"&&typeof (callback)==="function"){
        fs.mkdir(dir_path,function(er){
            if(er){
                fs.writeFile(dir_path+dirr_test,"",function(err){
                    if(err){
                        callback(false);
                        return;
                    }
                    callback(true);
                });
                return;
            }
            fs.rmdir(dir_path,function(){
                callback(false);
            });
        });
    }
};
function _dirExistsNoChecks(dir_path,callback){
    fs.mkdir(dir_path,function(er){
        if(er){
            fs.writeFile(dir_path+dirr_test,"",function(err){
                if(err){
                    callback(false);
                    return;
                }
                callback(true);
            });
            return;
        }
        fs.rmdir(dir_path,function(){
            callback(false);
        });
    });
}
function _check4dirNoChecks(dir_path,callback){
    fs.readdir(dir_path,"utf8",function(er,files){
        if(er){
            callback(false);
            return;
        }
        callback(true);
    });
};
//To check if a file exists
/**
 * 
 * @param {string} file_path 
 * @param {boolean} create
 * @param {(noscDBReturnType: boolean)=>void} callback A callback function that recieves a boolean as argument.
 */
function _fileExistss(file_path,create,callback){
    if(typeof (create)==="function"){callback=create;create=false;}
    else if(typeof (create)!=="boolean"){create=false;}
    if(typeof (file_path)==="string"&&typeof (callback)==="function"){
        fs.open(file_path,"r",function(err,fd){
            if(err){
                callback(false);
            }else{
                if(create){
                    _createFile(fd,callback);
                }else{
                    fs.close(fd,function(c_err){
                        if(c_err){};
                        callback(true);
                    });
                }
                
            }
        }); 
    }
};
function _createFile(path,callback){
    if(typeof (callback)==="function"){
        if(typeof (path)==="number"){
            fs.writeFile(path,"",function(er){
                if(er){
                    fs.close(path,function(c_err){
                        if(c_err){}
                        callback(false);
                    });
                    return;
                }
                fs.close(path,function(c_err){
                    if(c_err){}
                    callback(true);
                });
                
            });
        }else if(typeof (path)==="string"){
            fs.writeFile(path,"",function(er){
                if(er){callback(false);return;}
                callback(true);
            });
        }
    }
};
function _fileExists(file_path,callback){
    if(typeof (file_path)==="string"&&typeof (callback)==="function"){
        fs.open(file_path,"r",function(err,fd){
            if(err){
                callback(false);
            }else{
                fs.close(fd,function(c_err){
                    if(c_err){};
                    callback(true);
                });
                
            }
        }); 
    }
};
function Err(mes){
    throw new Error("noscDB ERROR: "+mes);
};
function log(mes){
    if(logs){
        console.log("noscDB LOGS: "+mes);
    }
};
/**
 * 
 * @param {boolean} log A boolean to either allow logings or not. 
*/
function setLog(log){
    if(typeof (log)==="boolean"){logs=log};
};
function fAble(s){
    var ret=true;
    if(s.length<1){ret=false}
    else{
        var i,firstChar;
        for(i in s){
            firstChar=s[i].charCodeAt(0);
            if((firstChar>96&&firstChar<123)||(firstChar>47&&firstChar<58)){;}
            else{ret=false;break;}
        }
    };
    return ret;
};
/**
 * 
 * @param {{tablename:string,columns:string,created:boolean,storage:boolean,callback:(noscDBReturnType: void)=>void}} o 
  An object with noscDB table creation properties. 




  
 ** Object Properties:
 * @param o.tablename The name of the table to be created 
 * . 
 * @param o.columns A comma `,` separated names of columns for the new table
 * .
 * @param o.created A `boolean` to indicate whether the table is created already (*true*) or not (*false*).
 * 
 * If sets to true, sets table object only.
 * 
 * If sets to false or not defined, sets table object and create table path if not already existed.
 * @param o.storage A `boolean` to indicate whether to create a storage path for each row in this table (*true*) or not (*false*).
 * 
 * If not defined, creates a storage path for each row in this table.
 * @param o.callback An `optional` no-parameter-function. Called after successful table creation
 * . 
 
  ---
  ** *NOTE:

  A tablename or a table column-name can only include lowercase letters and numbers.*  
  
  A tablename or a table column-name must always begin with a letter.
   
 */
function _table(o){
    if(typeof (o.callback)==="function"){
        o.callback=o.callback.bind(this);
    }
    if(typeof (o)==="object"&&!Array.isArray(o)&&null!==o){
        if(string(o.tablename,o.columns)){
            o.tablename=o.tablename.toLowerCase();
            o.columns=o.columns.toLowerCase();
            var firstChar=o.tablename.charCodeAt(0);
            if((firstChar>96&&firstChar<123)){
                if(fAble(o.tablename)){
                    if(_column(o.columns)){
                        var _path="-/*\\.\\/+";
                        if(typeof (this[""])==="function"){_path=this[""]();}
                        if(_path===Databases[_path].dataPath&&_path!==""){
                            if(typeof (o.created)==="boolean"&&o.created){
                                if(!Databases[_path].tables.includes(o.tablename)){
                                    Databases[_path].tables.push(o.tablename);
                                    var store;
                                    if(typeof (o.storage)!=="boolean"){store=true;}else{store=o.storage;}
                                    Databases[_path].tablesObject[o.tablename]={columns:o.columns.split(","),storage:store};
                                    if(this.TABLES){
                                        this.TABLES[o.tablename]={columns:o.columns.split(","),storage:store};
                                    }
                                    log("Table named: ("+o.tablename+") is created...");
                                    if(typeof (o.callback)==="function"){
                                        o.callback();
                                    }
                                }else{
                                    log("Table named: ("+o.tablename+") is already created...");
                                }
                            }else{
                                if(!Databases[_path].tables.includes(o.tablename)){
                                    Databases[_path].tables.push(o.tablename);
                                    var Tables=false;
                                    if(this.TABLES){Tables=this.TABLES;}
                                    _dirExistss(_path+"/"+o.tablename,true,function(ex){
                                        if(!ex){
                                            Err("System Error: Can't create table...");
                                            return;
                                        }
                                       // _dirExistss(_path+"/"+o.tablename+"/r",true,function(ext){
                                            
                                            _recreateDir(_path+"/"+o.tablename,["r","t"],0,function(ext){
                                            
                                                var store;
                                                if(typeof (o.storage)!=="boolean"){store=true;}else{store=o.storage;}
                                                Databases[_path].tablesObject[o.tablename]={columns:o.columns.split(","),storage:store};
                                                if(Tables){
                                                    Tables[o.tablename]={columns:o.columns.split(","),storage:store};
                                                }
                                                log("Table named: ("+o.tablename+") is created...",this);
                                                if(typeof (o.callback)==="function"){
                                                    o.callback();
                                                }
                                            });
                                       // });
                                    });
                                }else{
                                    log("Table named: ("+o.tablename+") is already created...",this);
                                }
                            }
                        }else{
                            log("Database PATH: "+_path+" is not recognized...",this);
                        }
                    }
                }
            }
        }
    };
};
/**
  * 
  * @param {string} mainID 
  * @param {string} tempID 
  * @param {(noscDBReturnType:boolean)=>void} callback 
  */
 function _setTemporalID(tablename,mainID,tempID,callback){
    if(string(tablename,mainID,tempID)&&typeof (callback)==="function"){
        callback = callback.bind(this);
        var _path="-/*\\.\\/+";
        if(typeof (this[""])==="function"){_path=this[""]();}
        if(Databases[_path]){
            if(Databases[_path].tablesObject[tablename]){
                let main=resolveName(mainID),temp=resolveName(tempID);
                fs.readFile(_path+"/"+tablename+"/r/"+main+"/tmp"+db_EXT,"utf8",function(error,data){
                    if(error){
                        fs.writeFile(_path+"/"+tablename+"/r/"+main+"/tmp"+db_EXT,temp,function(err){
                            if(err){
                                log("Could'nt set temporalID for "+mainID);
                                callback(false);
                                return;
                            }
                            fs.writeFile(_path+"/"+tablename+"/t/t"+temp+db_EXT,mainID,function(er){
                                if(er){
                                    log("Could'nt set temporalID for "+mainID);
                                    callback(false);
                                    return;
                                }
                                callback(true);
                            });
                        });
                        return;
                    }
                    fs.rename(_path+"/"+tablename+"/t/t"+data+db_EXT,_path+"/"+tablename+"/t/t"+temp+db_EXT,function(e){
                        if(e){
                            log("Could'nt set temporalID for "+mainID);
                            callback(false);
                            return;
                        }
                        fs.writeFile(_path+"/"+tablename+"/r/"+main+"/tmp"+db_EXT,temp,function(errs){
                            if(errs){}
                            callback(true);
                        });
                    });
                });
            }
        }
    }
 };
 /**
  * 
  * @param {string} tablename 
  * @param {string} tempID 
  * @param {(noscDBReturnType:string)=>void} callback 
  * A callback function which is passed a string of the data retrived as argument on sucessful operation. 
  * Null is passed as argument if operation was unsucessful.
  */
 function _getMainID(tablename,tempID,callback){
    if(string(tablename,tempID)&&typeof (callback)==="function"){
        callback = callback.bind(this);
        var _path="-/*\\.\\/+";
        if(typeof (this[""])==="function"){_path=this[""]();}
        if(Databases[_path]){
            if(Databases[_path].tablesObject[tablename]){
                fs.readFile(_path+"/"+tablename+"/t/t"+resolveName(tempID)+db_EXT,"utf8",function(er,data){
                    if(er){
                        log("Could'nt retrieve mainID for "+tempID);
                        callback(null);
                        return;
                    }
                    callback(data);
                });
            }
        }
    }
 };
  /**
  * 
  * @param {string} tablename 
  * @param {string} mainID 
  * @param {(noscDBReturnType:string)=>void} callback 
  * A callback function which is passed a string of the data retrived as argument on sucessful operation. 
  * Null is passed as argument if operation was unsucessful.
  */
 function _getTemporalID(tablename,mainID,callback){
    if(string(tablename,tempID)&&typeof (callback)==="function"){
        callback = callback.bind(this);
        var _path="-/*\\.\\/+";
        if(typeof (this[""])==="function"){_path=this[""]();}
        if(Databases[_path]){
            if(Databases[_path].tablesObject[tablename]){
                fs.readFile(_path+"/"+tablename+"/r/"+resolveName(mainID)+"/tmp"+db_EXT,"utf8",function(er,data){
                    if(er){
                        log("Could'nt retrieve temporalID for "+mainID);
                        callback(null);
                        return;
                    }
                    callback(data);
                });
            }
        }
    }
 };
 /**
  * 
  * @param {string} tablename 
  * @param {string} oldID 
  * @param {string} newID 
  * @param {(noscDBReturnType:boolean)} callback 
  */
 function _changeID(tablename,oldID,newID,callback){
    if(string(tablename,oldID,newID)&&typeof (callback)==="function"){
        callback = callback.bind(this);
        var _path="-/*\\.\\/+";
        if(typeof (this[""])==="function"){_path=this[""]();}
        if(Databases[_path]){
            if(Databases[_path].tablesObject[tablename]){
                _check4dirNoChecks(_path+"/"+tablename+"/r/"+resolveName(oldID),function(exists){
                    if(!exists){
                        log("Could'nt change ID for "+oldID);
                        callback(false);
                        return;
                    }
                    let main = resolveName(newID);
                    fs.rename(_path+"/"+tablename+"/r/"+resolveName(oldID),_path+"/"+tablename+"/r/"+main,function(err){
                        if(err){
                            log("Could'nt change ID for "+oldID);
                            callback(false);
                            return;
                        }
                        fs.readFile(_path+"/"+tablename+"/r/"+main+"/tmp"+db_EXT,"utf8",function(error,data){
                            if(error){
                                callback(true);
                                return;
                            }
                            fs.writeFile(_path+"/"+tablename+"/r/"+main+"t/t"+data+db_EXT,main,function(er){
                                if(er){}
                                callback(true);
                            });
                        });
                    });
                });
            }
        }
    }
 };
/**
 * 
 * @param {string} s Must be string
 */
function _column(s){
    var ret=true;
    s=s.split(",");
    if(s.length>0){
        var i,firstChar;
        for(i in s){
            firstChar=s[i].charCodeAt(0);
            if((firstChar>96&&firstChar<123)){;}
            else{
                ret=false;
                break;
            }
        }
        if(ret){
            for(i in s){
                if(!fAble(s[i])){
                    ret=false;
                    break;
                }
            }
        }
    }else{ret=false};
    return ret;
};
function A_column(s){
    return "A"+s;
};
function _addColumns(table,s){
    if(typeof (table)==="string"&&typeof (s)==="string"){
        if(tablesObject[table]){
            s=s.toLowerCase();
            if(_column(s)){

            }
        }
    }
};
function _addColumns(table,s,checked){
    if(typeof (checked)==="undefined"){
        if(typeof (s)==="string"){
            if(_column(s)){

            }else{

            }
        }
    }else{

    }
};
/**
 * 
 * @param {string} tablename The table for which a new row is to be created
 * 
 * @param {string} id Identifier for the row to be created. 

  An identifier can only include lowercase letters and numbers.  
  
  An identifier must always begin with a letter.  
 * 
 * @param {(noscDBReturnType: boolean)=>void} callback A callback function that recieves a boolean as argument.
 * 
 *  A "true" passed as argument to the callback indicates the identifier does not exist
  hence, row is created. 
 
 *  A "false" passed as argument to the callback indicates the identifier already exists
  hence, row not created. 


 */
function _createRo(tablename,id,callback){
    if(string(tablename,id)){
        var _path="-/*\\.\\/+";
        if(typeof (this[""])==="function"){_path=this[""]();}
        if(Databases[_path].tablesObject[tablename]){
            id=id.toLowerCase();
            if(_column(id)){
                _createDir(_path+"/"+tablename+"/"+id,function(res){
                    if(typeof (res)==="string"){
                        log("System Error: Couldn't create row for ("+id+")");
                        callback(false);
                    }else{
                        if(!res){
                            callback(false);
                        }else{
                           if(Databases[_path].tablesObject[tablename].storage){
                                fs.mkdir(_path+"/"+tablename+"/"+id+"/storage",function(err){
                                    if(err){
                                        log("System Error: Couldn't create storage path for: ("+id+"). Ref: ("+_path+"/"+tablename+"/"+id+")");
                                        _recreateDBFile(_path+"/"+tablename+"/"+id,Databases[_path].tablesObject[tablename].columns,0,callback);
                                        return;
                                    }
                                    _recreateDir(_path+"/"+tablename+"/"+id+"/storage",Databases[_path].tablesObject[tablename].columns,0,function(){
                                        _recreateDBFile(_path+"/"+tablename+"/"+id,Databases[_path].tablesObject[tablename].columns,0,callback);
                                    });
                                });
                           }else{
                                _recreateDBFile(_path+"/"+tablename+"/"+id,Databases[_path].tablesObject[tablename].columns,0,callback);
                           }
                        }
                    }
                });
            }
        }else{
            log("Can't create row. No such table ("+tablename+") exists...");
        }
    }
};
/**
 * 
 * @param {string} tablename The table for which a new row is to be created
 * 
 * @param {string} id An identifier for the row to be created. 

  An identifier can only include lowercase letters and numbers.  
  
  An identifier must always begin with a letter.  
 * 
 * @param {(noscDBReturnType: boolean)=>void} callback A callback function that recieves a boolean as argument.
 * 
 *  A `true` passed as argument to the callback indicates that a new row is succesfully created. 
 
 *  A `false` passed as argument to the callback indicates that the identifier already exists
  hence, row creation was unsuccssful. 


 */
function _createRow(tablename,id,callback){
    if(typeof (callback)==="function"){
        callback = callback.bind(this);
    }
    if(string(tablename,id)){
        var _path="-/*\\.\\/+";
        if(typeof (this[""])==="function"){_path=this[""]();}
        if(Databases[_path].tablesObject[tablename]){
            id=resolveName(id);
            //if(_column(id)){
                _createDir(_path+"/"+tablename+"/r/"+id,function(res){
                    if(typeof (res)==="string"){
                        log("System Error: Couldn't create row for ("+id+")");
                        callback(false);
                    }else{
                        if(!res){
                            callback(false);
                        }else{
                            var s="",i;
                            for(i in Databases[_path].tablesObject[tablename].columns){
                                s+=Databases[_path].tablesObject[tablename].columns[i]+":null,";
                            }
                            fs.writeFile(_path+"/"+tablename+"/r/"+id+"/row"+db_EXT,s,function(err){
                                if(err){}
                                callback(true);
                            });
                            s=null;
                        }
                    }
                });
           /* }else{
                log("Can't create row with unaccepted ("+id+") @"+tablename);
            }*/
        }else{
            log("Can't create row. No such table ("+tablename+") exists...");
        }
    }
};
/**
 * Upadtes a row in a table.
 * @param {string} tablename The table for which a row is to be updated.
 * @param {string} id The identifier of the row to update.
 * @param {{}} columnsObject An `object` with the column(s) to update as properties set to their corresponding values.
 * 
 * Accepted value types: [`String`,`Number`,`Function`,`Boolean`,`Serializable objects`]
 * 
 * If value type is not accepted, `null` is used instead.
 * @param {(noscDBReturnType: boolean)=>void} callback An `optional` callback that receives a `boolean` as an argument
 * indicating whether updation was successful or not.
 *  
 */
function _updateRow(tablename,id,columnsObject,callback){
    if(typeof (callback)==="function"){
        callback = callback.bind(this);
    }
    if(string(tablename,id)&&typeof (columnsObject)==="object"&&!Array.isArray(columnsObject)&&null!==columnsObject){
        var _path="-/*\\.\\/+";
        if(typeof (this[""])==="function"){_path=this[""]();}
        if(Databases[_path].tablesObject[tablename]){
            id=resolveName(id);
            //if(_column(id)){
                fs.readFile(_path+"/"+tablename+"/r/"+id+"/row"+db_EXT,"utf8",function(err,data){
                    if(err){
                        log("System Error: Couldn't update database... Ref: '"+_path+"/"+tablename+"/r/"+id+"/row"+db_EXT+"'");
                        if(typeof (callback)==="function"){callback(false);}
                        return;
                    }
                    var func= new Function("const o={"+data+"};return o;"),Data=func();
                    func=null;
                    data=null;
                    var updatingCols=Object.keys(columnsObject),updated=Object.keys(Data),x,s="";
                    for(x in updated){
                        if(updatingCols.includes(updated[x])){
                            Data[updated[x]]=columnsObject[updated[x]];
                            if(updateAllowedTypes(typeof (Data[updated[x]]))){
                                s+=updated[x]+":"+toString(Data[updated[x]])+",";
                            }else{
                                s+=updated[x]+":null,";
                            }
                        }else{
                            s+=updated[x]+":"+toString(Data[updated[x]])+",";
                        }
                    }
                    nullifyObject(Data);
                    nullifyObject(columnsObject);
                    columnsObject=null;
                    Data=null;
                    updatingCols=null;
                    updated=null;
                    fs.writeFile(_path+"/"+tablename+"/r/"+id+"/row"+db_EXT,s,function(er){
                        if(er){
                            log("System Error: Couldn;t update database... Ref: '"+_path+"/"+tablename+"/r/"+id+"/row"+db_EXT+"'");
                            if(typeof (callback)==="function"){callback(false);}
                            return;
                        }
                        log("Database Updated...");
                        if(typeof (callback)==="function"){callback(true);}
                    });
                    s=null;
                });
            //}
        }
    }
};
/**
 * 
 * @param {string} tablename 
 * @param {string} id 
 * @param {{}} columnsObject 
 * @param {(noscDBReturnType: {}|null)=>void} callback 
 */
 function _getColumns(tablename,id,columnsObject,callback){
    if(string(tablename,id)&&typeof (columnsObject)==="object"&&!Array.isArray(columnsObject)&&null!==columnsObject){
        var _path="-/*\\.\\/+";
        if(typeof (this[""])==="function"){_path=this[""]();}
        if(Databases[_path].tablesObject[tablename]){
            id=id.toLowerCase();
            if(_column(id)){
                fs.readFile(_path+"/"+tablename+"/"+id+"/row"+db_EXT,"utf8",function(err,data){
                    if(err){
                        log("System Error: Couldn't update database... Ref: '"+_path+"/"+tablename+"/"+id+"/row"+db_EXT+"'");
                        if(typeof (callback)==="function"){callback(false);}
                        return;
                    }
                    var func= new Function("const o={"+data+"};return o;"),Data=func();
                    func=null;
                    data=null;
                    var updatingCols=Object.keys(columnsObject),updated=Object.keys(Data),x,s="";
                    for(x in updated){
                        if(updatingCols.includes(updated[x])){
                            Data[updated[x]]=columnsObject[updated[x]];
                            if(updateAllowedTypes(typeof (Data[updated[x]]))){
                                s+=updated[x]+":"+toString(Data[updated[x]])+",";
                            }else{
                                s+=updated[x]+":null,";
                            }
                        }else{
                            s+=updated[x]+":"+toString(Data[updated[x]])+",";
                        }
                    }
                    nullifyObject(Data);
                    nullifyObject(columnsObject);
                    columnsObject=null;
                    Data=null;
                    updatingCols=null;
                    updated=null;
                    fs.writeFile(_path+"/"+tablename+"/"+id+"/row"+db_EXT,s,function(er){
                        if(er){
                            log("System Error: Couldn;t update database... Ref: '"+_path+"/"+tablename+"/"+id+"/row"+db_EXT+"'");
                            if(typeof (callback)==="function"){callback(false);}
                            return;
                        }
                        log("Database Updated...");
                        if(typeof (callback)==="function"){callback(true);}
                    });
                    s=null;
                });
            }
        }
    }
};
/**
 * 
 * @param {string} tablename 
 * @param {string} id 
 * @param {(noscDBReturnType: {})=>void} callback 
 */
 function _getRow(tablename,id,callback){
    if(typeof (callback)==="function"){
        callback = callback.bind(this);
    }
    if(string(tablename,id)&&typeof (callback)==="function"){
        var _path="-/*\\.\\/+";
        if(typeof (this[""])==="function"){_path=this[""]();}
        if(Databases[_path].tablesObject[tablename]){
            id=resolveName(id);
           // if(_column(id)){
                fs.readFile(_path+"/"+tablename+"/r/"+id+"/row"+db_EXT,"utf8",function(err,data){
                    if(err){
                        log("System Error: Couldn't retrieve data... Ref: '"+_path+"/"+tablename+"/r/"+id+"/row"+db_EXT+"'");
                        callback(null);
                        return;
                    }
                    var func= new Function("const o={"+data+"};return o;");
                    data=null;
                    callback(func());
                    func=null;
                });
            //}
        }
    }
};
var allRowsCallCount=0;
var allRowsOnEndTracker=[];
var allRowsCallEnded=[];
var allRowsOnEndCallbacks=[];
function _allRowsOnData(path,callbacksArr,callerId){
    allRowsCallEnded[callerId]=false;
    fs.readFile(path+"/row"+db_EXT,"utf8",function(err,data){
        if(err){
            callbacksArr=null;
            allRowsOnEndTracker[callerId][0]+=1;
            if(allRowsOnEndTracker[callerId][0]===allRowsOnEndTracker[callerId][1]){
                allRowsCallEnded[callerId]=true;
                var x;
                for(x in allRowsOnEndCallbacks[callerId]){
                    allRowsOnEndCallbacks[callerId][x]();
                    allRowsOnEndCallbacks[callerId][x]=null;
                }
                allRowsOnEndCallbacks[callerId]=null;
                if(!allRowsCallEnded.includes(false)){
                    allRowsCallCount=0;
                    allRowsOnEndTracker=[];
                    allRowsCallEnded=[];
                    allRowsOnEndCallbacks=[];
                }
            }
            return;
        }
        var func= new Function("const o={"+data+"};return o;");
        data=null;
        var i,Data=func();
        func=null;
        for(i in callbacksArr){
            callbacksArr[i](Data);
            callbacksArr[i]=null;
        }
        Data=null;
        callbacksArr=null;
        allRowsOnEndTracker[callerId][0]+=1;
        if(allRowsOnEndTracker[callerId][0]===allRowsOnEndTracker[callerId][1]){
            allRowsCallEnded[callerId]=true;
            for(i in allRowsOnEndCallbacks[callerId]){
                allRowsOnEndCallbacks[callerId][i]();
                allRowsOnEndCallbacks[callerId][i]=null;
            }
            allRowsOnEndCallbacks[callerId]=null;
            if(!allRowsCallEnded.includes(false)){
                allRowsCallCount=0;
                allRowsOnEndTracker=[];
                allRowsCallEnded=[];
                allRowsOnEndCallbacks=[];
            }
        }
        
        
    });
};
/**
 * Gets all rows data in a table.
 * @param {string} tablename A table from which to get all rows data.
 * 
 *@returns A `Data Event Object` if tablename provided exists else, returns `void`
 * ---
 ** NOTE:

 * Rows data are retrieved in a sequential manner. 
 * Use the `ondata` and the `onend` properties of the 
 * `Data Event Object` returned to handle each row's data retrived.
 * 
 */
function _getAllRows(tablename){
    var _path="-/*\\.\\/+";
    if(typeof (this[""])==="function"){_path=this[""]();}
    if(Databases[_path].tables.includes(tablename)){
        var ondataFuncs=[];
        var onendFuncs=[];
        var ender=false;
        var acceptOnDataFuncs=true;
        var acceptOnEndFuncs=true;
        var id=allRowsCallCount;
        allRowsCallEnded.push(true);
        allRowsOnEndTracker.push([1,0]);
        allRowsOnEndCallbacks.push(null);
        allRowsCallCount+=1;
        fs.readdir(_path+"/"+tablename+"/r",function(err,f){
            if(err){return}
            var i;
            if(ondataFuncs.length>0&&f.length>0){
                var enderString="";
                allRowsOnEndTracker[id][1]=f.length+1;
                for(i in f){
                    if(!/[^0-9a-z]/.test(f[i])/*_column(f[i])*/){
                       if(!ender){
                           enderString=f[i];
                           ender=true;
                       }else{
                            _allRowsOnData(_path+"/"+tablename+"/r/"+f[i],ondataFuncs.slice(),id);
                       }
                    }else{
                        allRowsOnEndTracker[id][0]+=1;
                    }
                }
                if(ender){
                    onendFuncs.unshift(function(){acceptOnEndFuncs=false;onendFuncs=null;});
                    allRowsOnEndCallbacks[id]=onendFuncs;
                    _allRowsOnData(_path+"/"+tablename+"/r/"+enderString,ondataFuncs.slice(),id);
                    ondataFuncs=null;acceptOnDataFuncs=false;
                }else{
                    acceptOnDataFuncs=false;
                    acceptOnEndFuncs=false;
                    ondataFuncs=null;
                    allRowsOnEndTracker[id]=null;
                    for(i in onendFuncs){
                        onendFuncs[i]();
                        onendFuncs[i]=null;
                    }
                    onendFuncs=null;
                }

            }else{
                acceptOnDataFuncs=false;
                acceptOnEndFuncs=false;
                ondataFuncs=null;
                allRowsOnEndTracker[id]=null;
                for(i in onendFuncs){
                    onendFuncs[i]();
                    onendFuncs[i]=null;
                }
                onendFuncs=null;
            }
        });
        let THIS=this;
        return {
            /**
             * 
             * @param {(noscDBReturnType: {})=>void} callback 
             * A callback function that is executed anytime a row data is retrieved. 
             * Each row's data is passed as argument to the callback function anytime data is retrieved.
             * 
             * ---
             ** NOTE:

             * All `callbacks` passed as argument to this method is executed anytime a row data is retrieved.

             */
            ondata:function(callback){
                if(typeof (callback)==="function"&&acceptOnDataFuncs){
                    callback = callback.bind(THIS);
                    ondataFuncs.push(callback);
                }
                return this;
            },
            /**
             * 
             * @param {(noscDBReturnType: void)=>void} callback 
             * A callback function that is executed after all rows data is retrieved.
             * 
             * ---
             ** NOTE:

             * All `callbacks` passed as argument to this method is executed after all rows data is retrieved.
            
             */
            onend:function(callback){
                if(typeof (callback)==="function"&&acceptOnEndFuncs){
                    callback = callback.bind(THIS);
                    onendFuncs.push(callback);
                }
                return this;
            }
        };
    }
    
};
function updateAllowedTypes(t){
    let types="functionstringnumberobjectboolean";
    if(!types.includes(t)){return false;}
    return true;
}
function toString(item){
    if(typeof (item)==="function"){
        return item.toString();
    }else{
        try {
            return JSON.stringify(item);
        } catch (error) {
            return "null";
        }
    }
};
function createRelation(id1,id2){
    if(string(id1,id2)){
        let arr = [id1,id2].sort();
        return arr[0]+arr[1];
    }
};
function resolveName(name){
    if(string(name)&&""!==name){
        if(/[^0-9a-zA-Z]/.test(name)){
            var i,s="m";
            for(i in name){
                if(/[^0-9a-zA-Z]/.test(name[i])){
                    s+=name[i].charCodeAt(0)+"";
                }else{
                    s+=name[i];
                }
            };
            return s.toLowerCase();
        }else{
            return name.toLowerCase();
        }
    };
    return "?|\\/*.\\/";
 };
 
function _reupdateCol(keys,values){

};
function _recreateDir(path,dirArr,arrLen,callback){
    if(arrLen<0){arrLen=0;}
    if(arrLen<dirArr.length){
        _createDir(path+"/"+dirArr[arrLen],function(res){
            if(typeof (res)==="string"){
                log("System Error: Couldn't create storage column: ("+dirArr[arrLen]+"). Ref: ("+path+")");
            }
            arrLen+=1;
            _recreateDir(path,dirArr,arrLen,callback);
        });
        
    }else{
        if(typeof (callback)==="function"){callback(true);}
    }
};
function _recreateDBFile(path,dirArr,arrLen,callback){
    if(arrLen<0){arrLen=0;}
    if(arrLen<dirArr.length){
        _fileExists(path+"/"+dirArr[arrLen]+db_EXT,function(res){
            if(res){
                arrLen+=1;
                _recreateDBFile(path,dirArr,arrLen,callback);
            }else{
                _createFile(path+"/"+dirArr[arrLen]+db_EXT,function(created){
                    if(!created){
                        log("System Error: Couldn't create column: ("+dirArr[arrLen]+db_EXT+") for row with id ("+path.split("/").pop()+")");
                    }
                    arrLen+=1;
                    _recreateDBFile(path,dirArr,arrLen,callback);
                });
            }
            
        });
        
    }else{
        if(typeof (callback)==="function"){callback(true);}
    }
};
function string(){
    var i,ret=true;
    for(i in arguments){
        if(typeof (arguments[i])!=="string"){
            ret=false;break;
        }
    }
    return ret;
};
function is(s,what){
    if(typeof (what)==="undefined"){what="undefined"}
    if(typeof (s)===what){
        return true;
    }
    return false;
};
function DBtools(){
    if(!new.target){
        return new DBtools();
    }
    /**
     Checks if a file exists
     @file-path string 
     @callback function(exixsts)=> void
    */
    this.fileExists=_fileExists;

    /**
     Checks if a directory exists
     @file-path string 
     @callback function(exixsts)=> void
    */
    this.dirExists=_dirExists;
};
function DB(database_path,callback){
    if(allow_db){
        _dirExists(database_path,function(path_exists){
            if(!path_exists){
                Err("No such directory exists. Ref: "+[database_path]);
            }
            dataPath=database_path;
            DBobject.PATH=database_path;
            log("DBobject set...");
            callback(DBobject);
        });
        allow_db=false;
    }
};
function DBsync(database_path){
    if(allow_db){
        var y=fs.existsSync(database_path);
        allow_db=false;
        if(y){
            dataPath=database_path;
            DBobject.PATH=database_path;
            log("DBobject set...");
            return DBobject;
        }else{
            Err("No such directory exists. Ref: "+[database_path]);
        }
    }
};
function setAsyncDBObject(database_path,callback){
    var dir=database_path.split("/").pop();
    if(!dir.includes(".")){
        if(!Databases[""].includes(database_path)){
            Databases[""].push(database_path);
            _dirExists(database_path,function(path_exists){
                if(!path_exists){
                    Err("No such directory exists. Ref: "+[database_path]);
                }
                Databases[database_path]={tablesObject:{},dataPath:database_path,tables:[]};
                const DBobject={
                    PATH:database_path,
                    TABLES:{},
                    log:setLog,
                    updateRow:_updateRow,
                    getRow:_getRow,
                    getAllRows:_getAllRows,
                    createRow:_createRow,
                    createTable:_table,
                    setTemporalID:_setTemporalID,
                    getMainID:_getMainID,
                    getTemporalID:_getTemporalID,
                    changeID:_changeID
                };
                DBobject[""]=function(){return database_path;};
                log("Database created... PATH: '"+database_path+"'");
                callback=callback.bind(DBobject);//Added the binding of DBobject to the "this object" of the callback
                callback(DBobject);
            });
        }else{
            Err("Database with path: '"+[database_path]+"' is in use...");
        }
    }else{
        Err("Unaccepted database path. Ref: "+[database_path]);
    }
};
function getSyncDBObject(database_path,callback){
    var dir=database_path.split("/").pop();
    if(!dir.includes(".")){
        if(typeof (Databases[database_path])==="undefined"){
            var y=fs.existsSync(database_path);
            if(y){
                var dataPath="";
                Databases[dataPath].push(database_path);
                dataPath=database_path;
                Databases[database_path]={tablesObject:{},dataPath:dataPath,tables:[]};
                const DBobject={
                    PATH:dataPath,
                    TABLES:{},
                    logs:setLog,
                    updateRow:_updateRow,
                    getRow:_getRow,
                    getAllRows:_getAllRows,
                    createRow:_createRow,
                    createTable:_table,
                    setTemporalID:_setTemporalID,
                    getMainID:_getMainID,
                    getTemporalID:_getTemporalID,
                    changeID:_changeID
                };
                DBobject[""]=function(){return dataPath;};
                log("Database created... PATH: '"+database_path+"'");
                if(typeof (callback)==="function"){
                    callback=callback.bind(DBobject);//Added the binding of DBobject to the "this object" of the callback
                    callback(DBobject);
                };
                return DBobject;
            }else{
                Err("No such directory exists. Ref: "+[database_path]);
            }
        }else{
            Err("Database with path: '"+[database_path]+"' is in use...");
        }
    }else{
        Err("Unaccepted database path. Ref: "+[database_path]);
    }
    
}
function vc(a){
    console.log(a);
}
function dataObject(){
    if(new.target){
        const dataobject={
            tables:null,
            table_column3:null,
            
        }
        return dataobject;
    }
    return null;
};
var db={r:7};
//console.log(dataObject());
//var fu=new Function("d","d.tables=['User','Site'];");
//fu(dataObject)
//console.log(new dataObject());
















function dumped(){
//----------------------------------------
    setTimeout(() => {
        console.log(mem());
    }, 1000);
//-----------------------------------------
    function _dirExists(dir_path,o){
        if(typeof (dir_path)==="string"&&typeof (o)==="object"&&!Array.isArray(o)){
            var exists=false;
            emitter.once("dir_checked",function(){
                if(!o.true||typeof (o.true)!=="function"){
                    o.true=nothing;
                }
                if(!o.false||typeof (o.false)!=="function"){
                    o.false=nothing;
                }
                if(exists){
                    o.true();
                }else{o.false();};
            });
            fs.mkdir(dir_path,function(er){
                if(er){
                    exists=true;
                    emitter.emit("dir_checked");
                    return;
                }
                fs.rmdir(dir_path,function(){
                    emitter.emit("dir_checked");
                });
            });
        }
    };
//---------------------------------------------------------
    var fileExistsEventQueue=[],fe_IS_AT_WORK=false;
    emitter.on("fe_IS_INUSED",function(){
        fe_IS_AT_WORK=true;
        if(fileExistsEventQueue.length<1){
            fe_IS_AT_WORK=false;
        }else{
            _FE(fileExistsEventQueue.shift());
        }console.log(999);
    });
    function _fileExist(file_path,callback){
        if(typeof (file_path)==="string"&&typeof (callback)==="function"){
            fileExistsEventQueue.push([file_path,callback]);
            if(!fe_IS_AT_WORK){
                emitter.emit("fe_IS_INUSED");
            }
        }
    };
    function _FE(fpANDcb){
        var exists=false;
        emitter.once("file_checked",function(){
            emitter.emit("fe_IS_INUSED");
            fpANDcb[1](exists);
        });
        fs.createReadStream(fpANDcb[0],"utf8").on("open",function(){
            exists=true;
            emitter.emit("file_checked");
        }).on("error",function(er){
            emitter.emit("file_checked");
        }).close();
    };
//------------------------------------------------------
function mn(){
    if(!new.target){
        return new mn();
    }
    console.log(new.target);
    var g=0;
    this.g=7;
    
};
//-------------------------------------------------


}
/**
 * 
 * @param {np} noscDBReturnType 
 */
function NoReturnCallback(noscDBReturnType){};
function nullifyObject(a){
    var i;
    for(i in a){
        a[i]=null;
    }
};

/**noscDB-Object */
var noscDB={
    
    /**
     * A boolean to either allow logings or not.
     * @default [false]
     */
    log: false,
    /**
     * A boolean to either set up database synchronously (*true*) or asynchronously (*false*).
     * @default [false]
     * 
     * NOTE: 
     *  If "false", noscDB-Object.createDatabase returns void.
     *  If "true", noscDB-Object.createDatabase returns a DBobject.
     */
    sync:false,
     /**
      * @param {string} path A path to a folder or directory where data will be stored
      * @param {(noscDBReturnType: nd)=>void} callback 
      * A callback function to execute after database is set up.

     A database object (*DBobject*) is passed as an argument to this function.

     @example noscDB-Object.createDatabase(path: "yourFolderPath",callback: (db)=>{db.createTable(...);...})  
     
      * @returns DBobject if noscDB-Object.sync is set to true. 
      * @returns Void if noscDB-Object.sync is set to false.
      */
    createDatabase:function(path,callback){
        if(string(path)&&path.length>0){
            if(typeof (this.sync)!=="boolean"){noscDB.sync=false;}
            if(!this.sync){
                if(typeof (callback)==="function"){
                    setLog(this.log);
                    setAsyncDBObject(path,callback);
                }
            }else{
                setLog(this.log);
                return getSyncDBObject(path,callback);
            }
        }else{
            Err("An empty database path is not accepted...");
        }
    }
};
//neccessary-------------------
noscDB.sync=false;
var nd=noscDB.createDatabase("/");
nd=null;
//------------------------------
module.exports=noscDB;
//require.cache[reqf].exports=null;
