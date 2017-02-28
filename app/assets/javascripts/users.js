/* global $, Stripe */
//Document Ready.
$(document).on('turbolinks:load', function(){
  var theForm = $('#pro-form');
  var submitBtn = $('#form-signup-btn');
  
  //Set Stripe public key.
  Stripe.setPublishableKey( $('meta[name="stripe-key"]').attr('content') );

  //When user clicks form "submit" button,
  submitBtn.click(function(event) {
    //prevent default submission behavior.
    event.preventDefault();
    submitBtn.val("Processing").prop('disabled', true);
    
    //Collect all the cc fields.
    var ccNum = $('#card_number').val(),
        cvcNum = $('#card_code').val(),
        expMonth = $('#card_month').val(),
        expYear = $('#card_year').val();
        
    //Use Stripe JS library to check for card errors
    var error = false;
    
    //Validate card number
    if (!Stripe.card.validateCardNumber(ccNum)) {
      error = true;
      alert('Invalid credit card number');
    }
    
    //Validate CVC number
    if (!Stripe.card.validateCVC(cvcNum)) {
      error = true;
      alert('Invalid security code (CVC)');
    }
    
    //Validate Expiration Date
    if (!Stripe.card.validateExpiry(expMonth, expYear)) {
      error = true;
      alert('Invalid Expiration Date');
    }
    
    if (error) {
      //If there are card errors, don't send data to Stripe
      //Re-enable submit button
      submitBtn.prop('disabled', false).val("Sign Up");
    } else {  
      //Send card info to Stripe.
      Stripe.createToken({
        number: ccNum,
        cvc: cvcNum,
        exp_month: expMonth,
        exp_year: expYear
      }, stripeResponseHandler);
    }
      
    return false;
  });
    
  //Stripe returns back card token.
  function stripeResponseHandler(status, response) {
    // Get token from Stripe response
    var token = response.id;
  
  //Inject token as a hidden field into form.
  theForm.append( $('<input type="hidden" name="user[stripe_card_token]">').val(token) );
  
  //Submit the form to our Rails app
  theForm.get(0).submit();
  }
});