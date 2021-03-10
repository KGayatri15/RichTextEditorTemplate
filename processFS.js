let fileHandle;
const pickerOpts = {
    types: [
      {
        description: '.txt,.json,.html,.png,.gif,.jpg,.jpeg',
        accept: {
          'image/*': ['.png', '.gif', '.jpeg', '.jpg'],
          'text/*':['.txt','.html','.json']
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
        if(!fileHandle){
            document.getElementById('textBox').innerText = '';     
        }else{
        
        }
        // const options = {
        //     types: [
        //       {
        //         description: 'Action Space Editor files',
        //         accept: {
        //           'text/plain': ['.txt'],
        //           'text/html':['.html'],
        //           'text/json':['.json']
        //         },
        //       },
        //     ],
        //   };
        //   const handle = await window.showSaveFilePicker(options);
        //   return handle;
    }
    static async saveFile(event){
        event.preventDefault();
        if(!fileHandle){
            await processFS.saveAsFile(event);
        }
        const writable = await fileHandle.createWritable();
        await writable.write(document.getElementById('textBox').innerText);
        await writable.close();
    }
    static async saveAsFile(event){
        event.preventDefault();
        const newHandle = await window.showSaveFilePicker(pickerOpts);
        const writableStream = await newHandle.createWritable();
        await writableStream.write(document.getElementById('textBox').innerText);
        await writableStream.close()
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
        if(file['name'].includes('.json') || file['name'].includes('.txt')|| file['name'].includes('.html')){
            const contents = await file.text();
            document.getElementById('textBox').innerText = contents;
        }else if(file['type'].includes('image')){
            console.log("Image he jugaad karo");
        }
    }
}
