use rust_embed::RustEmbed;

#[derive(RustEmbed)]
#[folder = "./assets/images/"]
// #[include = "images/*"]
pub struct Images;

#[derive(RustEmbed)]
#[folder = "assets/config/"]
pub struct Config;
