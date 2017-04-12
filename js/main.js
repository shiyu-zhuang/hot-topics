/*global $, console*/
$(document).ready(function () {
    "use strict";
    
    // storage for contents
    var contents, url, nm, em, sb, ms, dt, errors, collect, i, xhr, pattern;
    
    contents = {};
    dt = {};
    errors = [];
    
    $(".container").load("./partials/home.html", function (rsp) {
        contents["./partials/home.html"] = rsp;
    });
    
    //VALIDATE FORM //week-11-ajax-object
    function handleResponse(rsp) {
        $(".feedback").html(rsp).val();
    }
    
    function handleErrors(jqXHR, textStatus, errorThrown) {
        console.log("textStatus: " + textStatus + "\n" + "errorThrown: " + errorThrown);
    }
    
    function validateForm(ev) {
        
        ev.preventDefault();
                
        //access the values from first and last name:
        nm = $("#name").val();
        em = $("#email").val();
        sb = $("#subject").val();
        ms = $("#message").val();
        pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  
        
        //evaluate first name
        if (nm !== "") {
            dt.name = nm;
        } else {
            errors.push("Name?");
        }
        
        if (em !== "") {
            //evaluate email format
            if (pattern.test(em)) {
                dt.email = em;
            } else {
                errors.push("Invalid Email!");
            }
        } else {
            errors.push("Email?");
        }
    
        if (sb !== "") {
            dt.subject = sb;
        } else {
            errors.push("Subject?");
        }
        if (ms !== "") {
            dt.message = ms;
        } else {
            errors.push("Message?");
        }
        
        //Check if the data is ready
        if (errors.length === 0) {
        //handle ajax 
            $.ajax({
                type: "post",
                url: "./server-side-script/web-service.php",
                data: dt,
                dataType: "html"
            }).done(handleResponse).fail(handleErrors);
        } else {
            collect = "Please fix the following errors:" + "<ul>";
            for (i = 0; i < errors.length; i += 1) {
                collect += "<li>" + errors[i] + "</li>";
            }
            collect += "</ul>";
            $(".feedback").html(collect);
            //alert(collect);
            errors = [];
            collect = [];
        }
    }
    /*storeContents*/
    function storeContents(container) {
        //if content already exists inside Pages
        if (contents[container]) {
            //load the content from Pages
            $(".container").html(contents[container]);
            console.log("Loaded from array");
        } else {
                
             //load the content by ajax request
            $(".container").load(container, function (pageRsp) {
                contents[url] = pageRsp;
                 /* 
                 Pass pageRsp to contents object 
                 with the key url (contents[url]) */
                console.log("Loaded by ajax request");
            });
        }
    }
    
    $(".box a").on("click", function (ev) {
        
        ev.preventDefault(); // make sure you are not taken to another page
        url = $(this).attr("href");
        
        storeContents(url);
        $(".container").on("submit", "form", validateForm);
    });
    
    $(".submit").click(function () {
        $(".feedback").addClass("padding");
    });//not working?
  
});
