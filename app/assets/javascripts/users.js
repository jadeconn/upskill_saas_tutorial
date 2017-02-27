/* global $ */
//Document Ready.
$(document).on('turbolinks:load', function(){
  var theForm = $('#pro-form');
  var submitBtn = $('#form-signup-btn');
  
  //Set Stripe public key.
  Stripe.setPublishableKey( $('meta[name="stripe-key"]').attr('content') );

  //When user clicks form "submit" button,
  submitBtn.click(function(event)) {
    //prevent default submission behavior.
    event.preventDefault();
    
  //Collect all the cc fields.
  var ccNum = $('#card_number').val(),
      cvcNum = $('#card_code').val(),
      expMonth = $('#card_month').val(),
      expYear = $('#card_year').val();

  //Send card info to Stripe.
  Stripe.createToken({
    number: ccNum,
    cvc: cvcNum,
    exp_month: expMonth,
    exp_year: expYear
  }, stripeResponseHandler);
  };
  

  //Stripe returns back card token.
  //Inject token as a hidden field into form.
});