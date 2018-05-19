module Map
  class Generator
    module ClassMethods
      def run(options = {})
        template = options[:template] || Templates::Standard
        board = Board.new(size: options[:size], template: template)
      end
    end

    extend ClassMethods
  end
end
