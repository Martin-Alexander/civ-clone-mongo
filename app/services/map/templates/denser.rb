module Map
  module Templates
    class Denser
      def self.run(board)


####################################################################################################



all_squares = board.squares

######################### CREATE A SINGLE LARGE BODY OF WATER ######################################

ocean_squares = board.squares_within((board.size * 0.2).to_i)

ocean_squares.generate "water", coverage: 1 do |square|
  square.is terrain: "grass"
end

all_squares.generate "water", coverage: :all, passes: board.size / 3 do |square|
  square.is terrain: "grass"
  square.has exactly: 1, terrain: "water", within: 1, chance: 0.20
  square.has exactly: 2, terrain: "water", within: 1, chance: 0.25
  square.has exactly: 3, terrain: "water", within: 1, chance: 0.33
  square.has more_than: 3, terrain: "water", within: 1
end

############################## CREATE SEVERAL SMALL BODIES OF WATER ################################

number_of_ponds = board.size / 4

lake_squares = SquareCollection.new(all_squares.select { |square| square.terrain == "grass" })

lake_squares.generate "water", coverage: board.size / 5 do |square|
  square.is terrain: "grass"
  square.has exactly: 0, terrain: "water", within: 3, required: true
end

lake_squares.generate "water", coverage: :all, passes: 3 do |square|
  square.is terrain: "grass"
  square.has exactly: 1, terrain: "water", within: 1, chance: 0.20
  square.has exactly: 2, terrain: "water", within: 1, chance: 0.25
  square.has exactly: 3, terrain: "water", within: 1, chance: 0.33
  square.has more_than: 3, terrain: "water", within: 1
end

lake_squares.generate "water", coverage: :all, passes: 2 do |square|
  square.is terrain: "grass"
  square.has more_than: 3, terrain: "water", within: 1
end

################################ CREATE ISLAND IN LARGE OCEAN ######################################

island_square = all_squares.find { |square| square.count_neighbours_by_terrain("grass", 6).zero? }

if island_square
  island_squares = SquareCollection.new(island_square.neighbours_and_self(5))

  island_squares.generate "grass", coverage: 3 do |square|
    square.is terrain: "water"
  end

  island_squares.generate "grass", coverage: :all, passes: 5 do |square|
    square.is terrain: "water"
    square.has exactly: 1, terrain: "grass", within: 1, chance: 0.20
    square.has exactly: 2, terrain: "grass", within: 1, chance: 0.25
    square.has exactly: 3, terrain: "grass", within: 1, chance: 0.33
    square.has more_than: 3, terrain: "grass", within: 1  
  end
end

######################################## CREATE A RIVER ############################################

all_squares.select { |square| square.neighbours.count < 8 }.sample.terrain = "river"

all_squares.generate "river", coverage: :all do |square|
  square.is terrain: "grass"
  square.has exactly: 1, terrain: "river", within: 1
end

all_squares.generate "river", coverage: :all do |square|
  square.is terrain: "grass"
  square.has exactly: 1, terrain: "river", within: 1, required: true
  square.has exactly: 2, terrain: "river", within: 2, required: true
end

all_squares.generate "river", coverage: :all, passes: board.size do |square|
  square.is terrain: "grass"
  square.has exactly: 1, terrain: "river", within: 1, required: true
  square.has exactly: 2, terrain: "river", within: 2, required: true  
  square.has exactly: 3, terrain: "river", within: 3, required: true  
end

all_squares.generate "river", coverage: :all, passes: 1 do |square|
  square.has more_than: 2, terrain: "river", within: 1
end

all_squares.each { |square| square.terrain = "water" if square.terrain == "river" }


################################### THE REST OF THE STUFF ##########################################

# Create some mountain roots
number_of_ranges = board.size / 4

all_squares.generate "mountains", coverage: number_of_ranges, distinct: false do |square|
  square.is terrain: "grass"
end

# Extend mountain roots and build mountain ranges
all_squares.generate "mountains", coverage: :all, passes: board.size do |square|
  square.is terrain: "grass", chance: 0.8
  square.has exactly: 1, terrain: "mountains", within: 1, required: true
  square.has less_than: 3, terrain: "mountains", within: 2, required: true
  square.has less_than: 5, terrain: "mountains", within: 4, required: true
end

# Flesh out mountain ranges
all_squares.generate "mountains", coverage: :all, passess: 2 do |square|
  square.is terrain: { not: "mountains" }
  square.has exactly: 1, terrain: "mountains", within: 1, chance: 0.25
  square.has exactly: 2, terrain: "mountains", within: 1, chance: 0.33
  square.has exactly: 3, terrain: "mountains", within: 1, chance: 0.5
  square.has more_than: 3, terrain: "mountains", within: 1
end

number_of_plains_roots = ((board.size / 2)..(board.size)).to_a.sample

# Create some plains roots
all_squares.generate "plains", coverage: number_of_plains_roots do |square|
  square.is terrain: "grass"
  square.has exactly: 0, terrain: "water", within: 3, chance: { if_not: 0.5 }, required: true
  square.has exactly: 0, terrain: "water", within: 2, chance: { if_not: 0.25 }, required: true
  square.has exactly: 0, terrain: "water", within: 1, chance: { if_not: 0.125}, required: true
end

# Increase plains
all_squares.generate "plains", coverage: :all, passes: 6 do |square|
  square.is terrain: "grass"
  square.has exactly: 0, terrain: "water", within: 3, chance: { if_not: 0.5 }, required: true
  square.has exactly: 0, terrain: "water", within: 2, chance: { if_not: 0.25 }, required: true
  square.has exactly: 0, terrain: "water", within: 1, chance: { if_not: 0.125}, required: true
  square.has exactly: 1, terrain: "plains", within: 1, chance: 0.166
  square.has exactly: 2, terrain: "plains", within: 1, chance: 0.2
  square.has exactly: 3, terrain: "plains", within: 1, chance: 0.25
  square.has more_than: 3, terrain: "plains", within: 1
end

# Fill in isolated grass patches
all_squares.generate "plains", coverage: :all, passes: 2 do |square|
  square.is terrain: "grass"
  square.has exactly: 0, terrain: "water", within: 3, chance: { if_not: 0.5 }, required: true
  square.has exactly: 0, terrain: "water", within: 2, chance: { if_not: 0.25 }, required: true
  square.has exactly: 0, terrain: "water", within: 1, chance: { if_not: 0.125}, required: true  
  square.has more_than: 3, terrain: "plains", within: 1
end

number_of_desert_roots = ((board.size / 4)..(board.size)).to_a.sample

# Create some desert roots
all_squares.generate "desert", coverage: number_of_desert_roots do |square|
  square.is terrain: "plains"
  square.has exactly: 0, terrain: "grass", within: 2, chance: { if_not: 0.25 }, required: true
  square.has exactly: 0, terrain: "grass", within: 1, chance: { if_not: 0.125 }, required: true
end

# Increase desert
all_squares.generate "desert", coverage: :all, passes: 8 do |square|
  square.has exactly: 0, terrain: "grass", within: 2, required: true
  square.has exactly: 1, terrain: "desert", within: 1, chance: 0.25
  square.has exactly: 2, terrain: "desert", within: 1, chance: 0.33
  square.has exactly: 3, terrain: "desert", within: 1, chance: 0.5
  square.has more_than: 3, terrain: "desert", within: 1
end


####################################################################################################        


      end
    end
  end
end
