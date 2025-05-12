// const onedayListType = `
// select * from onedayclass as o
// right join (
// 	select
// 		currentBannerType.uc_bannertype,
// 		currentBannerType.onedayclass_num
// 	From
// 		bannerinfo_update_record as uc
// 	inner join (
// 		select
// 			activitngTable.onedayclass_num ,
// 			activitngTable.uc_bannerinfo_num,
// 			rbp.update_banner_plan as  uc_bannertype
// 		from
// 			retry_banner_pay as rbp
// 		inner join (
// 			select
// 				cofirmOnedayNum.onedayclass_num,
// 				bif.bannerpayinfo_num,
// 				bif.banner_stdate ,
// 				bif.banner_eddate ,
// 				bif.uc_bannerinfo_num
// 			from
// 				bannerpayinfo as bif
// 			inner join

// (
// 				select
// 					*
// 				from
// 					teacher
// 				where
// 					business_status = 'confirm'

// ) as cofirmOnedayNum

// on
// 				bif.onedayclass_num = cofirmOnedayNum.onedayclass_num
// 			WHERE
// 				bif.banner_stdate <= ?

// ) as activitngTable on
// 			rbp.bannerpayinfo_num = activitngTable.bannerpayinfo_num

// ) as currentBannerType on
// 		uc.uc_bannerinfo_num = currentBannerType.uc_bannerinfo_num)  as crrentPlan  on o.onedayclass_num = crrentPlan.onedayclass_num
// where crrentPlan.uc_bannertype=?

// `;


// 현재 사업승인이 떨어지고  진행중인 원데이클래스번호를 리스트로 리턴한다.
const activiingOnedayNumWithBusinessStatus = 
`select t.onedayclass_num
from
	teacher as t
right join bannerpayinfo as bif on
	t.onedayclass_num = bif.onedayclass_num
where
	bif.banner_stdate <= ?
	and bif.banner_eddate >= ?
	and t.business_status = ?
  `;



// 현재 사업승인이 떨어지고  진행중인 원데이클래스번호를 단건 리턴한다.
const SelectOneActiviingOnedayNumWithBusinessStatus = 
`select t.onedayclass_num
from
	teacher as t
right join bannerpayinfo as bif on
	t.onedayclass_num = bif.onedayclass_num
where
	bif.banner_stdate <= ?
	and bif.banner_eddate >= ?
	and t.business_status = ?
  and t.onedayclass_num=?
  `;





const onedayListType = `
select
	*
from
	retry_banner_pay as rbp right join (
	select
		p.banner_paymentday,
		p.onedayclass_num,
        p.bannerpayinfo_num,
        o.onedayclass_name,
        o.onedayclass_price,
        o.onedayclass_info,
        o.onedayclass_playinfo,
        o.ClassLocation,
        o.Park,
        o.PlayTime,
        o.Playinguser,
        o.ClassIntro,
        o.reserve_img,
        o.createAT,
        o.updateAt,
        o.nickname
	from
		onedayclass as o
	right join bannerpayinfo as p on
		o.onedayclass_num = p.onedayclass_num
    where
      o.onedayclass_num=?
      and
    	p.banner_stdate <= ?
        and p.banner_eddate >= ?
) as activitingBanner on
	rbp.bannerpayinfo_num = activitingBanner.bannerpayinfo_num	
where rbp.update_banner_plan=?`;







module.exports = { onedayListType, activiingOnedayNumWithBusinessStatus ,SelectOneActiviingOnedayNumWithBusinessStatus};
