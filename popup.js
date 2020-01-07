// const fs = require('fs')
var aBlackList = ["google", "amazon"];
var imgBlackList = ["goog"];

// var aBlackList = ['&ad.vid=$~xmlhttprequest', '&ad_block=', '&ad_box_', '&ad_channel=', '&ad_classid=', '&ad_code=', '&ad_height=', '&ad_ids=', '&ad_keyword=', '&ad_network_', '&ad_number=', '&ad_revenue=', '&ad_slot=', '&ad_sub=', '&ad_time=', '&ad_type=', '&ad_type_', '&ad_url=', '&ad_zones=', '&adbannerid=', '&adclient=', '&adcount=', '&adflag=', '&adgroupid=', '&adlist=', '&admeld_', '&admid=$~subdocument', '&adname=', '&adnet=', '&adnum=', '&adpageurl=', '&Ads_DFP=', '&adsafe=', '&adserv=', '&adserver=', '&adsize=', '&adslot=', '&adslots=', '&adsourceid=', '&adspace=', '&adsrc=', '&adstrade=', '&adstype=', '&AdType=', '&adunit=', '&adurl=', '&adv_keywords=', '&advert_', '&advertiserid=$domain=~bee.gl|~cpashka.ru', '&advid=$~image', '&advtile=', '&adzone=', '&banner_id=', '&bannerid=', '&clicktag=http', '&customSizeAd=', '&displayads=', '&expandable_ad_', '&forceadv=', '&gerf=*&guro=', '&gIncludeExternalAds=', '&googleadword=', '&img2_adv=', '&jumpstartadformat=', '&largead=', '&maxads=', '&pltype=adhost^', '&popunder=', '&program=revshare&', '&prvtof=*&poru=', '&show_ad_', '&showad=', '&simple_ad_', '&smallad=', '&smart_ad_', '&strategy=adsense&', '&type=ad&', '&UrlAdParam=', '&video_ads_', '&videoadid='];
// var imgBlackList = ['&ad.vid=$~xmlhttprequest', '&ad_block=', '&ad_box_', '&ad_channel=', '&ad_classid=', '&ad_code=', '&ad_height=', '&ad_ids=', '&ad_keyword=', '&ad_network_', '&ad_number=', '&ad_revenue=', '&ad_slot=', '&ad_sub=', '&ad_time=', '&ad_type=', '&ad_type_', '&ad_url=', '&ad_zones=', '&adbannerid=', '&adclient=', '&adcount=', '&adflag=', '&adgroupid=', '&adlist=', '&admeld_', '&admid=$~subdocument', '&adname=', '&adnet=', '&adnum=', '&adpageurl=', '&Ads_DFP=', '&adsafe=', '&adserv=', '&adserver=', '&adsize=', '&adslot=', '&adslots=', '&adsourceid=', '&adspace=', '&adsrc=', '&adstrade=', '&adstype=', '&AdType=', '&adunit=', '&adurl=', '&adv_keywords=', '&advert_', '&advertiserid=$domain=~bee.gl|~cpashka.ru', '&advid=$~image', '&advtile=', '&adzone=', '&banner_id=', '&bannerid=', '&clicktag=http', '&customSizeAd=', '&displayads=', '&expandable_ad_', '&forceadv=', '&gerf=*&guro=', '&gIncludeExternalAds=', '&googleadword=', '&img2_adv=', '&jumpstartadformat=', '&largead=', '&maxads=', '&pltype=adhost^', '&popunder=', '&program=revshare&', '&prvtof=*&poru=', '&show_ad_', '&showad=', '&simple_ad_', '&smallad=', '&smart_ad_', '&strategy=adsense&', '&type=ad&', '&UrlAdParam=', '&video_ads_', '&videoadid='];

function finalRiskPercentage(aLength, aAdCount, imgLength, imgAdCount) {
    // Weighted average of the image black list and anchor black list

    totalAds = aLength + imgLength;
    aFrac = aLength / totalAds;
    imgFrac = imgLength / totalAds;
    finalPercent = aFrac * aAdCount + imgFrac * imgAdCount;
    return finalPercent;
}

function riskToElement(riskPercent) {
    // riskPercent : Percentage of risk finally calculated
    // Returns : HTML Paragraph element with text containing risk level

    riskFactor = document.createElement("div");
    if (riskPercent < 30) {
        riskFactor.id = "lowRisk";
        riskFactor.class = "lowRisk";
        riskFactor.innerText = "Low"
    } else if (riskPercent < 70) {
        riskFactor.id = "moderateRisk";
        riskFactor.class = "moderateRisk";
        riskFactor.innerText = "Moderate"
    } else {
        riskFactor.id = "highRisk";
        riskFactor.class = "highRisk";
        riskFactor.innerText = "High"
    }

    return riskFactor;

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
        finalPercent = finalRiskPercentage(anchors.length, anchorAdCount, images.length, imgAdCount);

        // Calculation result Testing
        console.log("Anchor Ad Count : ", anchorAdCount);
        console.log("Image Ad count : ", imgAdCount);
        console.log("Weighted Risk Percent : ", finalPercent);

        // Creating risk remark HTML element
        riskRemark = riskToElement(finalPercent);

        // Creating the heading of the page
        heading = document.createElement("h1");
        heading.id = "title";
        heading.innerText = "Source Webpage : " + doc.title;

        // Creating Pretext for Anchor tag data
        riskLine = document.createElement("div");
        riskLine.class = "riskText";
        riskLine.id = "riskText";
        riskLine.innerText = "Percentage of risk from Redirects : ";

        // Creating Pretext for Image tag data
        imgPretext = document.createElement("div");
        imgPretext.class = "riskText";
        imgPretext.id = "riskText";
        imgPretext.innerText = "Percentage of risk from Images : ";

        // Creating element for image data
        imgText = document.createElement("div");
        imgText.id = "imgMessage";
        imgText.class = "progress-bar progress-bar-striped progress-bar-animated";
        imgText.innerHTML = Math.floor(((imgAdCount / images.length) * 100)).toString() + "%";

        // Overall Risk element
        overall = document.createElement("p");
        overall.id = "overallRiskText";
        overall.class = "riskText";
        overall.id = "riskText";
        overall.innerText = "Overall Risk : "


        // Inserting all the elements into the DOM of the popup
        message.innerText = parseInt(((anchorAdCount / anchors.length) * 100)).toString() + "%";
        document.body.insertBefore(heading, message)
        document.body.insertBefore(document.createElement('br'), message)
        document.body.insertBefore(riskLine, message);
        document.body.appendChild(imgPretext);
        document.body.appendChild(imgText);
        document.body.appendChild(overall);
        document.body.appendChild(riskRemark);


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