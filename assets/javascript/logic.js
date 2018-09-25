$(document).ready(function(){

    /**
     * pulls information from the form and build the query URL
     * @returns {string} URL for NYT API based on form inputs
     */

    //create a function to pull in the information from the form to build the query
    function buildQueryURL() {
    var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?";

    //begins to build the object to contain our API call's query paramters (ie, search term, begin/end year etc)
    var queryParams = {"api-key": "e076d947932e43b88a684636f60089fd"};
    
    //this grabs the text input from the form and adds to the queryParams object
    queryParams.q = $("#searchTerm")
        .val()
        .trim();

    //if user inputs a beginning year, add to the queryParams
    var beginYear = $("#startYear")
        .val()
        .trim();

    if (parseInt(beginYear)) {
        queryParams.begin_date = beginYear + "0101";
    };

    //sams as begin year if input
    var endYear = $("#endYear")
        .val()
        .trim();
    
    if (parseInt(endYear)) {
        queryParams.end_date = endYear + "1231";
    };

    //logging the urls for troubleshooting
    console.log("url: " + queryURL);
    console.log(queryURL + $.param(queryParams));
    return queryURL + $.param(queryParams);
    };

    /**
     * takes API data (JSON/object) and turns it into elements on the page
     * @param {object} NYTData - object containing NYT API data
     */
    function updatePage(NYTdata) {
        //get from the form the nubmer of results to return
        //api doesn't have a limit so we do it ourselves
        var numToRetrieve = $("#numberToRetrieve").val();

        //logs the api call as an object in the console
        console.log(NYTdata);
        console.log("---------------------------");

        //loop through each article for the number selected in the form
        for (var i = 0; i < numToRetrieve; i++) {
            //get the specific article data for the current index
            var article = NYTdata.response.docs[i];
            //increase the article count starting with 1
            var articleCount = i + 1;
            //create the list group to contain the information to display (using bootstrap classes)
            var $articleList = $("<ul>");
            $articleList.addClass("list-group");
            //add the newly created element to teh DOM
            $("#articleResults").append($articleList);

            //if the article has a headline, log and ppend to the list
            var headline = article.headline;
            var $articleListItem = $("<li class='list-group-item articleHeadline'>");

            if (headline && headline.main) {
                console.log(headline.main);
                $articleListItem.append(
                    "<span class='label label-primary'>" +
                    articleCount +
                    "</span>" +
                    "<h5>" +
                    headline.main +
                    "</h5>"
                );
            }
            //add the byline if there is one
            var byline = article.byline;

            if (byline && byline.original) {
                console.log(byline.original);
                $articleListItem.append("<h6>" + byline.original + "</h6>");
            }
            //if there is a publication date addend
            var pubDate = article.pub_date;
            console.log(pubDate);

            if (pubDate) {
                $articleListItem.append("<h6>" + article.pub_date + "</h6>");
            }
            //append article url
            $articleListItem.append("<a href='" + article.web_url + "'>" + article.web_url + "</a>");
            console.log(article.web_url);

            //apend the article
            $articleList.append($articleListItem);
        }
    };
    //clears the article results, but keeps the search parameters filled in
    function clearArticles() {
        $("#articleResults").empty();
    };

    function clearSearch(){
        $("#searchTerm").empty();
        $("#numberToRetrieve").empty();
        $("#startYear").empty();
        $("#endYear").empty();
    };

    //click events
    $("#searchButton").on("click", function(event) {
        //this line allows us to also hit enter as submit to register the searc, not just click on "search"
        event.preventDefault();

        //build the query URL for the ajax request to the API using our function the builds all the paramters from the inputs
        var queryURL = buildQueryURL();

        //makes the ajax request to the NYT api and updates the page using our function from above
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(updatePage);
    });

        
    //clears search paramters when clear search is pushed
    $("#resetButton").click(clearSearch);

    //clears article results only, when button is pusshed
    $("#clearResults").click(clearArticles);



});