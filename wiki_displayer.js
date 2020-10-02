const axios = require('axios');
const jsdom = require("jsdom");

function stringToDOM(str) {
	const dom = new jsdom.JSDOM(str);
	return dom.window.document;
};


async function retrieveBio(lang,character,charLimit) {
        
    let bio ="";

    const name = character.split(" ");

    const urlFied = name.map(element => {
        return element.substring(0,1).toUpperCase() + element.substring(1).toLowerCase();
    }).join("_");

    console.log("looking for " + urlFied);
   

    const data = await axios.get('https://'+lang+'.wikipedia.org/wiki/'+urlFied).then(response=>response.data).catch(err=> {
        if(err.code == "ENOTFOUND") throw "Invalid language";
        throw "Character not found"
    });

    try {
    const dom = stringToDOM(data);

    const body = dom.getElementsByClassName("mw-parser-output")[0].innerHTML;

    const innerDOM = stringToDOM(body);

    const pars = dom.getElementsByTagName("p");

    
    const paragraphs =[...pars]
        .filter(a=>a.textContent !== 'undefined' && a.textContent.trim().length>0)
        .filter((a,index) => index<3).map(a=>a.textContent.trim())

    let i=0;

    while (bio.length<charLimit&&i<paragraphs.length) {
        bio+=paragraphs[i].trim()+"\n";
        i++;
    }    
    } catch(err) {
        throw "Invalid description";
    }

   return {character: urlFied, lang, bio: bio};


}

module.exports = (language, character, charLimit) => retrieveBio(language, character, charLimit);