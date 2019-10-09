const palette = [
    ['#ff9999', '#ff4d4d', '#ff0000', '#b30000', '#660000'], //red
    ['#ffcc99', '#ffa64d', '#ff8000', '#b35900', '#663300'],//orange
    ['#ffff99', '#ffff4d', '#ffff00', '#b3b300', '#666600'],//yelow
    ['#ccff99', '#a6ff4d', '#80ff00', '#59b300', '#336600'], //lightgreen
    ['#99ff99', '#4dff4d', '#00ff00', '#00b300', '#006600'], //green
    ['#99ffcc', '#4dffa6', '#00ff80', '#00b359', '#006633'], //green2
    ['#99ffff', '#4dffff', '#00ffff', '#00b3b3', '#006666'], //bluegreen
    ['#99ccff', '#4da6ff', '#0080ff', '#0059b3', '#003366'], //lightblue
    ['#9999ff', '#4d4dff', '#0000ff', '#0000b3', '#000066'], //blue 
    ['#cc99ff', '#a64dff', '#8000ff', '#5900b3', '#330066'], //purple
    ['#ff99ff', '#ff4dff', '#ff00ff', '#b300b3', '#660066'], //pinnku
    ['#ff99cc', '#ff4da6', '#ff0080', '#b30059', '#660033'] //redpurple
];
let target_color = [];
let search_text = [];
let file_top = [];
let file_bottom = [];
let file_links = [];
window.onload = ()=>{
    let color_buttons = "";
    for(let x=0; x<5; x++){
        for(let y=0; y<12; y++){
            let id = "color" + x + "-" + y;
            color_buttons += "<button class='color_button' style='background:"+ palette[y][x] +"' id='"+ id +"'></button>"
        }
    }
    document.querySelector('.color_list').innerHTML = color_buttons;
    for(let x=0; x<5; x++){
        for(let y=0; y<12; y++){
            let id = "color" + x + "-" + y;
            document.querySelector('#' + id).addEventListener('click',()=>{
                ColorSelect(x,y,id);
            });
        }
    }
    document.querySelector('.color_reset').addEventListener('click', ()=>{
        ColorReset();
    })
    document.querySelector('.text_form').addEventListener('change', ()=>{
        TextSet();
    })
    document.querySelector('#min_time').addEventListener('change', () => {
        MinTimeSet();
    });
    document.querySelector('#max_time').addEventListener('change', () => {
        MaxTimeSet();
    })

    document.querySelector('.delete_button').addEventListener('click', (e) => {
       e.preventDefault();
       console.log("fdfs");
    });

    const weeks = document.querySelectorAll('.weeks');
    weeks.forEach((element) => {
        element.addEventListener('click', (e) => {
            document.querySelector('.select_week').classList.remove('select_week');
            e.target.classList.add('select_week');
            console.log(e.target.value)
            CoalReadFile();
        })
    })
    CoalReadFile();

    document.querySelector('.histry_ul').onscroll = function() {
        console.log(this.scrollTop);
        for(let i=0; i<file_links.length; i++){
            if(file_top[i] <= this.scrollTop && this.scrollTop < file_bottom[i]){
                file_links[i].classList.add('now_scroll');
                for(let j=0; j<file_links.length; j++){
                    if(j != i){
                        file_links[j].classList.remove('now_scroll');
                    }
                }
            }
        }
    }
}


const ColorCheck = (arr1,colors) => {
    let arr2 = [];
    for(let i=0; i<colors.length; i++){
        arr2.push(colors[i].color);
    }
    return [...arr1, ...arr2].filter(item => arr1.includes(item) && arr2.includes(item)).length > 0
}

