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
    let urlParams = location.search.substring(1);
    console.log(urlParams);
    if(urlParams) {
        const param = urlParams.split('&');
        let paramArray = [];
        for (i = 0; i < param.length; i++) {
          let paramItem = param[i].split('=');
          paramArray[paramItem[0]] = paramItem[1];
        }
        if(paramArray.text){
            console.log(decodeURI(paramArray.text));
            search_text = decodeURI(paramArray.text).split(" ");
            console.log(search_text);
            SearchTextSet(search_text);
        }
      }

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
        CoalReadFile()
    });
    document.querySelector('#max_time').addEventListener('change', () => {
        CoalReadFile()
    })

    document.querySelector('.delete_button').addEventListener('click', (e) => {
       e.preventDefault();
       console.log("fdfs");
    });

    document.querySelector('.ac_switch').addEventListener('click', (e) => {
        document.querySelector('.color_accordion').classList.toggle('open_accordion');
        e.target.classList.toggle('open_switch');
    })

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
        for(let i=0; i<file_links.length; i++){
            if(file_top[i] <= this.scrollTop && this.scrollTop < file_bottom[i]){
                file_links[i].classList.add('now_scroll');
                for(let j=0; j<file_links.length; j++){
                    if(j != i){
                        file_links[j].classList.remove('now_scroll');
                        document.querySelector('.now_scroll').scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });
                    }
                }
            }
        }
    }

    document.querySelector('.inv_flag').addEventListener('click', (e) => {
        CloseView();
    })
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
    file_top = [];
    file_bottom = [];
    file_links = [];
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
                                
                                if(!target_color.length && !search_text.length && min_time.value === '0' && max_time.value === '23'){
                                    console.log('nomal');
                                    for(let i=0; i<obj.length; i++){
                                        let histrylink = document.createElement('li');
                                        histrylink.className = 'histrylink'
                                        histrylink.classList.add(filename + '_' + i);
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
                                            if(text.match(/^or/)){
                                                console.log('orororororororoorororo')
                                                const or = text.split('||');
                                                console.log(or);
                                                for(let i=0; i<obj.length; i++){
                                                    let match_flag = false;
                                                    for(let j=1; j<or.length; j++){
                                                        if(or[j].match(/^t::/)){
                                                            if(obj[i].title.toLowerCase().match(or[j].slice(3))){
                                                                match_flag = true;
                                                            }
                                                        }
                                                        else if(or[j].match(/^u::/)){
                                                            if(obj[i].url.toLowerCase().match(or[j].slice(3))){
                                                                match_flag = true;
                                                            }
                                                        }
                                                        if(obj[i].title.toLowerCase().match(or[j]) || obj[i].url.toLowerCase().match(or[j])){
                                                            match_flag = true;
                                                        }
                                                    }
                                                    if(match_flag){
                                                        result.push(obj[i]);
                                                    }
                                                }
                                                obj = result;
                                            }else{
                                                for(let i=0; i<obj.length; i++){
                                                    if(text.match(/^t::/)){
                                                        if(obj[i].title.toLowerCase().match(text.slice(3))){
                                                            result.push(obj[i]);
                                                        }
                                                    }
                                                    else if(text.match(/^u::/)){
                                                        if(obj[i].url.toLowerCase().match(text.slice(3))){
                                                            result.push(obj[i]);
                                                        }
                                                    }
                                                    else {
                                                        if(obj[i].title.toLowerCase().match(text) || obj[i].url.toLowerCase().match(text)){
                                                            result.push(obj[i]);
                                                        }
                                                    }
                                                }
                                                obj = result;
                                            }
                                        })
                                        
                                    }
                                    if(min_time.value !== '0' || !max_time.value !== '23'){
                                        let result = [];
                                        const min_num = Number(min_time.value);
                                        const max_num = Number(max_time.value);
                                        if(min_num > max_num){
                                            for(let i=0; i<obj.length; i++){
                                                if(((min_num <= obj[i].hour) && (obj[i].hour <= 23)) || ((0 <= obj[i].hour) && (obj[i].hour <= max_num))){
                                                    result.push(obj[i]);
                                                }
                                            }
                                        }
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
                                        histrylink.classList.add(filename + '_' + obj[i].id);
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
                                        let viewbutton = document.createElement('button');
                                        viewbutton.className = 'view_button';
                                        viewbutton.innerHTML = '↕';
                                        viewbutton.addEventListener('click', (e) => {
                                            e.preventDefault();
                                            ViewHistry(filename,obj[i].id);
                                        });
                                        linkaction.appendChild(viewbutton);
                                        linkaction.appendChild(deletebutton);
                                        link.appendChild(linkaction);

                                        histrylink.appendChild(imgarea);
                                        histrylink.appendChild(sitedate);
                                        histrylink.appendChild(link);

                                        one_days_file.appendChild(histrylink);
                                    }
                                    console.log(obj);
                                }
                                if(one_days_file.childNodes.length != 1){
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

                                    let histry_ul = document.querySelector('.histry_ul');
                                    histry_ul.appendChild(one_days_file);
                                    file_top.push(document.getElementById(reed_day).getBoundingClientRect().top - 80);
                                    file_bottom.push(document.getElementById(reed_day).getBoundingClientRect().bottom - 80);
                                }
                                
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
        if(file_links[0]){
            file_links[0].classList.add('now_scroll');
        }
       
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
            if(Number(time[0]) > 23){
                time[0] = "23";
            }
            if(Number(time[1]) > 23){
                time[1] = "23";
            }
            min_time.value = time[0];
            max_time.value = time[1]
            search_text.splice(i,1);
            i--;
        }
        else if(search_text[i] === "||" && search_text[i-1] && search_text[i+1]){
            if(search_text[i-1].match(/^or/)){
                search_text[i-1] = search_text[i-1] + "||" + search_text[i+1];
                console.log(search_text[i-1]);
                search_text.splice(i+1,1);
                search_text.splice(i,1);
                i = i-2;
            }else{
                const or_text = "or||" + search_text[i-1] + "||" + search_text[i+i]
                console.log(or_text);
                search_text[i] = or_text;
                search_text.splice(i+1,1);
                search_text.splice(i-1,1);
                console.log(search_text);
                i = i-2;
            }
            
        }
    }
    console.log(search_text);
    CoalReadFile();
    SearchTextSet(search_text);
    
}

