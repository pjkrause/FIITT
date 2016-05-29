class AddCoordsToDecisions < ActiveRecord::Migration
  def change
    add_column :decisions, :x_position, :integer, default: 0
    add_column :decisions, :y_position, :integer, default: 0
  end
end