const ColorSelect = (x,y,id) => {
    console.log(palette[y][x]);
    console.log(y,x);

    document.querySelector('.selected_color').style.backgroundColor = palette[y][x];
    
    if(y===0){
        target_color = [
            palette[11][x-1],palette[11][x],palette[11][x+1],
            palette[y][x-1],palette[y][x],palette[y][x+1],
            palette[y+1][x-1],palette[y+1][x],palette[y+1][x+1]
        ];
    }else if(y===11){
        target_color = [
            palette[y-1][x-1],palette[y-1][x],palette[y-1][x+1],
            palette[y][x-1],palette[y][x],palette[y][x+1],
            palette[0][x-1],palette[0][x],palette[0][x+1]
        ];
    }else{
        target_color = [
            palette[y-1][x-1],palette[y-1][x],palette[y-1][x+1],
            palette[y][x-1],palette[y][x],palette[y][x+1],
            palette[y+1][x-1],palette[y+1][x],palette[y+1][x+1]
        ];
    }
    console.log(target_color.length);
    CoalReadFile();
}

const ColorReset = () => {
    target_color = [];
    document.querySelector('.selected_color').style.backgroundColor = '#fff';
    CoalReadFile();
}


const CoalReadFile = () =>{
    document.querySelector('.histry_ul').innerHTML = null;
    document.querySelector('.history_nav').innerHTML = null;
    file_height = [];
    chrome.storage.local.get("test3", (value) => {
        ReadFile(value.test3);
    });
}

