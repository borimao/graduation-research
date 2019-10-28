let title;
let url;
let image;
let color_array;

let date;
let year;
let month;
let day;
let hour;
let minute;
let second;
let week;
let WeekStr;

chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
    date = new Date();
    year = date.getFullYear();
    month = date.getMonth() + 1;	
    day = date.getDate();
    hour = date.getHours();
    minute = date.getMinutes();
    second = date.getSeconds();
    week = date.getDay();
    WeekStr = [ "日", "月", "火", "水", "木", "金", "土" ][week];	

    const filename = year + ":" + month + ":" + day + ":" + WeekStr;
    
    chrome.storage.local.get("test3", (value)=> {
        console.log(value.test3)
        if(value.test3 == undefined){
            console.log('uryyy')
            chrome.storage.local.set({'test3':[filename]}, ()=>{
            });
        }else if(value.test3[0] != filename){
            console.log(value.test3[0])
            console.log(filename)
            const obj = value.test3;
            obj.unshift(filename);
            chrome.storage.local.set({'test3':obj}, ()=>{
            });
        }
    });

    console.log(year + "年" + month + "月" + day + "日" + " (" + WeekStr + ") " + hour + ":" + minute + ":" + second)

    chrome.tabs.getSelected(null, (tab) => {
        title = tab.title;
        url = tab.url;
        console.log(title);
        console.log(url);
        console.log(date);
    })

    //スクリーンショット取得
    chrome.tabs.captureVisibleTab(null,{format:"jpeg"}, (base64Data) => {

        const img = new Image();
        img.src = base64Data;
        
        img.onload = () => {
            //リサイズ
            let width = 320;
            let height = 200;
            const ratio = img.width / img.height;
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            if(width/ratio <= height){
                height = width / ratio;
                canvas.height = width / ratio;
            }
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, width/ratio);
            image = canvas.toDataURL("image/webp");
            console.log(image); 

            //色識別
            color_array = [{
                "color":"#ffffff",
                "count": 0
            }];
            let colordata;
            const palette = [
                '#ff9999', '#ff4d4d', '#ff0000', '#b30000', '#660000', //red
                '#ffcc99', '#ffa64d', '#ff8000', '#b35900', '#663300', //orange
                '#ffff99', '#ffff4d', '#ffff00', '#b3b300', '#666600', //yelow
                '#ccff99', '#a6ff4d', '#80ff00', '#59b300', '#336600', //lightgreen
                '#99ff99', '#4dff4d', '#00ff00', '#00b300', '#006600', //green
                '#99ffcc', '#4dffa6', '#00ff80', '#00b359', '#006633', //green2
                '#99ffff', '#4dffff', '#00ffff', '#00b3b3', '#006666', //bluegreen
                '#99ccff', '#ada6ff', '#0080ff', '#0059b3', '#003366', //lightblue
                '#9999ff', '#4d4dff', '#0000ff', '#0000b3', '#000066', //blue 
                '#cc99ff', '#a64dff', '#8000ff', '#5900b3', '#330066', //purple
                '#ff99ff', '#ff4dff', '#ff00ff', '#b300b3', '#660066', //pinnku
                '#ff99cc', '#ff4da6', '#ff0080', '#b30059', '#660033', //redpurple
                '#000', '#fff'
            ];
            const colorClassifier = new ColorClassifier(palette);
            let count = 0;
            for(var w=0; w<=width; w=w+4){
                for(var h=0; h<=height; h=h+4){
                    colordata = ctx.getImageData(w, h, 4, 4);
                    const sample_color = rgb2hex([colordata.data[0] ,colordata.data[1] ,colordata.data[2]])
                    const color_ave = colorClassifier.classify(sample_color, 'hex'); 
                    count += 1;
                    if(! IsArrayExists(color_array, color_ave)) {
                        color_array.push({
                            color:color_ave,
                            count:1
                        });
                    }
                }
            }
            color_array.sort(
                (a,b) => {
                  return (a.count < b.count ? 1 : -1);
                }
            );
            color_array.some(
                (v,i)=>{
                    if(v.count < 50){
                        color_array.splice(i);
                    } 
                }
            );
            console.log(color_array);
            console.log(count);
            
            webkitRequestFileSystem(TEMPORARY, 1024*1024, function(fileSystem){
                fileSystem.root.getFile(filename, {'create':true}, function(fileEntry){
                    /*　ファイル壊れた時用
                    fileEntry.remove(function() {
                        console.log('File removed.');
                    },);
                    */
                    console.log(fileEntry.isFile);
                    console.log(fileEntry.name); 
                    console.log(fileEntry.fullPath);
        
                    //ファイル読み込み
                    fileEntry.file(function(file) {
                        const reader = new FileReader();
                        let obj;
                        reader.onloadend = function(e) {
                            if(this.result.length > 0){
                                const json = this.result;
                                obj = JSON.parse(json);
                            }
                            
                            //ファイル書き込み
                            fileEntry.createWriter(function(fileWriter){
                                fileWriter.onwriteend = function(e) {
                                    if (fileWriter.length === 0) {
                                        if(obj != undefined){
                                            console.log(obj);
                                            obj.unshift({
                                                title: title,
                                                url: url,
                                                year: year,
                                                month: month,
                                                day: day,
                                                hour: hour,
                                                minute: minute,
                                                second: second,
                                                image: image,
                                                colors: color_array
                                            });
                                            const json = JSON.stringify(obj);
                                            const data =  new Blob([json], { type: "text/plain" });
                                            fileWriter.write(data);
                                        }else{
                                            console.log('undefind');
                                            obj = [{
                                                title: title,
                                                url: url,
                                                year: year,
                                                month: month,
                                                day: day,
                                                hour: hour,
                                                minute: minute,
                                                second: second,
                                                image: image,
                                                colors: color_array
                                            }]
                                            const json = JSON.stringify(obj);
                                            const data =  new Blob([json], { type: "text/plain" });
                                            fileWriter.write(data);
                                        }
                                    } else {
                                        console.log('Write completed.');
                                    }
                                };
                                fileWriter.truncate(0);
                            },);
                        };
                        reader.readAsText(file);

                        
                    },);
                    
                },);
            });
        };  
    });
    
    


    /*
    webkitRequestFileSystem(TEMPORARY, 1024*1024, function(fileSystem){
        fileSystem.root.getFile("test.txt", {'create':true}, function(fileEntry){
            console.log(fileEntry.isFile);
            console.log(fileEntry.name); 
            console.log(fileEntry.fullPath);

            //ファイル書き込み
            fileEntry.createWriter(function(fileWriter){
                fileWriter.seek(fileWriter.length);

                
                const text = request.siteTitle + " : " + request.siteUrl + " ¥n"
                let data =  new Blob([text], { type: "text/plain" });
                fileWriter.write(data);
            },);

            //ファイル読み込み
            fileEntry.file(function(file) {
                console.log(file);
                var reader = new FileReader();
         
                reader.onloadend = function(e) {
                  //console.log(this.result);
                };
         
                reader.readAsText(file);
            },);

        },);
    });
    */
});


function IsArrayExists(array, value) {
    for (var i =0, len = array.length; i < len; i++) {
      if (value == array[i].color) {
        array[i].count += 1;
        return true;
      }
    }
    return false;
}

function rgb2hex ( rgb ) {
    return "#" + rgb.map( function ( value ) {
        return ( "0" + value.toString( 16 ) ).slice( -2 ) ;
    } ).join( "" ) ;
}

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({"url": "demo.html" });
});
