module BoardGeneration

  private
  
  # Generates global squares
  # TEST MODE
  def generate_global_squares
    (0..board_size).each do |y_coord|
      (0..board_size).each do |x_coord|
        Square::Global.create x: x_coord, y: y_coord, board: self
      end
    end
  end

  # Generates game players
  # TEST MODE
  def generate_game_players
    players.each do |player|
      GamePlayer.create game: self
    end
  end

  # Generates vision squares for each game player
  # TEST MODE
  def generate_vision_squares
    game_players.each do |game_player|
      squares.each do |square|
        Square::Vision.create x: square.x, y: square.x, board: game_player
      end
    end
  end

  # Generates initlia player placement
  # TEST MODE
  def generate_initial_player_placement
    for i in (1..players.length)
      loop do 
        selected_square = squares.sample
        if selected_square.player.zero?
          selected_square.update!(player: i)
          break
        end
      end 
    end
  end  
end