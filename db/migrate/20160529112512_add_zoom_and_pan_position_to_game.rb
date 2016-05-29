class AddZoomAndPanPositionToGame < ActiveRecord::Migration
  def change
    change_table :games do |t|
      t.float :pan_x_position, default: 0
      t.float :pan_y_position, default: 0
      t.float :zoom, default: 0
    end
  end
end
