let fileHandle;
const pickerOpts = {
    types: [
      {
        description: '.txt,.html,.js,.json,.csv,.xml',
        accept: {
          'text/*':['.txt','.html','.json','.js']
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
    static async Open(event){
        event.preventDefault();
        [fileHandle] = await window.showOpenFilePicker(pickerOpts);
        if(!fileHandle)
            return;
        console.log(fileHandle);
        const file = await fileHandle.getFile();
        if(file['name'].includes('.json') || file['name'].includes('.txt')|| file['name'].includes('.html')|| file['name'].includes('.js')){
            const contents = await file.text();
            document.getElementById('textBox').innerText = contents;
        }else if(file['type'].includes('image')){
            console.log("Image he jugaad karo");
        }else{
            console.log("Not supported");
        }
    }
    static async OpenDirectory(event){
        event.preventDefault();
        const dirHandle = await window.showDirectoryPicker();
        await set("directory", dirHandle);
        var get = document.getElementById('frontEnd');
        var li = document.createElement('li');
        var span = document.createElement('span');span.setAttribute('class','caret');span.innerText = dirHandle.name;li.append(span);
        var ul = document.createElement('ul');ul.setAttribute('class','nested');li.append(ul);//ul.setAttribute('id',dirHandle)
        get.append(li);
        console.log("Directory Name :- " + dirHandle.name);
       await processFS.getContent(dirHandle ,ul);
        console.log(get);
        var carets = document.getElementsByClassName('caret');
        for (var i = 0; i < carets.length; i++) {
            carets[i].addEventListener('click', function() {
                this.classList.toggle('caret-down')
                parent = this.parentElement;
                parent.querySelector('.nested').classList.toggle('active')
            })
        }
        var files = document.getElementsByClassName('file');
        for(var i = 0 ; i < files.length; i++){
            files[i].addEventListener('click',async()=>{
                const handle = await get(this.getAttribute('id'));
                const getFile = await handle.getFile();
                const contents = await getFile.text();
                document.getElementById('textBox').innerText = contents;
            });
        }

    }
    static async getContent(handle,parent){
        for await (const entry of handle.values()){
            if(entry.kind == 'directory'){
                console.log("Name of Directory :- " + entry.name);
                var li = document.createElement('li');parent.append(li);
                var parentHandle = await get("directory");
                var getDirHandle = await parentHandle.getDirectoryHandle(entry.name);await set("directory",getDirHandle);
                var span = document.createElement('span');span.setAttribute('class','caret');span.innerText = entry.name;li.append(span);
                var ul = document.createElement('ul');ul.setAttribute('class','nested');li.append(ul);//ul.setAttribute('id',getDirHandle)
                await processFS.getContent(entry ,ul);
            }else if(entry.kind == 'file' && entry.name.includes('.')){
                var parentHandle = await get("directory");
                var fileHandle = await parentHandle.getFileHandle(entry.name);
                var liFile = document.createElement('li');liFile.setAttribute('id',entry.name);liFile.setAttribute('class','file');liFile.innerText = entry.name;
                await set(entry.name , fileHandle);
                parent.append(liFile);
            }
        }
    }
    
}
