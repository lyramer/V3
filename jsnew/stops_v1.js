var language;

    //store page language
    language = $('#_lang').val();
    console.log(language);

    //This keeps the callweb form from submitting when the return key is pressed on the autocomplete

    $('form').keypress(function(event) {
        if (event.which == 13) {
            event.preventDefault();
        }
    });
