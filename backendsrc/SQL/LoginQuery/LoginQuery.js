getFindUser = `select * from user where id=?`;

hasRoleTeacher = `select business_num ,onedayclass_num from user as u right join teacher as t on u.id=t.tid where t.tid=?`;

hasRoleMaster = `select count(*) as count from master_user as m  where m.master_id=?`;
module.exports = {
  getFindUser,
  hasRoleTeacher,
  hasRoleMaster,
};
