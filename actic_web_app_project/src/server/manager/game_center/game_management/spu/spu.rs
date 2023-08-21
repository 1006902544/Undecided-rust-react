use mysql::PooledConn;

use crate::schema::{
    base_struct::{handle_limit, handle_page},
    modules::manager::game_center::game_management::spu::spu::*,
};

pub async fn get_games(conn: &mut PooledConn, params: GetGameLimitReq) {
    let limit = handle_limit(&params.limit);
    let page = handle_page(&params.page);
    let sql_str =
        "select spus.id,spus.name,spus.logo_url,spus.price,spus.issue_time,spus.create_time,spus.update_time,stl.tag_name from spus left join (select spu_id,tag_name from spu_tags) as stl on stl.spu_id=spus.id order by update_time desc limit :scope,:limit";
}
