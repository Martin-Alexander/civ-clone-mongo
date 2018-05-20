module Map
  class Board
    include GeneralHelperMethods
    include InitializationHelperMethods

    attr_reader :squares, :size

    def initialize(options = {})
      @size = options[:size] || raise("Must provide board size")
      @squares = generate_squares

      options[:template].run(self)
    end

    def player_starting_locations(number_of_players)
      suitable_squares = squares.select do |square|
        !["water", "desert", "mountains"].include?(square.terrain) &&
          square.count_neighbours_by_terrain("mountains", 1).zero? &&
          square.count_neighbours_by_terrain("desert", 2).zero? &&
          square.neighbours(3).length > 40
      end
  
      starting_locations = []
      10.times do
        suitable_squares.shuffle.each_slice(number_of_players) do |slice|
          starting_locations.push(slice) if slice.length == number_of_players
        end
      end
  
      sorted_starting_locations = starting_locations.sort_by do |group_of_squares|
        group_of_squares.combination(2).map { |pair| distance(pair[0], pair[1]) }.min
      end
  
      tenth_percentile = sorted_starting_locations[-(sorted_starting_locations.length / 100)..-1]
  
      final_sort = tenth_percentile.sort_by do |group_of_squares|
        group_of_squares.combination(2).map { |pair| desirability_difference(pair[0], pair[1]) }.max
      end
  
      final_sort.first
    end

    private

    def desirability_difference(a, b)
      (a.desirability(3) - b.desirability(3)).abs
    end    
  end
end