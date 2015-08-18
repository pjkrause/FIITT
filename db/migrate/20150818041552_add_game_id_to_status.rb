class AddGameIdToStatus < ActiveRecord::Migration
  def change
    add_column :statuses, :game_id, :integer
  end
end