const SearchTextSet = (search_text) => {
    document.querySelector('.text_form').value = ""
    const searched = document.querySelector('.searched_display');
    const searched_text = search_text.map((text) => {
        if(text.match(/^or/)){
            const or_html = text.split('||');
            
            or_html.splice(0,1);
            console.log(or_html);
            return or_html.join("<span class='or'> or </span>");
        }else {
            return text
        }
    })
    console.log(searched_text)
    const searched_string = searched_text.join("<span class='and'> and </span>");
    searched.innerHTML = "検索：" + searched_string;
}

const CloseView = () => {
    const view = document.querySelector('.view_area');
    view.classList.add('invisible');
    document.querySelector('.view_ul').innerHTML = null;
}

const ViewHistry = (filename, id) => {
    const view = document.querySelector('.view_area');
    view.classList.remove('invisible');

    chrome.storage.local.get("test3", (value) => {
        const file_length = value.test3.length
        const num = value.test3.indexOf(filename);
        let array;
        if(file_length <= 2){
            array = value.test3;
        }else if(num === 0){
            array = value.test3.slice(num,num+2)
        }else if(num+1 === file_length){
            array = value.test3.slice(num-1)
        }else{
            array = value.test3.slice(num-1,num+2)
        }
        console.log(array);
        console.log(id,filename)

        ReadFile2(array, id ,filename);
    });
}

const ReadFile2 = (array, id, now_file) => {
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

                            for(let i=0; i<obj.length; i++){
                                let histrylink = document.createElement('li');
                                histrylink.className = 'histrylink'
                                if(filename === now_file && i === id){
                                    histrylink.id = 'now_view';
                                }
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

                            let view_ul = document.querySelector('.view_ul');
                            view_ul.appendChild(one_days_file);
                        
                                
                            array.shift();
                            ReadFile2(array, id, now_file);
                        };
                        reader.readAsText(file);
                    },);
                },);
            }
        });
    } else {
        document.getElementById('now_view').scrollIntoView({
            block: "center"
        });
        console.log('finished'); 
    }
}










const test = () => {
    console.log('tinko')
}