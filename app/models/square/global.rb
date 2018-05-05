module Square
  class Global < Base
    include Unit::Embed
    include Square::Modules::Units
    include Structure::Embed
    include Square::Modules::Structures

    direct_children :units, :structures

    embedded_in :board, class_name: "Game"
    embed_units :infantry, :tanks, :ships, :workers
    embed_structures :roads, :fortresses, :farms, :cities

    field :terrain, type: String, default: "grass"
  end
end
