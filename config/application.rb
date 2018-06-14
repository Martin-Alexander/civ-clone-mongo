require_relative 'boot'

require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
# require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
require "action_cable/engine"
require "sprockets/railtie"
require "rails/test_unit/railtie"

require 'logger'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module CivCloneMongo
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.1
    config.autoload_paths += ["#{config.root}/lib/rules", "#{config.root}/app/services"]
    config.eager_load_paths += ["#{config.root}/lib/rules", "#{config.root}/app/services"]
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.
  end
end

model_directories = Dir.glob(Rails.root.join("app/models/*")).select { |f| File.directory? f }

model_directories.each do |directory|
  directory_name = directory.split("/").last
  ActiveSupport.autoload(directory_name.capitalize, directory + "/" + directory_name)
end
