window.onload = () => {
    /*
    console.log('url : ' + location.href);
    console.log('タイトル : ' + document.title);
    */
    chrome.extension.sendRequest({
        "siteTitle": document.title,
        "siteUrl": location.href
    });
    /*
    const today = new Date();
    console.log('時間 : ' + today);
    var imgData
    html2canvas(document.body,{
        width: document.body.clientWidth,
        height: document.body.clientWidth * 0.625,
        onrendered: function(canvas){
            imgData = canvas.toDataURL("image/webp");
            console.log(imgData);
            const img = new Image();
            img.src = imgData;
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = 320;
                canvas.height = 200;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, 320, 200);
                const imgB64_dst = canvas.toDataURL("image/webp");
                console.log(imgB64_dst);

                const color_array = [{
                    "rgb":"rgb(255,255,255)",
                    "r":255,
                    "g":255,
                    "b":255,
                    "count": 0
                }];
                var colordata;
                var r;
                var g;
                var b
                for(var w=0; w<=320; w=w+1){
                    for(var h=0; h<=200; h=h+1){
                        colordata = ctx.getImageData(w, h, 1, 1);
                        rgb = "rgb(" + colordata.data[0] + "," + colordata.data[1] + "," + colordata.data[2] + ")" 
                        r = colordata.data[0] 
                        g = colordata.data[1] 
                        b = colordata.data[2] 
                        if(! IsArrayExists(color_array, rgb)) {
                            color_array.push({
                                rgb:rgb,
                                r:r,
                                g:g,
                                b:b,
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
                console.log(color_array);

                const palette = [
                    '#ff0000', '#ff6666', '#ffcccc',//red
                    '#ff8000', '#ffff00', '#80ff00',  '#00f000', '#00ffff',  '#0000f0', '#8000ff', '#ff00ff', '#000', '#fff'
                ];
                const colorClassifier = new ColorClassifier(palette);
                for(var i=0; i<=5; i++){
                    const sample_color = rgb2hex([color_array[i].r ,color_array[i].g ,color_array[i].b])
                    const color_ave = colorClassifier.classify(sample_color, 'hex');
                    if(color_ave == "#ff0000" || color_ave == "#ff6666" || color_ave == "#ffcccc"){
                        console.log(i,"赤")
                    }else if(color_ave == "#ff8000"){
                        console.log(i,"オレンジ")
                    }else if(color_ave == "#ffff00"){
                        console.log(i,"黄")
                    }else if(color_ave == "#80ff00"){
                        console.log(i,"黄緑")
                    }else if(color_ave == "#00f000"){
                        console.log(i,"緑")
                    }else if(color_ave == "#00ffff"){
                        console.log(i,"水色")
                    }else if(color_ave == "#0000f0"){
                        console.log(i,"青")
                    }else if(color_ave == "#8000ff"){
                        console.log(i,"紫")
                    }else if(color_ave == "#ff00ff"){
                        console.log(i,"ピンク")
                    }else if(color_ave == "#000000"){
                        console.log(i,"黒")
                    }else if(color_ave == "#ffffff"){
                        console.log(i,"白")
                    }
                    
                }
            };            
        }
    });  
    */
}

/*
function IsArrayExists(array, value) {
    for (var i =0, len = array.length; i < len; i++) {
      if (value == array[i].rgb) {
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
*/