const ReadFile = (array) => {
    console.log(array)
    let filename = array[0]
    if(filename){
        webkitRequestFileSystem(TEMPORARY, 1024*1024, (fileSystem)=>{
            if(!array.length){
                
            }else {
                fileSystem.root.getFile(filename, {'create':false, exclusive: true}, (fileEntry) => {
                    
                    //ファイル読み込み
                    fileEntry.file((file) => {
                        const reader = new FileReader();
                        reader.onloadend = function(e) {
                            const json = this.result;
                            let obj = JSON.parse(json);
                            let date = filename.split(':');
                            let reed_day = date[0] + '年' + date[1] + '月' + date[2] + '日（' + date[3] + '）';
                            let one_days_file = document.createElement('div');
                            one_days_file.className = 'one_days_file';
                            one_days_file.id = reed_day;
                            let browsing_day = document.createElement('li');
                            browsing_day.className = 'browsing_day';
                            browsing_day.id = reed_day
                            browsing_day.innerText = reed_day;
                            one_days_file.appendChild(browsing_day);

                            const min_time = document.querySelector('#min_time');
                            const max_time = document.querySelector('#max_time');
                            const select_week = document.querySelector('.select_week').value;
                            console.log(select_week);
                            if(select_week === 'ALL' || select_week === date[3]){
                                console.log(select_week);
                                console.log(search_text)
                                let history_nav = document.querySelector('.history_nav');
                                let nav_a = document.createElement('a');
                                nav_a.innerText = reed_day;
                                console.log(reed_day);
                                nav_a.addEventListener('click', (e) => {
                                    console.log(reed_day);
                                    document.querySelectorAll('.now_scroll').forEach((element) => {
                                        element.classList.remove('now_scroll');
                                    });
                                    e.target.parentNode.classList.add('now_scroll')
                                    document.getElementById(reed_day).scrollIntoView(true);
                                })
                                let nav_li = document.createElement('li');
                                nav_li.className = "one_day_file_link"
                                nav_li.appendChild(nav_a);
                                history_nav.appendChild(nav_li);
                                if(!target_color.length && !search_text.length && min_time.value === '0' && max_time.value === '23'){
                                    console.log('nomal');
                                    for(let i=0; i<obj.length; i++){
                                        let histrylink = document.createElement('li');
                                        histrylink.className = 'histrylink'
                                        let imgarea = document.createElement('div');
                                        imgarea.className = 'imgarea';
                                        let img = document.createElement('img');
                                        img.setAttribute('src', obj[i].image);
                                        imgarea.appendChild(img);
                                        
                                        let sitedate = document.createElement('div');
                                        sitedate.className = 'sitedate';
                                        let title = document.createElement('p');
                                        title.className = 'title';
                                        title.innerText = obj[i].title;
                                        let url = document.createElement('p');
                                        url.className = 'url';
                                        url.setAttribute('href', obj[i].url);
                                        url.innerText = obj[i].url;
                                        let time = document.createElement('p');
                                        time.className = 'time';
                                        time.innerText = obj[i].year+"年"+obj[i].month+"月"+obj[i].day+"日 "+obj[i].hour+":"+obj[i].minute+":"+obj[i].second;
                                        sitedate.appendChild(title);
                                        sitedate.appendChild(url);
                                        sitedate.appendChild(time);
                                    
                                        let link = document.createElement('a');
                                        link.className = 'link';
                                        link.setAttribute('href', obj[i].url);
                                        let linkaction = document.createElement('div');
                                        linkaction.className = 'link_action';
                                        let deletebutton = document.createElement('button');
                                        deletebutton.className = 'delete_button';
                                        deletebutton.innerHTML = 'X';
                                        deletebutton.addEventListener('click', (e) => {
                                            e.preventDefault();
                                            DeleteLink(filename,i)
                                        });
                                        linkaction.appendChild(deletebutton);
                                        link.appendChild(linkaction);

                                        histrylink.appendChild(imgarea);
                                        histrylink.appendChild(sitedate);
                                        histrylink.appendChild(link);

                                        one_days_file.appendChild(histrylink);
                                    }
                                    console.log(obj);
                                }else{
                                    console.log('serch')
                                    for(let i=0; i<obj.length; i++){
                                        obj[i].id = i
                                    }
                                    if(target_color.length){
                                        let result = [];
                                        for(let i=0; i<obj.length; i++){
                                            if(ColorCheck(target_color,obj[i].colors)){
                                                console.log(obj[i])
                                                result.push(obj[i]);
                                            }
                                        }
                                        obj = result;
                                    }
                                    if(search_text.length){
                                        console.log("text_serch")
                                        search_text.forEach((text) => {
                                            let result = [];
                                            for(let i=0; i<obj.length; i++){
                                                if(obj[i].title.toLowerCase().match(text) || obj[i].url.toLowerCase().match(text)){
                                                    result.push(obj[i]);
                                                }
                                            }
                                            obj = result;
                                        })
                                        
                                    }
                                    if(min_time.value !== '0' || !max_time.value !== '23'){
                                        let result = [];
                                        const min_num = Number(min_time.value);
                                        const max_num = Number(max_time.value);
                                        for(let i=0; i<obj.length; i++){
                                            if((min_num <= obj[i].hour) && (obj[i].hour <= max_num)){
                                                result.push(obj[i]);
                                            }
                                        }
                                        obj = result;
                                    }

                                    for(let i=0; i<obj.length; i++){

                                        let histrylink = document.createElement('li');
                                        histrylink.className = 'histrylink'
                                        let imgarea = document.createElement('div');
                                        imgarea.className = 'imgarea';
                                        let img = document.createElement('img');
                                        img.setAttribute('src', obj[i].image);
                                        imgarea.appendChild(img);
                                        
                                        let sitedate = document.createElement('div');
                                        sitedate.className = 'sitedate';
                                        let title = document.createElement('p');
                                        title.className = 'title';
                                        title.innerText = obj[i].title;
                                        let url = document.createElement('p');
                                        url.className = 'url';
                                        url.setAttribute('href', obj[i].url);
                                        url.innerText = obj[i].url;
                                        let time = document.createElement('p');
                                        time.className = 'time';
                                        time.innerText = obj[i].year+"年"+obj[i].month+"月"+obj[i].day+"日 "+obj[i].hour+":"+obj[i].minute+":"+obj[i].second;
                                        sitedate.appendChild(title);
                                        sitedate.appendChild(url);
                                        sitedate.appendChild(time);
                                    
                                        let link = document.createElement('a');
                                        link.className = 'link';
                                        link.setAttribute('href', obj[i].url);
                                        let linkaction = document.createElement('div');
                                        linkaction.className = 'link_action';
                                        let deletebutton = document.createElement('button');
                                        deletebutton.className = 'delete_button';
                                        deletebutton.innerHTML = 'X';
                                        deletebutton.addEventListener('click', (e) => {
                                            e.preventDefault();
                                            DeleteLink(filename,obj[i].id);
                                        });
                                        linkaction.appendChild(deletebutton);
                                        link.appendChild(linkaction);

                                        histrylink.appendChild(imgarea);
                                        histrylink.appendChild(sitedate);
                                        histrylink.appendChild(link);

                                        one_days_file.appendChild(histrylink);
                                    }
                                    console.log(obj);
                                }
                                let histry_ul = document.querySelector('.histry_ul');
                                histry_ul.appendChild(one_days_file);
                                file_top.push(document.getElementById(reed_day).getBoundingClientRect().top - 80);
                                file_bottom.push(document.getElementById(reed_day).getBoundingClientRect().bottom - 80);
                            }
                            array.shift();
                            ReadFile(array);
                        };
                        reader.readAsText(file);
                    },);
                },);
            }
        });
    } else {
        console.log('finished');
        file_links = document.querySelectorAll('.one_day_file_link');
        file_links[0].classList.add('now_scroll');
    }
}

