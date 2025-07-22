const left_editor = document.getElementById("left_html");
let left_html=left_editor.value;
const right_editor = document.getElementById("right_html");
let right_html=right_editor.value;

// счетчик для присвоения id спискам, прошедшим через функцию
let GLOBAL_LIST_COUNTER=0;
MAX_HEAD_LENGTH=18;


//--- блок div для показа списка найденных заголовков
const result_text=document.getElementById("check");
//--- блок div для показа кнопки пересбора списков
const rebuild_block=document.getElementById("rebuild-block");


// ищем кнопку LOOK FOR LIST
const look_list=document.getElementById("look-list");
//console.log("button look_list = ", look_list);
if (look_list != undefined ){
    look_list.onclick=showHeads;
}
else{
    console.log("Error! button look_list not found");
};

// ищем кнопку пересбора списков COMPOSE LINKS
const btn_rebuild_list=document.getElementById("btn-rebuild");
console.log("button rebuild_list = ", btn_rebuild_list);


// списки найденных зогловках в тегах LI
let head_set=new Set();

// ищет все заголовки в тегах LI и показывает на панели их список
function showHeads(){
    // очистим правую панель
    right_editor.value="";

    head_set=new Set();

    prepareHeadSets(left_editor, head_set);
    console.log("head set:",head_set);
    console.log("------------------");

    let answer="";
    if (head_set.size>0){
        let size=head_set.size;
        if (size==0){
            answer="Right text: list not found";
            console.log(answer);

        } else{
            answer=`We have ${size} headers in list:`;
            console.log(answer);
            answer+="<ol>";
            for (let element of head_set.values()){
                answer+=("<li>"  + element+"</li>");
                console.log(element);
            }
            answer+="</ol>"

            result_text.innerHTML=answer;
            result_text.style.setProperty("display", 'block');
            rebuild_block.style.setProperty("display", 'block');
        }
    }else{
            result_text.innerHTML='Headers not found. Nothing to change';
            result_text.style.setProperty("display", 'block');
    }
}


// читаем html текст из textarea и заполняем массив заголовков из тегов <li>
function prepareHeadSets(textarea_node, head_set) {
    text=textarea_node.value;

    const parser= new DOMParser();
    const htmlDOM=parser.parseFromString(text,"text/html");
    console.log("htmlDOM => ",htmlDOM);


    const headPattern=/.*?:/i;
    const allElements = htmlDOM.getElementsByTagName('LI');
    let li_counter=0;
    for (const element of allElements) {
      li_counter++;
      //console.log(element.textContent);
      let text=element.textContent;
      let found=headPattern.exec(text);
      if (found!==null && found.length){
            if(found[0].trimStart().slice(-6)==='https:'){
                continue;
            }
            // избегаем длинных head
            if(found[0].trimStart().length>MAX_HEAD_LENGTH){
                continue;
            }
        console.log(found[0].trimStart());
        head_set.add(found[0].trimStart())
      }

    }
    console.log("heads set:",head_set);
}


//--- кнопка пересбора списков
function rebuildLists(){
    text=left_editor.value;

    const parser= new DOMParser();
    const htmlDOM=parser.parseFromString(text,"text/html");
    //console.log("htmlDOM => ",htmlDOM);


    // паттерн для поиска заголовков вида Header:
    const headPattern=/.*?:/i;
    // найдем все нумерованные списки
    const allLists = htmlDOM.getElementsByTagName('OL');
    let OL_counter=0; // счетчик списков
    let last_head=""; // последний найденный заголовок
    printed=false;
    for (const element of allLists) {
        let root=document.createElement("div");  // сюда складываем новые списки
        let empty=document.createElement("div"); // сюда пустые элементы списка

        OL_counter++;
        console.log(`${OL_counter} list`);
        // получим все теги li внутри списка
        let lis= element.getElementsByTagName("LI");
        console.log(lis.length)
        let li_counter=0;
        let curr_ul;
        for (const li of lis){
            li_counter++;
            //console.log(`${li_counter}  li`);
            let text=li.textContent;
            let found=headPattern.exec(text);
            if (found!==null && found.length){
                let current_head=found[0].trimStart();

                // найден новый заголовок
                if (current_head!=last_head){
                    if (curr_ul!==undefined){
                        // выведем информацию о количестве элементов в последнем заголовке
                        console.log(`${last_head} has ${curr_ul.childElementCount } items`);
                    }
                    last_head=current_head;
                    //  создадим заголовок и вставим
                    const H_tag=document.createElement("h2");
                    H_tag.innerHTML=current_head;
                    root.appendChild(H_tag);

                    // создадим список и вставим
                    curr_ul=document.createElement("ul");
                    root.appendChild(curr_ul);
                }
                console.log(`${li_counter} ${current_head} - ${text.slice(5, 20)}`);
                curr_ul.appendChild(li.cloneNode(true));
                //console.log(li.cloneNode(true));
                //console.log(li);
            } else {
                console.log(`${li_counter} empty - ${text.slice(0, 20)}`);
                const P_tag=document.createElement("p");
                P_tag.innerHTML=li.innerHTML;
                empty.appendChild(P_tag);
            }
        }
        if (root.childElementCount>0){
            console.log(root.innerHTML);
            //right_editor.value=root.innerHTML;
            //console.log(root);
        }
        if (empty.childElementCount>0){
            console.log(empty.innerHTML);
            //console.log(empty);
        }
        if(printed==false){
            right_editor.value=root.innerHTML+empty.innerHTML;
            printed=true;
            //console.log('printed=',printed);
        }
    }
}

