let fileHandle;
const pickerOpts = {
    types: [
      {
        description: '.txt,.html,.js,.json,.csv,.xml,.xlsx,.jpg,jpeg,.png',
        accept: {
          'text/*':['.txt','.html','.json','.js'],
          'iamge/*':['jpg','jpeg','png']
        }
      },
    ],
    excludeAcceptAllOption: true,
    multiple: false
};
class processFS{
    static async NewFile(event){
        event.preventDefault();
        if(!fileHandle || document.getElementById('textBox').innerText.length < 1){
            document.getElementById('textBox').innerText = '';     
        }else{
            if(confirm('You want to erase the content ?')){
                document.getElementById('textBox').innerText = '';     
            }
        }
    }
    static async saveFile(event){
        event.preventDefault();
        console.log('File Handle ' + fileHandle);
        if(fileHandle === undefined){
            await processFS.saveAsFile(event);
        }else{
            const writable = await fileHandle.createWritable();
            await writable.write(document.getElementById('textBox').innerText);
            await writable.close();
        }
    }
    static async saveAsFile(event){
        event.preventDefault();
        const newHandle = await window.showSaveFilePicker(pickerOpts);
        const writableStream = await newHandle.createWritable();
        await writableStream.write(document.getElementById('textBox').innerText);
        await writableStream.close();
        fileHandle = newHandle;
    }
    static async readFile(event){
        event.preventDefault();
        if(fileHandle){
            if(confirm('Want to erase all the changes made it to the file')){
                await this.Open(event);
            }
        }else{
            await this.Open(event);
        }
    }
    static async Open(event,handle){
        event.preventDefault();
        if(!handle){
        [fileHandle] = await window.showOpenFilePicker(pickerOpts);
        if(!fileHandle)
            return;
        }else{
            fileHandle = handle;
        }
        console.log(fileHandle);
        var file = await fileHandle.getFile();var contents;
        if(file['name'].includes('.json') || file['name'].includes('.txt')|| file['name'].includes('.html')|| file['name'].includes('.js')||file['name'].includes('.pdf')){
            contents = await file.text();
            document.getElementById('textBox').innerText = contents;
        }else if(file['name'].includes('.xml') || file['name'].includes('.xlsx')|| file['name'].includes('.csv')){
            console.log("Work In Progress");
        }else if(file['type'].includes('image') ||file['name'].includes('.JPG') ||file['name'].includes('.JPEG') ||file['name'].includes('.PNG')){
           var reader = new FileReader();
           reader.addEventListener("load", function () {
            var image = new Image();
            image.title = file.name;
            image.src = reader.result;
            document.getElementById('textBox').append(image);
          }, false);
            reader.readAsDataURL(file);
        }else{
            console.log("Not supported");
        }
    }
    static async OpenDirectory(event){
        event.preventDefault();
        const dirHandle = await window.showDirectoryPicker();
        var dirID = processFS.uid();
        await indexDB.set(dirID, dirHandle);
        //set innerHTML
        var workspace = document.getElementById('workspace');
        var li = document.createElement('li');
        var span = document.createElement('span');span.setAttribute('class','caret');span.innerText = dirHandle.name;li.append(span);
        var ul = document.createElement('ul');ul.setAttribute('class','nested');li.append(ul);ul.setAttribute('id',dirID);
        workspace.appendChild(li);
        await processFS.getContent(dirHandle ,ul);
        console.log(workspace);
        var carets = document.querySelectorAll('.caret');console.log("Kitne carets he " + carets.length);
        carets.forEach(caret =>{
            caret.onclick = async function(event) {
                event.preventDefault();
                console.log(event.target.innerHTML);
                this.classList.toggle('caret-down')
                parent = this.parentElement;
                parent.querySelector('.nested').classList.toggle('active')
            }
        })
        var files = document.querySelectorAll('.file');
        files.forEach(file =>{
            file.addEventListener('click',async function(event){
                event.preventDefault();
                console.log(event.target.getAttribute("id"));
                var handleDirFile = await indexDB.get(event.target.getAttribute('id'));
                processFS.Open(event,handleDirFile);
            });
        })
    }
    static async getContent(handle,parent){
        var parentHandle = await indexDB.get(parent.getAttribute('id'));//get parent Handle from indexDB
        for await (const entry of handle.values()){
            var ID = processFS.uid(); //new id for directory/file
            if(entry.kind == 'directory'){
                console.log("Name of Directory :- " + entry.name);
                var li = document.createElement('li');parent.append(li);
                var getDirHandle = await parentHandle.getDirectoryHandle(entry.name);//get current directory handle
                await indexDB.set(ID,getDirHandle);//set Unique ID to this directory handle
                var span = document.createElement('span');span.setAttribute('class','caret');span.innerText = entry.name;li.append(span);
                var ul = document.createElement('ul');ul.setAttribute('class','nested');li.append(ul);ul.setAttribute('id',ID);
                await processFS.getContent(entry ,ul);
            }else if(entry.kind == 'file' && entry.name.includes('.')){
                var getfileHandle = await parentHandle.getFileHandle(entry.name);//get current file handle
                await indexDB.set(ID,getfileHandle);//set Unique ID to this directory handle
                var liFile = document.createElement('li');liFile.innerText = entry.name;liFile.setAttribute('id',ID);liFile.setAttribute('class','file');
                parent.append(liFile);
            }
        }
    }
    static uid() {
        let timmy = Date.now().toString(36).toLocaleUpperCase();
        let randy = parseInt(Math.random() * Number.MAX_SAFE_INTEGER);
        randy = randy.toString(36).slice(0, 12).padStart(12, '0').toLocaleUpperCase();
        return ''.concat(timmy, '-', randy);
    }    
}
