// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function() {

  $(".delquote").on("click", function(event) {

    

    $.ajax("/api/user_pick/", {

      type: "DELETE"

    }).then(

      function() {

        console.log("rows deleted  ");

        // Reload the page to get the updated list

        location.reload();

      }

    );

  });

  $(".create-form").on("submit", function(event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();
  
   
   
    var btn = $(this).attr("data-id");

    var pickedwinner = {
      winner: $("input[name=team]:checked", `#${btn}`).val().trim()

  
     
    };

    // if (btn===id){
    //   document.getElementById("hide").disabled=true;
    // };
    
    console.log (pickedwinner);
  
    // Send the POST request.
    $.ajax("/api/user_pick", {
      type: "POST",
      data: pickedwinner
    }).then(
      function() {
        // document.getElementById("hide").disabled=true;
        
        console.log("created Winner");
        // Reload the page to get the updated list
        // location.reload();
      }
    );
  });


  

  $(".send").on("click", function(event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();
    // var ids = $('.send').attr("data-id");

    var btn = $(this).attr("data-id");
    var updatewinner = {
      winner: $("input[name=team]:checked", `#${btn}`).val().trim()
      
    };

    var id = $(this).data("id");

    console.log (updatewinner)
    console.log(id);
    // Send the POST request.
    $.ajax("/api/user_pick/"+id, {

      type: "PUT",

      data: updatewinner

    }).then(

      function() {
        
        console.log("updated quote");

        // Reload the page to get the updated list

        location.assign("/");

      }

    );

  });

});
