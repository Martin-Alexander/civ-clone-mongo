module Map
  module Templates
    class Standard
      def self.run(board)


####################################################################################################


all_squares = board.squares

# Create some mountain roots
mountain_squares = board.squares_within(board.size / 4)
number_of_ranges = ((board.size / 16)..(board.size / 8)).to_a.sample

mountain_squares.generate "mountains", coverage: number_of_ranges, distinct: false do |square|
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

number_of_water_roots = ((board.size / 8)..(board.size / 4)).to_a.sample

# Create some water roots
all_squares.generate "water", coverage: number_of_water_roots do |square|
  square.is terrain: "grass"
end

# Increase water
all_squares.generate "water", coverage: :all, passes: 6 do |square|
  square.is terrain: "grass"
  square.has exactly: 1, terrain: "water", within: 1, chance: 0.20
  square.has exactly: 2, terrain: "water", within: 1, chance: 0.25
  square.has exactly: 3, terrain: "water", within: 1, chance: 0.33
  square.has more_than: 3, terrain: "water", within: 1
end

# Remove isolated water patches
all_squares.generate "water", coverage: :all do |square|
  square.is terrain: "grass"
  square.has more_than: 3, terrain: "water", within: 1
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
