// const fs = require('fs')
var blackListData = ["google", "amazon"];
var imgBlackList = ["goog"];

chrome.runtime.onMessage.addListener(function(request, sender) {

    //Ideally this should go into the onInstalled event handler
    // blackListTags = "adclick google_ads";
    // chrome.storage.sync.set({ blackList: blackListTags }, function() {
    //     console.log("Blacklist values set");
    // })


    if (request.action == "getSource") {
        src = request.source;

        var doc = new DOMParser().parseFromString(src, "text/html");
        anchors = doc.getElementsByTagName("a");
        images = doc.getElementsByTagName("img");
        message.innerText = anchors.length;

        //Finding page title
        //Creating h1 element with class "title" and text
        title = doc.title;
        heading = document.createElement("h1");
        //CHANGE CSS Class HERE
        heading.class = "title";
        heading.innerText = "Source Webpage : " + title;

        //Percentage risk tag
        riskLine = document.createElement("h2");
        //CHANGE CSS Class HERE
        riskLine.class = "riskText";
        riskLine.innerText = "Percentage of redirects to Google owned pages: ";



        document.body.insertBefore(heading, message)
        document.body.insertBefore(document.createElement('br'), message)
        document.body.insertBefore(riskLine, message);


        // console.log(anchors);
        // console.log(images);

        // var fileData;
        // fs.readFile("contentStorage/blacklist.txt", "utf-8", (err, data) => {
        //     if (error) throw error;
        //     fileData = data;
        // })
        // console.log(fileData)

        // var blackListData;
        // chrome.storage.sync.get(['blackList'], function(result) {
        //     blackListData = result.split();
        // }) 

        let adCount = 0
        adStuff = []

        console.log("Anchor data", anchors[0]);

        for (let index = 0; index < anchors.length; index++) {
            for (let blindex = 0; blindex < blackListData.length; blindex++) {
                if (anchors[index].href.indexOf(blackListData[blindex]) != -1) {
                    adCount = adCount + 1;
                    adStuff.push(anchors[index]);
                    console.log(adCount);
                }
            }
        }
        message.innerText = ((adCount / anchors.length) * 100).toString() + "%";


        //% of images from the blackList
        let imgAdCount = 0;
        imgStuff = [];
        for (let index = 0; index < images.length; index++) {
            for (let blindex = 0; blindex < imgBlackList.length; blindex++) {
                if (images[index].src.indexOf(imgBlackList[blindex]) != -1) {
                    imgAdCount = imgAdCount + 1;
                    imgStuff.push(images[index]);
                    // console.log(imgStuff)
                }
            }
        }

        console.log("Image Ad count ", imgAdCount);

        imgText = document.createElement("h2");
        //CHANGE CSS Class HERE
        imgText.class = "riskText";
        imgText.innerText = "Images from Google : ";
        document.body.appendChild(imgText);

        imgText = document.createElement("div");
        imgText.id = "imgMessage";
        imgText.innerHTML = ((imgAdCount / images.length) * 100).toString() + "%";
        document.body.appendChild(imgText);


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