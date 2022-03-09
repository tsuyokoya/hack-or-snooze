"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** Show post submit form on click on "submit" */

function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  $navSubmitClasses.add("visible");
  // hidePageComponents();
  $submitForm.show();
}

/** Check if submit form is visible.
 *  If it is, remove "visible" class and hide
 *  If not, show submit form
 */
$navSubmit.on("click", () => {
  if ($navSubmitClasses.contains("visible")) {
    navSubmitRemove();
  } else {
    navSubmitClick();
  }
});

function navSubmitRemove() {
  $navSubmitClasses.remove("visible");
  $submitForm.hide(500);
}
