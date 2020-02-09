import axios from "axios";
import {action, computed, observable} from 'mobx';
import React, {Context} from "react";
import {Media} from "../types";
import {sumMediaSize} from "../util";

export class MediaStore {
  @observable.deep
  media: Record<number, Media> = {};

  @action
  addMedia(media: Media) {
    this.media[media.id] = media;
  }

  @action
  removeMedia(media: Media) {
    delete this.media[media.id];
  }

  @action
  reset() {
    this.media = {};
  }

  deleteMedia(movieKey: string, media: Media): Promise<any> {
    return new Promise((resolve, reject) => {
      axios.post(`http://localhost:5000/delete/media`, {
        'movie_key': movieKey,
        'media_id': media.id
      })
      .then(() => {
        this.removeMedia(media);
        resolve();
      });
    })
  }

  @computed
  get length(): number {
    return Object.keys(this.media).length;
  }

  @computed
  get totalSizeBytes(): number {
    let total = 0;
    Object.values(this.media).forEach(media => {
      total += sumMediaSize(media);
    });
    return total;
  }
}

export function newMediaStore(): MediaStore {
  return new MediaStore();
}

export function newMediaStoreContext(): Context<MediaStore> {
  return React.createContext<MediaStore>(newMediaStore());
}
