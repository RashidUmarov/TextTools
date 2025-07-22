const editor = document.getElementById("editor");
let text=editor.value;
const text_check=document.getElementById("check");
const clean_block=document.getElementById("clean-block");

// читаем html текст из textarea и подсчитываем теги без стилей и классов
function getHtmlText() {
    text=editor.value;
    /*console.log("we got text from editor:", text);*/
    const parser= new DOMParser();
    const htmlDOM=parser.parseFromString(text,"text/html");
    console.log("htmlDOM => ",htmlDOM);

    const errorNode = htmlDOM.querySelector('parsererror');
    if (errorNode) {
      // parsing failed
       console.log("Failed to parse HTML (parser.parseFromString), please check");
    } else {
      // parsing succeeded
      console.log("parser.parseFromString - OK");
    }

    const allElements = htmlDOM.getElementsByTagName('*');

    // Loop through all elements (including html, head, meta, scripts)
    let div_empty=0;
    let span_empty=0;
    let blockquote_empty=0;
    for (const element of allElements) {
      // console.log(element);

      // проверим тег div
      if (element.tagName==='DIV'){
      const attrs = element.getAttributeNames();
          if (attrs.length==0){
             //console.log(`${element.tagName} ${attrs}`);
             div_empty+=1;
          }
      }

      // проверим тег span
      if (element.tagName==='SPAN'){
      const attrs = element.getAttributeNames();
          if (attrs.length==0){
             span_empty+=1;
          }
      }

      // проверим тег blockquote
      if (element.tagName==='BLOCKQUOTE'){
      const attrs = element.getAttributeNames();
          if (attrs.length==0){
             blockquote_empty+=1;
          }
      }
    }

  //  результаты проверки
  let result='';
  if (div_empty>0){
    console.log(`<div> empty: ${div_empty}`);
    result+=`<li>&lt;div&gt; empty: ${div_empty}</li>`
  }

  if (span_empty>0){
    console.log(`<span> empty: ${span_empty}`);
    result+=`<li>&lt;span&gt; empty: ${span_empty}</li>`
  }

  if (blockquote_empty>0){
    console.log(`<blockquote> empty: ${blockquote_empty}`);
    result+=`<li>&lt;blockquote&gt; empty: ${blockquote_empty}</li>`
  }

  if (result.length>0){
    result=check.innerHTML="<ul>Empty tags found:<br>"+result+"</ul>";
    check.style.setProperty("display", 'block');
    check.style.setProperty("background-color", 'RGB(251,207,208)');
    clean_block.style.setProperty("display", 'block');
  }
  else
  {
    result=check.innerHTML="<ul>Empty tags not found:<br><li>OK!</li></ul>";
    check.style.setProperty("display", 'block');
    check.style.setProperty("background-color", 'RGB(200,239,212)');
    clean_block.style.setProperty("display", 'none');
  }
}

/*  кнопка Clean */
const clean=document.getElementById("btn-check");
/* console.log("button clean = ", clean); */
if (clean != undefined){
    clean.onclick=getHtmlText;
}
else{
    console.log("Error! button clean not found");
};


function deleteEmptySpans(){
    console.log("delete spans");

    text=editor.value;
    while (hasEmptyTags(text, 'span'))
        text=stripeEmptyTags(text,'span')
//  выведем результат обработки
    //console.log(text);
    editor.value=text;

}

function deleteEmptyDivs(){
    console.log("delete divs");

    text=editor.value;
    while (hasEmptyTags(text, 'div'))
        text=stripeEmptyTags(text,'div')
//  выведем результат обработки
    //console.log(text);
    editor.value=text;
}

// считает количество пустых тегов в html строке
function hasEmptyTags(htmlString, tagName){
    let count=0;
    const parser= new DOMParser();
    const htmlDOM=parser.parseFromString(htmlString,"text/html");
    const allElements = htmlDOM.getElementsByTagName(tagName);
    for (const element of allElements) {
      const attrs = element.getAttributeNames();
      if (attrs.length==0){
         count+=1;
      }
    }
    return(count);
}


// разбирает пустые теги
function stripeEmptyTags(htmlString, tagName){
    const parser= new DOMParser();
    const htmlDOM=parser.parseFromString(htmlString,"text/html");
    const allElements = htmlDOM.getElementsByTagName(tagName);
    for (const element of allElements) {
      const attrs = element.getAttributeNames();
      if (attrs.length==0){
         let inner = element.innerHTML;
         element.outerHTML=inner;
      }
    }
    return(htmlDOM.body.innerHTML);
}
/*
console.log("editor=",editor);
console.log("text=",text);
*/