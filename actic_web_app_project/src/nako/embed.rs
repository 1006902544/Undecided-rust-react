use rust_embed::RustEmbed;

#[derive(RustEmbed)]
#[folder = "assets/images/"]
pub struct Images;

#[derive(RustEmbed)]
#[folder = "assets/config/"]
pub struct Config;
