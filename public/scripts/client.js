/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const data = [];

//Preventing XSS
const escape = function(str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};


$(document).ready(function() {
  //Hiding Error Messages
  $("#error-message-over").hide();
  $("#error-message-nothing").hide();

  const createTweetElement = function(tweet) {
    let $tweet = $(`<article>
    <header class="userInfo">
        <div><img src="${tweet.user.avatars}">${tweet.user.name}</div>
        <div>${tweet.user.handle}</div>
    </header>
    <div class="tweetedText">${escape(tweet.content.text)}</div>
    <footer>
    <span class="timeago">${timeago.format(tweet.created_at)}</span>
        <div>
        <i class="fas fa-flag"></i>
        <i class="fas fa-retweet"></i>
        <i class="fas fa-heart"></i>   
        </div>     
    </footer>
    </article>`);
    return $tweet;
  };

  //Creating all the tweets
  const renderTweets = function(tweets) {
    $('.tweets-container').empty();
    for (let tweet in tweets) {
      $('.tweets-container').append(createTweetElement(tweets[tweet]));
    }
  };

  renderTweets(data);

  //Loading all the tweets from creation time descending
  const loadTweets = function() {
    $.ajax("/tweets", {
      method: 'GET',
      dataType: "json",
    })
      .then((result) => {
        renderTweets(result.reverse());
      });
  };

  loadTweets();

  //When tweet button is clicked
  const submitButton = function() {
    $('#tweet-form').submit(function(event) {
      event.preventDefault();
      const tweetString = $(this).serialize();
      const content = tweetString.split('=')[1];
      
      //If textbox area is empty or null
      if (content.length <= 0 || content === null) {
        $("#error-message-nothing").slideDown();
        $("#error-message-over").hide();
      //If textbox area is less over 140 characters
      } else if (content.length > 140) {
        $("#error-message-over").slideDown();
        $("#error-message-nothing").hide();
      } else {
        $("#error-message-nothing").slideUp();
        $("#error-message-over").slideUp();
        $.ajax("/tweets", { method: 'POST', data: tweetString})
          .then(() => {
            $('#tweet-text').val('');
            $(".counter").replaceWith(
              `<output name="counter" id="maximum" class="counter" for="tweet-text">140</output>`
            );
            loadTweets();
          });
      }
    });
  };
   
  submitButton();

  //Sliding down composing tweet and focusing on textarea
  $('#down-button').click(function(event) {
    $('#new-tweet').hide();
    $('#new-tweet').slideDown();
    $('#tweet-text').focus();
  });

});
