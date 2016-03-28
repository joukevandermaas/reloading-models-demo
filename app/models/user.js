import DS from 'ember-data';
import Reload from '../mixins/reloading-model';
import Ember from 'ember';

export default DS.Model.extend(Reload, {
  name: DS.attr('string'),
  amount: DS.attr('number'),

  autoReloadDelay: Ember.computed('name', function() {
    if (this.get('name') === 'Link') {
      return 10000;
    } else {
      return 30000;
    }
  })
});
