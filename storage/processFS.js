
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
function include(event){
event.preventDefault();
console.log('Included');
shortcut.add('Ctrl+S',processFS.saveFile);
shortcut.add('F12',processFS.saveAsFile);
shortcut.add('Ctrl+O',processFS.Open);
}
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
        }
    }
    static async OpenDirectory(event){
        event.preventDefault();
        const dirHandle = await window.showDirectoryPicker();
        var get = document.getElementById('frontEnd');
        var li = document.createElement('li');
        var span = document.createElement('span');span.setAttribute('class','caret');span.innerText = dirHandle.name;li.append(span);
        var ul = document.createElement('ul');ul.setAttribute('class','nested');ul.setAttribute('id',JSON.stringify(dirHandle));li.append(ul);
        get.append(li);
        console.log("Directory Name :- " + dirHandle.name);
       await processFS.getContent(dirHandle ,ul);
        console.log(get);
        var carets = document.getElementsByClassName('caret');
        for (var i = 0; i < carets.length; i++) {
            carets[i].addEventListener('click', function() {
                console.log("Clicked on caret");
                this.classList.toggle('caret-down')
                parent = this.parentElement;
                parent.querySelector('.nested').classList.toggle('active')
            })
        }
    }
    static async getContent(handle,parent){
        for await (const entry of handle.values()){
            if(entry.kind == 'directory'){
                console.log("Name of Directory :- " + entry.name);
                var li = document.createElement('li');parent.append(li);
                var parentHandle = parent.getAttribute('id');console.log(parentHandle);
                var getDirHandle = await parentHandle.getDirectoryHandle(entry.name);
                var span = document.createElement('span');span.setAttribute('class','caret');span.innerText = entry.name;li.append(span);
                var ul = document.createElement('ul');ul.setAttribute('class','nested');ui.setAttribute('id',getDirHandle);li.append(ul);
                await processFS.getContent(entry ,ul);
            }else if(entry.kind == 'file' && entry.name.includes('.')){
                var parentHandle = JSON.parse(parent.getAttribute('id'));
                var fileHandle = await parentHandle.getFileHandle(entry.name);
                var liFile = document.createElement('li');liFile.setAttribute('id',fileHandle);liFile.innerText = entry.name;
                parent.append(liFile);
            }
        }
    }
    
}
