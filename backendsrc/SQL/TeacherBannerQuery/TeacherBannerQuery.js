const checkOutActivitingBanner = `
select	
uc.uc_bannertype
from
	bannerpayinfo as bif
left join bannerinfo_update_record as uc on
	bif.uc_bannerinfo_num = uc.uc_bannerinfo_num
where
	bif.banner_stdate <= ?
	and bif.banner_eddate >= ?
	and bif.onedayclass_num = ?
`;

module.exports = {
  checkOutActivitingBanner,
};
