class AddGameIdToStep < ActiveRecord::Migration
  def change
    add_column :steps, :game_id, :integer
  end
end
