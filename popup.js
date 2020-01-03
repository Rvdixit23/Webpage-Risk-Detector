// const fs = require('fs')
var aBlackList = ["google", "amazon"];
var imgBlackList = ["goog"];


function riskToElement(riskPercent) {
    // riskPercent : Percentage of risk finally calculated
    // Returns : HTML Paragraph element with text containing risk level

    riskFactor = document.createElement("p");
    if (riskPercent < 30) {
        riskFactor.id = "lowRisk";
        riskFactor.class = "lowRisk";
        riskFactor.innerText = "Low Risk"
    } else if (riskPercent < 70) {
        riskFactor.id = "moderateRisk";
        riskFactor.class = "moderateRisk";
        riskFactor.innerText = "Moderate Risk"
    } else {
        riskFactor.id = "highRisk";
        riskFactor.class = "highRisk";
        riskFactor.innerText = "High Risk"
    }

    return riskFactor;
}

function finalRiskPercentage(aLength, aAdCount, imgLength, imgAdCount) {
    // Weighted average of the image black list and anchor black list

    totalAds = aLength + imgLength;
    aFrac = aLength / totalAds;
    imgFrac = imgLength / totalAds;
    finalPercent = aFrac * aAdCount + imgFrac * imgAdCount;
    return finalPercent;
}


chrome.runtime.onMessage.addListener(function(request, sender) {

    if (request.action == "getSource") {
        src = request.source;

        // Parsing the HTML String into DOM of the Source Page
        var doc = new DOMParser().parseFromString(src, "text/html");

        // Collecting all anchor and image tags into two lists for processing
        anchors = doc.getElementsByTagName("a");
        images = doc.getElementsByTagName("img");

        // Logging for testing
        // console.log(anchors);
        // console.log(images); 

        // Calculation for number of tags within blackList

        // Number of Anchor tags from the black list
        let anchorAdCount = 0
        adStuff = []
        console.log("Anchor data", anchors[0]);

        for (let index = 0; index < anchors.length; index++) {
            for (let blindex = 0; blindex < aBlackList.length; blindex++) {
                if (anchors[index].href.indexOf(aBlackList[blindex]) != -1) {
                    anchorAdCount = anchorAdCount + 1;
                    adStuff.push(anchors[index]);
                    console.log(anchorAdCount);
                }
            }
        }


        // Number of Image tags from the blackList
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

        // Calculating final result percentage

        // Calculation result Testing
        console.log("Anchor Ad Count : ", anchorAdCount);
        console.log("Image Ad count : ", imgAdCount);

        // Creating the heading of the page
        heading = document.createElement("h1");
        heading.class = "title";
        heading.innerText = "Source Webpage : " + doc.title;

        // Creating Pretext for Anchor tag data
        riskLine = document.createElement("h2");
        riskLine.class = "riskText";
        riskLine.innerText = "Percentage of redirects to Google owned pages: ";

        // Creating Pretext for Image tag data
        imgPretext = document.createElement("h2");
        imgPretext.class = "riskText";
        imgPretext.innerText = "Images from Google : ";

        // Creating element for image data
        imgText = document.createElement("div");
        imgText.id = "imgMessage";
        imgText.innerHTML = ((imgAdCount / images.length) * 100).toString() + "%";



        // Inserting all the elements into the DOM of the popup
        message.innerText = ((anchorAdCount / anchors.length) * 100).toString() + "%";
        document.body.insertBefore(heading, message)
        document.body.insertBefore(document.createElement('br'), message)
        document.body.insertBefore(riskLine, message);
        document.body.appendChild(imgPretext);
        document.body.appendChild(imgText);


    }


});

function onWindowLoad() {

    // var message = document.querySelector('#message');

    chrome.tabs.executeScript(null, {
        file: "getPagesSource.js"
    }, function() {
        // non http or ssh pages
        if (chrome.runtime.lastError) {
            message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
        }
    });


}


var src = "";
window.onload = onWindowLoad;
console.log(src);