class Controller{
 constructor(model,view){
     this._model = model;
     this._view = view;
     //registering events
     
     view.on('Open New File',()=>this.NewFile());
     view.on('Save File',()=>this.saveFile());
     view.on('Load File',()=>this.loadAFile());
     view.on('Delete File',()=>this.DeleteFile());
 }
 async NewFile(){
    if(confirm("If you haven't saved the file you are working on.. Click on Cancel Save the file First.")){
        var collection = localStorage.getItem("collection");
        var entityCollection,index;
        if(collection === null){
        entityCollection = [];
        }else{
        entityCollection = JSON.parse(collection);
        }
        if(localStorage.getItem('currentIndex') === null)
            index = 0;
        else
            index = entityCollection.length;
        var json = {
            'name':'ActionStoryNo'+index,
            'content':'<h1>ActionStory</h1>'
        }
        entityCollection.push(json);
        localStorage.setItem('currentIndex',index);
        console.log(JSON.stringify(json)  + "::" + localStorage.getItem('currentIndex'));
        localStorage.setItem("collection",JSON.stringify(entityCollection));
        this._view.setText('<h1>ActionStory</h1>');
        localStorage.setItem('AutoSave','');
    }
 }
 async saveFile(){
    var collection = localStorage.getItem("collection");
    var entityCollection;
    if(collection === null){
        alert("No file exists to save ....");
    }else{
        entityCollection = JSON.parse(collection);
        entityCollection[localStorage.getItem('currentIndex')]['content'] = this._view.getText();
        localStorage.setItem("collection",JSON.stringify(entityCollection));
    }
 }
 async loadAFile(){
    var collection = localStorage.getItem("collection");
    if(collection === null){
        entityCollection = [];
        alert("You don't have Action Stories till now. Start by Opening a new file");
       }else{
        var entityCollection = JSON.parse(collection);
        var index = window.prompt("You have " + entityCollection.length + " Action Stories... Which Action Story you want to Load" , '');
        console.log("Action Story" +  index + "  entity collection   " + entityCollection.length);
        if(entityCollection.length > index || entityCollection.length == index){
            this._view.setText(entityCollection[index - 1]['content']);
            localStorage.setItem('currentIndex',index - 1);
            localStorage.setItem('AutoSave',this._view.getText());
        }else{
            alert('You have entered a wrong ActionStory');
        }
    }   
}
 async DeleteFile(){
    if(confirm('Do you want to delete the file you are currently working on ?')){
        var collection = localStorage.getItem("collection");
        var entityCollection = JSON.parse(collection);
        entityCollection.splice(localStorage.getItem('currentIndex'),1);
        localStorage.setItem('collection',JSON.stringify(entityCollection));
        if(entityCollection.length === 0){
            alert('Loading a new file');
            await this.NewFile();
        }else{
            alert('Loading a previous file');
            await this.loadAFile();
        }
        
    }
 }
 restore(){
     var HTML;
    if(localStorage.getItem('currentIndex')!== null){
        console.log("Index of Action Story :" + localStorage.getItem('currentIndex'));
        HTML = localStorage.getItem('AutoSave');
    }else{
        HTML = "<p>You haven't opened any files .Start by creating a new file or Load a file from previous data</p>";
    }
    this._view.setText(HTML);
    setInterval(()=>{
        if(localStorage.getItem('AutoSave') !== this._view.getText()){
            localStorage.setItem('AutoSave' , this._view. getText());
            console.log("AutoSave :- " + localStorage.getItem('AutoSave'));
        }
    },3000);
 }
 showCollection(){
    var collection = JSON.parse(localStorage.getItem('collection'))
    console.log(collection);
 }
}