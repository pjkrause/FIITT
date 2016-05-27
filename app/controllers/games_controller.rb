class GamesController < ApplicationController
  def show
    @game = Game.find(params[:id])

    respond_to do |format|
      format.json { render json: { game: @game, steps: @game.steps }, status: :ok }
    end
  end
end
