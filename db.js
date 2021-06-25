/** noscDB */ 
const DATABASE = {};
var fs= require('fs');
var mon=["january","february","march","april","may","june","july","august","september","october","november","december"];
/** Creates and returns a new database object
 @param string Argument must be a string of the path and name for the new database file
 **  The name for the new database file must be unique and not already existed in its directory
 ** path: must not be in any format, e.g "./mynewdata_house" or "/myProject/src/data_house";
 */
DATABASE.new = (path_with_name_of_data_house)=>{
    "use strict"
    var IDS=[];
    var ROWS=[];
    var TABLES=[];
    var ROWIDS=[];
    var COLUMNS=[];
    var G_COLOMNS=[];
    var S_G_COLOMNS=[];
    var TABLEGROUPS=[];
    var TABLECOLUMNS=[];
    var GROUPCOLUMNS=[[],[]];
    var TEMP_TABLE,DB_FILE;
    const DB = {};
    ((path)=>{
        if(typeof (path)!=="string"||path===''){
            error("Data storage path not set. Argument must be a string");
        }
        data_path(path);
        if(!fs.existsSync(path+'.js')){
            Save();
        }
        require_data();
    })(path_with_name_of_data_house);
    /** Most of the functions require this function to be called first */
    DB.TABLE = function(table_name){
        if(string(table_name,false)){
            TEMP_TABLE = table_name;
            return this;
        }
    };
    /** Creates column(s) for a new table and returns true on success
     ** NOTE: [If the IDENTIFIER function (IDCOLUMN) 
     * of this function is not called, a table is never created] 
    */
    /* Each new table must at least have one column created with an identifier column */
    DB.CREATECOLUMNS = function(columns_array){
        if(array(columns_array)&&columns_array.length>0){/* Checks if argument is an array */
            if(exists(columns_array,'')){
                error("A table column must have a name");
            }
            if(TEMP_TABLE===''){
                error("A table must have a name");
            }
            DB.CREATECOLUMNS.IDCOLUMN=nothing;
            columns_array=stringify(columns_array);/* Makes sure argument is an array of strings */
            if(!duplicated(columns_array)){/* Checks if multiple columns are created */
                if(!exists(TABLES,TEMP_TABLE)){/* Checks if the new table name already exists */
                    /** IDENTIFIER function */
                    DB.CREATECOLUMNS.IDCOLUMN = function(id_column_name){
                        if(string(id_column_name)&&string(TEMP_TABLE)){/* Checks if argument is a string */
                            if(exists(columns_array,id_column_name)){/* Checks if identifier column is created */
                                /* Gives access to create table */
                                var i;
                                TABLES.push(TEMP_TABLE);
                                TABLECOLUMNS.push(columns_array);
                                IDS.push(id_column_name);
                                ROWS.push([]);
                                ROWIDS.push([]);
                                COLUMNS.push([]);
                                if(DB.GROUPS){
                                    G_COLOMNS.push([]);
                                    S_G_COLOMNS.push([]);
                                    GROUPCOLUMNS[0].push([]);
                                    GROUPCOLUMNS[1].push([]);
                                    TABLEGROUPS.push(true);
                                }else{
                                    G_COLOMNS.push(null);
                                    S_G_COLOMNS.push(null);
                                    GROUPCOLUMNS[0].push(null);
                                    GROUPCOLUMNS[1].push(null);
                                    TABLEGROUPS.push(false);
                                    DB.GROUPS=true;
                                }
                                for(i in columns_array){
                                    COLUMNS[COLUMNS.length-1].push([]);
                                }
                                log("TABLE NAMED: ("+TEMP_TABLE+") successfully created with IDENTIFIER COLUMN NAMED: ("+id_column_name+")");
                                return true;
                            }else{
                                error("IDENTIFIER COLUMN NAMED: ("+id_column_name+") does not exist in TABLE NAMED: ("+TEMP_TABLE+")");
                            }
                        }
                    };
                    return this.CREATECOLUMNS;
                }else{
                    errorOut("TABLE NAMED: ("+TEMP_TABLE+") is in use");
                }
            }else{
                error("Can't create table with duplicate columns");
            };
            return this.CREATECOLUMNS;
        }
    };
    /** Creates one or more group columns for a specified identifier.
     * A group column is either strict or not, depending on the boolean passed to the FOR_ID function
     */
    DB.CREATE_GROUPCOLUMNS = function(cols_array){
        if(exists(cols_array,'')){
            error('A table column must have a name');
        }
        var pos = locateItem(TABLES,TEMP_TABLE);
        if(typeof (pos)!=="string"){
           if(TABLEGROUPS[pos]){
                if(array(cols_array)&&cols_array.length>0){
                    cols_array=stringify(cols_array);
                    DB.CREATE_GROUPCOLUMNS.FOR_ID = function(id,strict){
                        var returner = false;
                        if(string(id,false)){
                            var id_col_pos=locateItem(TABLECOLUMNS[pos],IDS[pos]);
                            var id_ex = locateItem(COLUMNS[pos][id_col_pos],id);
                            if(typeof (id_ex)!=="string"){
                                if(typeof (strict)!=="boolean"){
                                    strict=true;
                                }
                                var st = strict?1:0;
                                var _cols=GROUPCOLUMNS[st][pos][id_ex],all_cols=_cols.concat(cols_array);
                                if(!duplicated(all_cols)){
                                        var i;
                                        if(st==1){/* 1 means true hence, strict */
                                            for(i in cols_array){
                                                GROUPCOLUMNS[1][pos][id_ex].push(cols_array[i]);
                                                S_G_COLOMNS[pos][id_ex].push([]);
                                            }
                                        }else{/* 0 means false hence, not strict */
                                            for(i in cols_array){
                                                GROUPCOLUMNS[0][pos][id_ex].push(cols_array[i]);
                                                G_COLOMNS[pos][id_ex].push([]);
                                            }
                                        }
                                        returner=true;
                                }else{
                                    errorOut("Multiple named columns found");
                                }
                            }else{
                                errorOut("IDENTIFIER NAMED: ("+id+") does not exist in TABLE NAMED: ("+TEMP_TABLE+")");
                            }
                        }
                        return returner;
                    };
                    return this.CREATE_GROUPCOLUMNS;
                }else{
                    error("Array passed as argument must have at least one member or ensure argument is an array");
                }
           }else{
               log("Group columns for TABLE NAMED: ("+TEMP_TABLE+") is disabled");
           }
        }else{
            error("TABLE NAMED: ("+TEMP_TABLE+") does not exist");
        }
    };
    /** Creates one or more tables together and returns true on success
     * * STAND-ALONE FUNCTION
     */
    DB.CREATE_MULTIPLETABLES = function(array_of_ordered_table_creation){
        if(!Array.isArray(array_of_ordered_table_creation)){
            error('Requires an array as argument');
        }
        var i;
        for(i in array_of_ordered_table_creation){
            DB.TABLE(array_of_ordered_table_creation[i][0])
            .CREATECOLUMNS(array_of_ordered_table_creation[i][1])
            .IDCOLUMN(array_of_ordered_table_creation[i][2]);
        }
        return true;
    };
    /** Updates one or more rows of a table and returns true on success
     * * STAND-ALONE FUNCTION
    */
    DB.UPDATE_MULTIPLEROWS = function(array_of_columns_to_update_array,items_array_in_order_as_id_array,id_array){
        if(!array(array_of_columns_to_update_array,false)||!array(items_array_in_order_as_id_array,false)||!array(id_array,false)){
            error('Requires an array as argument');
        }
        if(items_array_in_order_as_id_array.length!=id_array.length){
            error('Array specified ('+items_array_in_order_as_id_array+') does not match with rows array ('+id_array+')');
        }
        var i;
        DB.TABLE(TEMP_TABLE);
        for(i in id_array){
            
            DB.UPDATE(array_of_columns_to_update_array,items_array_in_order_as_id_array[i]).FOR_ID(id_array[i]);
        };
        return true;
    };
    /** Creates one or more rows for group column(s) of a specified identifier. */
    DB.CREATE_GROUPROWS = function(group_colums_array,items_array){
        var pos = locateItem(TABLES,TEMP_TABLE);
        if(typeof (pos)!=="string"){
            if(TABLEGROUPS[pos]){
                if(array(group_colums_array,false)&&array(items_array,false)){
                    var len1=group_colums_array.length,len2=items_array.length;
                    if(len1>0&&len1==len2){
                        DB.CREATE_GROUPROWS.FOR_ID = function(id,strict){
                            var returner=false;
                            if(string(id,false)){
                                var id_col_pos = locateItem(TABLECOLUMNS[pos],IDS[pos]);
                                var id_ex = locateItem(COLUMNS[pos][id_col_pos],id);
                                if(typeof (id_ex)!=="string"){
                                    if(typeof (strict)!=="boolean"){
                                        strict=true;
                                    }
                                    var st=strict?1:0;
                                    var id_gcols=GROUPCOLUMNS[st][pos][id_ex],gcol_pos,id_gcol_items,i;
                                    for(i in group_colums_array){
                                        gcol_pos = locateItem(id_gcols,group_colums_array[i]);
                                        if(typeof (gcol_pos)==="string"){
                                            error("Can't create row for uncreated column named: ("+group_colums_array[i]+")");
                                        }
                                    }
                                    if(st==1){
                                        for(i in group_colums_array){
                                            gcol_pos = locateItem(id_gcols,group_colums_array[i]);
                                            id_gcol_items=S_G_COLOMNS[pos][id_ex][gcol_pos];
                                            if(!exists(id_gcol_items,items_array[i])){
                                                S_G_COLOMNS[pos][id_ex][gcol_pos].push(items_array[i]);
                                            }
                                        }
                                    }else{
                                        for(i in group_colums_array){
                                            gcol_pos = locateItem(id_gcols,group_colums_array[i]);
                                            id_gcol_items=G_COLOMNS[pos][id_ex][gcol_pos];
                                            G_COLOMNS[pos][id_ex][gcol_pos].push(items_array[i]);
                                        }
                                    }
                                    returner=true;
                                }
                            };
                            return returner;
                        };
                        return this.CREATE_GROUPROWS;
                    }
                }
            }
        }else{
            error("TABLE NAMED: ("+TEMP_TABLE+") does not exist");
        }
    };
    /** Adds one or more columns to a named table and returns true on success */
    DB.ADDCOLUMNS = function(new_columns_array){
        if(array(new_columns_array)&&new_columns_array.length>0){/* Checks if argument is an array and also ensure no empty column is created */
            if(exists(new_columns_array,'')){
                error("A table column must have a name");
            }
            var pos = locateItem(TABLES,TEMP_TABLE);/* Returns the position of the table( if exixsts else, returns a string) to work on*/ 
            if(typeof (pos)!=="string"){
                new_columns_array=stringify(new_columns_array);/* Makes sure argument is an array of strings */
                var col = TABLECOLUMNS[pos];
                col = col.concat(new_columns_array);
                /* Checks if multiple columns are created */
                if(!duplicated(col)){
                   TABLECOLUMNS[pos]=col;
                   var i,j;
                   /* Creates space for each column added */
                   for(i in new_columns_array){
                    COLUMNS[pos].push([]);
                    for(j in ROWS[pos]){
                        COLUMNS[pos][COLUMNS[pos].length-1].push('');
                    }
               }
                   /* Creates column(s) in each row of a named table */
                   for(i in ROWS[pos]){
                       for(j in new_columns_array){
                           ROWS[pos][i].push(''); 
                       }
                   }
                   
                   return true;
                }else{
                    errorOut("Couldn't add new column(s) to TABLE NAMED: ("+TEMP_TABLE+"). Remove duplicate columns");
                }
            }else{
                error("TABLE NAMED: ("+TEMP_TABLE+") does not exist");
            }
        }
    };
    /** Changes the identifier column name of the specified table and returns true on success */
    DB.CHANGE_IDCOLUMN = function(new_id){
        if(string(new_id)){
            var pos = locateItem(TABLES,TEMP_TABLE);
            if(typeof (pos)!=="string"){
                var new_id_pos=locateItem(TABLECOLUMNS[pos],new_id);
                var old_id_col=COLUMNS[pos][locateItem(TABLECOLUMNS[pos],IDS[pos])];
                if(typeof (new_id_pos)!=="string"){
                    var needed_col=COLUMNS[pos][new_id_pos];
                    if(!exists(needed_col,'')&&needed_col.length==old_id_col.length){
                        if(!duplicated(needed_col)){
                            IDS[pos]=new_id;
                            ROWIDS[pos]=needed_col;
                            log("IDENTIFIER for ("+TEMP_TABLE+") successfully changed to ("+new_id+")");
                            return true;
                        }else{
                            errorOut("Change of IDENTIFIER COLUMN for TABLE NAMED: ("+TEMP_TABLE+") from ("+IDS[pos]+") to ("+new_id+") was unsuccessful. Eacc row in COLUMN: ("+new_id+") must be unique.");
                        }
                    }else{
                        errorOut("Change of IDENTIFIER COLUMN for TABLE NAMED: ("+TEMP_TABLE+") from ("+IDS[pos]+") to ("+new_id+") was unsuccessful. Empty row(s) found.");
                    }
                }else{
                    error("IDENTIFIER COLUMN NAMED: ("+new_id+") does not exist in TABLE NAMED: ("+TEMP_TABLE+")");
                }
            }else{
                error("TABLE NAMED: ("+TEMP_TABLE+") does not exist");
            }
        }
    };
    /*** CLEARS ENTIRE DATABASE
     ** STAND-ALONE FUNCTION
    */
    DB.CLEAR =function(){
        clear(S_G_COLOMNS)(G_COLOMNS)(ROWS)(ROWIDS)(TABLES)(IDS)
        (GROUPCOLUMNS[0])(GROUPCOLUMNS[1])(TABLECOLUMNS)(COLUMNS)(TABLEGROUPS);
        log("Database cleared. FILE: "+DB_FILE);
    };
    /** Renames a named table and returns true on success */
    DB.RENAMETABLE = function(new_name){
        if(string(new_name)){
            var pos = locateItem(TABLES,TEMP_TABLE);
            if(typeof (pos)==="string"){
                errorOut("TABLE NAMED: ("+TEMP_TABLE+") does not exist");
                return false;
            }
            if(exists(TABLES,new_name)){
                errorOut("TABLE NAMED: ("+new_name+") is in use");
                return false;
            }
            if(new_name===''){
                error("A table must have a name");
            }
            TABLES[pos] = new_name;
            log("TABLE NAMED: ("+TEMP_TABLE+") successfully renamed to ("+new_name+")");
            return true;
        }
    };
    /** Deletes a named table and returns true on success */
    DB.DELETETABLE = function(){
        var pos = locateItem(TABLES,TEMP_TABLE);
        if(typeof (pos)==="string"){
            errorOut("Deletion unsuccessful. TABLE NAMED: ("+TEMP_TABLE+") does not exist");
            return false;
        }
        TABLES.splice(pos,1);
        TABLECOLUMNS.splice(pos,1);
        IDS.splice(pos,1);
        ROWS.splice(pos,1);
        ROWIDS.splice(pos,1);
        COLUMNS.splice(pos,1);
        if(TABLEGROUPS[pos]){
            GROUPCOLUMNS[0].splice(pos,1);
            GROUPCOLUMNS[1].splice(pos,1);
            S_G_COLOMNS.splice(pos,1);
            G_COLOMNS.splice(pos,1);
            TABLEGROUPS.splice(pos,1);
        }
        log("TABLE NAMED: ("+TEMP_TABLE+") successfully deleted.");
        return true;
    };
    DB.DELETEROW = function(id_of_row_to_del){
        var pos = locateItem(TABLES,TEMP_TABLE);
        if(typeof (pos)==="string"){
            errorOut("Deletion unsuccessful. TABLE NAMED: ("+TEMP_TABLE+") does not exist");
            return false;
        }
        var id_col_pos = locateItem(TABLECOLUMNS[pos],IDS[pos]);
        var id_pos = locateItem(COLUMNS[pos][id_col_pos],id_of_row_to_del);
        if(typeof (id_pos)==="string"){
            log("Deletion unsuccessful. IDENTIFIER NAMED: ("+id_of_row_to_del+") does not exist.");
            return false;
        }
        var i;
        for(i in COLUMNS[pos]){
            COLUMNS[pos][i].splice(id_pos,1);
        }
        if(TABLEGROUPS[pos]){
            S_G_COLOMNS[pos].splice(id_pos,1);
            G_COLOMNS[pos].splice(id_pos,1);
            GROUPCOLUMNS[0][pos].splice(id_pos,1);
            GROUPCOLUMNS[1][pos].splice(id_pos,1);
        }
        ROWIDS[pos].splice(id_pos,1);
        ROWS[pos].splice(id_pos,1);
        log("IDENTIFIER NAMED: ("+id_of_row_to_del+") successfully deleted from TABLE NAMED: ("+TEMP_TABLE+")");
        return true;
    };
    /** Renames existing columns of a named table and returns true on success */
    DB.RENAMECOLUMNS = function(old_names_array,new_names_array){
        var pos = locateItem(TABLES,TEMP_TABLE);
        if(typeof (pos)!=="string"){
            if(exists(new_names_array,'')){
                error("A table column must have a name");
            }
            if(array(new_names_array)&&array(old_names_array,false)&&old_names_array.length>0){
                if(old_names_array.length==new_names_array.length){
                    new_names_array=stringify(new_names_array);
                    old_names_array=stringify(old_names_array);
                    var T_pos=TABLECOLUMNS[pos],old_pos,ld_pos,i,j;
                    var id_pos=locateItem(TABLECOLUMNS[pos],IDS[pos]);
                    for(j in new_names_array){
                        ld_pos = locateItem(T_pos,old_names_array[j]);
                        if(typeof (ld_pos)==="string"){
                            error('COLUMN NAMED: ('+old_names_array[j]+') does not exist in TABLE NAMED: ('+TEMP_TABLE+')');
                        }
                        if(exists(T_pos,new_names_array[j])){
                            errorOut("COLUMN NAMED: ("+new_names_array[j]+") is in use");
                            return false;
                        }
                    }
                    for(i in old_names_array){
                        old_pos = locateItem(T_pos,old_names_array[i]);
                        T_pos[old_pos]=new_names_array[i];
                    }
                    TABLECOLUMNS[pos]=T_pos;
                    IDS[pos]=T_pos[id_pos];
                    log("TABLE COLUMNS of TABLE NAMED: ("+TEMP_TABLE+") successfully amended. New list of columns is ("+TABLECOLUMNS[pos]+")");
                    return true;
                }else{
                    errorOut("Array lengths do not match");
                    return false;
                }
            }
        }else{
            error("TABLE NAMED: ("+TEMP_TABLE+") does not exist");
        }
    };
    /**Use to either allow or disallow database loggings in console. Set to a boolean to either allow logs or not. */
    DB.LOGS=false;
    /**Use to either allow or disallow detection of database errors. Set to a boolean to either allow or disallow. */
    DB.ERRORS=false;
    DB.GROUPS=true;
    /** Creates row(s) for a named table and returns true if successful else, returns false */
    DB.CREATEROWS = function(id_array){
        var pos = locateItem(TABLES,TEMP_TABLE),feedback=false;
        if(typeof (pos)==="string"){
            error("TABLE NAMED: ("+TEMP_TABLE+") does not exist");
        }
        if(array(id_array,false)&&id_array.length>0){
            var i,j,R_ids=ROWIDS[pos],T_col=TABLECOLUMNS[pos],T_id=IDS[pos],cur_row,give_access=true;
            R_ids=R_ids.concat([]);
            for(i in id_array){
                if(R_ids.includes(id_array[i])){
                    give_access=false;break;
                }
                R_ids.push(id_array[i]);
            }
            // R_ids=R;
            /* 
                R_ids=R_ids.concat(id_array); if(!duplicated(R_ids))
                give_access is rather used for fast execution
            */
            if(give_access){
                for(i in id_array){
                    cur_row=[];
                    for(j in T_col){
                        if(T_col[j]!==T_id){
                            cur_row.push('');
                            COLUMNS[pos][j].push('');
                        }else{
                            cur_row.push(id_array[i]);
                            COLUMNS[pos][j].push(id_array[i]);
                        }
                    }
                    ROWS[pos].push(cur_row);
                    ROWIDS[pos].push(id_array[i]);
                    if(TABLEGROUPS[pos]){
                        S_G_COLOMNS[pos].push([]);
                        G_COLOMNS[pos].push([]);
                        GROUPCOLUMNS[1][pos].push([]);
                        GROUPCOLUMNS[0][pos].push([]);
                    }
                }
                feedback=true;
            }
        }
    return feedback;
    };
    /**Updates the column(s) specified of a named table
    ** Returns true if successful else, returns false
     */
    DB.UPDATE = function(columns_to_update_array,items_array){
        var pos = locateItem(TABLES,TEMP_TABLE);
        if(typeof (pos)!=="string"){
            if(array(columns_to_update_array,false)&&array(items_array,false)){
                /* Gives access to the ID function of UPDATE */
                if(columns_to_update_array.length==items_array.length&&items_array.length>0){
                    DB.UPDATE.FOR_ID = function(id){
                        var returner=false,j,allow;
                        for(j in columns_to_update_array){
                            allow=locateItem(TABLECOLUMNS[pos],columns_to_update_array[j]);
                            if(typeof (allow)==="string"){
                                errorOut('COLUMN NAMED: ('+columns_to_update_array[j]+') does not exist in TABLE NAMED: ('+TEMP_TABLE+')');
                                return false;
                            }
                        }
                        if(string(id,false)){
                            var i,up_id=locateItem(TABLECOLUMNS[pos],IDS[pos]),updatable;
                            var up_col=COLUMNS[pos][up_id],id_pos=locateItem(up_col,id);
                            if(typeof (id_pos)!=="string"){/* Checks if id exists */
                                var up_or_not=locateItem(columns_to_update_array,IDS[pos]),not_or_up=false,update=false;
                                if(typeof (up_or_not)!=="string"){
                                    not_or_up=!exists(up_col,items_array[up_or_not])&&items_array[up_or_not]!=='';
                                }
                                if(not_or_up){
                                    update=true;
                                }else{
                                    if(typeof (up_or_not)==="string"){
                                        update=true;
                                    }
                                }
                                if(update){
                                    for(i in columns_to_update_array){
                                        updatable= locateItem(TABLECOLUMNS[pos],columns_to_update_array[i]);
                                        if(updatable==up_id){
                                            ROWIDS[pos][id_pos]=items_array[i];
                                        }
                                        ROWS[pos][id_pos][updatable]=items_array[i];
                                        COLUMNS[pos][updatable][id_pos]=items_array[i];
                                    }
                                    returner=true;
                                }
                            } 
                        };
                        
                        return returner;
                    };
                    return this.UPDATE;
                }
            }
        }else{
            error("TABLE NAMED: ("+TEMP_TABLE+") does not exist");
        }
    };
    DB.DELETE = function(arr_of_cols_to_del){
        DB.DELETE.FOR_ID = function(id){
            if(array(arr_of_cols_to_del,false)){
                var i,arr=[];
                for(i in arr_of_cols_to_del){
                    arr.push("");
                }
                
                if(!DB.UPDATE(arr_of_cols_to_del,arr).FOR_ID(id)){
                    log("Deletion unsuccessful.");
                    return false;
                }
                log("Deletion successful.");
                return true;
            }else{
                log("Deletion unsuccessful. Argument must be an array.");
                return false;
            }
        };
        return this.DELETE;
    };
    DB.GET_COLUMNCONTENTS = function(array_of_columns){
        var pos = locateItem(TABLES,TEMP_TABLE),returner={};
        if(typeof (pos)!=="string"){
            var j,allow,i;
            for(j in array_of_columns){
                allow=locateItem(TABLECOLUMNS[pos],array_of_columns[j]);
                if(typeof (allow)==="string"){
                    errorOut('COLUMN NAMED: ('+array_of_columns[j]+') does not exist in TABLE NAMED: ('+TEMP_TABLE+')');
                    return returner;
                }
            }
            for(i in array_of_columns){
                allow=locateItem(TABLECOLUMNS[pos],array_of_columns[i]);
                returner[array_of_columns[i]]=COLUMNS[pos][allow];
            }
        }else{
            error("TABLE NAMED: ("+TEMP_TABLE+") does not exist");
        }
        return returner;
    };
    /**Document-embedded querying function 
    ** STAND-ALONE FUNCTION
    */
    DB.RETRIEVE = function(str,hashtag){
        var returner = '',i,ser,serr;
        var que=[],id_n=[],res=[],lol,l1,l2;
        if(string(str,false)){
            function process(str){
                for(i in str){
                    if(str[i]!==''){
                        l1 = locateItem(id_n,str[i]);
                        l2 = locateItem(que,str[i]);
                        if(typeof (l1)!=="string"){
                            que.push(que[l1]);
                            id_n.push(str[i]);
                            serr=str[i];
                            str[i]=res[l1];
                            res.push(res[l1]);
                        }else if(typeof (l2)!=="string"){
                            que.push(que[l2]);
                            id_n.push(id_n[l2]);
                            serr=id_n[l2];
                            str[i]=res[l2];
                            res.push(res[l2]);
                        }else{
                            ser=get('??'+str[i]+'??',hashtag);
                            if(ser!==str[i]){
                                que.push(str[i]);
                                id_n.push('/>');
                                str[i]=ser;
                                res.push(ser);
                            }
                        }
                    }
                };
                 return str.join('');
            };
           if(str.includes('<id=')&&str.includes('/>')){
                str=str.split('<id=');
                for(i in str){
                    if(!str[i].includes('/>')&&str[i].includes('??')&&str[i].includes('.')&&str[i].includes('@')&&str[i].includes(')')&&str[i].includes('(')){
                        str[i]=str[i].split('??');
                        if(str[i][0]!==''){
                            lol=locateItem(id_n,'<'+str[i][0]);
                            if(typeof (lol)==='string'){/* Query if value has not been requested already  */
                                serr='<'+str[i].shift();
                                id_n.push(serr);
                                str[i]=str[i][0];
                                que.push(str[i]);
                                str[i]=get('??'+str[i]+'??',hashtag);
                                res.push(str[i]);
                            }else{/* Don't query database if value requested is already retrieved  */
                                id_n.push('<'+str[i][0]);
                                serr='<'+str[i][0];
                                que.push(str[i][1]);
                                str[i]=res[lol];
                                res.push(res[lol]);
                            }
                        }else{
                            if(str[i].length>1){
                                str[i].shift();
                                if(str[i][str[i].length-1]===''){
                                    str[i].pop();
                                }
                            }
                            str[i]=process(str[i]);
                        }
                    }else{
                        if(str[i].includes('/>')){
                            serr=serr.split('');
                            serr.shift();
                            serr.pop();
                            serr=serr.join('');
                            if(str[i].includes(serr+'/>')){
                                str[i]=str[i].split(serr+'/>');
                                str[i].shift();
                                str[i]=str[i].join('');
                            }
                        } 
                        str[i]=str[i].split('??');
                        str[i]=process(str[i]);
                    }
                }
                returner=str.join('');
           }else{
                str=str.split('??');
                returner = process(str);
           }
            
        }
        que=null,id_n=null,res=null;
        return returner;
    };
    /**Checks if an identifier exists in a table. Returns true if exists else, false
    ** STAND-ALONE FUNCTION
    */
    DB.IDEXISTS = function(table_name,id){
        return idExists(table_name,id);
    };
    /** Use to query database. Queries a single table at a time.
    ** Returns an array of data retrieved from the database in the order it was queried.
    ** Returns false if unsuccessful 
    ** STAND-ALONE FUNCTION 
    */
    DB.QUERY = function(str){
        var returner = false,i=0,cols,obj,j;
        if(string(str,false)){
            str=str.split('??');
            str.shift();str.pop();
            var table_name,id;
            if(str[i][0]==='<'&&str[i][str[i].length-1]==='>'){
                if(str[i].includes('.')&&str[i].includes('@')&&str[i].includes(')')&&str[i].includes('(')){
                    table_name='.',id='';
                    str[i]=str[i].split('');
                    str[i].shift();
                    str[i].pop();
                    str[i]=str[i].join('');
                    str[i]=str[i].split('@');
                    id=str[i].pop();
                    str[i]=str[i][0].split('.');
                    table_name=str[i].shift();
                    if(idExists(table_name,id)){
                        str[i]=str[i][0].split('');
                        str[i].shift();
                        str[i].pop();
                        str[i]=str[i].join('');
                        cols=str[i].split(',');
                        returner=query(table_name,cols,id);
                        if(typeof (returner)!=='boolean'){
                            obj={};
                            for(j in cols){
                                if(cols[j].startsWith('+',0)||cols[j].startsWith('-',0)){
                                    cols[j]=cols[j].split('');
                                    cols[j].shift();
                                    cols[j]=cols[j].join('');
                                }
                                obj[cols[j]]=returner[j];
                            }
                            returner=obj;
                        }
                    }
                }
            }
        }

        return returner;
    };
    /**Saves data in memory as of the time called to the database. 
     
      **If none of the save function is called, data remains in memory and no data is stored in database.
      Data in memory is lost if server breaks or stops running*

      ***STAND**-**ALONE** **FUNCTION**
    */
    DB.SAVE = function(){
        save();
    };
    /**Saves data in memory to the database. Call it once anywhere in the code and it saves evrything till the last
     
      **If none of the save function is called, data remains in memory and no data is stored in database.
      Data in memory is lost if server breaks or stops running*

      ***STAND**-**ALONE** **FUNCTION**
    */
    DB.SAVEALL = function(){
        saveAll();
    };
    /** Takes a new path to save an instance of the database at the time called
     ** The new path must not be in any format, e.g "./mynewdata_house" or "/myProject/src/data_house";
     ** The file is stored in a .js format.

     ***STAND-ALONE FUNCTION**
    */
    DB.SAVETO = function(new_file_path){
        if(typeof (new_file_path)==="string"&&new_file_path!==''){
            var old_path = DB_FILE;
            if(new_file_path!==old_path){
                data_path(new_file_path);
                save();
                data_path(old_path);
            }
        }
    };
    /**Returns a string of local date with time separated with a colons
     @example 2021:05:14:23:24:43
     STAND-ALONE FUNCTION
    */
    DB.TIMESTAMP = function(){
        return date().stamp;
    };
    /**Returns an object representing date and time now per loacal time
     
    ***STAND-ALONE FUNCTION**
    */
    DB.DATE = function(){
        return date();
    };
    /**Returns the time diferrence between the timestamp passed as an argument
    
     
    ***STAND-ALONE FUNCTION**
     @argument timestamp string
     @example DB.TIMEDIFF(DB.TIMESTAMP()): "6 seconds ago"
    */
    DB.TIMEDIFF = function(date_stamped){
        return dateAgo(date_stamped);
    };

    /* HELPER FUNCTIONS */
    function get(str,hashtag){
        var i,j;
        if(str==='????'){return '';};
        str=str.split('??');
        str.pop();
        str.shift();
        var arr,table_name,id;
        for(i in str){
            if(str[i][0]==='<'&&str[i][str[i].length-1]==='>'){
                if(str[i].includes('.')&&str[i].includes('@')&&str[i].includes(')')&&str[i].includes('(')){
                    table_name='.',id='';
                    str[i]=str[i].split('');
                    str[i].shift();
                    str[i].pop();
                    str[i]=str[i].join('');
                    str[i]=str[i].split('@');
                    id=str[i].pop();
                    if(id===''){
                        id=hashtag;
                        if(typeof (hashtag)==='undefined'){
                            id='';
                        }
                    }
                    str[i]=str[i][0].split('.');
                    table_name=str[i].shift();
                    if(idExists(table_name,id)){
                        str[i]=str[i][0].split('');
                        str[i].shift();
                        str[i].pop();
                        str[i]=str[i].join('');
                        arr=query(table_name,str[i].split(','),id);
                        for(j in arr){
                            if(Array.isArray(arr[j])){
                                arr[j]=arr[j].join('');
                            }
                        }
                        str[i]=arr.join('');
                    }else{
                        errorOut('IDENTIFIER NAMED: ('+id+') does not exist in TABLE NAMED: ('+table_name+')');
                    }
                }
            }
        }
        return str.join('');
    };
    function data_path(file_path){
         DB_FILE=file_path;
    };
    function nothing(){};
    var stime_hld=setTimeout(nothing,0),stime_hld_all=setTimeout(nothing,0);

    async function save_to(){
        var mdd=DB_FILE;
        await fs.writeFileSync(DB_FILE+".js", create_datastring());
        log("Changes saved. FILE: "+mdd);
    };
    function w_FUNCC(mdd,sALL){
        //clearTimeout(stime_hld_all);stime_hld_all=nothing;
        fs.writeFile(mdd+".js",sALL,function(err){
            if(err){
                log("Saving error");
            }else{
                log("Changes saved. FILE: "+mdd);
            }
        });
    };
    function w_FUNC(mdd,sALL){
        clearTimeout(stime_hld_all);stime_hld_all=nothing;
        var wrt=fs.createWriteStream(mdd+".js","utf8");
        wrt.write(sALL,function(err){
            if(err){
                w_FUNCC(mid,sALL);
            }else{
                log("Changes saved. FILE: "+mdd);
            }
        });
        wrt.close();
    };
    function s_aLLL(){
        //clearTimeout(stime_hld);stime_hld=nothing;
        var mdd=DB_FILE;
         fs.writeFile(mdd+".js",create_datastring(),function(err){
             if(err){
                 log("Saving error");
             }else{
                 log("Changes saved. FILE: "+mdd);
             }
         });
     };
     function s_aLL(){
        clearTimeout(stime_hld);stime_hld=nothing;
        var mdd=DB_FILE;
        var wrt=fs.createWriteStream(mdd+".js","utf8");
         wrt.write(create_datastring(),function(err){
             if(err){
                 s_aLLL();
             }else{
                 log("Changes saved. FILE: "+mdd);
             }
         });
         wrt.close();
     };
    function save(){
        clearTimeout(stime_hld);
        stime_hld=setTimeout(w_FUNC,0,DB_FILE,create_datastring());
    };
    function saveAll(){
        clearTimeout(stime_hld_all);
        stime_hld_all=setTimeout(s_aLL,0);
    };
    function Save(){
        fs.writeFileSync(DB_FILE+".js", create_datastring());
    };
    function require_data(){
        var data = require(DB_FILE);
        IDS = data.IDS;
        ROWS = data.ROWS;
        ROWIDS = data.ROWIDS;
        TABLES = data.TABLES;
        COLUMNS = data.COLUMNS;
        G_COLOMNS = data.G_COLOMNS;
        S_G_COLOMNS = data.S_G_COLOMNS;
        GROUPCOLUMNS = data.GROUPCOLUMNS;
        TABLECOLUMNS = data.TABLECOLUMNS;
        TABLEGROUPS = data.TABLEGROUPS;
        data=null;
    };
    function create_datastring(){
        var sTABLES,sTABLECOLUMNS,sIDS,sROWS,sROWIDS,sdata,sTABLEGROUPS;
        var sCOLUMNS,sGROUPCOLUMNS,sS_G_COLOMNS,sG_COLOMNS,mod;
        sTABLES ="\ndata.TABLES = "+JSON.stringify(TABLES)+";\n";
        sTABLECOLUMNS ="\ndata.TABLECOLUMNS = "+JSON.stringify(TABLECOLUMNS)+";\n";
        sTABLEGROUPS="\ndata.TABLEGROUPS = "+JSON.stringify(TABLEGROUPS)+";\n";
        sIDS ="\ndata.IDS = "+JSON.stringify(IDS)+";\n";
        sROWS ="\ndata.ROWS = "+JSON.stringify(ROWS)+";\n";
        sROWIDS ="\ndata.ROWIDS = "+JSON.stringify(ROWIDS)+";\n";
        sCOLUMNS ="\ndata.COLUMNS = "+JSON.stringify(COLUMNS)+";\n";
        sGROUPCOLUMNS ="\ndata.GROUPCOLUMNS = "+JSON.stringify(GROUPCOLUMNS)+";\n";
        sS_G_COLOMNS ="\ndata.S_G_COLOMNS = "+JSON.stringify(S_G_COLOMNS)+";\n";
        sG_COLOMNS ="\ndata.G_COLOMNS = "+JSON.stringify(G_COLOMNS)+";\n";
        mod ="\nmodule.exports = data;\n";sdata="\nconst data = {};\n";
        return sdata+sTABLES+sTABLECOLUMNS+sTABLEGROUPS+sIDS+sROWS+sROWIDS+sCOLUMNS+sGROUPCOLUMNS+sS_G_COLOMNS+sG_COLOMNS+mod;
    }
    function string(str,arg){
        var returner = false;
        if(typeof (str)!=="string"){
            log("Requires a string as argument");
        }else{
            returner = true;
            if(typeof (arg)!=="boolean"){
                arg=true;
            }
           if(arg){
                returner = accept(str);
           }
        };
        return returner;
    };
    function array(arr,arg){
        var returner=false;
        if(!Array.isArray(arr)){
            log("Requires an array as argument");
        }else{
            returner=true;
            if(typeof (arg)!=="boolean"){
                arg=true;
            }
            if(arg){
                returner = accept(arr.toString());
            };
        };
        return returner;
    };
    function accept(str){
        var returner=true;
        var EXCLUSION = "?(>.+@-<)",i;
        for(i in EXCLUSION){
            if(str.includes(EXCLUSION[i])){
                returner=false;
                error('Unacceptable character: ("'+EXCLUSION[i]+'") found');
                break;
            }
        }
        return returner;
    };
    function exists(arr,item){
        return arr.includes(item);
    };
    function locateItem(arr,item){
        if(exists(arr,item)){
            return arr.indexOf(item);
        }
        return "false";
    };
    function stringify(arr){
        return arr.toString().split(',');
    };
    function duplicated(arr) {
        var i,yes=false,len=arr.length-1;
        for(i=0;i<len;i++){
            if(arr.includes(arr[i],Number(i+1))){
                yes=true;break;
            }
        };
        return yes;
    };
    function errorOut(str) {
        if(DB.ERRORS){
            throw new Error(str);
        }else{
            console.log(str);
        }
    };
    function error(str) {
        throw new Error(str);
    };
    function log(str){
        if(DB.LOGS){
            console.log(str);
        }
    };
    function clear(arr){
        arr.splice(0,arr.length);
        return clear;
    };
    function idExists(table_name,id){
        var yes_or_no=false;
        if(string(id,false)){
            var pos = locateItem(TABLES,table_name);
            if(typeof (pos)!=="string"){
                var id_col_pos = locateItem(TABLECOLUMNS[pos],IDS[pos]);
                var id_ex = locateItem(COLUMNS[pos][id_col_pos],id);
                if(typeof (id_ex)!=="string"){
                    yes_or_no=true;
                }
            }
        };
        return yes_or_no;
    };
    function query(table_name,columns_array,id){
        var return_arr=[];
        var pos = locateItem(TABLES,table_name);
        if(typeof (pos)!=="string"){
            var id_col_pos = locateItem(TABLECOLUMNS[pos],IDS[pos]);
            var id_ex = locateItem(COLUMNS[pos][id_col_pos],id);
            if(typeof (id_ex)!=="string"){
                var i,st,ith_col_pos,stct;
                for(i in columns_array){
                    st=3;
                    if(columns_array[i][0]==='+'){
                        st=1;
                    }else if(columns_array[i][0]==='-'){
                        st=0;
                    }
                    if(st>1){/* Normal column query */
                        ith_col_pos = locateItem(TABLECOLUMNS[pos],columns_array[i]);
                        if(typeof (ith_col_pos)==="string"){
                            error('COLUMN NAMED: ('+columns_array[i]+') is not created in TABLE NAMED: ('+table_name+')');
                        }
                        return_arr.push(COLUMNS[pos][ith_col_pos][id_ex]);
                    }else{/* Group column query */
                        stct=columns_array[i].split('');
                        stct.shift();
                        stct=stct.join('');
                        ith_col_pos = locateItem(GROUPCOLUMNS[st][pos][id_ex],stct);
                        if(typeof (ith_col_pos)==="string"){
                            error('GROUPCOLUMN NAMED: ('+stct+') is not created in TABLE NAMED: ('+table_name+')');
                        }
                        if(st==1){
                            return_arr.push(S_G_COLOMNS[pos][id_ex][ith_col_pos]);
                        }else{
                            return_arr.push(G_COLOMNS[pos][id_ex][ith_col_pos]);
                        }
                    }
                }
            }else{
                return_arr=false;
            }
        };
        return return_arr;
    };
    function date(){
        const d={};
        var dt=new Date(),i;
        dt=dt.toUTCString();
        dt=dt.split(" ");
        dt[0]=dt[0].split("");
        dt[0].pop();
        dt[0]=dt[0].join("");
        d.day=Number(dt[1]);
        d.dayToWord=dt[0];
        d.month=0;
        d.monthToWord=dt[2];
        d.year=Number(dt[3]);
        d.time=dt[4].split(":");
        d.time.pop();
        d.time=d.time[0]+":"+d.time[1];
        d.timeWithSecond=dt[4];
        d.formart=dt[5];
        var Time=dt[4];
        Time=Time.split(":");
        d.hour=Number(Time[0]);
        d.minute=Number(Time[1]);
        d.second=Number(Time[2]);
        for(i=0;i<12;i++){
            if(mon[i].startsWith(dt[2].toLowerCase(),0)){
                d.month=i+1;
                break;
            }
        }
       // d.calculateable=d.year+":"+d.month+":"+d.day+":"+d.hour+":"+d.minute+":"+d.second;
        d.stamp=d.year+":"+d.month+":"+d.day+":"+d.timeWithSecond;
        return d;
    };
    function oneOrmore(num,str){
        if(num>1){
            str+="s";
        }
        return num+""+str+" ago";
    };
    function det_ret(ret,r1,r2,div,main,alt,r11,r22){
        if(r2<r1){
            ret-=1;
        }
        if(r2==r1){
            if(typeof (r22)==="number"){
                if(r22<r11){
                    ret-=1;
                }
            }
        }
        if(ret==0){
            var r=(div-r1)+r2;
            if(r>=div){
                return oneOrmore(1," "+main);
            };
            return oneOrmore(r," "+alt);
        };
        return oneOrmore(ret," "+main);
    };
    function dateAgo(date_stamp){
        var dte=date();
        var time2=dte.stamp.split(":");
        var time1=date_stamp.split(":");
        var ret="";
        switch(time1[0]!==time2[0]){
            case true:
                ret=Number(time2[0])-Number(time1[0]);
                ret = det_ret(ret,Number(time1[1]),Number(time2[1]),12,"year","month",Number(time1[2]),Number(time2[2]));
                break;
            case false:
                switch(time1[1]!==time2[1]){
                    case true:
                        ret=Number(time2[1])-Number(time1[1]);
                        if(Number(time1[1])==2){
                            if(Number(time1[1])%4==0){
                                ret = det_ret(ret,Number(time1[2]),Number(time2[2]),29,"month","day",Number(time1[3]),Number(time2[3]));
                            }else{
                                ret = det_ret(ret,Number(time1[2]),Number(time2[2]),28,"month","day",Number(time1[3]),Number(time2[3]));
                            }
                        }else if(Number(time1[1])==9||Number(time1[1])==4||Number(time1[1])==6||Number(time1[1])==11){
                            ret = det_ret(ret,Number(time1[2]),Number(time2[2]),30,"month","day",Number(time1[3]),Number(time2[3]));
                        }else{
                            ret = det_ret(ret,Number(time1[2]),Number(time2[2]),31,"month","day",Number(time1[3]),Number(time2[3]));
                        }
                        break;
                    case false:
                        switch(time1[2]!==time2[2]){
                            case true:
                                ret=Number(time2[2])-Number(time1[2]);
                                ret = det_ret(ret,Number(time1[3]),Number(time2[3]),24,"day","hour",Number(time1[4]),Number(time2[4]));
                                break;
                            case false:
                                switch(time1[3]!==time2[3]){
                                    case true:
                                        ret=Number(time2[3])-Number(time1[3]);
                                        ret = det_ret(ret,Number(time1[4]),Number(time2[4]),60,"hour","minute",Number(time1[5]),Number(time2[5]));
                                        break;
                                    case false:
                                        switch(time1[4]!==time2[4]){
                                            case true:
                                                ret=Number(time2[4])-Number(time1[4]);
                                                ret = det_ret(ret,Number(time1[5]),Number(time2[5]),60,"minute","second");
                                                break;
                                            case false:
                                                switch(time1[5]!==time2[5]){
                                                    case true:
                                                        ret=Number(time2[5])-Number(time1[5]);
                                                        ret=oneOrmore(ret," second");
                                                        break;
                                                    case false:
                                                        ret="now";
                                                }
                                        }
                                }
                        }
                }
        };
        return ret;
    };

    return DB;

    /*
     NOT IN USE...ENHANCED FUNCTIONS ARE CREATED IN PLACE OF THESE 

     DB.UNSTRICTGROUPCOLUMNS = function(cols_array){
        var pos = locateItem(TABLES,TEMP_TABLE);
        if(pos!=="false"){
            if(array(cols_array)&&cols_array.length>0){
                cols_array=stringify(cols_array);
                DB.UNSTRICTGROUPCOLUMNS.ID = function(id){
                    if(string(id,false)){
                        var id_col_pos=locateItem(TABLECOLUMNS[pos],IDS[pos]);
                        var id_ex = locateItem(COLUMNS[pos][id_col_pos],id);
                        if(id_ex!=="false"){
                            var _cols=GROUPCOLUMNS[0][pos][id_ex],all_cols=_cols.concat(cols_array);
                            if(!duplicated(all_cols)){
                                    var i;
                                    for(i in cols_array){
                                        GROUPCOLUMNS[0][pos][id_ex].push(cols_array[i]);
                                    }
                            }
                        }
                    }
                }
                return this.UNSTRICTGROUPCOLUMNS;
            }
        }
    };
    DB.retriev = function(str,hashtag){
        var returner = '',i,j;
        if(string(str,false)){
            str=str.split('??');
            var arr,table_name,id;
            for(i in str){
                if(str[i][0]==='<'&&str[i][str[i].length-1]==='>'){
                    if(str[i].includes('.')&&str[i].includes('@')&&str[i].includes(')')&&str[i].includes('(')){
                        table_name='.',id='';
                        str[i]=str[i].split('');
                        str[i].shift();
                        str[i].pop();
                        str[i]=str[i].join('');
                        str[i]=str[i].split('@');
                        id=str[i].pop();
                        if(id===''){
                            id=hashtag;
                            if(typeof (hashtag)==='undefined'){
                                id='';
                            }
                        }
                        str[i]=str[i][0].split('.');
                        table_name=str[i].shift();
                        if(idExists(table_name,id)){
                            str[i]=str[i][0].split('');
                            str[i].shift();
                            str[i].pop();
                            str[i]=str[i].join('');
                            arr=query(table_name,str[i].split(','),id);
                            for(j in arr){
                                if(Array.isArray(arr[j])){
                                    arr[j]=arr[j].join('');
                                }
                            }
                            str[i]=arr.join('');
                        }else{
                            str[i]='';
                        }
                    }
                }
            }
            returner = str.join('');
        }
        return returner;
    };

     */

};
module.exports=DATABASE;

//2021:5:14:20:35:03
var d=DATABASE.new("./newDB");
d.LOGS=true;
console.log(d.DATE());


