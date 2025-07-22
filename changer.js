const left_editor = document.getElementById("left_html");
let left_html=left_editor.value;
const right_editor = document.getElementById("right_html");
let right_html=right_editor.value;
// списки найденных src в img
let left_list=[];
let right_list=[];


const result_text=document.getElementById("check");
const result_block=document.getElementById("replace-block");
const result_img_block=document.getElementById("replace-img-block");

// ищем кнопку LOOK FOR IMG
const look_img=document.getElementById("look-img");
//console.log("button look_img = ", look_img);
if (look_img != undefined ){
    look_img.onclick=searchImgSrc;
}
else{
    console.log("Error! button look_img not found");
};

// ищем кнопку Replace SRC
const replace_src=document.getElementById("btn-replace");
console.log("button replace_src = ", replace_src);


//const clean_block=document.getElementById("clean-block");
//
//console.log(left_editor);
//console.log(right_editor);
//console.log(result_text);

// читаем html текст из textarea и подсчитываем количество src в тегах img
function getHtmlText(textarea_node, src_list, img_list) {
    text=textarea_node.value;

    const parser= new DOMParser();
    const htmlDOM=parser.parseFromString(text,"text/html");
    console.log("htmlDOM => ",htmlDOM);
    let src;

    const allElements = htmlDOM.getElementsByTagName('IMG');
    let img_counter=0;
    for (const element of allElements) {
      img_counter++;
      //console.log("img=",element);
      // добавим элемент <img> в массив
      img_list.push(element);
      const attrs = element.getAttributeNames();
      //console.log(attrs);
      for (let ind in attrs){
//         console.log(`${ind}  --->  ${attrs[ind]}`);
         let attr_name=attrs[ind];
         if (attr_name==='src'){
//            console.log(`  ${img_counter}. src= ${src}:  attr_name=${attr_name}`)
            src=element.getAttribute('src');
            src_list.push(src)
         }
      }
    }
    //console.log("links list:",src_list);
}

// ищет все src в тегах IMG на обоих панелях
function searchImgSrc(){
    left_img_list=[];  // список найденных <img> в окне слева
    right_img_list=[];  // список найденных <img> в окне справа
    left_list=[];  // список  атрибутов src в найденных тегах <img> слева
    right_list=[]; // список  атрибутов src в найденных тегах <img> справа
    getHtmlText(left_editor, left_list, left_img_list);
    console.log("left img list:",left_img_list);
    console.log("------------------");
    getHtmlText(right_editor, right_list, right_img_list);
    console.log("right img list:",right_img_list);
    let answer="";
    if (left_list.length>0){
        let size=Math.min(left_list.length, right_list.length);
        if (size==0){
            answer="Right text no links";
            console.log(answer);
        } else{
            answer=`We have ${size} links to replace`;
            console.log(answer);
            answer+="<ol>";
            for (let i in left_list){
            answer+=("<li>"  + left_list[i].slice(5, 40)+"...<br>"+right_list[i].slice(5, 40)+ "...</li>");
            console.log(left_list[i]);
            }
            answer+="</ol>"

            result_text.innerHTML=answer;
            result_text.style.setProperty("display", 'block');
            result_block.style.setProperty("display", 'block');
            result_img_block.style.setProperty("display", 'block');
        }
    }
}


function replaceSrcInImg(){
    if (left_list.length>0){
        let size=Math.min(left_list.length, right_list.length);
    }
    text=right_editor.value;
    if (text.length==0){
        console.log('right panel is empty');
        return;
    }
    const parser= new DOMParser();
    const htmlDOM=parser.parseFromString(text,"text/html");
    console.log("htmlDOM => ",htmlDOM);
    let src;

    const allElements = htmlDOM.getElementsByTagName('IMG');
    let img_counter=0;
    for (const element of allElements) {
      const attrs = element.getAttributeNames();
      for (let ind in attrs){
         let attr_name=attrs[ind];
         if (attr_name==='src'){
//            console.log(`  ${img_counter}. src= ${src}:  attr_name=${attr_name}`)
            let left=left_list[img_counter];
            let right=element.getAttribute('src');
            if(left != right){
                element.setAttribute('src',left_list[img_counter]);
                console.log(`replace ${right}  -> ${left}`);
            }
         }
      }
      img_counter++;
    }
    right_editor.value=htmlDOM.body.innerHTML;
}

function replaceImg(){
    if (left_list.length>0){
        let size=Math.min(left_list.length, right_list.length);
    }
    text=right_editor.value;
    if (text.length==0){
        console.log('right panel is empty');
        return;
    }
    const parser= new DOMParser();
    const htmlDOM=parser.parseFromString(text,"text/html");
    console.log("htmlDOM => ",htmlDOM);
    let src;

    const allElements = htmlDOM.getElementsByTagName('IMG');
    let img_counter=0;
    for (const element of allElements) {
      const attrs = element.getAttributeNames();
      for (let ind in attrs){
         let attr_name=attrs[ind];
         // будем менять src
         if (attr_name==='src'){
//            console.log(`  ${img_counter}. src= ${src}:  attr_name=${attr_name}`)
            let left=left_list[img_counter];
            let right=element.getAttribute('src');
            if(left != right){
                element.setAttribute('src',left_list[img_counter]);
                console.log(`replace ${right}  -> ${left}`);
            }
         }

         if (attr_name==='width' || attr_name==='height'){
//            console.log(`  ${img_counter}. src= ${src}:  attr_name=${attr_name}`)
            let left=left_pre_list[img_counter].getAttribute(attr_name);;
            let right=element.getAttribute(attr_name);
            //console.log(attr_name,'  left=',left,'    right=',right)
            if(left != right) {
                element.setAttribute(attr_name,left);
                console.log(`replace ${attr_name} ${right}  -> ${left}`);
            }
         }
      }
      img_counter++;
    }
    right_editor.value=htmlDOM.body.innerHTML;
}