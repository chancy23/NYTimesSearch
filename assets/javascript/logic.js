$(document).ready(function(){

    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
        url += '?' + $.param({
            'api-key': "7a4922f00ce646a9a51e704a5a3ab409",
            'q': "Trump",
            'begin_date': begin_date,
            'end_date': end_date,
        });


        $("#searchButton").on("click", function() {
            var begin_date = $("#startYear");
            var end_date = $("#endYear");
            console.log(year);
            console.log(begin_date);
            console.log(end_date);

            $.ajax({
                url: url,
                method: 'GET',
            }).then(function(results) {

            })

        })

        $("#resetButton").on("click"), function() {
            $("#searchTerm").empty();
            $("#numberToRetrieve").empty();
            $("#startYear").empty();
            $("#endYear").empty();
            $("#searchButton").empty();
            $("#resetButton").empty();
        };

        $("#clearResults").on("click"), function() {
            $("#articleResults").empty();
        };


});