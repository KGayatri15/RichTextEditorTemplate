async function  checkAndPush(){
   var collection = localStorage.getItem("collection");
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
}
async function NewFile(){
    if(confirm("If you haven't saved the file you are working on.. Click on Cancel Save the file First.")){
        await checkAndPush();
        document.getElementById('textBox').innerHTML = '<h1>ActionStory</h1>';
        localStorage.setItem('AutoSave','');
    }
  
}
function loadAFile(){
    var collection = localStorage.getItem("collection");
    if(collection === null){
        entityCollection = [];
       }else{
        entityCollection = JSON.parse(collection);
        index = window.prompt("You have " + entityCollection.length + " Action Stories... Which Action Story you want to Load" , '');
        console.log("Action Story" +  index + "  entity collection   " + entityCollection.length);
        if(entityCollection.length > index || entityCollection.length == index){
            document.getElementById('textBox').innerHTML = entityCollection[index - 1]['content'];
            localStorage.setItem('currentIndex',index - 1);
            localStorage.setItem('AutoSave',document.getElementById('textBox').innerHTML);
        }else{
            alert('You have entered a wrong ActionStory');
        }
    }   
}
async function  DeleteFile(){
    if(confirm('Do you want to delete the file you are currently working on ?')){
        var collection = localStorage.getItem("collection");
        entityCollection = JSON.parse(collection);
        entityCollection.splice(localStorage.getItem('currentIndex'),1);
        localStorage.setItem('collection',JSON.stringify(entityCollection));
        if(entityCollection.length === 0){
            alert('Loading a new file');
            NewFile();
        }else{
            alert('Load a previous file');
            loadAFile();
        }
        
    }
}
function saveFile(){
    var collection = localStorage.getItem("collection");
    if(collection === null){
        alert("No file exists to save ....");
    }else{
        entityCollection = JSON.parse(collection);
        entityCollection[localStorage.getItem('currentIndex')]['content'] = document.getElementById('textBox').innerHTML;
        localStorage.setItem("collection",JSON.stringify(entityCollection));
    }
}
function restore(){
    if(localStorage.getItem('currentIndex')!== null){
        console.log("Index of Action Story :" + localStorage.getItem('currentIndex'));
        document.getElementById('textBox').innerHTML = localStorage.getItem('AutoSave');
    }else{
        document.getElementById('textBox').innerHTML = "<p>You haven't opened any files .Start by creating a new file or Load a file from previous data</p>";
    }
    setInterval(()=>{
        localStorage.setItem('AutoSave' , document.getElementById('textBox').innerHTML);
        console.log("AutoSave :- " + localStorage.getItem('AutoSave'));
    },3000);
}
function showCollection(){
    var collection = JSON.parse(localStorage.getItem('collection'))
    console.log(collection);
}

//autosave