class AddCoordsToSteps < ActiveRecord::Migration
  def change
    add_column :steps, :x_position, :integer, default: 0
    add_column :steps, :y_position, :integer, default: 0
  end
end
