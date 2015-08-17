class AddPlayerIdToStatus < ActiveRecord::Migration
  def change
    add_column :statuses, :player_id, :integer
  end
end