const DeleteLink = (filename, id) => {
    console.log(filename);
    console.log(id);
    webkitRequestFileSystem(TEMPORARY, 1024*1024, (fileSystem)=>{
        fileSystem.root.getFile(filename, {'create':false, exclusive: true}, (fileEntry) => {
            //ファイル読み込み
            fileEntry.file((file) => {
                const reader = new FileReader();
                reader.onloadend = function(e) {
                    const json = this.result;
                    let obj = JSON.parse(json);
                    console.log(obj[id]);
                    obj.splice(id,1);
                    console.log(obj);

                    fileEntry.createWriter(function(fileWriter){
                        fileWriter.onwriteend = function(e) {
                            if (fileWriter.length === 0) {
                                const json = JSON.stringify(obj);
                                const data =  new Blob([json], { type: "text/plain" });
                                fileWriter.write(data);
                            } else {
                                console.log('Write completed.');
                                CoalReadFile()
                            }
                        };
                        fileWriter.truncate(0);
                    },);


                };
                reader.readAsText(file);
            },);
        },);
    });
}
/*
const TextSet = () => {
    search_text = document.querySelector('.text_form').value.toLowerCase()
    if(search_text.match(/^([0-9]|[1-2][0-9])~([0-9]|[1-2][0-9])$/)){
        console.log("best match!!!")
        const time = search_text.split('~');
        const min_time = document.querySelector('#min_time');
        const max_time = document.querySelector('#max_time');
        if(Number(time[0]) > Number(time[1])){
            max_time.value = time[0];
            min_time.value = time[0];
        }else{
            max_time.value = time[1];
            min_time.value = time[0];
        }
        search_text = "";
    }else{
        console.log("no match...")
    }
    console.log(search_text);
    chrome.storage.local.get("test3", (value) => {
        document.querySelector('ul').innerHTML = null;
        ReadFile(value.test3);
    });
}
*/

const TextSet = () => {
    const text = document.querySelector('.text_form').value.toLowerCase()
    console.log(text);
    search_text = text.split(/ |　/);
    console.log(search_text);
    for(let i=0; i<search_text.length; i++){
        console.log(search_text[i])
        if(search_text[i].match(/^([0-9]|[1-2][0-9])~([0-9]|[1-2][0-9])$/)){
            console.log(search_text[i])
            console.log("best match!!!")
            const time = search_text[i].split('~');
            const min_time = document.querySelector('#min_time');
            const max_time = document.querySelector('#max_time');
            if(Number(time[0]) > Number(time[1])){
                max_time.value = time[0];
                min_time.value = time[0];
            }else{
                max_time.value = time[1];
                min_time.value = time[0];
            }
            search_text.splice(i,1);
            i--;
        }else{
            console.log(search_text[i])
            console.log("no match...")
        }
    }
    console.log(search_text);
    CoalReadFile()
}

const MinTimeSet = () => {
    const min_time = document.querySelector('#min_time');
    const max_time = document.querySelector('#max_time');
    if(Number(min_time.value) > Number(max_time.value)){
        max_time.value = min_time.value;
    }
    CoalReadFile()
}
const MaxTimeSet = () => {
    const min_time = document.querySelector('#min_time');
    const max_time = document.querySelector('#max_time');
    if(Number(min_time.value) > Number(max_time.value)){
        min_time.value = max_time.value;
    }
    CoalReadFile()
}








const test = () => {
    console.log('tinko')
}