module Map
  class Generator
    module ClassMethods
      def run(options = {})
        Board.new(size: options[:size])
      end
    end

    extend ClassMethods
  end
end
