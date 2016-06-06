class AddGameIdToDecisions < ActiveRecord::Migration
  def change
    add_column :decisions, :game_id, :integer
  end
end
