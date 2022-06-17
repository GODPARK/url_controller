let pageInfo = {};
let paramsMap = new Map();

document.addEventListener('DOMContentLoaded', function () {
   var redirectButton = document.getElementById("redirectButton");
   redirectButton.addEventListener("click", redirectButtonClick);

   // var buttons = document.getElementsByClassName('btn btn-danger btn-sm getValue');
   // console.log(buttons);
   // for (var i = 0; i < buttons.length; i++) {
   //    buttons[i].addEventListener("click", deleteButtonClick);
   // }
});

window.onload = function () {
   mounted();
}

/**
 * 
 * 
 * 
 */
function mounted() {
   makePage();
}

/**
 * 
 */
function errorOccur(msg) {
   if (msg === undefined || msg === '') {
      msg = '.'
   }
   let errorMsgDiv = document.createElement("div");
   errorMsgDiv.innerHTML = 'Error is Occur: '.concat(msg);
   errorMsgDiv.setAttribute("id", "errorMsgDiv");
   errorMsgDiv.className = "alert alert-danger";
   document.getElementById("errorSection").appendChild(errorMsgDiv);
   setTimeout(
      function(){
         document.getElementById("errorMsgDiv").remove();
      }, 2000
   );
}

async function getCurrentUrl() {
   let queryOptions = { active: true, currentWindow: true };
   const tabs = await chrome.tabs.query(queryOptions);
   if (tabs.length > 0) {
      if (tabs[0].url !== undefined && tabs[0].url !== '') {
         return tabs[0].url;
      } else {
         errorOccur('url is wrong');
         return '';
      }
   } else {
      errorOccur('tab info is empty');
      return ''
   }
}


async function makePage() {
   const url = await getCurrentUrl();
   pageInfo = new URL(url);

   setProtocolView(pageInfo.protocol);
   setDomainView(pageInfo.hostname);
   setPathView(pageInfo.pathname);
   setPortView(pageInfo.port);

   paramsMap = makeParamsMap(pageInfo.search);
   setParamView(paramsMap);
}

function makeParamsMap(rawParams) {
   const resultMap = new Map();
   if (rawParams !== '') {
      const removeQuestionMark = rawParams.replace('?', '');
      const paramList = removeQuestionMark.split('&');

      paramList.forEach(element => {
         const paramKeyValue = element.split('=');
         if (paramKeyValue.length === 2) {
            resultMap.set(paramKeyValue[0], paramKeyValue[1])
         } else if (paramKeyValue.length === 1) {
            resultMap.set(paramKeyValue[0], '');
         }
      });
   }
   return resultMap;
}


function paramByView() {
   const resultMap = new Map();
   var inputElements = document.getElementsByClassName('form-control getValue');
   for(var i = 0; i < inputElements.length; i++) {
      resultMap.set(inputElements[i].name, inputElements[i].value);  
   };
   return resultMap;
}

function makeRedirectUrl(paramsMap) {
   let baseUrl = pageInfo.origin + pageInfo.pathname;
   if (paramsMap.size === 0) {
      return baseUrl;
   } else {
      let i = 0;
      baseUrl = baseUrl + "?";
      paramsMap.forEach((value, key) => {
         baseUrl = baseUrl + key + "=" + value;

         if (i +1 < paramsMap.size) {
            baseUrl += "&";
         }

         i +=1;
      })
      return baseUrl;
   }
}

function setParamView(params) {
   if (params.size === 0) {
      document.getElementById('paramTotalSection').remove();
   } else {
      params.forEach((value, key) => {
         let input = document.createElement("input");
         input.type = "text";
         input.className = "form-control getValue"
         input.name = key;
         input.value = value;

         // let button = document.createElement("button");
         // button.className = "btn btn-danger btn-sm getValue";
         // button.innerHTML = "X";
         // button.name=key;
         // button.onclick = deleteButtonClick;
   
         let tdKey = document.createElement("td");
         tdKey.innerHTML = key;
         let tdValue = document.createElement("td");
         tdValue.appendChild(input);
         // let tdDelete = document.createElement("td");
         // tdDelete.appendChild(button);

         let tr = document.createElement("tr");
         tr.appendChild(tdKey);
         tr.appendChild(tdValue);
         // tr.appendChild(tdDelete);
         document.getElementById("tableBodySection").appendChild(tr);
      });
   }
}

function setProtocolView(protocol) {
   
   let protocolText = protocol;
   if (protocol === 'https:') {
      protocolText = 'https';
   } else if (protocol === 'http:') {
      protocolText = 'http';
   } else if (protocol === '') {
      protocolText = 'unknown';
   }
   document.getElementById("protocolSection").innerHTML = protocolText;
}

function setDomainView(domain) {
   document.getElementById("domainSection").innerHTML = domain;
}

function setPathView(path) {
   document.getElementById("pathSection").innerHTML = path;
}

function setPortView(port) {
   if (port !== '') {
      document.getElementById("portSection").innerHTML = port;
   } else {
      document.getElementById("portParentSection").remove();
   }
}

async function redirectButtonClick() {
   const paramMap = paramByView();
   const url = makeRedirectUrl(paramMap);
   await chrome.tabs.create({
      url: url
   });
}


function deleteButtonClick(target) {
   console.log(window);
}