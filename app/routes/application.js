import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.get('store').findAll('user');
  },

  afterModel(resolvedModel) {
    this.get('store').unloadRecord(resolvedModel.get('firstObject'));
  }
});
