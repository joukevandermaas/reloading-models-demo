import DS from 'ember-data';
import AutoReload from 'ember-data-autoreload';

export default DS.Model.extend(AutoReload, {
  name: DS.attr('string'),
  amount: DS.attr('number'),

  init() {
    this._super(...arguments);

    this.startAutoReloading();
  }
});
