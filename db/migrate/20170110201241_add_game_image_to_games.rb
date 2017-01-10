class AddGameImageToGames < ActiveRecord::Migration
  def change
    add_column :games, :game_image, :string
  end
end
