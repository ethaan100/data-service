const { where } = require('../../../../utils/db/knex');

const commonFilters = require('../../_common/sql/filters');
const commonFiltersOrder = require('../../_common/sql/filtersOrder');

module.exports = {
  filters: {
    ...commonFilters,
    script: where('script'),
  },
  filtersOrder: [...commonFiltersOrder, 'script'],
};
