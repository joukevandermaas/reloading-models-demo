import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';

const { Mixin } = Ember;

export default Mixin.create({
  /* overridable properties/methods */
  autoReloadStrategy: 'increasing', // can be 'increasing' or 'fixed'

  autoReloadDelay: 30000,

  minimumAutoReloadDelay: 5000,
  maximumAutoReloadDelay: 300000,
  autoReloadDelayGrowth: 2,

  willAutoReload(/* currentSnapshot */) { },
  didAutoReload(/* attributesChanged, newSnapshot, oldSnapshot */) { },

  /* end overridable properties/methods */

  /* public api */

  startAutoReloading() {
    this.get('_autoReloadTask').perform();
  },

  stopAutoReloading() {
    this.get('_autoReloadTask').cancelAll();
  },

  /* end public api */

  init() {
    this._super(...arguments);

    this.get('_autoReloadTask').perform();
  },

  unloadRecord() {
    this._super(...arguments);

    this.get('_autoReloadTask').cancelAll();
  },

  _autoReloadTask: task(function*() {
    let nextDelay = this._getNextReloadDelay(
      this.get('minimumAutoReloadDelay'),
      true);

    while (true) {
      yield timeout(nextDelay);

      let oldState = this._createSnapshot();

      this.willAutoReload(oldState);

      if (this.get('isLoaded') && !this.get('isDeleted')) {
        yield this.reload();
        let newState = this._createSnapshot();

        let changeOccured = this._didAttributesChange(oldState, newState);
        this.didAutoReload(changeOccured, newState, oldState);

        nextDelay = this._getNextReloadDelay(nextDelay, changeOccured);
      }
    }
  }).drop(),

  _getNextReloadDelay(currentDelay, attributesChanged) {
    switch (this.get('autoReloadStrategy')) {
      case 'fixed':
        return this.get('autoReloadDelay');
      case 'increasing':
        return attributesChanged ?
          this.get('autoReloadDelay') :
          Math.min(
            this.get('maximumAutoReloadDelay'),
            currentDelay * this.get('autoReloadDelayGrowth'));
    }
  },

  _didAttributesChange(oldSnapshot, newSnapshot) {
    let oldAttrs = oldSnapshot.attributes();
    let newAttrs = newSnapshot.attributes();

    for (let key in oldAttrs) {
      if (oldAttrs[key] !== newAttrs[key]) {
        return true;
      }
    }

    return false;
  }
});
