import CustomElement from '../abstract/CustomElement';
import { addEvent, emit } from '../utils';
import { subscribeEvents, getVideos } from '../domains/Store';
import TEMPLATE from '../templates';

class VideoItem extends CustomElement {
  render() {
    this.innerHTML = this.template(JSON.parse(this.dataset.video));
    subscribeEvents(this);
    this.hideSaveButton();
  }

  template(video) {
    return TEMPLATE.generateVideoItem(video);
  }

  setEvent() {
    addEvent(this, 'click', '.video-item__save-button', (e) => {
      this.emitEvent(e, this);
      e.target.hidden = true;
    });
  }

  emitEvent(e, _this) {
    e.preventDefault();
    const videoId = JSON.parse(_this.dataset.video).id;

    emit('.video-item__save-button', '@store', { videoId, videoItem: _this }, _this);
  }

  hideSaveButton() {
    const videos = getVideos();

    if (videos.some((video) => video.videoId === JSON.parse(this.dataset.video).id)) {
      this.querySelector('.video-item__save-button').hidden = true;
    }
  }
}

customElements.define('video-item', VideoItem);

export default VideoItem;
