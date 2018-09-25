$(document).ready(function() {
    
    /**
     * pulls information from the form and build the query URL
     * @returns {string} URL for NYT API based on form inputs
     */

    //function to build query URL from search inputes

    function buildQueryURL() {
        //need to get API url
        var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?";
        

        //set the api key as a parameter
        var queryParams = {"api-key": "e076d947932e43b88a684636f60089fd"};

        //add to that parameter our search parameters
        //search term
        queryParams.q = $("#searchTerm")
            .val()
            .trim();

        
        //begin year
        var beginYear = $("#startYear")
            .val()
            .trim();

        //get year and make an number and add the MM and DD to it
        if (parseInt(beginYear)) {
           queryParams.begin_date = beginYear + "0101";
        };

        //end year
        var endYear = $("#endYear")
            .val()
            .trim();

        //get year and make an number and add the MM and DD to it
        if (parseInt(endYear)) {
             queryParams.end_year = endYear + "1231"
         };

         //console log for troubleshooting
         console.log("queryURL: " + queryURL);
         console.log(queryURL + $.param(queryParams));
         //this returns our queryURL and all the paramters, so we can pass it to the ajax function?
         return queryURL + $.param(queryParams);

    };

    /**
     * take the api data JSON) and turns it to items on the page
    @param {object} NYTdata - object containing the NYT api data
    */

    //build a function to load api results to page
    function loadResults(NYTdata) {

        //find out number to retrive from search input
        var numberToRetrieve = $("#numberToRetrieve").val();

        //loop through the number selected and for each:
        for (var i = 0; i < numberToRetrieve; i ++) {

            //loads the data for the specified article for that index
            var article = NYTdata.response.docs[i]

            //increase the article count by 1 to display
            var articleCount = i + 1;

            //create an unordered list to hold the list-items, give it the bootstrap class for a ul
            var $articleList = $("<ul>").addClass("list-group");

            //load the ul to the dom
            $("#articleResults").append($articleList);

            //get headline from the object, add it to the UL, give it the class for a list-group-item , 
            var headline = article.headline;
            var $articleListItem = $("<li class='list-group-item'>");

            //if there is a headline and a headline main from the object append it to the list, along with the article number,format it as a header5
            if (headline && headline.main) {
                console.log(headline.main);
                $articleListItem.append(
                    "<span class='label label-primary'>" + articleCount + "</span>" +
                    "<h5>" + headline.main + "</h5>"
                );
            };

            //get byline from object
            var byline = article.byline;

            //if there is a byline and byline.original then append it to the list
            if (byline && byline.original) {
                console.log(byline.original);
                $articleListItem.append("<h6>" + byline.original + "</h6>");
            };

            //get publication date 
            var pubDate = article.pub_date;
            console.log(pubDate);

            //if there is one append it to the list
            if (pubDate){
                $articleListItem.append("<h6>" + pubDate + "</h6>");
            };

            //append the article url to the list
            $articleListItem.append("<a href='" + article.web_url + "'>" + article.web_url + "</a>");
            console.log(article.web_url);

            //append each $articleListITem to the $articleList variable
            $articleList.append($articleListItem);
        };

    };

    //function to reset search parameters
    function clearParams(){
        $("#searchTerm").empty();
        $("#numberToRetrieve").empty();
        $("#startYear").empty();
        $("#endYear").empty();
    };

    //function to clear articles returned in dom
    function clearResults() {
        $("#articleResults").empty();
    };

    //on click functions for the search button to call the api and return the results
    $("#searchButton").on("click", function(event){
        //allows user to hit enter as well as click on searhc, and prevents page from reloading.
        event.preventDefault();

        //calls the api and retrieves the data based on our parameters, then loads to page, using our functions from above
        var queryURL = buildQueryURL();
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(loadResults);

    });

    //click functions using the reset and clear fucntions for those buttons
    $("#resetButton").click(clearParams);
    $("#clearResults").click(clearResults);


})