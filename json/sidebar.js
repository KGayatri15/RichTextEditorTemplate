
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
                'children':[{
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
                            'children':[

                            ]
                        }
                }]
            }
        }
  //  }
};
var directoryJSON = {
    'name':'li',
    'span':{
        'name':'span',
        'class':'caret',
        //inner Text will be included
    },
    'list':{
        'name':'ul',
        'class':'nested',
        //id - Unique ID with which directory handle of this folder can ke retrieved from indexDB
    }
}
var fileJSON = {
    'name':'list',
     //id - Unique ID with which file handle of this file retrieved from indexDB
     'class':'file',//used for opening file
     //innerText - name of the file
}