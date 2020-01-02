chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
   src = request.source;
   
   var doc = new DOMParser().parseFromString(src, "text/html");
   console.log(doc);
   
  }
  
});

function onWindowLoad() {

  //var message = document.querySelector('#message');
  
  chrome.tabs.executeScript(null, {
    file: "getPagesSource.js"
  }, function() {
   //non http or ssh pages
    if (chrome.runtime.lastError) {
      message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
    }
  });
  

}
var src = "";
window.onload = onWindowLoad;
console.log(src);
///var count = document.getElementsByTagName('a');
// console.log(count.length);
//file: "getPagesSource.js"