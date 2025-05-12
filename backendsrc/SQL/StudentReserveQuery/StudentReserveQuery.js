

const MyReserveFullSize=`
SELECT
	count(*) as count
FROM
	reserveinfo AS r
WHERE
	r.id =?
`

const SelectListMyReserve = `
SELECT
	*
FROM
	reserveinfo AS r
INNER JOIN onedayclassupdaterecode AS o ON
	r.updateAt = o.updateAt
WHERE
	r.id =?

	order by application_day desc
	
	limit ? ,10
`;

module.exports = { SelectListMyReserve ,MyReserveFullSize};
