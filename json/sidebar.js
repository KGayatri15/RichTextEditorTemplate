
var sidebar = {
    // 'sidebar':{
        'name':'div',
        'class':'row',
        'menu':{
            'name':'div',
            'class':'menu col-md-4',
            'frontEnd':{
                'name':'ul',
                'id':'frontEnd',
                'workspace':{
                        'name':'li',
                        'span':{
                            'name':'span',
                            'class':'caret',
                            'innerText':'Workspace'
                        },
                        'list':{
                            'name':'ul',
                            'class':'nested',
                            'id':'workspace',
                        }
                }
            }
        }
  //  }
};
var example = {
    'name':'li',
    'children':{
        'span':{
            'name':'span',
            'class':'caret',
            'innerText':'', //inner Text will be included
        },
        'list':{
            'name':'ul',
            'class':'nested',
            'id':'' //id - Unique ID with which directory handle of this folder can ke retrieved from indexDB
        }
    }
}
var directoryJSON = {
    'li':{
    'name':'li',
    'span':{
        'name':'span',
        'class':'caret',
        'innerText':'', //inner Text will be included
    },
    'list':{
        'name':'ul',
        'class':'nested',
        'id':'' //id - Unique ID with which directory handle of this folder can ke retrieved from indexDB
    }
    }
}
var fileJSON = {
    'name':'li',
    'id':'', //id - Unique ID with which file handle of this file retrieved from indexDB
     'class':'file',//used for opening file
     'innerText':''
     //innerText - name of the file
}