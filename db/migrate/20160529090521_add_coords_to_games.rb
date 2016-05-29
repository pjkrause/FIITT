class AddCoordsToGames < ActiveRecord::Migration
  def change
    add_column :games, :x_position, :integer, default: 0
    add_column :games, :y_position, :integer, default: 0
  end
end
