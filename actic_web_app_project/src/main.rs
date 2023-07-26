mod app;
mod controller;
mod middleware;
mod nako;
mod routes;
mod schema;
mod server;
mod utils;

use actix_web::main;

#[main]
async fn main() -> std::io::Result<()> {
    app::start::start().await
}
