const selectListCurrentMontRest = `select
		o.onedayclass_num,
		o.openningday,
		r.rest,
		r.openday
from
		reserverest as r
right join openningclass as o on
		r.openningclass_num = o.openningclass_num
where
		o.isopenning = 'yes'
	and o.onedayclass_num = ?
	and r.openday like ?
	and o.openningday <= ?
	and o.openningday >= ?`;

module.exports = { selectListCurrentMontRest };
