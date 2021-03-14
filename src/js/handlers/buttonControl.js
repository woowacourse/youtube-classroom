import MESSAGE from '../constants/message.js';
import videoInfos from '../states/videoInfos.js';
import { removeSavedVideo, showSnackBar } from '../viewControllers/app.js';
import { renderSavedVideoCount } from '../viewControllers/searchModal.js';

function handleWatchedButton($target) {
  const $targetVideo = $target.closest('.js-video');

  videoInfos.toggleWatchType($targetVideo.dataset.videoId);
  showSnackBar(MESSAGE.SNACKBAR.MOVE_SUCCESS);

  renderSavedVideoCount(videoInfos.length);
  removeSavedVideo($targetVideo);
}

function handleDeleteButton($target) {
  if (!window.confirm(MESSAGE.CONFIRM.DELETE_VIDEO)) return;

  const $targetVideo = $target.closest('.js-video');

  videoInfos.remove($targetVideo.dataset.videoId);
  showSnackBar(MESSAGE.SNACKBAR.DELETE_SUCCESS);

  renderSavedVideoCount(videoInfos.length);
  removeSavedVideo($targetVideo);
}

function handleButtonsControl({ target }) {
  if (target.classList.contains('js-watched-button')) {
    handleWatchedButton(target);
    return;
  }
  if (target.classList.contains('js-delete-button')) {
    handleDeleteButton(target);
  }
}

export default handleButtonsControl;
