"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        ${showDeleteBtn ? attachDeleteBtn(story, currentUser) : ""}
        ${showFavoriteBtn(story, currentUser)}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

$("#my-stories").on("click", handleDeleteClick);

async function handleDeleteClick(e) {
  const isTrashIcon = e.target.classList.contains("fa-trash");
  if (isTrashIcon) {
    const storyId = $(e.target).closest("li")[0].id;

    await storyList.removeStory(currentUser, storyId);
    await putUserStoriesOnPage();
  }
}

function attachDeleteBtn(story, user) {
  return `
    <span>
      <i class="fas fa-trash"></i>
    </span>`;
}

function showFavoriteBtn(story, user) {
  // far (non filled) for non-favorited, fas (filled) for favorited
  const heartStyle = user.isUserFavorite(story) ? "fas" : "far";
  return `
    <span class = "favorite-icon">
      <i class="${heartStyle} fa-heart"></i>
    </span>`;
}

// Handle favorite-icon click
$(".stories-list").on("click", handleFavoriteClick);

async function handleFavoriteClick(e) {
  const storyId = $(e.target).closest("li")[0].attributes.id.value;
  const story = storyList.stories.find((story) => story.storyId === storyId);
  const isFavoriteIcon = e.target.classList.contains("fa-heart");

  if (isFavoriteIcon) {
    if (e.target.classList.contains("far")) {
      e.target.classList.remove("far");
      e.target.classList.add("fas");
      await currentUser.addFavorite(story);
    } else {
      e.target.classList.remove("fas");
      e.target.classList.add("far");
      await currentUser.removeFavorite(story);
    }
  }
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function submitStory() {
  console.debug("submitStory");

  const user = currentUser;
  const title = $("#submit-title");
  const author = $("#submit-author");
  const url = $("#submit-url");
  const newStory = {
    title: title.val(),
    author: author.val(),
    url: url.val(),
  };
  const story = await storyList.addStory(user, newStory);
  $allStoriesList.prepend(generateStoryMarkup(story));
  getAndShowStoriesOnStart();
  user.ownStories.push(story);

  $submitForm.hide();
  title.val("");
  author.val("");
  url.val("");
}

$("#submit-form").on("submit", function (e) {
  e.preventDefault();
  submitStory();
});

// loop through all user favorites and append to page
function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");
  $favoritedStories.empty();

  if (currentUser.favorites.length === 0) {
    $favoritedStories.append("<h4>You don't have any favorites yet!</h4>");
  } else {
    for (const story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoritedStories.append($story);
    }
  }
}

function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");
  $ownStories.empty();

  if (currentUser.ownStories.length === 0) {
    $ownStories.append("<h4>You don't have your own stories yet!</h4>");
  } else {
    for (const story of currentUser.ownStories) {
      const $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }
}
