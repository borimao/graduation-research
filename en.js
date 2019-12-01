window.onload = () => {
    document.querySelector('.write').addEventListener('click', () => {
        webkitRequestFileSystem(TEMPORARY, 1024*1024, function(fileSystem){
            fileSystem.root.getFile('testfile', {'create':true}, function(fileEntry){
                //ファイル書き込み
                fileEntry.createWriter(function(fileWriter){
                    fileWriter.onwriteend = function(e) {
                        if (fileWriter.length === 0) {
                            const text = "a";
                            const data =  new Blob([text], { type: "text/plain" });
                            fileWriter.write(data);
                        } else {
                        console.log('Write completed.');
                        }
                        
                    };
                    fileWriter.truncate(0);
                },);
            },);
        });
    })  
    
    document.querySelector('.read').addEventListener('click', () => {
        webkitRequestFileSystem(TEMPORARY, 1024*1024, function(fileSystem){
            fileSystem.root.getFile('2019:11:12:火', {'create':true}, function(fileEntry){
                fileEntry.file(function(file) {
                    const reader = new FileReader();
                   
                    reader.onloadend = function(e) {
                        (() => {
                            try {
                                JSON.parse(this.result);
                            } catch (e) {　//だめな時
                                console.log('a')
                                return false;
                            }
                            console.log('b')
                            return true;
                        })();
                        console.log(this.result)
                        const obj = JSON.parse(this.result)
                        
                        console.log(obj)
                    };
                    reader.readAsText(file); 
                },);
            },);
        });
    }) 
}