// обрабатывает списки UL
function composeHTML(){
    text=left_editor.value;

    const parser= new DOMParser();
    const htmlDOM=parser.parseFromString(text,"text/html");

    // найдем все нумерованные списки
    const allLists = htmlDOM.getElementsByTagName('OL');
    for (let ol_tag of allLists) {
        //ol_tag.innerHTML=rebuildList(ol_tag);
        if(ol_tag.id===""){
            ol_tag.outerHTML=makeNewList(ol_tag);
        }else{
            console.log(`ol id=${ol_tag.id}`);
        }


        console.log("done");
    }
    right_editor.value=htmlDOM.body.innerHTML;
}



function makeNewList(OL_Tag){
    // паттерн для поиска заголовков вида Header:
    const headPattern=/.*?:/i;

    let root=document.createElement("div");  // сюда складываем новые списки
    let empty=document.createElement("div"); // сюда пустые элементы списка

    let last_head=""; // последний найденный заголовок
    // получим все теги li внутри списка
    let lis= OL_Tag.getElementsByTagName("LI");
    let li_counter=0;
    let curr_ul;
    for (const li of lis){
        if(li.parentNode!==OL_Tag){
            continue;
        }
        li_counter++;
        let text=li.textContent;
        let found=headPattern.exec(text);
        //console.log(`found=${found}  found.length=${found.length}`);
        if (found!==null && found.length){
            let current_head=found[0].trimStart();
            console.log(`current_head.slice(-6) =${current_head.slice(-6)}`);
            //  избегаем ловушек с https:
            if(current_head.slice(-6)==='https:'){
                li_counter--;
                continue;
            }
            // избегаем длинных head
            console.log(`${current_head}.length = ${current_head.length}`);
            if(current_head.length>MAX_HEAD_LENGTH){
                console.log(`current_head.length>MAX_HEAD_LENGTH(${MAX_HEAD_LENGTH})`);
                li_counter--;
                continue;
            }

            // найден новый заголовок
            if (current_head!=last_head){
                if (curr_ul!==undefined){
                    // выведем информацию о количестве элементов в последнем заголовке
                    console.log(`${last_head} has ${curr_ul.childElementCount } items`);
                }
                console.log(`new header ${current_head}`);
                last_head=current_head;
                //  создадим заголовок и вставим
                const H_tag=document.createElement("h3");
                H_tag.innerHTML=current_head.slice(0,-1);
                root.appendChild(H_tag);

                // создадим список и вставим
                GLOBAL_LIST_COUNTER++;
                curr_ul=document.createElement("ol");
                curr_ul.id="l"+GLOBAL_LIST_COUNTER;
                root.appendChild(curr_ul);
                //console.log(root.innerHTML);
            }
            //console.log(`${li_counter} ${current_head} - ${text.slice(5, 20)}`);
            let clone_li=li.cloneNode(true);
            let li_text=li.innerHTML;
            //console.log(`before  ${li_text.slice(0,20)}`);
            li_text=li_text.replace(current_head,"");
            //console.log(`after  ${li_text.slice(0,20)}`);
            //console.log(`index=${index}`);
//            if (index==-1){
//                index=0;
//            }
//            else{
//                index++;
//            }
//            index=0;
            clone_li.innerHTML=li_text;
            curr_ul.appendChild(clone_li);
            //console.log(li.cloneNode(true));
            //console.log(li);
        } else {
            //console.log(`${li_counter} empty - ${text.slice(0, 20)}`);
            const P_tag=document.createElement("p");
            P_tag.innerHTML=li.innerHTML;
            empty.appendChild(P_tag);
        }
    }
    if (root.childElementCount==0){
        GLOBAL_LIST_COUNTER++;
        OL_Tag.id='e'+GLOBAL_LIST_COUNTER;
        return(OL_Tag.outerHTML);
    }
    //right_editor.value=root.innerHTML+empty.innerHTML;
    return(root.innerHTML+empty.innerHTML);
}

