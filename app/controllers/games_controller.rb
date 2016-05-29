class GamesController < ApplicationController
  def show
    @game = Game.find(params[:id])
    
    respond_to do |format|
      format.json { render json: GameSerializer.new(@game, {}) }
      #format.json { render json: { game: @game, steps: @game_steps.to_json(:include => :decisions)}, status: :ok }
    end
  end
end
