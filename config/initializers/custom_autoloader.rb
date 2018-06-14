model_directories = Dir.glob(Rails.root.join("app/models/*")).select { |f| File.directory? f }

model_directories.each do |directory|
  directory_name = directory.split("/").last
  ActiveSupport.autoload(directory_name.capitalize, directory + "/" + directory_name)
end