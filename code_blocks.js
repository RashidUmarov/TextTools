const left_editor = document.getElementById("left_html");
let left_html = left_editor.value;
const right_editor = document.getElementById("right_html");
let right_html = right_editor.value;
// списки найденных src в img
let left_list = [];
let right_list = [];


const result_text = document.getElementById("check");
const result_block = document.getElementById("replace-block");

// ищем кнопку LOOK FOR IMG
const look_pre = document.getElementById("look-pre");
//console.log("button look_img = ", look_img);
if (look_pre != undefined) {
    look_pre.onclick = searchPreCode;
} else {
    console.log("Error! button look_img not found");
}
;

// ищем кнопку Replace SRC
const replace_src = document.getElementById("btn-replace");
console.log("button replace_src = ", replace_src);


//const clean_block=document.getElementById("clean-block");
//
//console.log(left_editor);
//console.log(right_editor);
//console.log(result_text);

// читаем html текст из textarea и подсчитываем количество src в тегах img
function getHtmlText(textarea_node, block_list, pre_list) {
    text = textarea_node.value;

    const parser = new DOMParser();
    const htmlDOM = parser.parseFromString(text, "text/html");
    console.log("htmlDOM => ", htmlDOM);
    let src;

    const allElements = htmlDOM.getElementsByTagName('PRE');
    let pre_counter = 0;
    for (const element of allElements) {
        pre_counter++;
        //console.log("img=",element);
        // добавим элемент <img> в массив
        pre_list.push(element);
        const attrs = element.getAttributeNames();
        //console.log(attrs);
        for (let ind in attrs) {
//         console.log(`${ind}  --->  ${attrs[ind]}`);
            let attr_name = attrs[ind];
            if (attr_name === 'class') {
//              console.log(`  ${pre_counter}. src= ${src}:  attr_name=${attr_name}`)
                let classValue = element.getAttribute('class');
                // Проверяем, равно ли значение атрибута 'class' строке "code"
                if (classValue === 'code') {
//                  console.log(`  ${pre_counter}. src= ${classValue}:  attr_name=${attr_name}`)
                    block_list.push(element.innerHTML);
                }
            }
        }
        //console.log("links list:",src_list);
    }
}

// ищет все src в тегах IMG на обоих панелях
function searchPreCode() {
    left_pre_list = [];   // список найденных <pre> в окне слева
    right_pre_list = [];  // список найденных <pre> в окне справа
    left_list = [];       // список  атрибутов src в найденных тегах <img> слева
    right_list = [];      // список  атрибутов src в найденных тегах <img> справа
    getHtmlText(left_editor, left_list, left_pre_list);
    console.log("left pre list:", left_pre_list);
    console.log("------------------");
    getHtmlText(right_editor, right_list, right_pre_list);
    console.log("right pre list:", right_pre_list);
    let answer = "";
    if (left_list.length > 0) {
        let size = Math.min(left_list.length, right_list.length);
        if (size == 0) {
            answer = "Right text no links";
            console.log(answer);
        } else {
            answer = `We have ${size} blocks  to replace`;
            console.log(answer);
            answer += "<ol>";
            for (let i in left_list) {
                //answer+=("<li>"  + left_list[i].slice(5, 40)+"...<br>"+right_list[i].slice(5, 40)+ "...</li>");
                console.log(left_list[i]);
            }
            answer += "</ol>"

            result_text.innerHTML = answer;
            result_text.style.setProperty("display", 'block');
            result_block.style.setProperty("display", 'block');
        }
    }
}


function replacePreBlock() {
    if (left_list.length > 0) {
        let size = Math.min(left_list.length, right_list.length);
    }
    text = right_editor.value;
    if (text.length == 0) {
        console.log('right panel is empty');
        return;
    }
    const parser = new DOMParser();
    const htmlDOM = parser.parseFromString(text, "text/html");
    console.log("htmlDOM => ", htmlDOM);
    let src;

    const allElements = htmlDOM.getElementsByTagName('PRE');
    let pre_counter = 0;
    for (const element of allElements) {
        // Проверяем, содержит ли элемент класс "code"
        if (element.getAttribute('class') === 'code') {
            // Получаем новое содержимое для элемента из списка
            let newContent = left_list[pre_counter];
            // Получаем текущее содержимое элемента
            let currentContent = element.innerHTML;

            // Проверяем, отличается ли новое содержимое от текущего
            if (newContent !== currentContent) {
                // Обновляем содержимое элемента
                element.innerHTML = newContent;
                console.log(`${pre_counter}. Replaced content in element #${pre_counter}`);
            }
        }
        pre_counter++;
    }
    right_editor.value = htmlDOM.body.innerHTML;
}
