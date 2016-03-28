import Ember from 'ember';
import ReloadingModelMixin from 'reloading-models/mixins/reloading-model';
import { module, test } from 'qunit';

module('Unit | Mixin | reloading model');

// Replace this with your real tests.
test('it works', function(assert) {
  let ReloadingModelObject = Ember.Object.extend(ReloadingModelMixin);
  let subject = ReloadingModelObject.create();
  assert.ok(subject);
});
